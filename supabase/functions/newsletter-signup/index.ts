import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://discoverainow.com",
  "https://www.discoverainow.com",
  "http://localhost:8080",
  "http://127.0.0.1:8080"
]);

function cors(origin:string|null){
  const allow=origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://discoverainow.com";
  return {
    "Access-Control-Allow-Origin":allow,
    "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Vary":"Origin"
  };
}

async function sendWelcome(email:string, token:string){
  const apiKey=Deno.env.get("RESEND_API_KEY");
  const from=Deno.env.get("NEWSLETTER_FROM_EMAIL");
  if(!apiKey || !from) return {sent:false,reason:"email_provider_not_configured"};

  const unsubscribeUrl="https://discoverainow.com/unsubscribe/?token="+encodeURIComponent(token);
  const html=`
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#111827">
    <p style="color:#2563eb;font-size:12px;font-weight:700;letter-spacing:.08em">DISCOVER AI NOW</p>
    <h1 style="font-size:28px;line-height:1.15">You’re subscribed.</h1>
    <p style="font-size:16px;line-height:1.6;color:#4b5563">Each issue will contain five things worth using: one workflow, one prompt, one useful tool, one comparison insight, and one important AI update.</p>
    <p style="font-size:14px;line-height:1.6;color:#4b5563">No daily firehose. No paid placement disguised as a recommendation.</p>
    <p><a href="https://discoverainow.com/" style="color:#2563eb">Explore Discover AI Now →</a></p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
    <p style="font-size:12px;color:#6b7280">You subscribed at DiscoverAINow.com. <a href="${unsubscribeUrl}" style="color:#6b7280">Unsubscribe</a></p>
  </div>`;

  const res=await fetch("https://api.resend.com/emails",{
    method:"POST",
    headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},
    body:JSON.stringify({from,to:[email],subject:"Welcome to Discover AI Now",html})
  });
  if(!res.ok) throw new Error("welcome_email_failed: "+await res.text());
  return {sent:true};
}

Deno.serve(async (req:Request)=>{
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

    const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const {data,error}=await supabase.from("newsletter_subscribers").upsert(
      {email,source,status:"active",unsubscribed_at:null,consent_at:new Date().toISOString()},
      {onConflict:"email",ignoreDuplicates:false}
    ).select("id,email,unsubscribe_token,welcome_sent_at").single();
    if(error) throw error;

    let welcome="already_sent";
    if(!data.welcome_sent_at){
      try{
        const result=await sendWelcome(data.email,String(data.unsubscribe_token));
        welcome=result.sent ? "sent" : result.reason;
        if(result.sent){
          await supabase.from("newsletter_subscribers").update({welcome_sent_at:new Date().toISOString(),last_email_sent_at:new Date().toISOString()}).eq("id",data.id);
        }
      }catch(err){
        console.error(err);
        welcome="send_failed";
      }
    }

    return new Response(JSON.stringify({ok:true,welcome}),{status:200,headers:{...cors(origin),"Content-Type":"application/json"}});
  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({error:"server_error"}),{status:500,headers:{...cors(origin),"Content-Type":"application/json"}});
  }
});