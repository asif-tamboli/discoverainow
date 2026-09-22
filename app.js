const el=(id)=>document.getElementById(id);

const toast=(msg)=>{
  const t=el('toast');
  if(!t)return;
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1700);
};

/* ===== Reusable UI components ===== */
const workflows=[
  {
    tag:'Research',
    title:'Research a topic and build a sourced brief',
    description:'Discovery → verification → synthesis → decision.',
    href:'/workflows/research-to-brief/',
    steps:['Discover','Verify','Synthesize','Brief']
  },
  {
    tag:'Meetings',
    title:'Turn meeting notes into decisions and actions',
    description:'Extract decisions, owners, deadlines and open questions without guessing.',
    href:'/workflows/meeting-notes-to-actions/',
    steps:['Capture','Extract','Confirm','Act']
  },
  {
    tag:'Presentations',
    title:'Turn raw information into a decision-ready deck',
    description:'Build the narrative before asking AI to build slides.',
    href:'/guides/ai-presentations/',
    steps:['Audience','Story','Evidence','Slides']
  },
  {
    tag:'Images',
    title:'Create better AI images with structured prompts',
    description:'Move from vague requests to reusable visual direction.',
    href:'/prompts/image-generation/',
    steps:['Purpose','Compose','Generate','Refine']
  },
  {
    tag:'Coding',
    title:'Debug and review code with AI',
    description:'Separate evidence from hypotheses before changing code.',
    href:'/prompts/coding/',
    steps:['Observe','Hypothesize','Fix','Verify']
  },
  {
    tag:'QA',
    title:'Turn a story into reviewed test coverage',
    description:'Clarify requirements, map risk, generate cases, then automate.',
    href:'/workflows/jira-story-to-test-cases/',
    steps:['Clarify','Risk','Design','Automate']
  }
];

const prompts=[
  {
    category:'Research',
    title:'Sourced research brief',
    text:'Build a research brief from the sources below. Preserve source links next to factual claims, separate facts from interpretation, flag conflicts, and identify what is outdated or uncertain.',
    href:'/prompts/research/'
  },
  {
    category:'Coding',
    title:'Evidence-first debugging',
    text:'Separate verified observations, likely hypotheses, and missing evidence. Propose the smallest diagnostic steps before suggesting a fix. Do not invent runtime behavior.',
    href:'/prompts/coding/'
  },
  {
    category:'Images',
    title:'Professional portrait',
    text:'Create a photorealistic editorial portrait of [SUBJECT] in [SETTING] using soft directional light, natural skin texture, realistic proportions, and clear framing constraints.',
    href:'/prompts/image-generation/'
  },
  {
    category:'Work',
    title:'Meeting notes → actions',
    text:'Extract decisions, action items, owners, due dates, open questions and risks. Do not guess owners or deadlines; mark missing information explicitly.',
    href:'/prompts/writing-productivity/'
  }
];

function WorkflowCard(item,index){
  return `
    <a class="workflow-feature-card searchable" data-type="workflow" data-search="${esc((item.tag+' '+item.title+' '+item.description).toLowerCase())}" href="${item.href}">
      <div class="workflow-feature-top"><span>${String(index+1).padStart(2,'0')}</span><b>${item.tag}</b></div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="workflow-mini-steps">${item.steps.map(step=>`<span>${step}</span>`).join('<i>→</i>')}</div>
    </a>`;
}

function PromptSnippet(item,index){
  return `
    <article class="prompt-snippet searchable" data-type="prompt" data-search="${esc((item.category+' '+item.title+' '+item.text).toLowerCase())}">
      <div class="prompt-snippet-head">
        <div><span>${item.category}</span><h3>${item.title}</h3></div>
        <button type="button" data-prompt-copy="${index}">Copy</button>
      </div>
      <p>${item.text}</p>
      <a href="${item.href}">See full prompt & usage notes →</a>
    </article>`;
}

function ResourceGrid(items){
  return items.map((x,i)=>`
    <a class="article-card searchable" data-type="news" data-search="${esc((x.title+' '+(x.summary||'')).toLowerCase())}" data-track="outbound_click" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer">
      <div class="article-thumb ${['visual-wave','visual-chat','visual-bot','visual-sail'][i%4]}"><span class="bookmark">↗</span><span class="live-pill">RADAR</span></div>
      <div class="article-body">
        <span class="article-type">${signalLabel(x.title)}</span>
        <h3>${esc(x.title)}</h3>
        <p>${esc(getDomain(x.url))}</p>
        <div class="article-meta">${relativeDate(x.published_at)} · external signal</div>
      </div>
    </a>`).join('');
}

function mountCollection(sectionId,gridId,items,renderer){
  const section=el(sectionId);
  const grid=el(gridId);
  if(!section||!grid)return;
  if(!Array.isArray(items)||items.length===0){
    section.remove();
    return;
  }
  grid.innerHTML=items.map(renderer).join('');
  if(!grid.children.length){
    section.remove();
    return;
  }
  section.hidden=false;
}

mountCollection('workflowHomeSection','workflowFeatureGrid',workflows,WorkflowCard);
mountCollection('promptHomeSection','promptSnippetGrid',prompts,PromptSnippet);

document.querySelectorAll('[data-prompt-copy]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=prompts[Number(btn.dataset.promptCopy)];
    navigator.clipboard.writeText(item.text).then(()=>{
      btn.textContent='Copied';
      setTimeout(()=>btn.textContent='Copy',1200);
      window.dainTrack?.('prompt_copy',{prompt:item.title,category:item.category});
      toast('Prompt copied');
    }).catch(()=>toast('Copy failed — select the prompt manually.'));
  });
});

/* ===== Task-first decision engine ===== */
const input=el('globalSearch');

const decisionProfiles=[
  {id:'documents',words:['pdf','document','documents','paper','report','sources','files'],title:'Work from your own documents',tool:'NotebookLM',toolUrl:'/tools/notebooklm/',why:'Keep the answer grounded in the source set you provide.',workflow:'/workflows/research-to-brief/',workflowLabel:'Research workflow',prompt:'/prompt-builder/'},
  {id:'research',words:['research','current','web','sources','fact check','fact-check','competitor','market'],title:'Research with traceable sources',tool:'Perplexity',toolUrl:'/tools/perplexity/',why:'Start with source-oriented discovery, then verify consequential claims.',workflow:'/workflows/research-to-brief/',workflowLabel:'Research workflow',prompt:'/prompts/research/'},
  {id:'image',words:['image','photo','thumbnail','poster','visual','product image','logo'],title:'Create and refine an image',tool:'Midjourney + Prompt Lab',toolUrl:'/tools/midjourney/',why:'Use an image-focused workflow and adapt the same intent across generators when useful.',workflow:'/prompt-lab/',workflowLabel:'Cross-tool Prompt Lab',prompt:'/prompts/image-generation/'},
  {id:'coding',words:['code','coding','debug','bug','repository','repo','software','test automation','api'],title:'Work inside a codebase',tool:'Cursor',toolUrl:'/tools/cursor/',why:'Use repository context, make a scoped change and verify the behavior.',workflow:'/best/ai-coding-tools/',workflowLabel:'Coding tool guide',prompt:'/prompts/coding/'},
  {id:'presentation',words:['presentation','slides','deck','powerpoint','pitch deck'],title:'Turn information into a presentation',tool:'Presentation workflow',toolUrl:'/guides/ai-presentations/',why:'Build the narrative and evidence before generating slides.',workflow:'/guides/ai-presentations/',workflowLabel:'Presentation workflow',prompt:'/prompt-builder/'},
  {id:'meeting',words:['meeting','transcript','minutes','action items','meeting notes'],title:'Turn a meeting into actions',tool:'Meeting workflow',toolUrl:'/workflows/meeting-notes-to-actions/',why:'Preserve the source, then separate decisions, owners and unresolved questions.',workflow:'/workflows/meeting-notes-to-actions/',workflowLabel:'Meeting workflow',prompt:'/prompts/writing-productivity/'},
  {id:'automation',words:['automate','automation','workflow','webhook','repetitive','integrate','trigger'],title:'Automate a repeatable process',tool:'Automation tools',toolUrl:'/tools/',why:'Choose the automation layer around integrations, control and human approval points.',workflow:'/guides/ai-agents/',workflowLabel:'Automation guide',prompt:'/prompt-builder/'},
  {id:'writing',words:['write','writing','email','blog','proposal','resume','content','rewrite'],title:'Create a structured first draft',tool:'Prompt Builder',toolUrl:'/prompt-builder/',why:'Define audience, context, output format and constraints before generating.',workflow:'/prompts/writing-productivity/',workflowLabel:'Writing prompts',prompt:'/prompt-builder/'},
  {id:'website',words:['website','web app','landing page','app','web site','frontend'],title:'Build a website or app',tool:'AI build workflow',toolUrl:'/use-cases/build-website/',why:'Define the outcome and acceptance criteria before choosing how much control to delegate.',workflow:'/use-cases/build-website/',workflowLabel:'Build workflow',prompt:'/prompt-builder/'}
];

function inferDecisionContext(q){
  const t=q.toLowerCase();
  const privacy=/private|privacy|confidential|sensitive|internal|cannot upload|can't upload|cant upload|proprietary|phi|pii/.test(t)?'Privacy-sensitive':null;
  const evidence=/citation|citations|source|sources|evidence|accurate|fact|verify/.test(t)?'Traceability matters':null;
  const speed=/quick|quickly|fast|fastest|today|urgent/.test(t)?'Speed matters':null;
  const budget=/free|budget|cheap|low cost|under \$/.test(t)?'Budget-sensitive':null;
  const beginner=/no code|no-code|beginner|nontechnical|non-technical/.test(t)?'Low-code preferred':null;
  const output=/brief|report|summary|slides|presentation|video|image|website|app|code|email/.exec(t)?.[0];
  return {privacy,evidence,speed,budget,beginner,output};
}
function chooseDecision(q){
  const t=q.toLowerCase();
  const ranked=decisionProfiles.map(p=>({p,score:p.words.reduce((n,w)=>n+(t.includes(w)?(w.includes(' ')?4:2):0),0)})).sort((a,b)=>b.score-a.score);
  return ranked[0]?.score?ranked[0].p:null;
}
function showDecision(q){
  const box=el('decisionResult'); if(!box)return;
  const d=chooseDecision(q), ctx=inferDecisionContext(q);
  if(!d){window.location.href='/tool-finder/?q='+encodeURIComponent(q);return;}
  const constraints=[ctx.privacy,ctx.evidence,ctx.speed,ctx.budget,ctx.beginner,ctx.output?'Output: '+ctx.output:null].filter(Boolean);
  const privacyNote=ctx.privacy?'<p class="decision-caution"><strong>Constraint:</strong> Your request appears privacy-sensitive. Confirm the selected product\'s current data-handling and enterprise terms before uploading sensitive material.</p>':'';
  box.innerHTML='<span class="decision-label">Recommended approach</span><strong>'+d.title+'</strong><p>'+d.why+'</p>'+
    (constraints.length?'<div class="decision-context">'+constraints.map(x=>'<span>'+x+'</span>').join('')+'</div>':'')+privacyNote+
    '<div class="decision-path"><span>1 · Tool</span><a href="'+d.toolUrl+'">'+d.tool+'</a><span>2 · Prompt</span><a href="'+d.prompt+'">Prepare prompt</a><span>3 · Workflow</span><a href="'+d.workflow+'">'+d.workflowLabel+'</a><span>4 · Verify</span><a href="/verify-ai-output/">Judge result</a></div>'+
    '<div class="decision-actions"><a href="'+d.workflow+'">Start this approach</a><a href="/tool-finder/?q='+encodeURIComponent(q)+'">Refine constraints</a></div>';
  box.hidden=false;
  window.dainTrack?.('search',{query:(window.dainSafeText?.(q)||q.toLowerCase().slice(0,180)),category:'decision_v2',matches:1,task:d.id,privacy:!!ctx.privacy,evidence:!!ctx.evidence});
}
el('searchForm')?.addEventListener('submit',e=>{e.preventDefault();const q=(input?.value||'').trim();if(q.length<3){input?.focus();return;}showDecision(q);});
document.querySelectorAll('.topic-chip').forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.query||'';showDecision(input.value);}));
document.querySelector('.topics-link')?.addEventListener('click',()=>{input.value='';const box=el('decisionResult');if(box)box.hidden=true;input.focus();});
el('headerSearch')?.addEventListener('click',()=>{input?.focus();document.querySelector('.hero-search')?.scrollIntoView({behavior:'smooth',block:'center'});});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el('headerSearch')?.click();}});

/* ===== Theme ===== */
el('themeToggle')?.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  el('themeToggle').textContent=document.body.classList.contains('dark')?'☀':'☾';
});

/* ===== Newsletter ===== */
el('newsletterForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const email=(el('newsletterEmail')?.value||'').trim();
  const button=e.currentTarget.querySelector('button');
  const note=el('newsletterNote');
  if(!email)return;
  button.disabled=true;
  button.textContent='Joining…';
  try{
    const r=await fetch('https://wtbaosegszmousraqfnw.supabase.co/functions/v1/newsletter-signup',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,source:'homepage'})
    });
    const data=await r.json().catch(()=>({}));
    if(!r.ok){
      throw new Error(data.error||'signup_failed');
    }
    e.currentTarget.reset();
    toast('You’re subscribed.');
    if(note){
      note.textContent=data.welcome==='sent'
        ? 'Subscribed. Check your inbox for the welcome email.'
        : data.welcome==='send_failed'
          ? 'Subscribed. Your welcome email may be delayed.'
          : 'Subscribed. Your weekly brief will focus on useful workflows, prompts and tools.';
    }
    window.dainTrack?.('newsletter_signup',{source:'homepage',welcome:data.welcome||'unknown'});
  }catch(err){
    console.warn(err);
    toast('Could not subscribe right now. Please try again.');
    if(note)note.textContent='Signup failed temporarily. Your email was not saved.';
  }finally{
    button.disabled=false;
    button.textContent='Subscribe';
  }
});

/* ===== Conditional live section: hidden unless real data exists ===== */
const SUPABASE_URL='https://wtbaosegszmousraqfnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_pP9DgWk8vs4Bd2QuAtZWYA_1BeB7WOH';

function esc(s=''){
  return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}
function getDomain(url){
  try{return new URL(url).hostname.replace(/^www\./,'')}catch{return''}
}
function relativeDate(iso){
  if(!iso)return'Recent';
  const ms=Date.now()-new Date(iso).getTime();
  const hours=Math.max(0,Math.floor(ms/3600000));
  if(hours<1)return'Just now';
  if(hours<24)return hours+' hr ago';
  const days=Math.floor(hours/24);
  return days+' day'+(days===1?'':'s')+' ago';
}
function signalLabel(title=''){
  const t=title.toLowerCase();
  if(/agent|agentic/.test(t))return'Agents';
  if(/code|coding|developer|github|copilot/.test(t))return'Coding';
  if(/image|video|diffusion|midjourney/.test(t))return'Creative AI';
  if(/openai|anthropic|claude|gemini|gpt|llama|mistral|model/.test(t))return'Models';
  return'AI signal';
}

async function loadRadar(){
  const section=el('radarSection');
  const grid=el('trendingGrid');
  if(!section||!grid)return;

  try{
    const url=SUPABASE_URL+'/rest/v1/public_signals?select=source_name,title,url,summary,published_at,relevance_score,raw&order=published_at.desc.nullslast&limit=30';
    const r=await fetch(url,{headers:{apikey:SUPABASE_PUBLISHABLE_KEY}});
    if(!r.ok)throw new Error('signal_fetch_'+r.status);
    const items=await r.json();
    const hn=Array.isArray(items)?items.filter(x=>x.source_name==='Hacker News').slice(0,4):[];

    if(!hn.length){
      section.remove();
      return;
    }

    grid.innerHTML=ResourceGrid(hn);
    section.hidden=false;
  }catch(err){
    console.warn('Radar unavailable',err);
    section.remove();
  }
}

loadRadar();
