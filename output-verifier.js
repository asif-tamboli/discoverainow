(() => {
 const $=id=>document.getElementById(id);
 const sets={
  research:[
   ['Source support','Can each consequential factual claim be traced to a source?'],
   ['Citation match','Does each cited source actually support the nearby claim?'],
   ['Freshness','Are dates and current-state claims recent enough for the question?'],
   ['Conflict handling','Does the answer expose credible disagreement instead of flattening it?'],
   ['Certainty','Are assumptions and uncertainty labeled rather than presented as fact?']
  ],
  code:[
   ['Reproduction','Does the proposed fix address the actual observed failure?'],
   ['Invented APIs','Verify every method, library, configuration and version-specific claim.'],
   ['Scope','Check for unrelated or unnecessarily broad changes.'],
   ['Tests','Add a test that fails before the fix and passes after it.'],
   ['Regression / security','Check edge cases, permissions, error handling and dependency risk.']
  ],
  writing:[
   ['Fact preservation','Compare names, dates, numbers and commitments against the source.'],
   ['Invented claims','Remove unsupported statistics, testimonials, credentials or promises.'],
   ['Audience fit','Does the tone and detail match the intended reader?'],
   ['Action clarity','Is the intended takeaway or next action obvious?'],
   ['Compression','Remove confident-sounding filler that adds no information.']
  ],
  requirements:[
   ['Scope','Are actors, triggers, inputs and outputs explicit?'],
   ['Ambiguity','Flag undefined terms, hidden assumptions and missing acceptance criteria.'],
   ['Edge cases','Check boundaries, empty/error states, permissions and concurrency where relevant.'],
   ['Ownership','Verify owners, deadlines and dependencies were not invented.'],
   ['Testability','Can each requirement be objectively verified?']
  ],
  general:[
   ['Grounding','Compare important claims with the source/context you supplied.'],
   ['Assumptions','Identify statements that depend on unstated assumptions.'],
   ['Completeness','Check whether important inputs, constraints or edge cases were ignored.'],
   ['Specificity','Replace generic advice with concrete, testable statements where possible.'],
   ['Human check','Review any consequential recommendation before acting on it.']
  ]
 };
 function signals(t,type,hasSource){
  const s=[]; if(/\b(always|never|guarantee|definitely|proven|100%)\b/i.test(t))s.push('Absolute language');
  if(type==='research' && !/https?:\/\/|source|citation|according to|\[[0-9]+\]/i.test(t))s.push('No obvious source references');
  if(/\b\d+(\.\d+)?%\b/.test(t) && !hasSource)s.push('Numeric claims without supplied evidence');
  if(t.length<180)s.push('Very short output may omit assumptions or edge cases');
  return s;
 }
 $('outputVerifierForm').addEventListener('submit',e=>{
  e.preventDefault();const text=$('ovOutput').value.trim(), source=$('ovSource').value.trim(), type=$('ovType').value;if(!text)return;
  const sig=signals(text,type,!!source);
  $('ovRisk').innerHTML='<strong>'+(sig.length?'Review signals detected':'No obvious structural red flags detected')+'</strong><p>'+(sig.length?sig.join(' · '):'You should still complete the checks below. This tool does not independently prove factual accuracy.')+'</p>';
  $('ovChecks').innerHTML=sets[type].map((x,i)=>'<label><input type="checkbox"><span><strong>'+String(i+1).padStart(2,'0')+' · '+x[0]+'</strong><small>'+x[1]+'</small></span></label>').join('');
  $('outputVerifierResult').hidden=false;$('outputVerifierResult').scrollIntoView({behavior:'smooth',block:'start'});
  window.dainTrack?.('output_verifier_run',{type,signals:sig.length,has_source:!!source});
 });
 $('ovCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('ovRisk').innerText+'\n\n'+$('ovChecks').innerText);$('ovCopy').textContent='Copied';setTimeout(()=>$('ovCopy').textContent='Copy checklist',1200);window.dainTrack?.('output_verifier_copy',{type:$('ovType').value});}catch{}});
 $('ovReset').addEventListener('click',()=>{$('outputVerifierForm').reset();$('outputVerifierResult').hidden=true;$('ovOutput').focus();});
})();