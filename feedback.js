(() => {
 document.querySelectorAll('[data-feedback-widget]').forEach(root=>{
  if(root.dataset.feedbackReady)return;root.dataset.feedbackReady='true';
  const context=root.dataset.context||location.pathname;
  root.className='feedback-widget outcome-feedback';
  root.innerHTML='<form><strong>Did this work?</strong><label>Outcome<select name="outcome" required><option value="">Choose an outcome</option><option value="worked">Worked</option><option value="partly">Partly worked</option><option value="failed">Did not work</option><option value="not_tried">Not tried yet</option></select></label><label>Tool used<select name="tool"><option value="unspecified">Choose a tool (optional)</option><option>ChatGPT</option><option>Claude</option><option>Gemini</option><option>Perplexity</option><option>NotebookLM</option><option>Cursor</option><option>GitHub Copilot</option><option>Midjourney</option><option>Ideogram</option><option>Adobe Firefly</option><option>FLUX</option><option>Other</option></select></label><label>What needs improvement?<select name="reason"><option value="none">Nothing / not applicable</option><option value="wrong_tool">Tool recommendation</option><option value="prompt">Prompt clarity</option><option value="accuracy">Accuracy</option><option value="missing_details">Missing details</option><option value="cost_access">Cost or access</option><option value="usability">Hard to use</option><option value="other">Other</option></select></label><small>Only these selections are sent. Your prompt, source material and result are not included.</small><button type="submit">Send feedback</button></form><small role="status"></small>';
  const form=root.querySelector('form'),status=root.querySelector('[role="status"]'),button=form.querySelector('button');
  const details=document.createElement('details'),summary=document.createElement('summary');
  summary.textContent='Did this work? Share your outcome';details.append(summary,form,status);root.append(details);
  form.addEventListener('submit',async e=>{
   e.preventDefault();button.disabled=true;status.textContent='Sending…';
   const data=new FormData(form);
   try{
    const ok=await window.dainTrack?.('utility_feedback_detail',{context,feedback_version:2,outcome:data.get('outcome'),tool:data.get('tool'),reason:data.get('reason')});
    if(!ok)throw Error('not saved');
    form.hidden=true;status.textContent='Thanks. Your outcome feedback was saved.';
   }catch{status.textContent='Feedback could not be saved. Please try again.';button.disabled=false;}
  });
 });
})();
