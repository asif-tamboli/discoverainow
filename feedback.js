(() => {
 document.querySelectorAll('[data-feedback-widget]').forEach((root)=>{
  const context=root.dataset.context||location.pathname;
  root.className='feedback-widget';
  root.innerHTML='<span>Did this help?</span><div><button type="button" data-v="yes">Yes</button><button type="button" data-v="no">Not really</button></div><form hidden><label>What was missing? <input maxlength="280" placeholder="Optional feedback"></label><button type="submit">Send</button></form><small></small>';
  const note=root.querySelector('small'), form=root.querySelector('form');
  root.querySelectorAll('[data-v]').forEach(btn=>btn.addEventListener('click',()=>{
    const v=btn.dataset.v; window.dainTrack?.('utility_feedback',{context,value:v});
    if(v==='yes'){root.querySelector('div').hidden=true;note.textContent='Thanks — that helps us decide what to improve.';}
    else{root.querySelector('div').hidden=true;form.hidden=false;}
  }));
  form.addEventListener('submit',e=>{e.preventDefault();const message=form.querySelector('input').value.trim();window.dainTrack?.('utility_feedback_detail',{context,message:message.slice(0,280)});form.hidden=true;note.textContent='Thanks — we’ll use this to improve the utility.';});
 });
})();