(() => {
  const ENDPOINT='https://wtbaosegszmousraqfnw.supabase.co/functions/v1/newsletter-signup';
  document.querySelectorAll('form.dain-newsletter').forEach(form=>{
    if(form.dataset.bound==='1') return;
    form.dataset.bound='1';
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const input=form.querySelector('input[type="email"]');
      const button=form.querySelector('button');
      const note=form.querySelector('small');
      const email=(input?.value||'').trim();
      if(!email)return;
      const old=button.textContent;
      button.disabled=true; button.textContent='Joining…';
      try{
        const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,source:location.pathname})});
        if(!r.ok)throw new Error('signup_failed');
        form.reset();
        button.textContent='Subscribed';
        if(note)note.textContent='You’re in. Unsubscribe anytime.';
        window.dainTrack?.('newsletter_signup',{source:location.pathname});
      }catch(err){
        console.warn(err);
        button.textContent='Try again';
        if(note)note.textContent='Could not subscribe right now.';
      }finally{
        setTimeout(()=>{button.disabled=false;button.textContent=old},1800);
      }
    });
  });
})();