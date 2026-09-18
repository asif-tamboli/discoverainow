(() => {
  const form=document.getElementById('toolFinderForm');
  const input=document.getElementById('requirement');
  const results=document.getElementById('finderResults');
  const primary=document.getElementById('finderPrimary');
  const alternatives=document.getElementById('finderAlternatives');
  const next=document.getElementById('finderNextStep');
  const reset=document.getElementById('finderReset');

  const tools={
    cursor:{name:'Cursor',href:'/tools/cursor/',tag:'Coding',why:'Best when the job involves building or changing a real codebase inside an AI-native editor.'},
    copilot:{name:'GitHub Copilot',href:'/tools/github-copilot/',tag:'Coding',why:'Strong fit for GitHub-centered teams and IDE workflows.'},
    claudeCode:{name:'Claude Code',href:'/tools/claude-code/',tag:'Coding agent',why:'Strong fit for repository and terminal tasks where an agent can inspect, edit and verify code.'},
    chatgpt:{name:'ChatGPT',href:'/tools/chatgpt/',tag:'General assistant',why:'Flexible across writing, coding, analysis, structured planning and iterative image work.'},
    claude:{name:'Claude',href:'/tools/claude/',tag:'Analysis',why:'Strong for long-form reasoning, document analysis, writing and code review.'},
    gemini:{name:'Gemini',href:'/tools/gemini/',tag:'Multimodal',why:'Useful for Google-centered productivity and multimodal work across files and media.'},
    perplexity:{name:'Perplexity',href:'/tools/perplexity/',tag:'Research',why:'Strong starting point for current web discovery and source-oriented research.'},
    notebooklm:{name:'NotebookLM',href:'/tools/notebooklm/',tag:'Documents',why:'Strong when the answer should stay grounded in a set of documents or sources you provide.'},
    midjourney:{name:'Midjourney',href:'/tools/midjourney/',tag:'Images',why:'Strong for image-first creative exploration, composition and style work.'},
    runway:{name:'Runway',href:'https://runwayml.com/',tag:'Video',why:'Strong fit for generative video, image-to-video and creative video workflows.',external:true},
    firefly:{name:'Adobe Firefly',href:'https://firefly.adobe.com/',tag:'Creative',why:'Useful when AI generation needs to fit a broader Adobe creative-editing workflow.',external:true},
    gamma:{name:'Gamma',href:'https://gamma.app/',tag:'Presentations',why:'Strong for quickly turning a prepared narrative into a polished presentation or document.',external:true},
    otter:{name:'Otter',href:'https://otter.ai/',tag:'Meetings',why:'Strong when the first problem is transcription, searchable notes and meeting capture.',external:true},
    lovable:{name:'Lovable',href:'https://lovable.dev/',tag:'Website builder',why:'Useful for quickly turning a product or website brief into a working web app through natural-language iteration.',external:true},
    bolt:{name:'Bolt',href:'https://bolt.new/',tag:'Website builder',why:'Useful for quickly prototyping and building browser-based applications from a prompt.',external:true},
    replit:{name:'Replit',href:'https://replit.com/',tag:'App builder',why:'Useful when you want an AI-assisted build environment that can run and deploy the application.',external:true},
    n8n:{name:'n8n',href:'https://n8n.io/',tag:'Automation',why:'Strong for visual multi-step automation with APIs, AI steps and custom logic.',external:true},
    make:{name:'Make',href:'https://www.make.com/',tag:'Automation',why:'Strong for visual business automation across many SaaS tools.',external:true},
    zapier:{name:'Zapier',href:'https://zapier.com/',tag:'Automation',why:'Strong for fast no-code automation across common business apps.',external:true}
  };

  const profiles=[
    {id:'website',words:['website','web site','landing page','web app','webapp','frontend','front end','build a site','saas app'],primary:'lovable',alts:['bolt','replit','cursor'],next:'/best/ai-coding-tools/',nextText:'Compare AI coding and building tools'},
    {id:'video',words:['video','short film','reel','animation','image to video','text to video','product video'],primary:'runway',alts:['firefly','chatgpt'],next:'/best/ai-video-tools/',nextText:'See the AI video buyer guide'},
    {id:'documents',words:['pdf','document','documents','summarize','summary','contract','report','paper','papers','source citations','citation'],primary:'notebooklm',alts:['claude','chatgpt','gemini'],next:'/workflows/research-to-brief/',nextText:'Use the research-to-brief workflow'},
    {id:'research',words:['research','sources','market research','company research','competitor','fact check','fact-check','current information'],primary:'perplexity',alts:['notebooklm','claude','chatgpt'],next:'/workflows/research-to-brief/',nextText:'Use the research-to-brief workflow'},
    {id:'automation',words:['automate','automation','workflow','integrate','trigger','webhook','repetitive task','process automation'],primary:'n8n',alts:['make','zapier','chatgpt'],next:'/guides/ai-agents/',nextText:'Understand AI agents and automation'},
    {id:'image',words:['image','photo','photograph','headshot','thumbnail','poster','logo','visual','product image','product photography'],primary:'midjourney',alts:['chatgpt','firefly'],next:'/prompts/image-generation/',nextText:'Use the image prompt gallery'},
    {id:'presentation',words:['presentation','slides','slide deck','deck','powerpoint','pitch deck'],primary:'gamma',alts:['chatgpt','claude','gemini'],next:'/guides/ai-presentations/',nextText:'Use the presentation workflow'},
    {id:'meeting',words:['meeting','transcript','meeting notes','minutes','action items'],primary:'otter',alts:['chatgpt','claude','gemini'],next:'/workflows/meeting-notes-to-actions/',nextText:'Use the meeting-notes workflow'},
    {id:'coding',words:['code','coding','developer','debug','refactor','repository','repo','api','software','program','bug','test automation'],primary:'cursor',alts:['claudeCode','copilot','chatgpt'],next:'/best/ai-coding-tools/',nextText:'Compare AI coding tools'},
    {id:'writing',words:['write','writing','email','rewrite','copy','blog','proposal','resume','cover letter','content'],primary:'chatgpt',alts:['claude','gemini'],next:'/prompts/writing-productivity/',nextText:'Use writing and productivity prompts'}
  ];

  function scoreProfile(text,p){
    let score=0;
    p.words.forEach(w=>{ if(text.includes(w)) score += w.includes(' ')?3:2; });
    return score;
  }

  function card(tool,rankLabel){
    const t=tools[tool];
    const rel=t.external?' target="_blank" rel="noopener"':'';
    return '<a class="finder-tool-card" href="'+t.href+'"'+rel+'><div><span>'+rankLabel+' · '+t.tag+'</span><strong>'+t.name+'</strong><p>'+t.why+'</p></div><b>'+(t.external?'↗':'→')+'</b></a>';
  }

  function recommend(text){
    const normalized=text.toLowerCase();
    const ranked=profiles.map(p=>({p,score:scoreProfile(normalized,p)})).sort((a,b)=>b.score-a.score);
    let match=ranked[0];
    if(!match || match.score===0){
      match={p:{id:'general',primary:'chatgpt',alts:['claude','gemini'],next:'/tools/',nextText:'Browse tools by use case'},score:0};
    }
    const p=match.p;
    primary.innerHTML=card(p.primary,'Primary recommendation');
    alternatives.innerHTML='<h3>Strong alternatives</h3><div class="finder-alt-grid">'+p.alts.map((x,i)=>card(x,'Alternative '+(i+1))).join('')+'</div>';
    next.innerHTML='<span>Next best step</span><strong>'+p.nextText+'</strong><a href="'+p.next+'">Open workflow / guide →</a>';
    results.hidden=false;
    results.scrollIntoView({behavior:'smooth',block:'start'});
    window.dainTrack?.('tool_finder_result',{task:p.id,query:normalized.slice(0,180)});
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const text=(input.value||'').trim();
    if(text.length<4){input.focus();return;}
    recommend(text);
  });

  document.querySelectorAll('[data-example]').forEach(btn=>btn.addEventListener('click',()=>{
    input.value=btn.dataset.example||'';
    input.focus();
  }));

  reset.addEventListener('click',()=>{
    results.hidden=true;
    input.value='';
    input.focus();
  });
})();