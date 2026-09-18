(() => {
  document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{
    const el=document.querySelector(btn.dataset.copy); if(!el)return;
    try{await navigator.clipboard.writeText(el.innerText);const old=btn.textContent;btn.textContent='Copied';setTimeout(()=>btn.textContent=old,1200);window.dainTrack?.('guardrail_prompt_copy',{source:location.pathname});}catch{}
  }));
})();