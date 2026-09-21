(() => {
 const $=id=>document.getElementById(id);
 const esc=s=>String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
 const sets={
  research:[['Source support','Trace consequential factual claims to reliable sources.'],['Citation match','Confirm each citation supports the nearby claim.'],['Freshness','Check dates and current-state claims.'],['Conflict handling','Expose credible disagreement and uncertainty.'],['Certainty','Separate evidence, inference and assumption.']],
  code:[['Reproduction','Confirm the solution addresses the observed failure.'],['Invented APIs','Verify methods, libraries, configuration and versions.'],['Scope','Look for unrelated or unnecessarily broad changes.'],['Tests','Require a test that fails before the fix and passes after it.'],['Regression / security','Check edge cases, permissions, errors and dependency risk.']],
  writing:[['Fact preservation','Compare names, dates, numbers and commitments with the source.'],['Invented claims','Remove unsupported statistics, credentials or promises.'],['Audience fit','Check tone and detail for the intended reader.'],['Action clarity','Make the takeaway or next action explicit.'],['Compression','Remove confident filler that adds no information.']],
  requirements:[['Scope','Check actors, triggers, inputs and outputs.'],['Ambiguity','Flag undefined terms and hidden assumptions.'],['Edge cases','Check boundaries, empty/error states and permissions.'],['Ownership','Verify owners, deadlines and dependencies were not invented.'],['Testability','Make each requirement objectively verifiable.']],
  general:[['Grounding','Compare important claims with supplied context.'],['Assumptions','Identify statements that depend on unstated assumptions.'],['Completeness','Check ignored inputs, constraints and edge cases.'],['Specificity','Prefer concrete, testable statements.'],['Human check','Review consequential recommendations before acting.']]
 };
 const stop=new Set('the a an and or but to of in on for with from by at as is are was were be been being this that these those it its your you we they them our should must need needs required requirement requirements output result original ai'.split(' '));
 function tokens(s){return (s.toLowerCase().match(/[a-z0-9][a-z0-9+.#/-]*/g)||[]).filter(x=>x.length>2&&!stop.has(x));}
 function splitReq(s){
   return s.split(/\n+|(?<=[.!?;])\s+/).map(x=>x.replace(/^[-*•\d.)\s]+/,'').trim()).filter(x=>x.length>=12).slice(0,12);
 }
 function coverage(req,out){
   const ot=new Set(tokens(out));
   return splitReq(req).map(text=>{
     const rt=[...new Set(tokens(text))];
     const hits=rt.filter(x=>ot.has(x));
     const ratio=rt.length?hits.length/rt.length:0;
     return {text,status:ratio>=.58?'Likely addressed':ratio>=.25?'Needs review':'Not evident',ratio};
   });
 }
 function signals(t,type,hasSource){
   const s=[]; if(/\b(always|never|guarantee|definitely|proven|100%)\b/i.test(t))s.push('Absolute language');
   if(type==='research'&&!/https?:\/\/|source|citation|according to|\[[0-9]+\]/i.test(t))s.push('No obvious source references');
   if(/\b\d+(\.\d+)?%\b/.test(t)&&!hasSource)s.push('Numeric claims without supplied evidence');
   if(t.length<180)s.push('Very short output may omit assumptions or edge cases');
   return s;
 }
 function corrective(type,req,out,cov,sig){
   const gaps=cov.filter(x=>x.status!=='Likely addressed').map(x=>'- '+x.text);
   return `Revise the AI result against the original requirement. Preserve correct material; do not rewrite sections merely for style.

ORIGINAL REQUIREMENT / SOURCE CONTEXT:
${req||'[No requirement supplied — ask for it before claiming requirement coverage.]'}

CURRENT RESULT:
${out}

AREAS THAT NEED REVIEW:
${gaps.length?gaps.join('\n'):'- Re-check every requirement explicitly; no obvious lexical coverage gap was detected.'}
${sig.length?'\nRISK SIGNALS:\n- '+sig.join('\n- '):''}

INSTRUCTIONS:
1. Map each original requirement to the revised result.
2. Fix omissions and constraint violations.
3. Do not invent facts, APIs, sources, owners, dates or behavior.
4. Label assumptions and unresolved questions.
5. For ${type}, perform the relevant verification checks before claiming correctness.
6. Return the revised result first, followed by a short "What changed" section and a "Still needs verification" section.`;
 }
 $('outputVerifierForm').addEventListener('submit',e=>{
  e.preventDefault(); const out=$('ovOutput').value.trim(), req=$('ovSource').value.trim(), type=$('ovType').value; if(!out)return;
  const sig=signals(out,type,!!req), cov=req?coverage(req,out):[];
  const gaps=cov.filter(x=>x.status!=='Likely addressed').length;
  $('ovRisk').innerHTML='<strong>'+(req?(gaps?gaps+' requirement area'+(gaps===1?'':'s')+' need review':'No obvious requirement coverage gaps detected'):(sig.length?'Review signals detected':'Structural review only'))+'</strong><p>'+(req?'This is a deterministic text-overlap review, not proof of semantic correctness. Treat “likely addressed” as a review cue, then verify the actual meaning and evidence.':'No original requirement was supplied, so requirement coverage cannot be assessed.')+(sig.length?' Signals: '+esc(sig.join(' · ')):'')+'</p>';
  $('ovCoverage').innerHTML=req?'<div class="judge-section-head"><span class="section-kicker">Requirement coverage</span><h3>Requirement → result</h3></div>'+cov.map((x,i)=>'<div class="judge-row"><span>'+String(i+1).padStart(2,'0')+'</span><p>'+esc(x.text)+'</p><strong data-status="'+x.status.toLowerCase().replace(/\s+/g,'-')+'">'+x.status+'</strong></div>').join(''):'';
  $('ovChecks').innerHTML='<div class="judge-section-head"><span class="section-kicker">Human verification</span><h3>Checks that still matter</h3></div>'+sets[type].map((x,i)=>'<label><input type="checkbox"><span><strong>'+String(i+1).padStart(2,'0')+' · '+x[0]+'</strong><small>'+x[1]+'</small></span></label>').join('');
  const cp=corrective(type,req,out,cov,sig); $('ovCorrectionText').textContent=cp; $('ovCorrection').hidden=false;
  $('outputVerifierResult').hidden=false; $('outputVerifierResult').scrollIntoView({behavior:'smooth',block:'start'});
  window.dainTrack?.('output_verifier_run',{type,signals:sig.length,has_source:!!req,requirements:cov.length,gaps});
 });
 $('ovCopyCorrection').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('ovCorrectionText').innerText);$('ovCopyCorrection').textContent='Copied';setTimeout(()=>$('ovCopyCorrection').textContent='Copy corrective prompt',1200);window.dainTrack?.('output_verifier_correction_copy',{type:$('ovType').value});}catch{}});
 $('ovCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('ovRisk').innerText+'\n\n'+$('ovCoverage').innerText+'\n\n'+$('ovChecks').innerText);$('ovCopy').textContent='Copied';setTimeout(()=>$('ovCopy').textContent='Copy review',1200);window.dainTrack?.('output_verifier_copy',{type:$('ovType').value});}catch{}});
 $('ovReset').addEventListener('click',()=>{$('outputVerifierForm').reset();$('outputVerifierResult').hidden=true;$('ovCorrection').hidden=true;$('ovOutput').focus();});
})();