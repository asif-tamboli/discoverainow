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
      <footer>Use workflow →</footer>
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
  {words:['pdf','document','documents','paper','report','sources'],title:'Work from your own documents',tool:'NotebookLM',toolUrl:'/tools/notebooklm/',why:'Best starting point when the answer should stay grounded in a source set you provide.',next:'/workflows/research-to-brief/',nextLabel:'Use the research workflow'},
  {words:['research','current','web','sources','fact check','competitor'],title:'Research with sources',tool:'Perplexity',toolUrl:'/tools/perplexity/',why:'A strong starting point for current web discovery and source-oriented research.',next:'/workflows/research-to-brief/',nextLabel:'Use the research workflow'},
  {words:['image','photo','thumbnail','poster','visual','product image'],title:'Create and refine an image',tool:'Midjourney + Prompt Lab',toolUrl:'/tools/midjourney/',why:'Start with an image-focused tool, then adapt the same intent across generators when needed.',next:'/prompt-lab/',nextLabel:'Build the cross-tool prompt'},
  {words:['code','coding','debug','bug','repository','repo','software','test automation'],title:'Work inside a codebase',tool:'Cursor',toolUrl:'/tools/cursor/',why:'A practical starting point for AI-assisted editing, debugging and changes across real project files.',next:'/best/ai-coding-tools/',nextLabel:'Compare coding approaches'},
  {words:['presentation','slides','deck','powerpoint'],title:'Turn an idea into a presentation',tool:'AI presentation workflow',toolUrl:'/guides/ai-presentations/',why:'Start with the narrative and evidence before choosing the tool that renders the deck.',next:'/guides/ai-presentations/',nextLabel:'Open the presentation workflow'},
  {words:['meeting','transcript','minutes','action items'],title:'Turn a meeting into actions',tool:'Meeting workflow',toolUrl:'/workflows/meeting-notes-to-actions/',why:'Capture the source first, then structure decisions, owners and follow-ups.',next:'/workflows/meeting-notes-to-actions/',nextLabel:'Open the meeting workflow'},
  {words:['automate','automation','workflow','webhook','repetitive'],title:'Automate a repeatable process',tool:'Automation tools',toolUrl:'/tools/',why:'Choose the automation layer based on integrations, control and how much custom logic you need.',next:'/use-cases/',nextLabel:'Explore automation use cases'},
  {words:['write','writing','email','blog','proposal','resume','content'],title:'Create a structured first draft',tool:'Prompt Builder',toolUrl:'/prompt-builder/',why:'The biggest gain comes from defining context, output format and constraints before generating.',next:'/prompt-builder/',nextLabel:'Build the prompt'},
  {words:['website','web app','landing page','app'],title:'Build a website or app',tool:'AI coding/building workflow',toolUrl:'/use-cases/build-website/',why:'Start from the outcome and acceptance criteria, then choose the build tool around your level of control.',next:'/use-cases/build-website/',nextLabel:'Open the build workflow'}
];

function chooseDecision(q){
  const t=q.toLowerCase();
  const ranked=decisionProfiles.map(p=>({p,score:p.words.reduce((n,w)=>n+(t.includes(w)?(w.includes(' ')?3:2):0),0)})).sort((a,b)=>b.score-a.score);
  return ranked[0]?.score?ranked[0].p:null;
}
function showDecision(q){
  const box=el('decisionResult');
  if(!box)return;
  const d=chooseDecision(q);
  if(!d){
    window.location.href='/tool-finder/?q='+encodeURIComponent(q);
    return;
  }
  box.innerHTML='<span class="decision-label">Recommended starting point</span><strong>'+d.title+'</strong><p>'+d.why+'</p><div class="decision-actions"><a href="'+d.toolUrl+'">'+d.tool+'</a><a href="'+d.next+'">'+d.nextLabel+'</a><a href="/tool-finder/?q='+encodeURIComponent(q)+'">Refine recommendation</a></div>';
  box.hidden=false;
  window.dainTrack?.('search',{query:q.toLowerCase().slice(0,180),category:'decision',matches:1});
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