const content = {
  trending: [
    {type:'prompt', icon:'✦', title:'Turn rough notes into an executive brief', text:'A structured prompt for converting scattered notes into a concise, decision-ready summary.', meta:'Productivity'},
    {type:'tool', icon:'⚡', title:'AI research assistants', text:'Explore the new generation of tools that search, synthesize and cite information for you.', meta:'Research'},
    {type:'agent', icon:'🤖', title:'Daily intelligence agent', text:'A reusable agent pattern for collecting updates, ranking importance and creating a daily digest.', meta:'Agents'},
    {type:'workflow', icon:'↗', title:'Idea → content system', text:'Turn one idea into an article, social posts, video hooks and a newsletter draft.', meta:'Creator workflow'},
    {type:'tutorial', icon:'◫', title:'How to write prompts that generalize', text:'A practical framework using role, goal, context, constraints, examples and output format.', meta:'Prompting'},
    {type:'news', icon:'◎', title:'Model & product update tracker', text:'A home for important changes across AI labs, developer platforms and popular AI products.', meta:'News'}
  ],
  prompts: [
    {title:'Deep Research Brief', category:'Research', text:'Act as a senior research analyst. Investigate [TOPIC] for [AUDIENCE]. Separate verified facts, assumptions, disagreements, and open questions. End with a concise executive summary and a list of the highest-value next questions.'},
    {title:'Better Writing Editor', category:'Writing', text:'Rewrite the text below for clarity, flow and credibility while preserving my meaning and voice. Remove repetition, tighten weak sentences, and flag any claim that needs evidence. Provide the polished version first.'},
    {title:'Product Comparison', category:'Shopping', text:'Compare [PRODUCT A] and [PRODUCT B] for someone who cares most about [PRIORITIES]. Use a compact table for meaningful differences, identify tradeoffs, and explain which type of user each option suits best.'},
    {title:'Learn Anything Faster', category:'Learning', text:'Teach me [TOPIC] from beginner to practical competence. Start with the mental model, then the 20% of concepts that unlock 80% of understanding. Include examples, common mistakes, a short exercise, and a knowledge check.'},
    {title:'Meeting to Action Plan', category:'Work', text:'Convert these meeting notes into: decisions made, unresolved questions, action items with owners, risks, dependencies, and the next checkpoint. Keep uncertain assignments clearly marked instead of guessing.'},
    {title:'Code Review Partner', category:'Coding', text:'Review the following code for correctness, maintainability, security, performance and testability. Prioritize actual defects over style preferences. Explain each issue, its impact, and a concrete fix.'}
  ],
  tools: [
    {type:'tool', icon:'⌕', title:'AI Search & Research', text:'Tools for web research, synthesis, citations and source discovery.', meta:'Explore category'},
    {type:'tool', icon:'⌨', title:'AI Coding', text:'Coding assistants, agents, test generation, code review and developer workflows.', meta:'Explore category'},
    {type:'tool', icon:'◉', title:'AI Image & Design', text:'Image generation, editing, design assistance, presentations and visual content.', meta:'Explore category'},
    {type:'tool', icon:'▶', title:'AI Video', text:'Text-to-video, video editing, avatars, dubbing and short-form content workflows.', meta:'Explore category'},
    {type:'tool', icon:'♪', title:'AI Audio & Voice', text:'Speech generation, transcription, music, podcasting and audio cleanup.', meta:'Explore category'},
    {type:'tool', icon:'▦', title:'AI Productivity', text:'Writing, meetings, spreadsheets, email, documents and personal knowledge tools.', meta:'Explore category'}
  ],
  agents: [
    ['🧭','Research Scout','Finds, compares and summarizes information around a goal.'],
    ['🧪','QA Agent','Generates scenarios, test ideas, edge cases and defect hypotheses.'],
    ['📣','Content Agent','Repurposes one source into multiple audience-ready assets.'],
    ['📊','Ops Agent','Monitors inputs, detects changes and produces recurring summaries.']
  ],
  workflows: [
    ['01','Research','Collect credible sources and identify what actually matters.'],
    ['02','Synthesize','Turn raw information into patterns, comparisons and decisions.'],
    ['03','Create','Generate the output: prompt, brief, content, plan or prototype.'],
    ['04','Verify','Check claims, quality, edge cases, risks and missing information.']
  ],
  news: [
    {type:'news', title:'Model releases & capability changes', text:'Track major model launches, pricing changes, API updates and meaningful capability improvements.'},
    {type:'news', title:'AI products worth knowing', text:'Surface genuinely useful new tools rather than every launch announcement.'},
    {type:'news', title:'Policy, safety & industry shifts', text:'Follow important developments that affect how businesses and users can apply AI.'}
  ]
};

const createCard = item => `
  <article class="card searchable" data-type="${item.type}" data-search="${(item.title+' '+item.text+' '+item.meta).toLowerCase()}">
    <div class="card-top"><span class="icon-tile">${item.icon}</span><span class="type-badge">${item.type}</span></div>
    <h3>${item.title}</h3><p>${item.text}</p>
    <div class="meta"><span>${item.meta}</span><span>→</span></div>
  </article>`;

document.querySelector('#trendingGrid').innerHTML = content.trending.map(createCard).join('');
document.querySelector('#toolGrid').innerHTML = content.tools.map(createCard).join('');

document.querySelector('#promptGrid').innerHTML = content.prompts.map((p,i)=>`
  <article class="prompt-card searchable" data-type="prompt" data-search="${(p.title+' '+p.category+' '+p.text).toLowerCase()}">
    <div class="prompt-head"><div><span class="type-badge">${p.category}</span><h3>${p.title}</h3></div><button class="copy-button" data-copy="${i}">Copy prompt</button></div>
    <div class="prompt-text">${p.text}</div>
  </article>`).join('');

document.querySelector('#agentList').innerHTML = content.agents.map(a=>`
  <div class="stack-item searchable" data-type="agent" data-search="${a.join(' ').toLowerCase()}"><span>${a[0]}</span><div><strong>${a[1]}</strong><small>${a[2]}</small></div></div>`).join('');

document.querySelector('#workflowGrid').innerHTML = content.workflows.map(w=>`
  <article class="workflow-card searchable" data-type="workflow" data-search="${w.join(' ').toLowerCase()}"><span class="workflow-step">${w[0]}</span><h3>${w[1]}</h3><p>${w[2]}</p></article>`).join('');

document.querySelector('#newsGrid').innerHTML = content.news.map(n=>`
  <article class="news-card searchable" data-type="news" data-search="${(n.title+' '+n.text).toLowerCase()}"><span class="type-badge">AI NEWS</span><h3>${n.title}</h3><p>${n.text}</p></article>`).join('');

const toast = msg => {
  const t = document.querySelector('#toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1800);
};

document.addEventListener('click', e => {
  const copy = e.target.closest('[data-copy]');
  if (copy) {
    navigator.clipboard.writeText(content.prompts[Number(copy.dataset.copy)].text);
    toast('Prompt copied');
  }
  const tag = e.target.closest('[data-filter]');
  if (tag) applyFilter(tag.dataset.filter);
});

const input = document.querySelector('#globalSearch');
input.addEventListener('input', ()=> applyFilter(document.querySelector('.tag.active')?.dataset.filter || 'all', input.value));

function applyFilter(type='all', search=input.value) {
  document.querySelectorAll('.tag').forEach(t=>t.classList.toggle('active',t.dataset.filter===type));
  const q = search.trim().toLowerCase();
  document.querySelectorAll('.searchable').forEach(el => {
    const typeOK = type==='all' || el.dataset.type===type;
    const searchOK = !q || (el.dataset.search||'').includes(q);
    el.classList.toggle('hidden-card', !(typeOK && searchOK));
  });
}

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k') { e.preventDefault(); input.focus(); }
});

document.querySelector('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.querySelector('#themeToggle').textContent = document.body.classList.contains('dark') ? '☀' : '☾';
});

document.querySelector('#newsletterForm').addEventListener('submit', e => {
  e.preventDefault(); e.currentTarget.reset(); toast('Thanks — signup UI is ready to connect.');
});