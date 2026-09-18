import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const AI_TERMS=[
  "artificial intelligence","generative ai","machine learning","deep learning","openai","chatgpt","gpt",
  "anthropic","claude","gemini","llm","large language model","ai agent","agentic","copilot","mistral",
  "llama","hugging face","midjourney","stable diffusion","diffusion","transformer","inference",
  "foundation model","multimodal","computer vision","reasoning model","ai coding","coding agent"
];

function relevant(text:string){
  const t=text.toLowerCase();
  return AI_TERMS.some(x=>t.includes(x));
}

function score(text:string){
  const t=text.toLowerCase();
  let s=0;
  for(const term of AI_TERMS) if(t.includes(term)) s+=1;
  return s;
}

Deno.serve(async (req:Request) => {
  if(req.method!=="POST") return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:{"Content-Type":"application/json"}});
  try{
    const body=await req.json().catch(()=>({}));
    const requested=String(body?.source||"all").toLowerCase();

    const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const {data:sources,error:srcErr}=await supabase.from("sources").select("id,name").eq("enabled",true);
    if(srcErr) throw srcErr;
    const sourceMap=new Map((sources||[]).map((s:any)=>[s.name.toLowerCase(),s.id]));

    const rows:any[]=[];

    if(requested==="all"||requested==="hackernews"){
      const ids=await fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then(r=>r.json());
      const top=(ids||[]).slice(0,35);
      const items=await Promise.all(top.map((id:number)=>fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r=>r.json()).catch(()=>null)));
      for(const it of items){
        if(!it?.title||!relevant(it.title+" "+(it.text||""))) continue;
        rows.push({
          source_id:sourceMap.get("hacker news"),
          external_id:String(it.id),
          title:it.title,
          url:it.url||`https://news.ycombinator.com/item?id=${it.id}`,
          summary:null,
          published_at:it.time?new Date(it.time*1000).toISOString():null,
          raw:{score:it.score||0,comments:it.descendants||0},
          relevance_score:score(it.title+" "+(it.text||"")),
          status:"new"
        });
      }
    }

    if(requested==="all"||requested==="huggingface"){
      const items=await fetch("https://huggingface.co/api/spaces?sort=likes&direction=-1&limit=20&full=true").then(r=>r.json());
      for(const it of Array.isArray(items)?items:[]){
        const title=String(it.id||"").split("/").pop()?.replace(/[-_]/g," ")||"";
        const tags=Array.isArray(it.tags)?it.tags.join(" "):"";
        if(!relevant(title+" "+tags+" ai")) continue;
        rows.push({
          source_id:sourceMap.get("hugging face"),
          external_id:String(it.id),
          title,
          url:`https://huggingface.co/spaces/${it.id}`,
          summary:Array.isArray(it.tags)?it.tags.slice(0,5).join(" · "):null,
          published_at:it.lastModified||null,
          raw:{likes:it.likes||0,tags:it.tags||[]},
          relevance_score:score(title+" "+tags+" ai"),
          status:"new"
        });
      }
    }

    if(requested==="all"||requested==="dev"){
      const items=await fetch("https://dev.to/api/articles?tag=ai&top=30&per_page=20").then(r=>r.json());
      for(const it of Array.isArray(items)?items:[]){
        if(!it?.title) continue;
        rows.push({
          source_id:sourceMap.get("dev community"),
          external_id:String(it.id),
          title:it.title,
          url:it.url,
          summary:it.description||null,
          published_at:it.published_at||null,
          raw:{reactions:it.public_reactions_count||0,reading_time_minutes:it.reading_time_minutes||null,tags:it.tag_list||[]},
          relevance_score:score(it.title+" "+(it.description||"")+" "+(it.tag_list||[]).join(" ")),
          status:"new"
        });
      }
    }

    if(requested==="all"||requested==="github"){
      const q=encodeURIComponent("ai-agent in:name,description stars:>20");
      const gh=await fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=15`,{
        headers:{"Accept":"application/vnd.github+json","User-Agent":"DiscoverAINow"}
      });
      if(gh.ok){
        const payload=await gh.json();
        for(const it of payload.items||[]){
          rows.push({
            source_id:sourceMap.get("github"),
            external_id:String(it.id),
            title:it.full_name||it.name,
            url:it.html_url,
            summary:it.description||null,
            published_at:it.updated_at||null,
            raw:{stars:it.stargazers_count||0,language:it.language||null,topics:it.topics||[]},
            relevance_score:score((it.name||"")+" "+(it.description||"")+" ai agent"),
            status:"new"
          });
        }
      }
    }

    const clean=rows.filter(r=>r.source_id&&r.external_id&&r.title);
    if(clean.length){
      const {error}=await supabase.from("external_signals").upsert(clean,{onConflict:"source_id,external_id"});
      if(error) throw error;
    }

    return new Response(JSON.stringify({ok:true,source:requested,upserted:clean.length}),{status:200,headers:{"Content-Type":"application/json"}});
  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({error:"server_error"}),{status:500,headers:{"Content-Type":"application/json"}});
  }
});