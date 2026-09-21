(() => {
  const ENDPOINT='https://wtbaosegszmousraqfnw.supabase.co/functions/v1/track-event';
  const aidKey='dain_anonymous_id';
  const sidKey='dain_session_id';
  const makeId=()=>crypto?.randomUUID?.()||Math.random().toString(36).slice(2)+Date.now().toString(36);
  let anonymous_id=localStorage.getItem(aidKey);
  if(!anonymous_id){anonymous_id=makeId();localStorage.setItem(aidKey,anonymous_id)}
  let session_id=sessionStorage.getItem(sidKey);
  if(!session_id){session_id=makeId();sessionStorage.setItem(sidKey,session_id)}

  window.dainTrack=(event,properties={})=>{
    const payload={event_name:event,path:location.pathname,session_id,anonymous_id,properties};
    fetch(ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
      keepalive:true
    }).catch(()=>{});
    if(window.gtag)window.gtag('event',event,properties);
  };

  document.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(!a)return;
    const href=a.getAttribute('href')||'';
    const explicit=a.matches('.track-link,[data-track]');
    const external=/^https?:\/\//i.test(href) && !href.includes(location.hostname);
    const decision=a.closest('.decision-result,.finder-results,.prompt-lab-result,.result-loop');
    if(explicit) window.dainTrack(a.dataset.event||a.dataset.track||'outbound_click',{href});
    else if(decision) window.dainTrack('recommendation_click',{href,context:decision.className});
    else if(external) window.dainTrack('outbound_click',{href});
  });

  const started=Date.now();
  let engaged=false;
  const markEngaged=()=>{if(engaged)return;engaged=true;window.dainTrack('engaged_session',{seconds:Math.round((Date.now()-started)/1000),scroll:Math.round((scrollY/(Math.max(1,document.documentElement.scrollHeight-innerHeight)))*100)});};
  setTimeout(()=>{if(document.visibilityState==='visible')markEngaged()},30000);
  document.addEventListener('click',e=>{if(e.target.closest('button,input,textarea,select,a'))markEngaged()},{once:true});
  addEventListener('pagehide',()=>{window.dainTrack('session_exit',{seconds:Math.round((Date.now()-started)/1000),engaged,scroll:Math.min(100,Math.round((scrollY/(Math.max(1,document.documentElement.scrollHeight-innerHeight)))*100))})});

  if(!sessionStorage.getItem('dain_session_seen')){
    window.dainTrack('session_start',{referrer:document.referrer||'direct'});
    sessionStorage.setItem('dain_session_seen','1');
  }else{
    window.dainTrack('return_pageview');
  }
  window.dainTrack('page_view',{title:document.title});
})();