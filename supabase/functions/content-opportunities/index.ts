import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async(req:Request)=>{
  if(req.method!=="GET" && req.method!=="POST"){
    return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:{"Content-Type":"application/json"}});
  }
  try{
    const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const since=new Date(Date.now()-30*24*60*60*1000).toISOString();
    const {data,error}=await supabase.from("events")
      .select("event_name,properties,created_at")
      .gte("created_at",since)
      .in("event_name",["search","search_no_result","tool_finder_result","prompt_builder_generate","workflow_generator_generate","prompt_evaluator_run","output_verifier_run","utility_feedback"]);
    if(error) throw error;

    const searches=new Map<string,{count:number,no_result:number}>();
    const finder=new Map<string,number>();
    const builders=new Map<string,number>();
    const utilities=new Map<string,number>();
    const feedback=new Map<string,{yes:number,no:number}>();

    for(const row of data||[]){
      const p:any=row.properties||{};
      if(row.event_name==="search" || row.event_name==="search_no_result"){
        const q=String(p.query||"").trim().toLowerCase();
        if(!q) continue;
        const cur=searches.get(q)||{count:0,no_result:0};
        cur.count++;
        if(row.event_name==="search_no_result" || Number(p.matches||0)===0) cur.no_result++;
        searches.set(q,cur);
      }
      if(row.event_name==="tool_finder_result"){
        const task=String(p.task||"unknown");
        finder.set(task,(finder.get(task)||0)+1);
      }
      if(row.event_name==="prompt_builder_generate"){
        const type=String(p.type||"unknown");
        builders.set(type,(builders.get(type)||0)+1);
      }
      if(["workflow_generator_generate","prompt_evaluator_run","output_verifier_run"].includes(row.event_name)){
        const utility=row.event_name.replace(/_(generate|run)$/,"");
        utilities.set(utility,(utilities.get(utility)||0)+1);
      }
      if(row.event_name==="utility_feedback"){
        const context=String(p.context||"unknown");
        const cur=feedback.get(context)||{yes:0,no:0};
        if(String(p.value)==="yes") cur.yes++; else if(String(p.value)==="no") cur.no++;
        feedback.set(context,cur);
      }
    }

    const searchSignals=[...searches.entries()]
      .map(([query,v])=>({query,...v,opportunity_score:v.no_result*4+v.count}))
      .sort((a,b)=>b.opportunity_score-a.opportunity_score)
      .slice(0,20);

    const toolFinder=[...finder.entries()].map(([task,count])=>({task,count})).sort((a,b)=>b.count-a.count);
    const promptBuilder=[...builders.entries()].map(([type,count])=>({type,count})).sort((a,b)=>b.count-a.count);
    const utilityDemand=[...utilities.entries()].map(([utility,count])=>({utility,count})).sort((a,b)=>b.count-a.count);
    const usefulness=[...feedback.entries()].map(([context,v])=>({context,...v,total:v.yes+v.no,helpful_rate:(v.yes+v.no)?Math.round((v.yes/(v.yes+v.no))*100):null})).sort((a,b)=>b.total-a.total);

    const recommendations=[
      ...searchSignals.filter(x=>x.no_result>0).slice(0,5).map(x=>({
        reason:"unmet_search_demand",
        topic:x.query,
        evidence:`${x.no_result} no-result search${x.no_result===1?"":"es"} in last 30 days`
      })),
      ...toolFinder.slice(0,3).map(x=>({
        reason:"tool_finder_demand",
        topic:x.task,
        evidence:`${x.count} Tool Finder request${x.count===1?"":"s"} in last 30 days`
      }))
    ];

    return new Response(JSON.stringify({
      window_days:30,
      generated_at:new Date().toISOString(),
      search_signals:searchSignals,
      tool_finder_demand:toolFinder,
      prompt_builder_demand:promptBuilder,
      utility_demand:utilityDemand,
      usefulness_feedback:usefulness,
      recommended_content_opportunities:recommendations
    }),{headers:{"Content-Type":"application/json"}});
  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({error:"server_error"}),{status:500,headers:{"Content-Type":"application/json"}});
  }
});