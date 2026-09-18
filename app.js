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
 document.querySelectorAll('.searchable').forEach(node=>{
   const matchText=!q||(node.dataset.search||'').includes(q);
   const matchType=type==='all'||node.dataset.type===type;
   node.classList.toggle('hidden-card',!(matchText&&matchType));
 });
 if(q||type!=='all') document.querySelector('#content').scrollIntoView({behavior:'smooth',block:'start'});
}
el('searchForm').addEventListener('submit',e=>{e.preventDefault();runSearch()});
input.addEventListener('input',()=>{if(!input.value)runSearch('',select.value)});
select.addEventListener('change',()=>runSearch());
document.querySelectorAll('.topic-chip').forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.query;select.value='all';runSearch()}));
document.querySelector('.topics-link').addEventListener('click',()=>{input.value='';select.value='all';runSearch('', 'all');el('globalSearch').focus()});
document.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>document.querySelector(btn.dataset.jump).scrollIntoView({behavior:'smooth'})));
document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',()=>{navigator.clipboard.writeText(data.prompts[Number(btn.dataset.copy)][2]);toast('Prompt copied')}));
document.querySelectorAll('[data-filter="all"]').forEach(btn=>btn.addEventListener('click',()=>{input.value='';select.value='all';runSearch('','all')}));
el('headerSearch').addEventListener('click',()=>{input.focus();document.querySelector('.search-panel').scrollIntoView({behavior:'smooth',block:'center'})});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el('headerSearch').click()}});
el('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');el('themeToggle').textContent=document.body.classList.contains('dark')?'☀':'☾'});
el('newsletterForm').addEventListener('submit',e=>{e.preventDefault();e.currentTarget.reset();toast('Thanks — you’re subscribed.')});

/* ===== Live AI news: Hacker News API ===== */
const HN_BASE = 'https://hacker-news.firebaseio.com/v0';
const LIVE_CACHE_KEY = 'discoverainow_hn_ai_v1';
const LIVE_CACHE_MS = 15 * 60 * 1000;

const AI_TERMS = [
  'artificial intelligence','generative ai','machine learning','deep learning',
  'openai','chatgpt','gpt-','gpt4','gpt5','anthropic','claude','gemini',
  'llm','large language model','language model','ai agent','ai agents',
  'agentic','copilot','mistral','llama','hugging face','huggingface',
  'midjourney','stable diffusion','diffusion model','transformer',
  'inference','foundation model','multimodal','computer vision','speech model',
  'ai coding','coding agent','reasoning model'
];

function isAiStory(item) {
  if (!item || item.type !== 'story' || item.dead || item.deleted) return false;
  const haystack = ((item.title || '') + ' ' + (item.text || '')).toLowerCase();
  return AI_TERMS.some(term => haystack.includes(term));
}

function storyRank(item) {
  const ageHours = Math.max(1, (Date.now()/1000 - (item.time || 0)) / 3600);
  const score = Number(item.score || 0);
  const comments = Number(item.descendants || 0);
  return (score * 1.2 + comments * 0.5) / Math.pow(ageHours, 0.38);
}

function getStoryUrl(item) {
  return item.url || ('https://news.ycombinator.com/item?id=' + item.id);
}

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./,''); }
  catch { return 'news.ycombinator.com'; }
}

function relativeTime(unix) {
  const secs = Math.max(1, Math.floor(Date.now()/1000 - unix));
  if (secs < 3600) return Math.floor(secs/60) + ' min ago';
  if (secs < 86400) return Math.floor(secs/3600) + ' hr ago';
  return Math.floor(secs/86400) + ' day' + (Math.floor(secs/86400) === 1 ? '' : 's') + ' ago';
}

function liveLabel(title='') {
  const t = title.toLowerCase();
  if (/agent|agentic/.test(t)) return 'Agents';
  if (/code|coding|developer|github|copilot/.test(t)) return 'Coding';
  if (/image|video|diffusion|midjourney/.test(t)) return 'Creative AI';
  if (/openai|anthropic|claude|gemini|gpt|llama|mistral|model/.test(t)) return 'Models';
  return 'AI News';
}

function liveVisual(index) {
  return ['visual-wave','visual-chat','visual-bot','visual-sail'][index % 4];
}

function renderLiveTrending(stories) {
  if (!stories.length) return;
  el('trendingGrid').innerHTML = stories.slice(0,4).map((x,i)=> {
    const url = getStoryUrl(x);
    const domain = getDomain(url);
    return `<a class="article-card searchable live-article" data-type="news" data-search="${(x.title+' '+domain+' '+liveLabel(x.title)).toLowerCase()}" href="${url}" target="_blank" rel="noopener noreferrer">
      <div class="article-thumb ${liveVisual(i)}"><span class="bookmark">↗</span><span class="live-pill">LIVE</span></div>
      <div class="article-body">
        <span class="article-type">${liveLabel(x.title)}</span>
        <h3>${x.title}</h3>
        <p>${domain} · ${x.score || 0} points · ${x.descendants || 0} comments</p>
        <div class="article-meta">${relativeTime(x.time)} &nbsp;•&nbsp; Hacker News</div>
      </div>
    </a>`;
  }).join('');
}

function renderLiveNews(stories) {
  if (!stories.length) return;
  el('newsGrid').innerHTML = stories.slice(0,8).map(x => {
    const url = getStoryUrl(x);
    const domain = getDomain(url);
    return `<a class="news-item searchable live-news-item" data-type="news" data-search="${(x.title+' '+domain+' '+liveLabel(x.title)).toLowerCase()}" href="${url}" target="_blank" rel="noopener noreferrer">
      <span class="news-date">${relativeTime(x.time)}</span>
      <div><h3>${x.title}</h3><p>${domain} · ${x.score || 0} points · ${x.descendants || 0} comments</p></div>
      <span class="news-source">Read ↗</span>
    </a>`;
  }).join('');
}

function setLiveStatus(text, state='ok') {
  let node = document.querySelector('.live-data-status');
  if (!node) {
    node = document.createElement('div');
    node.className = 'live-data-status';
    const trending = document.querySelector('#content .section-title-row');
    if (trending) trending.appendChild(node);
  }
  node.dataset.state = state;
  node.textContent = text;
}

async function fetchJson(url, timeoutMs=8000) {
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, {signal: controller.signal, cache:'no-store'});
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(timer); }
}

async function fetchHnAiStories() {
  const cachedRaw = localStorage.getItem(LIVE_CACHE_KEY);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.savedAt < LIVE_CACHE_MS && Array.isArray(cached.items)) {
        setLiveStatus('Live AI feed · cached a few minutes ago');
        return cached.items;
      }
    } catch {}
  }

  setLiveStatus('Refreshing live AI stories…','loading');
  const [topIds, newIds] = await Promise.all([
    fetchJson(HN_BASE + '/topstories.json'),
    fetchJson(HN_BASE + '/newstories.json')
  ]);

  const ids = [...new Set([...(newIds || []).slice(0,55), ...(topIds || []).slice(0,45)])].slice(0,80);
  const results = await Promise.allSettled(ids.map(id => fetchJson(HN_BASE + '/item/' + id + '.json', 6500)));
  const items = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(isAiStory)
    .sort((a,b) => storyRank(b) - storyRank(a))
    .slice(0,24);

  if (items.length) {
    localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({savedAt:Date.now(),items}));
    setLiveStatus('Live AI feed · updated ' + new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}));
  } else {
    setLiveStatus('Live feed unavailable · showing curated content','error');
  }
  return items;
}

async function loadLiveAiNews() {
  try {
    const stories = await fetchHnAiStories();
    if (!stories.length) return;
    renderLiveTrending(stories);
    renderLiveNews(stories);
  } catch (err) {
    console.warn('Live AI feed failed:', err);
    setLiveStatus('Live feed unavailable · showing curated content','error');
  }
}

loadLiveAiNews();


/* ===== Live directory feeds: Hugging Face, GitHub, DEV ===== */
const DIRECTORY_CACHE_MS = 30 * 60 * 1000;

function cacheGet(key, maxAge=DIRECTORY_CACHE_MS) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.savedAt || Date.now() - parsed.savedAt > maxAge) return null;
    return parsed.data;
  } catch { return null; }
}
function cacheSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({savedAt:Date.now(), data})); } catch {}
}
function esc(s='') {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function shortNumber(n=0) {
  n=Number(n)||0;
  if(n>=1000000) return (n/1000000).toFixed(1).replace('.0','')+'m';
  if(n>=1000) return (n/1000).toFixed(1).replace('.0','')+'k';
  return String(n);
}
function setSourceStatus(sectionId, text, state='ok') {
  const section=document.getElementById(sectionId);
  const row=section?.querySelector('.section-title-row');
  if(!row) return;
  let badge=row.querySelector('.source-status');
  if(!badge){
    badge=document.createElement('span');
    badge.className='source-status';
    row.appendChild(badge);
  }
  badge.dataset.state=state;
  badge.textContent=text;
}
async function cachedFetch(key, loader, maxAge=DIRECTORY_CACHE_MS) {
  const cached=cacheGet(key,maxAge);
  if(cached) return {data:cached,cached:true};
  const data=await loader();
  if(data) cacheSet(key,data);
  return {data,cached:false};
}

async function loadHuggingFaceTools() {
  setSourceStatus('tools','Loading live Hugging Face tools…','loading');
  try {
    const {data:spaces,cached}=await cachedFetch('dain_hf_spaces_v1', async()=>{
      const url='https://huggingface.co/api/spaces?sort=likes&direction=-1&limit=18&full=true';
      const items=await fetchJson(url,9000);
      return Array.isArray(items)?items:[];
    },45*60*1000);
    if(!spaces?.length) throw new Error('No spaces');
    const useful=spaces.filter(x=>!x.private&&!x.disabled).slice(0,9);
    el('toolGrid').innerHTML=useful.map(x=>{
      const id=x.id||'';
      const name=id.split('/').pop().replace(/[-_]/g,' ');
      const tags=Array.isArray(x.tags)?x.tags.slice(0,3).join(' · '):'AI app';
      return `<a class="resource-card searchable live-resource" data-type="tool" data-search="${esc((name+' '+tags+' '+id).toLowerCase())}" href="https://huggingface.co/spaces/${encodeURI(id)}" target="_blank" rel="noopener noreferrer">
        <span class="resource-icon">◉</span>
        <span class="source-label">Hugging Face Space</span>
        <h3>${esc(name)}</h3>
        <p>${esc(tags || 'Interactive AI application')}</p>
        <footer>♥ ${shortNumber(x.likes)} likes · Open Space ↗</footer>
      </a>`;
    }).join('');
    setSourceStatus('tools',(cached?'Cached':'Live')+' · Hugging Face');
  } catch(e) {
    console.warn('HF tools failed',e);
    setSourceStatus('tools','Curated tools · live source unavailable','error');
  }
}

async function githubSearch(query, perPage=12) {
  const url='https://api.github.com/search/repositories?q='+encodeURIComponent(query)+'&sort=stars&order=desc&per_page='+perPage;
  const r=await fetchJson(url,9000);
  return Array.isArray(r.items)?r.items:[];
}

async function githubMultiSearch(queries, perQuery=8) {
  const merged = [];
  const seen = new Set();
  for (const query of queries) {
    try {
      const items = await githubSearch(query, perQuery);
      for (const item of items) {
        if (!item || seen.has(item.id)) continue;
        seen.add(item.id);
        merged.push(item);
      }
      if (merged.length >= 12) break;
    } catch (e) {
      console.warn('GitHub query failed:', query, e);
    }
  }
  return merged.sort((a,b)=>(b.stargazers_count||0)-(a.stargazers_count||0));
}

function renderGithubResources(targetId, items, type, icon, sourceText='GitHub') {
  if(!items?.length) return false;
  el(targetId).innerHTML=items.slice(0,9).map(x=>{
    const topics=Array.isArray(x.topics)&&x.topics.length?x.topics.slice(0,3).join(' · '):(x.language||'Open source');
    return `<a class="resource-card searchable live-resource" data-type="${type}" data-search="${esc(((x.name||'')+' '+(x.description||'')+' '+topics).toLowerCase())}" href="${esc(x.html_url||'#')}" target="_blank" rel="noopener noreferrer">
      <span class="resource-icon">${icon}</span>
      <span class="source-label">${sourceText}</span>
      <h3>${esc(x.name||'Open-source project')}</h3>
      <p>${esc(x.description||'Open-source AI project')}</p>
      <footer>★ ${shortNumber(x.stargazers_count)} · ${esc(topics)} · Open ↗</footer>
    </a>`;
  }).join('');
  return true;
}

async function loadGithubAgents() {
  setSourceStatus('agents','Loading open-source agents…','loading');
  try {
    const {data:items,cached}=await cachedFetch('dain_gh_agents_v2',()=>githubMultiSearch([
      'topic:ai-agent stars:>20',
      'agentic-ai in:name,description stars:>20',
      'llm-agent in:name,description stars:>20'
    ],8),45*60*1000);
    if(!renderGithubResources('agentGrid',items,'agent','♙')) throw new Error('No agents');
    setSourceStatus('agents',(cached?'Cached':'Live')+' · GitHub');
  } catch(e) {
    console.warn('GitHub agents failed',e);
    setSourceStatus('agents','Curated agents · live GitHub feed paused','error');
  }
}

async function loadGithubWorkflows() {
  setSourceStatus('workflows','Loading AI workflows…','loading');
  try {
    const {data:items,cached}=await cachedFetch('dain_gh_workflows_v2',()=>githubMultiSearch([
      'ai-workflow in:name,description stars:>10',
      'llm-workflow in:name,description stars:>10',
      'agent-workflow in:name,description stars:>10',
      'workflow ai in:name,description stars:>20'
    ],7),45*60*1000);
    if(!items?.length) throw new Error('No workflows');
    el('workflowGrid').innerHTML=items.slice(0,8).map((x,i)=>`<a class="workflow-card searchable live-workflow" data-type="workflow" data-search="${esc(((x.name||'')+' '+(x.description||'')).toLowerCase())}" href="${esc(x.html_url||'#')}" target="_blank" rel="noopener noreferrer">
      <span class="workflow-step">${String(i+1).padStart(2,'0')}</span>
      <span class="source-label">GitHub workflow</span>
      <h3>${esc(x.name||'AI workflow')}</h3>
      <p>${esc(x.description||'Open-source workflow for AI automation.')}</p>
      <small>★ ${shortNumber(x.stargazers_count)} · Open ↗</small>
    </a>`).join('');
    setSourceStatus('workflows',(cached?'Cached':'Live')+' · GitHub');
  } catch(e) {
    console.warn('GitHub workflows failed',e);
    setSourceStatus('workflows','Curated workflows · live GitHub feed paused','error');
  }
}

async function loadPromptCollections() {
  try {
    const {data:items}=await cachedFetch('dain_gh_prompts_v2',()=>githubMultiSearch([
      'prompt-engineering in:name,description stars:>100',
      'awesome-prompts in:name,description stars:>100',
      'chatgpt-prompts in:name,description stars:>100'
    ],6),60*60*1000);
    if(!items?.length) return;
    const live=items.slice(0,2).map(x=>`<a class="prompt-card searchable live-prompt-collection" data-type="prompt" data-search="${esc(((x.name||'')+' '+(x.description||'')).toLowerCase())}" href="${esc(x.html_url||'#')}" target="_blank" rel="noopener noreferrer">
      <div class="prompt-head"><div><span class="prompt-category">Community collection</span><h3>${esc(x.name||'Prompt collection')}</h3></div><span class="collection-stars">★ ${shortNumber(x.stargazers_count)}</span></div>
      <div class="prompt-text">${esc(x.description||'Open public prompt collection on GitHub.')}</div>
      <div class="collection-link">Browse on GitHub ↗</div>
    </a>`).join('');
    el('promptGrid').insertAdjacentHTML('beforeend',live);
    setSourceStatus('prompts','Curated prompts + public GitHub collections');
  } catch(e) {
    console.warn('Prompt collections failed',e);
  }
}

async function devArticles(tags, topDays=30, perPage=20) {
  const url='https://dev.to/api/articles?tags='+encodeURIComponent(tags)+'&top='+topDays+'&per_page='+perPage;
  const r=await fetchJson(url,9000);
  return Array.isArray(r)?r:[];
}

function renderDevResources(targetId, items, type, icon) {
  if(!items?.length) return false;
  el(targetId).innerHTML=items.slice(0,9).map(x=>`<a class="resource-card searchable live-resource" data-type="${type}" data-search="${esc(((x.title||'')+' '+(x.description||'')+' '+(x.tag_list||[]).join(' ')).toLowerCase())}" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer">
    <span class="resource-icon">${icon}</span>
    <span class="source-label">DEV Community</span>
    <h3>${esc(x.title||'AI guide')}</h3>
    <p>${esc(x.description||'Community-written AI article and tutorial.')}</p>
    <footer>♡ ${shortNumber(x.public_reactions_count)} · ${x.reading_time_minutes||'—'} min read · Open ↗</footer>
  </a>`).join('');
  return true;
}

async function loadDevGuides() {
  setSourceStatus('guides','Loading community guides…','loading');
  try {
    const {data:items,cached}=await cachedFetch('dain_dev_guides_v1',()=>devArticles('ai,machinelearning',30,24),60*60*1000);
    const filtered=items.filter(x=>/guide|how|tutorial|learn|build|using|introduction/i.test((x.title||'')+' '+(x.description||'')));
    if(!renderDevResources('guideGrid',filtered.length?filtered:items,'guide','▧')) throw new Error('No guides');
    setSourceStatus('guides',(cached?'Cached':'Live')+' · DEV');
  } catch(e) {
    console.warn('DEV guides failed',e);
    setSourceStatus('guides','Curated guides · DEV unavailable','error');
  }
}

async function loadDevTutorials() {
  setSourceStatus('tutorials','Loading AI tutorials…','loading');
  try {
    const {data:items,cached}=await cachedFetch('dain_dev_tutorials_v1',()=>devArticles('ai,programming',14,24),60*60*1000);
    const filtered=items.filter(x=>/tutorial|build|create|step|how to|project|code/i.test((x.title||'')+' '+(x.description||'')));
    if(!renderDevResources('tutorialGrid',filtered.length?filtered:items,'tutorial','◫')) throw new Error('No tutorials');
    setSourceStatus('tutorials',(cached?'Cached':'Live')+' · DEV');
  } catch(e) {
    console.warn('DEV tutorials failed',e);
    setSourceStatus('tutorials','Curated tutorials · DEV unavailable','error');
  }
}

Promise.allSettled([
  loadHuggingFaceTools(),
  loadGithubAgents(),
  loadGithubWorkflows(),
  loadPromptCollections(),
  loadDevGuides(),
  loadDevTutorials()
]);
