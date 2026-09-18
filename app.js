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