(() => {
  const $=id=>document.getElementById(id);
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  const tools={
    chatgpt:{
      name:'ChatGPT Image',href:'/tools/chatgpt/',type:'Conversational image workflow',
      base:{adherence:9,realism:8,aesthetic:8,text:7,editing:10,commercial:8,reference:9},
      best:'Instruction-following, iterative refinement and controlled edits.',
      trade:'Can produce polished creative work, but users seeking highly stylized exploration may prefer a more aesthetic-first workflow.',
      prompt:v=>`Create an image for this exact goal:

${v.goal}

PURPOSE
${v.useCaseLabel}

VISUAL DIRECTION
Style: ${v.styleLabel}
Aspect ratio: ${v.ratioLabel}

COMPOSITION
- Build the composition around the stated purpose.
- Keep subject hierarchy clear.
${v.text?'- Leave intentional space and render only the exact requested text. Verify spelling and typography.':'- Do not add unrequested text or typography.'}
${v.reference?'- Preserve the supplied product/character/reference identity, geometry and defining details.':''}

REALISM / QUALITY
- Use believable materials, lighting, perspective and scale.
- Avoid duplicated objects, malformed anatomy, inconsistent reflections and accidental artifacts.

CONSTRAINTS
${v.constraints||'[No additional constraints supplied]'}

ITERATION
${v.edit?'After the first version, preserve approved elements and change only the parts I explicitly request.':'Aim for a strong first-pass composition and do not introduce details that were not requested.'}`
    },
    midjourney:{
      name:'Midjourney',href:'/tools/midjourney/',type:'Aesthetic-first image generation',
      base:{adherence:7,realism:8,aesthetic:10,text:5,editing:6,commercial:7,reference:7},
      best:'High-impact visual exploration, cinematic composition and stylized aesthetics.',
      trade:'Exact instruction-following, typography and iterative local revisions can require more prompt/parameter experimentation.',
      prompt:v=>`${v.goal}, ${v.styleLabel.toLowerCase()} visual direction, strong subject hierarchy, refined composition, professional lighting, realistic materials and depth, premium image-making, intentional negative space${v.text?', exact legible typography only where specified':''}${v.reference?', preserve core reference identity and defining geometry':''}${v.constraints?', '+v.constraints:''} --ar ${v.ratio==='custom'?'1:1':v.ratio} --stylize 150`
    },
    ideogram:{
      name:'Ideogram',href:'https://ideogram.ai/',type:'Typography-aware image generation',
      external:true,
      base:{adherence:8,realism:7,aesthetic:8,text:10,editing:7,commercial:8,reference:7},
      best:'Posters, marketing graphics and images where visible text or layout matters.',
      trade:'For pure cinematic image-making without text, an aesthetic-first or conversational image workflow may be more natural.',
      prompt:v=>`IMAGE GOAL:
${v.goal}

DESIGN TYPE:
${v.useCaseLabel}

STYLE:
${v.styleLabel}

LAYOUT:
Create a deliberate ${v.ratioLabel} composition with clear visual hierarchy.
${v.text?'TEXT REQUIREMENT: Render only the exact supplied wording. Keep every character legible, correctly spelled and intentionally placed.':'Do not introduce decorative text, labels or lettering.'}
${v.reference?'REFERENCE FIDELITY: Preserve the defining subject/product identity and geometry.':''}

VISUAL QUALITY:
Professional lighting, clean edges, coherent perspective, controlled background detail and production-ready composition.

CONSTRAINTS:
${v.constraints||'[No additional constraints supplied]'}`
    },
    firefly:{
      name:'Adobe Firefly',href:'https://firefly.adobe.com/',type:'Creative-suite workflow',
      external:true,
      base:{adherence:8,realism:8,aesthetic:7,text:7,editing:9,commercial:10,reference:8},
      best:'Design-team workflows, asset editing and work that continues into Adobe creative tools.',
      trade:'Users prioritizing experimental visual style above production workflow may prefer a more exploration-oriented generator.',
      prompt:v=>`Create a production-ready ${v.useCaseLabel.toLowerCase()}.

Subject and goal:
${v.goal}

Visual treatment:
- ${v.styleLabel}
- ${v.ratioLabel}
- polished commercial composition
- believable materials and lighting
- clean separation between subject and background
${v.text?'- preserve exact requested copy and maintain strong typographic hierarchy':'- no unrequested text'}
${v.reference?'- maintain fidelity to the supplied reference/product details':''}

Editing intent:
${v.edit?'Build the image so major elements can be refined independently during subsequent creative editing.':'Prioritize a complete first-pass asset.'}

Constraints:
${v.constraints||'[No additional constraints supplied]'}`
    },
    flux:{
      name:'FLUX',href:'https://blackforestlabs.ai/',type:'Image-model workflow',
      external:true,
      base:{adherence:8,realism:9,aesthetic:8,text:7,editing:6,commercial:7,reference:8},
      best:'Photorealistic rendering and detailed prompt-driven image generation.',
      trade:'The user experience, editing controls and deployment path depend on the specific FLUX product/provider you use.',
      prompt:v=>`A ${v.styleLabel.toLowerCase()} ${v.useCaseLabel.toLowerCase()} depicting ${v.goal}. Highly coherent subject geometry, realistic lighting and material response, physically believable perspective, detailed but controlled background, professional composition, ${v.ratioLabel}${v.text?', exact and legible requested text only':''}${v.reference?', strong fidelity to supplied reference identity and structure':''}. Negative constraints: accidental extra objects, duplicated details, malformed geometry, unreadable lettering, inconsistent reflections${v.constraints?', '+v.constraints:''}.`
    }
  };

  const labels={
    product:'Product / ecommerce image',ad:'Advertising creative',poster:'Poster / graphic',thumbnail:'Thumbnail / social graphic',
    portrait:'Portrait / headshot',concept:'Concept art / cinematic scene',branding:'Brand / logo exploration',other:'Custom image',
    photorealistic:'Photorealistic',cinematic:'Cinematic',luxury:'Luxury / premium',editorial:'Editorial',
    minimal:'Minimal',artistic:'Artistic / stylized',fantasy:'Fantasy / surreal',graphic:'Graphic / flat design'
  };

  function context(){
    return {
      goal:$('plGoal').value.trim(),
      useCase:$('plUseCase').value,useCaseLabel:labels[$('plUseCase').value],
      style:$('plStyle').value,styleLabel:labels[$('plStyle').value],
      priority:$('plPriority').value,
      ratio:$('plRatio').value,ratioLabel:$('plRatio').selectedOptions[0].textContent,
      text:$('plText').checked,edit:$('plEdit').checked,reference:$('plReference').checked,
      constraints:$('plConstraints').value.trim()
    };
  }

  function scored(v){
    return Object.entries(tools).map(([key,t])=>{
      let score=t.base[v.priority]||7, reasons=[];
      if(v.text){score+=t.base.text>=9?2:t.base.text<=5?-2:0;if(t.base.text>=9)reasons.push('stronger fit when visible text matters');}
      if(v.edit){score+=t.base.editing>=9?2:t.base.editing<=6?-1:0;if(t.base.editing>=9)reasons.push('better suited to iterative editing');}
      if(v.reference){score+=t.base.reference>=9?2:t.base.reference<=7?-1:0;if(t.base.reference>=9)reasons.push('stronger fit for reference fidelity');}
      if(v.style==='cinematic'||v.style==='artistic'||v.style==='fantasy'){if(t.base.aesthetic>=9){score+=2;reasons.push('strong aesthetic exploration fit');}}
      if(v.style==='photorealistic'||v.useCase==='product'||v.useCase==='portrait'){if(t.base.realism>=9){score+=1.5;reasons.push('strong photorealism fit');}}
      if(v.useCase==='poster'||v.useCase==='thumbnail'){if(v.text&&t.base.text>=9)score+=2;}
      if(v.priority==='commercial'&&t.base.commercial>=9){score+=2;reasons.push('stronger production/design workflow fit');}
      return {key,t,score,reasons};
    }).sort((a,b)=>b.score-a.score);
  }

  function fit(score,top){const d=top-score;if(d<1)return 'Best fit';if(d<2.5)return 'Strong fit';if(d<4)return 'Good alternative';return 'Conditional fit';}
  function bar(n){return '<span class="pl-meter"><i style="width:'+(n*10)+'%"></i></span><b>'+n+'/10</b>';}

  function render(v,ranked){
    const top=ranked[0];
    $('plSummary').innerHTML='<strong>Use case:</strong> '+esc(v.useCaseLabel)+' <span>·</span> <strong>Style:</strong> '+esc(v.styleLabel)+' <span>·</span> <strong>Priority:</strong> '+esc($('plPriority').selectedOptions[0].textContent);

    $('plWinner').innerHTML='<div><span>Primary match</span><strong>'+top.t.name+'</strong><p>'+top.t.best+'</p><small>'+esc(top.reasons.slice(0,2).join(' · ')||'Best combined fit for the constraints you selected.')+'</small></div><a href="'+top.t.href+'" '+(top.t.external?'target="_blank" rel="noopener"':'')+'>Learn / open →</a>';

    const dims=['adherence','realism','aesthetic','text','editing','commercial'];
    const names={adherence:'Instruction fit',realism:'Realism',aesthetic:'Aesthetic impact',text:'Text handling',editing:'Revision workflow',commercial:'Commercial workflow'};
    $('plComparison').innerHTML=ranked.map(r=>{
      const rows=dims.map(d=>'<div class="pl-profile-row"><span>'+names[d]+'</span>'+bar(r.t.base[d])+'</div>').join('');
      return '<article class="pl-tool-card"><div class="pl-tool-card-head"><div><span>'+fit(r.score,top.score)+'</span><strong>'+r.t.name+'</strong><small>'+r.t.type+'</small></div><a href="'+r.t.href+'" '+(r.t.external?'target="_blank" rel="noopener"':'')+'>↗</a></div><p><b>Likely strength:</b> '+r.t.best+'</p><p><b>Tradeoff:</b> '+r.t.trade+'</p><div class="pl-profile">'+rows+'</div></article>';
    }).join('');

    $('plPrompts').innerHTML=ranked.map((r,i)=>{
      const prompt=r.t.prompt(v);
      return '<article class="tool-prompt-card '+(i===0?'featured':'')+'"><div class="tool-prompt-head"><div><span>'+(i===0?'Recommended first':'Alternative')+'</span><strong>'+r.t.name+'</strong></div><button type="button" class="pl-copy" data-key="'+r.key+'">Copy prompt</button></div><pre>'+esc(prompt)+'</pre><small><b>Why adapted this way:</b> '+esc(r.t.best)+' '+esc(r.t.trade)+'</small></article>';
    }).join('');

    document.querySelectorAll('.pl-copy').forEach(btn=>btn.addEventListener('click',async()=>{
      const key=btn.dataset.key;const prompt=tools[key].prompt(v);
      try{await navigator.clipboard.writeText(prompt);const old=btn.textContent;btn.textContent='Copied';setTimeout(()=>btn.textContent=old,1200);window.dainTrack?.('prompt_lab_copy',{tool:key,use_case:v.useCase,priority:v.priority});}catch{}
    }));
  }

  $('promptLabForm').addEventListener('submit',e=>{
    e.preventDefault();const v=context();if(v.goal.length<5){$('plGoal').focus();return;}
    const ranked=scored(v);render(v,ranked);$('promptLabResult').hidden=false;$('promptLabResult').scrollIntoView({behavior:'smooth',block:'start'});
    window.dainTrack?.('prompt_lab_compare',{use_case:v.useCase,style:v.style,priority:v.priority,text:v.text,editing:v.edit,reference:v.reference,primary:ranked[0].key});
  });

  $('plReset').addEventListener('click',()=>{$('promptLabForm').reset();$('promptLabResult').hidden=true;$('plGoal').focus();});
})();