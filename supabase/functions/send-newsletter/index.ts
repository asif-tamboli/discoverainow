import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

function addUnsubscribe(html:string, token:string){
  const url="https://discoverainow.com/unsubscribe/?token="+encodeURIComponent(token);
  return html+`<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0"><p style="font:12px Arial,sans-serif;color:#6b7280">You received this because you subscribed at DiscoverAINow.com. <a href="${url}" style="color:#6b7280">Unsubscribe</a></p>`;
}

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST") return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:{"Content-Type":"application/json"}});
  try{
    const apiKey=Deno.env.get("RESEND_API_KEY");
    const from=Deno.env.get("NEWSLETTER_FROM_EMAIL");
    if(!apiKey || !from) return new Response(JSON.stringify({error:"email_provider_not_configured"}),{status:503,headers:{"Content-Type":"application/json"}});

    const {campaign_id}=await req.json();
    if(!campaign_id) return new Response(JSON.stringify({error:"campaign_id_required"}),{status:400,headers:{"Content-Type":"application/json"}});

    const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const {data:campaign,error:campaignError}=await supabase.from("newsletter_campaigns").select("*").eq("id",campaign_id).single();
    if(campaignError) throw campaignError;
    if(!["ready","sending"].includes(campaign.status)) return new Response(JSON.stringify({error:"campaign_not_ready"}),{status:409,headers:{"Content-Type":"application/json"}});

    await supabase.from("newsletter_campaigns").update({status:"sending",updated_at:new Date().toISOString()}).eq("id",campaign_id);

    const {data:subscribers,error:subError}=await supabase.from("newsletter_subscribers")
      .select("id,email,unsubscribe_token").eq("status","active").is("unsubscribed_at",null).limit(500);
    if(subError) throw subError;

    let sent=0,failed=0;
    for(const s of subscribers||[]){
      const {data:existing}=await supabase.from("newsletter_sends").select("status").eq("campaign_id",campaign_id).eq("subscriber_id",s.id).maybeSingle();
      if(existing?.status==="sent") continue;
      try{
        const html=addUnsubscribe(campaign.html_body,String(s.unsubscribe_token));
        const res=await fetch("https://api.resend.com/emails",{
          method:"POST",
          headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},
          body:JSON.stringify({from,to:[s.email],subject:campaign.subject,html,text:campaign.text_body||undefined})
        });
        const payload=await res.json().catch(()=>({}));
        if(!res.ok) throw new Error(JSON.stringify(payload));
        await supabase.from("newsletter_sends").upsert({campaign_id,subscriber_id:s.id,provider_message_id:payload.id||null,status:"sent",sent_at:new Date().toISOString(),error_message:null},{onConflict:"campaign_id,subscriber_id"});
        await supabase.from("newsletter_subscribers").update({last_email_sent_at:new Date().toISOString()}).eq("id",s.id);
        sent++;
      }catch(err){
        failed++;
        await supabase.from("newsletter_sends").upsert({campaign_id,subscriber_id:s.id,status:"failed",error_message:String(err).slice(0,1000)},{onConflict:"campaign_id,subscriber_id"});
      }
    }

    await supabase.from("newsletter_campaigns").update({status:failed===0?"sent":"failed",sent_at:failed===0?new Date().toISOString():null,updated_at:new Date().toISOString()}).eq("id",campaign_id);
    return new Response(JSON.stringify({ok:true,sent,failed,total:(subscribers||[]).length}),{headers:{"Content-Type":"application/json"}});
  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({error:"server_error"}),{status:500,headers:{"Content-Type":"application/json"}});
  }
});