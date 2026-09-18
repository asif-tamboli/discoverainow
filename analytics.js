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
    const a=e.target.closest('a.track-link,[data-track]');
    if(!a)return;
    window.dainTrack(a.dataset.event||a.dataset.track||'outbound_click',{href:a.getAttribute('href')||''});
  });

  if(!sessionStorage.getItem('dain_session_seen')){
    window.dainTrack('session_start',{referrer:document.referrer||'direct'});
    sessionStorage.setItem('dain_session_seen','1');
  }else{
    window.dainTrack('return_pageview');
  }
  window.dainTrack('page_view',{title:document.title});
})();