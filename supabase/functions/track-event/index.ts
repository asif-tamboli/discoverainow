import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://discoverainow.com",
  "https://www.discoverainow.com",
  "http://localhost:8080",
  "http://127.0.0.1:8080"
]);
const ALLOWED_EVENTS = new Set([
  "session_start","return_pageview","page_view","tool_click","outbound_click","affiliate_click",
  "prompt_copy","workflow_open","newsletter_signup","newsletter_waitlist_join","search","search_no_result",
  "benchmark_view","comparison_open","youtube_click","hero_benchmark","hero_qa_guide",
  "home_benchmark","home_comparison","home_workflow","home_prompts","benchmark_to_comparison",
  "hero_prompts","hero_tools","prompt_gallery_image","prompt_gallery_coding","prompt_gallery_writing","prompt_gallery_qa"
]);

function cors(origin:string|null){
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://discoverainow.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
  };
}

Deno.serve(async (req:Request) => {
  const origin=req.headers.get("origin");
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors(origin)});
  if(req.method!=="POST") return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:{...cors(origin),"Content-Type":"application/json"}});
  if(origin && !ALLOWED_ORIGINS.has(origin)) return new Response(JSON.stringify({error:"origin_not_allowed"}),{status:403,headers:{...cors(origin),"Content-Type":"application/json"}});

  try{
    const body=await req.json();
    const event_name=String(body?.event_name||"").slice(0,80);
    if(!ALLOWED_EVENTS.has(event_name)) return new Response(JSON.stringify({error:"invalid_event"}),{status:400,headers:{...cors(origin),"Content-Type":"application/json"}});

    const path=String(body?.path||"/").slice(0,300);
    const session_id=String(body?.session_id||"").slice(0,120) || null;
    const anonymous_id=String(body?.anonymous_id||"").slice(0,120) || null;
    const rawProps=(body?.properties && typeof body.properties==="object") ? body.properties : {};
    const properties=JSON.parse(JSON.stringify(rawProps).slice(0,4000));

    const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const {error}=await supabase.from("events").insert({event_name,path,session_id,anonymous_id,properties});
    if(error) throw error;

    return new Response(JSON.stringify({ok:true}),{status:200,headers:{...cors(origin),"Content-Type":"application/json"}});
  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({error:"server_error"}),{status:500,headers:{...cors(origin),"Content-Type":"application/json"}});
  }
});