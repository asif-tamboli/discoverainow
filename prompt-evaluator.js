(() => {
 const $=id=>document.getElementById(id);
 const tests=[
  {id:'goal',label:'Clear outcome',ok:t=>/create|write|analy|compare|summar|build|debug|review|generate|explain|identify|produce|research|design/i.test(t),tip:'State exactly what the model should accomplish.'},
  {id:'context',label:'Useful context',ok:t=>t.length>180||/context|background|source|audience|product|code|requirement|data|document/i.test(t),tip:'Add the source material, audience or situation that changes the answer.'},
  {id:'format',label:'Output format',ok:t=>/format|table|json|bullet|steps|section|word|ratio|markdown|report|email|list/i.test(t),tip:'Specify the shape of the result so it is immediately usable.'},
  {id:'constraints',label:'Constraints',ok:t=>/must|must not|do not|avoid|only|constraint|preserve|limit|without/i.test(t),tip:'Say what must be preserved, avoided or bounded.'},
  {id:'verification',label:'Verification',ok:t=>/verify|source|citation|test|check|evidence|uncertain|assumption/i.test(t),tip:'For factual or consequential work, tell the model how uncertainty should be handled.'}
 ];
 function improve(t,type,missing){
  const add=[];
  if(missing.includes('goal')) add.push('GOAL\n[State the exact outcome you need]');
  if(missing.includes('context')) add.push('CONTEXT\n[Add the facts, source material, audience, code or references the model needs]');
  if(missing.includes('format')) add.push('OUTPUT\n[Specify the exact output format and level of detail]');
  if(missing.includes('constraints')) add.push('CONSTRAINTS\n- [What must be preserved]\n- [What must not be invented or changed]\n- [Relevant limits]');
  if(missing.includes('verification')) add.push('VERIFICATION\n- Separate facts from assumptions.\n- Flag uncertainty.\n- Verify consequential claims or changes using the available evidence.');
  const specific=type==='research'?'\nRESEARCH RULE\nPreserve sources for consequential claims and identify conflicting evidence.':type==='coding'?'\nENGINEERING RULE\nSeparate observations from hypotheses; propose the smallest change and include a verification test.':type==='image'?'\nVISUAL RULE\nSpecify subject, composition, lighting, aspect ratio and fidelity constraints.':type==='writing'?'\nWRITING RULE\nPreserve supplied facts and do not invent commitments, dates, evidence or statistics.':'';
  return t.trim()+'\n\n'+add.join('\n\n')+specific;
 }
 $('promptEvaluatorForm').addEventListener('submit',e=>{
  e.preventDefault(); const t=$('pePrompt').value.trim(), type=$('peType').value;if(!t)return;
  const res=tests.map(x=>({...x,pass:x.ok(t)})), missing=res.filter(x=>!x.pass).map(x=>x.id);
  $('peChecks').innerHTML=res.map(x=>'<div class="'+(x.pass?'pass':'improve')+'"><span>'+(x.pass?'✓':'!')+'</span><strong>'+x.label+'</strong><p>'+(x.pass?'Present in the prompt.':x.tip)+'</p></div>').join('');
  $('peImproved').textContent=improve(t,type,missing);
  $('promptEvaluatorResult').hidden=false;$('promptEvaluatorResult').scrollIntoView({behavior:'smooth',block:'start'});
  window.dainTrack?.('prompt_evaluator_run',{type,missing:missing.join(',')});
 });
 $('peCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('peImproved').textContent);$('peCopy').textContent='Copied';setTimeout(()=>$('peCopy').textContent='Copy improved prompt',1200);window.dainTrack?.('prompt_evaluator_copy',{type:$('peType').value});}catch{}});
 $('peReset').addEventListener('click',()=>{$('promptEvaluatorForm').reset();$('promptEvaluatorResult').hidden=true;$('pePrompt').focus();});
})();