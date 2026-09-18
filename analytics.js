(() => {
  const key='dain_event_queue_v1';
  function read(){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}}
  function write(v){try{localStorage.setItem(key,JSON.stringify(v.slice(-250)))}catch{}}
  window.dainTrack=(event,props={})=>{
    const row={event,props,path:location.pathname,ts:new Date().toISOString()};
    const q=read(); q.push(row); write(q);
    if(window.gtag) window.gtag('event',event,props);
  };
  document.addEventListener('click',e=>{
    const a=e.target.closest('a.track-link,[data-track]');
    if(!a)return;
    window.dainTrack(a.dataset.event||a.dataset.track||'outbound_click',{href:a.getAttribute('href')||''});
  });
  if(!sessionStorage.getItem('dain_session_seen')){
    window.dainTrack('session_start',{referrer:document.referrer||'direct'});
    sessionStorage.setItem('dain_session_seen','1');
  } else window.dainTrack('return_pageview');
})();