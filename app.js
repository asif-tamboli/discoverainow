const data={
trending:[
{type:'tool',visual:'visual-chat',label:'Tools',title:'ChatGPT’s new memory features — what’s actually new?',text:'A practical breakdown of what changed, how it works, and how to make it useful.',meta:'5 min read'},
{type:'guide',visual:'visual-sail',label:'Guides',title:'Midjourney v6: Real-world tips for better results',text:'From prompt structure to style control, here’s what actually works.',meta:'7 min read'},
{type:'agent',visual:'visual-bot',label:'Agents',title:'10 AI agents worth trying in 2026',text:'Practical use cases, setup tips, and real examples.',meta:'6 min read'},
{type:'news',visual:'visual-wave',label:'News',title:'The AI model landscape keeps changing',text:'A closer look at what’s new and where the differences matter.',meta:'4 min read'}],
tools:[
['⌕','AI Search & Research','Search, synthesis, source discovery and research assistance.'],
['⌨','AI Coding','Coding assistants, agents, testing, review and developer workflows.'],
['◉','Image & Design','Image generation, editing, presentations and design assistance.'],
['▶','Video AI','Video generation, editing, avatars and dubbing.'],
['♪','Audio & Voice','Speech, transcription, music, podcasting and cleanup.'],
['▦','Productivity','Writing, meetings, documents, email and knowledge work.']],
prompts:[
['Research','Deep Research Brief','Act as a senior research analyst. Investigate [TOPIC] for [AUDIENCE]. Separate verified facts, assumptions, disagreements, and open questions. End with an executive summary and the highest-value next questions.'],
['Writing','Better Writing Editor','Rewrite the text below for clarity, flow and credibility while preserving my meaning and voice. Remove repetition, tighten weak sentences, and flag claims that need evidence.'],
['Shopping','Product Comparison','Compare [PRODUCT A] and [PRODUCT B] for someone who cares most about [PRIORITIES]. Focus on meaningful tradeoffs and explain which type of user each option suits best.'],
['Learning','Learn Anything Faster','Teach me [TOPIC] from beginner to practical competence. Start with the mental model, then the concepts that unlock most of the understanding. Include examples and an exercise.'],
['Work','Meeting to Action Plan','Convert these notes into decisions, unresolved questions, action items, owners, risks, dependencies and the next checkpoint. Mark uncertain assignments instead of guessing.'],
['Coding','Code Review Partner','Review the code for correctness, maintainability, security, performance and testability. Prioritize actual defects over style preferences and suggest concrete fixes.']],
agents:[
['🧭','Research Scout','Finds, compares and summarizes information around a goal.'],
['🧪','QA Agent','Generates scenarios, test ideas, edge cases and defect hypotheses.'],
['📣','Content Agent','Repurposes one source into multiple audience-ready assets.'],
['📊','Ops Agent','Monitors inputs, detects changes and produces recurring summaries.'],
['✉','Support Agent','Classifies requests, drafts responses and routes exceptions.'],
['⌁','Knowledge Agent','Finds answers across internal documents and notes.']],
workflows:[
['01','Research','Collect credible sources and identify what actually matters.'],
['02','Synthesize','Turn raw information into patterns, comparisons and decisions.'],
['03','Create','Generate the output: brief, content, plan, code or prototype.'],
['04','Verify','Check claims, quality, edge cases, risks and missing information.']],
guides:[
['▧','Prompting Fundamentals','A practical framework for giving AI context, constraints and a useful output format.'],
['◫','Choosing the Right AI Tool','Start with the job-to-be-done and compare tools on the things that matter.'],
['⌘','Building AI Workflows','Combine prompts, tools and human checks into a repeatable process.'],
['◎','Evaluating AI Output','How to spot weak reasoning, unsupported claims and missing context.'],
['↗','AI for Daily Work','Practical patterns for research, writing, meetings and planning.'],
['⚙','Automation Basics','Where simple automation ends and agents begin.']],
news:[
['Today','Model releases & capability changes','Track major model launches, pricing changes, API updates and meaningful capability improvements.','Models'],
['Today','AI products worth knowing','Useful new products and features, without every launch announcement.','Tools'],
['This week','Policy, safety & industry shifts','Developments that affect how people and businesses can use AI.','Industry'],
['This week','The agent ecosystem is expanding','New ways to connect AI to tools, data and multi-step work.','Agents']],
tutorials:[
['01','Write a better research prompt','Build a prompt that asks for sources, uncertainty, alternatives and a concise conclusion.'],
['02','Compare AI tools properly','Use a repeatable evaluation rubric instead of relying on feature lists.'],
['03','Build your first AI workflow','Move from one-off prompting to a simple research → draft → verify loop.'],
['04','Create a reusable prompt template','Turn a good one-time prompt into something you can adapt quickly.']]};

const el=(id)=>document.getElementById(id);
const toast=(msg)=>{const t=el('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1700)};
const searchable=[];

el('trendingGrid').innerHTML=data.trending.map((x,i)=>`<article class="article-card searchable" data-type="${x.type}" data-search="${(x.title+' '+x.text+' '+x.label).toLowerCase()}"><div class="article-thumb ${x.visual}"><span class="bookmark">♡</span></div><div class="article-body"><span class="article-type">${x.label}</span><h3>${x.title}</h3><p>${x.text}</p><div class="article-meta">Sep ${17-i}, 2026 &nbsp;•&nbsp; ${x.meta}</div></div></article>`).join('');

const resourceCard=(x,type)=>`<article class="resource-card searchable" data-type="${type}" data-search="${x.join(' ').toLowerCase()}"><span class="resource-icon">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p><footer>Explore →</footer></article>`;
el('toolGrid').innerHTML=data.tools.map(x=>resourceCard(x,'tool')).join('');
el('agentGrid').innerHTML=data.agents.map(x=>resourceCard(x,'agent')).join('');
el('guideGrid').innerHTML=data.guides.map(x=>resourceCard(x,'guide')).join('');
el('tutorialGrid').innerHTML=data.tutorials.map(x=>resourceCard(x,'tutorial')).join('');

el('promptGrid').innerHTML=data.prompts.map((x,i)=>`<article class="prompt-card searchable" data-type="prompt" data-search="${x.join(' ').toLowerCase()}"><div class="prompt-head"><div><span class="prompt-category">${x[0]}</span><h3>${x[1]}</h3></div><button class="copy-button" data-copy="${i}">Copy prompt</button></div><div class="prompt-text">${x[2]}</div></article>`).join('');
el('workflowGrid').innerHTML=data.workflows.map(x=>`<article class="workflow-card searchable" data-type="workflow" data-search="${x.join(' ').toLowerCase()}"><span class="workflow-step">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('');
el('newsGrid').innerHTML=data.news.map(x=>`<article class="news-item searchable" data-type="news" data-search="${x.join(' ').toLowerCase()}"><span class="news-date">${x[0]}</span><div><h3>${x[1]}</h3><p>${x[2]}</p></div><span class="news-source">${x[3]} →</span></article>`).join('');

const input=el('globalSearch'), select=el('categorySelect');
function runSearch(query=input.value,type=select.value){
 const q=(query||'').trim().toLowerCase();
 const active=!!q||type!=='all';
 document.body.classList.toggle('search-active',active);
 let matches=0;
 document.querySelectorAll('.searchable').forEach(node=>{
   const matchText=!q||(node.dataset.search||'').includes(q);
   const matchType=type==='all'||node.dataset.type===type;
   const show=matchText&&matchType;
   node.classList.toggle('hidden-card',!show);
   if(show) matches++;
 });
 if(q||type!=='all'){
   window.dainTrack?.(matches?'search':'search_no_result',{query:q,category:type,matches});
   document.querySelector('#content').scrollIntoView({behavior:'smooth',block:'start'});
 }
}
el('searchForm').addEventListener('submit',e=>{e.preventDefault();runSearch()});
input.addEventListener('input',()=>{if(!input.value)runSearch('',select.value)});
select.addEventListener('change',()=>runSearch());
document.querySelectorAll('.topic-chip').forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.query;select.value='all';runSearch()}));
document.querySelector('.topics-link').addEventListener('click',()=>{input.value='';select.value='all';runSearch('', 'all');el('globalSearch').focus()});
document.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>document.querySelector(btn.dataset.jump).scrollIntoView({behavior:'smooth'})));
document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.copy);navigator.clipboard.writeText(data.prompts[i][2]);window.dainTrack?.('prompt_copy',{prompt:data.prompts[i][1],category:data.prompts[i][0]});toast('Prompt copied')}));
document.querySelectorAll('[data-filter="all"]').forEach(btn=>btn.addEventListener('click',()=>{input.value='';select.value='all';runSearch('','all')}));
el('headerSearch').addEventListener('click',()=>{input.focus();document.querySelector('.search-panel').scrollIntoView({behavior:'smooth',block:'center'})});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el('headerSearch').click()}});
el('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');el('themeToggle').textContent=document.body.classList.contains('dark')?'☀':'☾'});
el('newsletterForm').addEventListener('submit',async e=>{
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
    if(!r.ok) throw new Error('signup_failed');
    e.currentTarget.reset();
    toast('You’re subscribed.');
    if(note) note.textContent='Subscribed. We’ll use this list for the DiscoverAINow weekly brief.';
    window.dainTrack?.('newsletter_signup',{source:'homepage'});
  }catch(err){
    console.warn(err);
    toast('Could not subscribe right now. Please try again.');
    if(note) note.textContent='Signup failed temporarily. Your email was not saved.';
  }finally{
    button.disabled=false;
    button.textContent='Subscribe';
  }
});

/* ===== Supabase-backed live discovery feeds ===== */

const SUPABASE_URL='https://wtbaosegszmousraqfnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_pP9DgWk8vs4Bd2QuAtZWYA_1BeB7WOH';

function esc(s=''){
  return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}
function shortNumber(n=0){
  n=Number(n)||0;
  if(n>=1000000)return (n/1000000).toFixed(1).replace('.0','')+'m';
  if(n>=1000)return (n/1000).toFixed(1).replace('.0','')+'k';
  return String(n);
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
function setSourceStatus(sectionId,text,state='ok'){
  const section=document.getElementById(sectionId);
  const row=section?.querySelector('.section-heading, .section-title-row');
  if(!row)return;
  let badge=row.querySelector('.source-status');
  if(!badge){badge=document.createElement('span');badge.className='source-status';row.appendChild(badge)}
  badge.dataset.state=state;
  badge.textContent=text;
}
function liveVisual(index){return ['visual-wave','visual-chat','visual-bot','visual-sail'][index%4]}
function signalLabel(title=''){
  const t=title.toLowerCase();
  if(/agent|agentic/.test(t))return'Agents';
  if(/code|coding|developer|github|copilot/.test(t))return'Coding';
  if(/image|video|diffusion|midjourney/.test(t))return'Creative AI';
  if(/openai|anthropic|claude|gemini|gpt|llama|mistral|model/.test(t))return'Models';
  return'AI signal';
}

async function fetchSignals(){
  const url=SUPABASE_URL+'/rest/v1/public_signals?select=source_name,title,url,summary,published_at,relevance_score,raw&order=published_at.desc.nullslast&limit=100';
  const r=await fetch(url,{headers:{apikey:SUPABASE_PUBLISHABLE_KEY}});
  if(!r.ok)throw new Error('signal_fetch_'+r.status);
  return await r.json();
}

function renderSignals(items){
  const by=(name)=>items.filter(x=>x.source_name===name);
  const hn=by('Hacker News');
  const hf=by('Hugging Face');
  const gh=by('GitHub');
  const dev=by('DEV Community');

  if(hn.length){
    el('trendingGrid').innerHTML=hn.slice(0,4).map((x,i)=>`
      <a class="article-card searchable live-article" data-type="news" data-search="${esc((x.title+' '+(x.summary||'')).toLowerCase())}" data-track="outbound_click" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer">
        <div class="article-thumb ${liveVisual(i)}"><span class="bookmark">↗</span><span class="live-pill">RADAR</span></div>
        <div class="article-body"><span class="article-type">${signalLabel(x.title)}</span><h3>${esc(x.title)}</h3>
        <p>${esc(getDomain(x.url))} · ${shortNumber(x.raw?.score||0)} points · ${shortNumber(x.raw?.comments||0)} comments</p>
        <div class="article-meta">${relativeDate(x.published_at)} &nbsp;•&nbsp; Hacker News signal</div></div>
      </a>`).join('');
    el('newsGrid').innerHTML=hn.slice(0,8).map(x=>`
      <a class="news-item searchable live-news-item" data-type="news" data-search="${esc((x.title+' '+(x.summary||'')).toLowerCase())}" data-track="outbound_click" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer">
        <span class="news-date">${relativeDate(x.published_at)}</span><div><h3>${esc(x.title)}</h3><p>${esc(getDomain(x.url))} · ${shortNumber(x.raw?.score||0)} points</p></div><span class="news-source">Read ↗</span>
      </a>`).join('');
    setSourceStatus('news','Cached · Supabase');
  }

  if(hf.length){
    el('toolGrid').innerHTML=hf.slice(0,9).map(x=>`
      <a class="resource-card searchable live-resource" data-type="tool" data-search="${esc((x.title+' '+(x.summary||'')).toLowerCase())}" data-track="tool_click" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer">
        <span class="resource-icon">◉</span><span class="source-label">Hugging Face discovery</span><h3>${esc(x.title)}</h3>
        <p>${esc(x.summary||'Public AI application discovered through the Hugging Face feed.')}</p>
        <footer>♥ ${shortNumber(x.raw?.likes||0)} · Investigate ↗</footer>
      </a>`).join('');
    setSourceStatus('tools','Cached · Supabase');
  }

  if(gh.length){
    el('agentGrid').innerHTML=gh.slice(0,9).map(x=>`
      <a class="resource-card searchable live-resource" data-type="agent" data-search="${esc((x.title+' '+(x.summary||'')).toLowerCase())}" data-track="outbound_click" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer">
        <span class="resource-icon">♙</span><span class="source-label">GitHub discovery</span><h3>${esc(x.title)}</h3>
        <p>${esc(x.summary||'Open-source AI project discovered through GitHub.')}</p>
        <footer>★ ${shortNumber(x.raw?.stars||0)} · ${esc(x.raw?.language||'Open source')} · Inspect ↗</footer>
      </a>`).join('');
    el('workflowGrid').innerHTML=gh.slice(0,8).map((x,i)=>`
      <a class="workflow-card searchable live-workflow" data-type="workflow" data-search="${esc((x.title+' '+(x.summary||'')).toLowerCase())}" data-track="workflow_open" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer">
        <span class="workflow-step">${String(i+1).padStart(2,'0')}</span><span class="source-label">GitHub discovery</span><h3>${esc(x.title)}</h3>
        <p>${esc(x.summary||'Open-source AI workflow candidate.')}</p><small>★ ${shortNumber(x.raw?.stars||0)} · Inspect ↗</small>
      </a>`).join('');
    setSourceStatus('agents','Cached · Supabase');
    setSourceStatus('workflows','Discovery feed · Supabase');
  }

  if(dev.length){
    const guideItems=dev.filter(x=>/guide|how|learn|using|introduction|build/i.test((x.title||'')+' '+(x.summary||'')));
    const tutorialItems=dev.filter(x=>/tutorial|build|create|step|code|project/i.test((x.title||'')+' '+(x.summary||'')));
    const renderDev=(target,arr,type,icon)=>{if(!arr.length)return;el(target).innerHTML=arr.slice(0,9).map(x=>`
      <a class="resource-card searchable live-resource" data-type="${type}" data-search="${esc((x.title+' '+(x.summary||'')).toLowerCase())}" data-track="outbound_click" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer">
        <span class="resource-icon">${icon}</span><span class="source-label">DEV discovery</span><h3>${esc(x.title)}</h3>
        <p>${esc(x.summary||'Community article surfaced for editorial review.')}</p>
        <footer>♡ ${shortNumber(x.raw?.reactions||0)} · ${x.raw?.reading_time_minutes||'—'} min · Read ↗</footer>
      </a>`).join('')};
    renderDev('guideGrid',guideItems.length?guideItems:dev,'guide','▧');
    renderDev('tutorialGrid',tutorialItems.length?tutorialItems:dev,'tutorial','◫');
    setSourceStatus('guides','Discovery feed · Supabase');
    setSourceStatus('tutorials','Discovery feed · Supabase');
  }

  setSourceStatus('prompts','Original curated prompts');
  let radar=document.querySelector('.live-data-status');
  if(!radar){
    radar=document.createElement('div');radar.className='live-data-status';
    document.querySelector('#content .section-heading, #content .section-title-row')?.appendChild(radar);
  }
  radar.textContent='Server-cached AI radar · '+items.length+' signals';
}

async function loadServerBackedDiscovery(){
  try{
    const items=await fetchSignals();
    if(!Array.isArray(items)||!items.length)throw new Error('no_signals');
    renderSignals(items);
  }catch(err){
    console.warn('Supabase signal feed failed',err);
    const sections=['tools','agents','workflows','guides','tutorials','news'];
    sections.forEach(id=>setSourceStatus(id,'Curated fallback · feed temporarily unavailable','error'));
  }
}

loadServerBackedDiscovery();
