import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS=new Set(["https://discoverainow.com","https://www.discoverainow.com","http://localhost:8080","http://127.0.0.1:8080"]);
function headers(origin:string|null){
  const allow=origin && ALLOWED_ORIGINS.has(origin)?origin:"https://discoverainow.com";
  return {"Access-Control-Allow-Origin":allow,"Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json","Vary":"Origin"};
}
Deno.serve(async(req:Request)=>{
  const origin=req.headers.get("origin");
  if(req.method==="OPTIONS") return new Response("ok",{headers:headers(origin)});
  if(req.method!=="POST") return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:headers(origin)});
  try{
    const {token}=await req.json();
    const value=String(token||"").trim();
    if(!/^[0-9a-f-]{36}$/i.test(value)) return new Response(JSON.stringify({error:"invalid_token"}),{status:400,headers:headers(origin)});
    const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const {data,error}=await supabase.from("newsletter_subscribers").update({status:"unsubscribed",unsubscribed_at:new Date().toISOString()}).eq("unsubscribe_token",value).select("id").maybeSingle();
    if(error) throw error;
    return new Response(JSON.stringify({ok:true,found:!!data}),{headers:headers(origin)});
  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({error:"server_error"}),{status:500,headers:headers(origin)});
  }
});