(() => {
  const ENDPOINT='https://wtbaosegszmousraqfnw.supabase.co/functions/v1/track-event';
  const aidKey='dain_anonymous_id';
  const sidKey='dain_session_id';
  const makeId=()=>crypto?.randomUUID?.()||Math.random().toString(36).slice(2)+Date.now().toString(36);
  const storage=(kind,method,...args)=>{try{return window[kind][method](...args)}catch{return null}};
  let anonymous_id=storage('localStorage','getItem',aidKey);
  if(!anonymous_id){anonymous_id=makeId();storage('localStorage','setItem',aidKey,anonymous_id)}
  let session_id=storage('sessionStorage','getItem',sidKey);
  if(!session_id){session_id=makeId();storage('sessionStorage','setItem',sidKey,session_id)}
  const trafficParam=new URLSearchParams(location.search).get('traffic');
  if(['internal','public'].includes(trafficParam))storage('localStorage','setItem','dain_traffic',trafficParam);
  const trafficClass=storage('localStorage','getItem','dain_traffic')==='internal'?'internal':navigator.webdriver||/bot|crawler|spider|Headless/i.test(navigator.userAgent)?'suspected_bot':'unclassified';

  const audienceContext=()=>{
    const ua=navigator.userAgent||'';
    const device=/iPad|Tablet/i.test(ua)?'tablet':/Mobi|Android|iPhone/i.test(ua)?'mobile':'desktop';
    const os=/iPhone|iPad|iPod/i.test(ua)?'iOS':/Android/i.test(ua)?'Android':/Windows/i.test(ua)?'Windows':/Mac OS X|Macintosh/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'other';
    const source=(()=>{try{const r=document.referrer;if(!r)return'direct';const h=new URL(r).hostname.replace(/^www\./,'');if(h===location.hostname)return'internal';if(/google\./.test(h))return'google';if(/bing\./.test(h))return'bing';if(/linkedin\./.test(h))return'linkedin';if(/reddit\./.test(h))return'reddit';if(/facebook\.|instagram\./.test(h))return'meta';return h.slice(0,80)}catch{return'other'}})();
    const p=new URLSearchParams(location.search);
    return {device,os,language:(navigator.language||'unknown').slice(0,20),source,utm_source:(p.get('utm_source')||'').slice(0,80),utm_medium:(p.get('utm_medium')||'').slice(0,80),utm_campaign:(p.get('utm_campaign')||'').slice(0,120)};
  };
  const audience=audienceContext();
  const cleanText=s=>String(s||'').replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g,'[email]').replace(/\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,'[phone]').replace(/\b\d{3}-\d{2}-\d{4}\b/g,'[id]').slice(0,300);
  window.dainSafeText=cleanText;

  const funnelStages={
    session_start:['01_entry','Entry'],
    search:['02_intent','Intent'],
    tool_finder_result:['03_recommendation','Recommendation'],
    prompt_builder_generate:['03_recommendation','Recommendation'],
    workflow_generator_generate:['03_recommendation','Recommendation'],
    prompt_lab_compare:['03_recommendation','Recommendation'],
    prompt_evaluator_run:['03_recommendation','Recommendation'],
    prompt_compare_run:['03_recommendation','Recommendation'],
    stack_builder_result:['03_recommendation','Recommendation'],
    replacement_finder_result:['03_recommendation','Recommendation'],
    recommendation_click:['04_action','Action'],
    prompt_copy:['04_action','Action'],
    prompt_builder_copy:['04_action','Action'],
    workflow_open:['04_action','Action'],
    workflow_generator_copy:['04_action','Action'],
    prompt_lab_copy:['04_action','Action'],
    prompt_evaluator_copy:['04_action','Action'],
    prompt_compare_copy:['04_action','Action'],
    output_verifier_run:['05_verification','Verification'],
    output_verifier_copy:['05_verification','Verification'],
    output_verifier_correction_copy:['05_verification','Verification'],
    newsletter_signup:['06_conversion','Conversion'],
    workspace_save:['06_conversion','Conversion'],
    outbound_click:['06_conversion','Conversion'],
    affiliate_click:['06_conversion','Conversion'],
    content_request_submit:['06_conversion','Conversion']
  };

  const contentGroup=()=>{
    const part=location.pathname.split('/').filter(Boolean)[0]||'home';
    return ['best','benchmarks','compare','comparisons','guides','prompts','tools','use-cases','workflows'].includes(part)?part:'utilities';
  };

  window.dainTrack=(event,properties={})=>{
    const stage=funnelStages[event];
    // Task drafts belong in the browser, not analytics. Keep categorical fields only.
    const safeProperties={...properties};
    for(const key of ['query','goal','intent','prompt','source','output','constraints','message'])delete safeProperties[key];
    for(const key of ['href','referrer'])if(safeProperties[key]&&safeProperties[key]!=='direct'){
      try{const url=new URL(safeProperties[key],location.origin);safeProperties[key]=url.origin+url.pathname;}catch{delete safeProperties[key];}
    }
    const context={...audience,content_group:contentGroup(),journey_id:session_id,...safeProperties,traffic_class:trafficClass};
    if(stage){context.funnel_stage=stage[0];context.funnel_label=stage[1];}
    const payload={event_name:event,path:location.pathname,session_id,anonymous_id,properties:context};
    const request=fetch(ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
      keepalive:true
    }).then(r=>r.ok).catch(()=>false);
    if(window.gtag)window.gtag('event',event,context);
    return request;
  };

  document.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(!a)return;
    const href=a.getAttribute('href')||'';
    const explicit=a.matches('.track-link,[data-track]');
    const external=/^https?:\/\//i.test(href) && !href.includes(location.hostname);
    const decision=a.closest('.decision-result,.finder-results,.prompt-lab-result,.result-loop');
    if(a.dataset.affiliateApplied)window.dainTrack('affiliate_click',{tool:a.dataset.affiliateTool});
    else if(explicit) window.dainTrack(a.dataset.event||a.dataset.track||'outbound_click',{href});
    else if(decision) window.dainTrack('recommendation_click',{href,context:decision.className});
    else if(external) window.dainTrack('outbound_click',{href});
  });

  const started=Date.now();
  let engaged=false;
  const markEngaged=()=>{if(engaged)return;engaged=true;window.dainTrack('engaged_session',{seconds:Math.round((Date.now()-started)/1000),scroll:Math.round((scrollY/(Math.max(1,document.documentElement.scrollHeight-innerHeight)))*100)});};
  setTimeout(()=>{if(document.visibilityState==='visible')markEngaged()},30000);
  document.addEventListener('click',e=>{if(e.target.closest('button,input,textarea,select,a'))markEngaged()},{once:true});
  addEventListener('pagehide',()=>{window.dainTrack('session_exit',{seconds:Math.round((Date.now()-started)/1000),engaged,scroll:Math.min(100,Math.round((scrollY/(Math.max(1,document.documentElement.scrollHeight-innerHeight)))*100))})});

  if(!storage('sessionStorage','getItem','dain_session_seen')){
    window.dainTrack('session_start',{referrer:document.referrer||'direct',landing_path:location.pathname});
    storage('sessionStorage','setItem','dain_session_seen','1');
  }else{
    window.dainTrack('return_pageview');
  }
  window.dainTrack('page_view',{title:document.title});
})();
