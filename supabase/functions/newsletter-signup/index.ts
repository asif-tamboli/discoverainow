import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://discoverainow.com",
  "https://www.discoverainow.com",
  "http://localhost:8080",
  "http://127.0.0.1:8080"
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
    const email=String(body?.email||"").trim().toLowerCase();
    const source=String(body?.source||"homepage").slice(0,80);
    if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      return new Response(JSON.stringify({error:"invalid_email"}),{status:400,headers:{...cors(origin),"Content-Type":"application/json"}});
    }

    const supabase=createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const {error}=await supabase.from("newsletter_subscribers").upsert(
      {email,source,status:"active",unsubscribed_at:null},
      {onConflict:"email",ignoreDuplicates:false}
    );
    if(error) throw error;

    return new Response(JSON.stringify({ok:true}),{status:200,headers:{...cors(origin),"Content-Type":"application/json"}});
  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({error:"server_error"}),{status:500,headers:{...cors(origin),"Content-Type":"application/json"}});
  }
});