(() => {
 const $=id=>document.getElementById(id);
 const profiles=[
  {id:'research',match:/research|source|market|company|competitor|brief|evidence|fact/i,steps:[
   ['Define','Write the decision/question, scope, date range and evidence standard.','Human'],
   ['Discover','Find candidate sources and primary evidence.','Perplexity / web research'],
   ['Ground','Load trusted documents and extract claims with source references.','NotebookLM'],
   ['Synthesize','Compare agreements, conflicts, gaps and implications.','Claude / ChatGPT'],
   ['Verify','Spot-check consequential claims against primary sources.','Human'],
   ['Package','Turn the verified findings into the requested output.','Claude / ChatGPT']
  ]},
  {id:'meetings',match:/meeting|interview|transcript|notes|customer interview/i,steps:[
   ['Capture','Create a clean transcript or structured notes.','Otter / meeting tool'],
   ['Extract','Identify decisions, themes, actions and unresolved questions.','ChatGPT / Claude'],
   ['Trace','Keep quotes or note references for important conclusions.','Human + source notes'],
   ['Transform','Convert verified findings into the requested artifact.','ChatGPT / Claude'],
   ['Review','Confirm owners, dates and commitments were not invented.','Human']
  ]},
  {id:'coding',match:/code|debug|bug|software|api|repository|repo|test|automation|website|app/i,steps:[
   ['Observe','Collect requirement, code, error, logs and reproduction steps.','Human'],
   ['Diagnose','Separate observations from hypotheses and propose the smallest plan.','Cursor / Claude Code'],
   ['Change','Implement the smallest scoped change.','Cursor / Copilot / Claude Code'],
   ['Test','Run targeted tests plus regression checks.','Developer + test suite'],
   ['Review','Inspect diff, assumptions, security and maintainability.','Human + coding assistant'],
   ['Release','Deploy only after the verification gates pass.','Existing CI/CD']
  ]},
  {id:'creative',match:/image|photo|video|ad|design|poster|thumbnail|creative/i,steps:[
   ['Brief','Define audience, channel, message, references and non-negotiables.','Human'],
   ['Plan','Create a shot/composition list before generating assets.','ChatGPT / Claude'],
   ['Generate','Create stills, keyframes or visual variants.','ChatGPT Images / Midjourney / Firefly'],
   ['Animate / edit','Add motion or assemble the final creative where needed.','Runway / creative editor'],
   ['Verify','Check identity, product fidelity, text, continuity and brand details.','Human'],
   ['Export','Produce the channel-specific format and crop.','Creative editor']
  ]},
  {id:'automation',match:/automate|automation|workflow|trigger|weekly|repetitive|integrat/i,steps:[
   ['Map','Write the trigger, inputs, decisions, actions and failure paths.','Human'],
   ['Classify','Separate deterministic rules from tasks that actually need AI.','Human'],
   ['Build','Connect the systems and AI steps.','n8n / Make / Zapier'],
   ['Guard','Add validation, retries, approvals and data-handling controls.','Automation platform'],
   ['Test','Run normal, empty, malformed and failure scenarios.','Human'],
   ['Monitor','Track failures, costs and outputs after launch.','Platform logs + human review']
  ]},
  {id:'general',match:/.*/,steps:[
   ['Define','State the desired outcome, inputs, constraints and success criteria.','Human'],
   ['Prepare','Collect the source material the AI needs.','Human'],
   ['Generate','Use AI for the transformation or first draft.','ChatGPT / Claude / Gemini'],
   ['Verify','Check facts, assumptions, edge cases and requirements.','Human'],
   ['Refine','Correct issues and turn the result into a reusable artifact.','AI + human'],
   ['Reuse','Save the prompt/process if it consistently works.','Your workflow system']
  ]}
 ];
 function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
 $('workflowGeneratorForm').addEventListener('submit',e=>{
  e.preventDefault(); const goal=$('wgGoal').value.trim(); if(!goal)return;
  const p=profiles.find(x=>x.match.test(goal))||profiles.at(-1);
  const input=$('wgInput').value.trim()||'Not specified', output=$('wgOutput').value.trim()||'Desired final artifact', risk=$('wgRisk').value, constraints=$('wgConstraints').value.trim();
  $('wgSummary').innerHTML='<strong>Goal:</strong> '+esc(goal)+' <span>·</span> <strong>Pattern:</strong> '+p.id+' <span>·</span> <strong>Risk:</strong> '+risk;
  $('wgSteps').innerHTML=p.steps.map((s,i)=>'<div><span>'+String(i+1).padStart(2,'0')+'</span><div><strong>'+s[0]+'</strong><p>'+s[1]+'</p></div><small>'+s[2]+'</small></div>').join('')+
    '<div class="generated-context"><strong>Inputs</strong><p>'+esc(input)+'</p><strong>Output</strong><p>'+esc(output)+'</p>'+(constraints?'<strong>Constraints</strong><p>'+esc(constraints)+'</p>':'')+'</div>';
  $('workflowGeneratorResult').hidden=false; $('workflowGeneratorResult').scrollIntoView({behavior:'smooth',block:'start'});
  window.dainTrack?.('workflow_generator_generate',{pattern:p.id,risk,skill:$('wgSkill').value});
 });
 $('wgCopy').addEventListener('click',async()=>{const text=$('wgSummary').innerText+'\n\n'+$('wgSteps').innerText;try{await navigator.clipboard.writeText(text);$('wgCopy').textContent='Copied';setTimeout(()=>$('wgCopy').textContent='Copy workflow',1200);window.dainTrack?.('workflow_generator_copy',{});}catch{}});
 $('wgReset').addEventListener('click',()=>{$('workflowGeneratorForm').reset();$('workflowGeneratorResult').hidden=true;$('wgGoal').focus();});
})();