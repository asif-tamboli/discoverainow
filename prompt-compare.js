(() => {
 const $=id=>document.getElementById(id);
 const checks=[
  {id:'goal',label:'Clear outcome',test:t=>/create|write|analy|compare|summar|build|debug|review|generate|explain|identify|produce|research|design|convert/i.test(t),hint:'State the exact job.'},
  {id:'context',label:'Context',test:t=>t.length>180||/context|background|source|audience|product|code|requirement|data|document|reference/i.test(t),hint:'Supply the information that changes the answer.'},
  {id:'format',label:'Output shape',test:t=>/format|table|json|bullet|steps|section|word|ratio|markdown|report|email|list|schema/i.test(t),hint:'Define the reusable output.'},
  {id:'constraints',label:'Constraints',test:t=>/must|must not|do not|avoid|only|constraint|preserve|limit|without|never/i.test(t),hint:'Bound what can be changed or invented.'},
  {id:'verify',label:'Verification',test:t=>/verify|source|citation|test|check|evidence|uncertain|assumption|prove/i.test(t),hint:'Tell the model how to expose uncertainty.'}
 ];
 function score(t){return checks.map(c=>({...c,pass:c.test(t)}));}
 function combined(a,b,type,resA,resB){
   const missing=checks.filter((_,i)=>!resA[i].pass&&!resB[i].pass).map(x=>x.id);
   const sections=[];
   if(missing.includes('goal'))sections.push('GOAL\n[State the exact outcome]');
   if(missing.includes('context'))sections.push('CONTEXT\n[Add source material, audience, code, references or facts]');
   if(missing.includes('format'))sections.push('OUTPUT\n[Specify exact structure / format]');
   if(missing.includes('constraints'))sections.push('CONSTRAINTS\n- [What must be preserved]\n- [What must not be invented]\n- [Limits]');
   if(missing.includes('verify'))sections.push('VERIFICATION\n- Separate facts from assumptions.\n- Flag uncertainty.\n- Show how consequential claims or changes should be checked.');
   const special=type==='research'?'\nRESEARCH RULE\nPreserve sources for consequential claims and expose conflicting evidence.':type==='coding'?'\nENGINEERING RULE\nSeparate observations from hypotheses, minimize change scope and include a verification test.':type==='image'?'\nVISUAL RULE\nSpecify subject fidelity, composition, lighting, aspect ratio and exclusions.':type==='writing'?'\nWRITING RULE\nPreserve supplied facts and do not invent commitments, dates, statistics or evidence.':'';
   return 'BASE PROMPT\n'+(a.length>=b.length?a:b).trim()+'\n\n'+sections.join('\n\n')+special;
 }
 $('promptCompareForm').addEventListener('submit',e=>{
  e.preventDefault(); const a=$('promptA').value.trim(),b=$('promptB').value.trim(),type=$('pcType').value;if(!a||!b)return;
  const ra=score(a),rb=score(b);
  $('pcMatrix').innerHTML='<div class="pcm-head"><strong>Criterion</strong><strong>Prompt A</strong><strong>Prompt B</strong><strong>What matters</strong></div>'+checks.map((c,i)=>'<div class="pcm-row"><strong>'+c.label+'</strong><span class="'+(ra[i].pass?'pass':'miss')+'">'+(ra[i].pass?'Present':'Missing')+'</span><span class="'+(rb[i].pass?'pass':'miss')+'">'+(rb[i].pass?'Present':'Missing')+'</span><small>'+c.hint+'</small></div>').join('');
  $('pcCombined').textContent=combined(a,b,type,ra,rb);
  $('promptCompareResult').hidden=false;$('promptCompareResult').scrollIntoView({behavior:'smooth',block:'start'});
  window.dainTrack?.('prompt_compare_run',{type,a_present:ra.filter(x=>x.pass).length,b_present:rb.filter(x=>x.pass).length});
 });
 $('pcCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('pcCombined').textContent);$('pcCopy').textContent='Copied';setTimeout(()=>$('pcCopy').textContent='Copy combined prompt',1200);window.dainTrack?.('prompt_compare_copy',{type:$('pcType').value});}catch{}});
 $('pcReset').addEventListener('click',()=>{$('promptCompareForm').reset();$('promptCompareResult').hidden=true;$('promptA').focus();});
})();