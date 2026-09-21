(() => {
  const $=id=>document.getElementById(id);
  const templates={
    image:{
      tool:'ChatGPT Images / Midjourney',
      related:'/prompts/image-generation/',
      build:v=>`Create an image for this goal: ${v.goal}.

CONTEXT
${v.context||'[Add subject, product, setting or reference context]'}

VISUAL DIRECTION
Style / tone: ${v.tone||'[Specify visual style]'}
Output / aspect: ${v.format||'[Specify aspect ratio or format]'}

REQUIREMENTS
- Make the composition serve the stated goal.
- Use believable lighting, materials, scale and perspective.
- Keep important details away from unsafe crop areas when relevant.
- Preserve any identity, product or brand details explicitly provided.
- Do not add text, logos, people, objects or claims that were not requested.

CONSTRAINTS
${v.constraints||'[Add exclusions, fidelity requirements or elements that must remain unchanged]'}

Before generating, identify any missing detail that would materially change the result.`
    },
    coding:{
      tool:'Cursor / Claude Code / GitHub Copilot',
      related:'/prompts/coding/',
      build:v=>`You are helping with this engineering goal: ${v.goal}.

CONTEXT / CODE / ERROR
${v.context||'[Paste code, logs, requirement or stack trace]'}

FIRST
1. Separate verified observations from hypotheses.
2. Identify missing information that blocks a confident diagnosis.
3. Propose the smallest useful plan before editing code.

IMPLEMENTATION / OUTPUT
Format: ${v.format||'reviewable steps with code only where needed'}
Style: ${v.tone||'concise and technical'}

VERIFY
- Explain regression risks.
- Add or identify a test that should fail before the fix and pass after it.
- Do not invent APIs, runtime behavior, repository structure or business rules.

CONSTRAINTS
${v.constraints||'[Add framework, language, performance, security or scope constraints]'}`
    },
    research:{
      tool:'Perplexity + NotebookLM / Claude',
      related:'/prompts/research/',
      build:v=>`Research this question: ${v.goal}.

SOURCE / SCOPE
${v.context||'[Provide sources, date range, market, population or scope]'}

OUTPUT
${v.format||'A sourced brief with facts, disagreements, implications and open questions'}

RULES
- Separate factual claims from interpretation.
- Preserve a source next to each consequential factual claim when sources are provided.
- Flag stale, conflicting or weak evidence.
- Do not turn uncertainty into certainty.
- Identify what evidence is missing before making a recommendation.

STYLE
${v.tone||'clear, neutral and decision-oriented'}

CONSTRAINTS
${v.constraints||'[Add source restrictions, date limits or decision criteria]'}`
    },
    writing:{
      tool:'ChatGPT / Claude / Gemini',
      related:'/prompts/writing-productivity/',
      build:v=>`Help me produce: ${v.goal}.

SOURCE / CONTEXT
${v.context||'[Paste source material or explain the situation]'}

AUDIENCE / STYLE
${v.tone||'[Specify audience and tone]'}

OUTPUT FORMAT
${v.format||'[Specify email, report, summary, presentation outline, etc.]'}

RULES
- Preserve the original meaning and facts.
- Do not invent commitments, dates, owners, evidence or statistics.
- Remove filler and repetition.
- Make the requested action or takeaway clear.

CONSTRAINTS
${v.constraints||'[Add word limit, must-include points or prohibited changes]'}`
    },
    marketing:{
      tool:'ChatGPT / Claude',
      related:'/prompts/marketing/',
      build:v=>`Marketing goal: ${v.goal}.

PRODUCT / CUSTOMER EVIDENCE
${v.context||'[Provide product facts, customer problem, proof and target audience]'}

OUTPUT
${v.format||'[Positioning, landing page, ad concepts, campaign brief, SEO brief]'}

VOICE / STYLE
${v.tone||'[Specify brand voice]'}

RULES
- Start from the customer problem and supplied evidence.
- Do not invent testimonials, statistics, certifications, pricing or capabilities.
- Separate proof we have from claims we still need to validate.
- Prefer specific benefits over generic adjectives.

CONSTRAINTS
${v.constraints||'[Add channel, length, claim restrictions or CTA requirements]'}`
    }
  };

  $('promptBuilderForm').addEventListener('submit',e=>{
    e.preventDefault();
    const type=$('pbType').value, t=templates[type];
    const v={goal:$('pbGoal').value.trim(),context:$('pbContext').value.trim(),format:$('pbFormat').value.trim(),tone:$('pbTone').value.trim(),constraints:$('pbConstraints').value.trim()};
    if(!v.goal)return;
    $('pbOutput').textContent=t.build(v);
    $('pbToolFit').innerHTML='<span>Best tool fit</span><strong>'+t.tool+'</strong><small>Based on task type; use the Tool Finder when budget, privacy or integrations matter.</small>';
    $('pbRelated').href=t.related;
    $('promptBuilderResult').hidden=false;
    $('promptBuilderResult').scrollIntoView({behavior:'smooth',block:'start'});
    window.dainTrack?.('prompt_builder_generate',{type,intent:(window.dainSafeText?.(v.goal)||v.goal.slice(0,300))});
  });
  $('pbCopy').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText($('pbOutput').textContent);$('pbCopy').textContent='Copied';setTimeout(()=>$('pbCopy').textContent='Copy prompt',1200);window.dainTrack?.('prompt_builder_copy',{type:$('pbType').value});}catch{}
  });
  $('pbReset').addEventListener('click',()=>{ $('promptBuilderForm').reset(); $('promptBuilderResult').hidden=true; $('pbGoal').focus();});
})();