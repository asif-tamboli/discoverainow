(() => {
  const $=id=>document.getElementById(id);
  const form=$('toolFinderForm'), input=$('requirement'), results=$('finderResults'), primary=$('finderPrimary'),
    alternatives=$('finderAlternatives'), next=$('finderNextStep'), reset=$('finderReset'), summary=$('finderSummary');

  const tools={
    cursor:{name:'Cursor',href:'/tools/cursor/',tag:'Coding',level:['mixed','developer'],budget:['low','mid','flexible'],strengths:['quality','control'],privacy:'important',why:'Best when you want AI-native editing across a real codebase with strong control over files and changes.'},
    copilot:{name:'GitHub Copilot',href:'/tools/github-copilot/',tag:'Coding',level:['mixed','developer'],budget:['low','mid','flexible'],strengths:['integration','speed'],privacy:'important',why:'Strong for GitHub-centered teams and IDE workflows where developer integration matters.'},
    claudeCode:{name:'Claude Code',href:'/tools/claude-code/',tag:'Coding agent',level:['developer'],budget:['mid','flexible'],strengths:['quality','control'],privacy:'important',why:'Strong for repository and terminal tasks when you are comfortable delegating scoped engineering work to an agent.'},
    chatgpt:{name:'ChatGPT',href:'/tools/chatgpt/',tag:'General assistant',level:['beginner','mixed','developer'],budget:['free','low','mid','flexible'],strengths:['quality','speed'],privacy:'normal',why:'Flexible across writing, coding, analysis, planning and iterative image work.'},
    claude:{name:'Claude',href:'/tools/claude/',tag:'Analysis',level:['beginner','mixed','developer'],budget:['free','low','mid','flexible'],strengths:['quality','control'],privacy:'normal',why:'Strong for long-form reasoning, document analysis, writing and code review.'},
    gemini:{name:'Gemini',href:'/tools/gemini/',tag:'Multimodal',level:['beginner','mixed','developer'],budget:['free','low','mid','flexible'],strengths:['integration','speed'],privacy:'normal',why:'Useful for Google-centered productivity and multimodal work across files and media.'},
    perplexity:{name:'Perplexity',href:'/tools/perplexity/',tag:'Research',level:['beginner','mixed','developer'],budget:['free','low','mid','flexible'],strengths:['sources','speed'],privacy:'normal',why:'Strong starting point for current web discovery and source-oriented research.'},
    notebooklm:{name:'NotebookLM',href:'/tools/notebooklm/',tag:'Documents',level:['beginner','mixed','developer'],budget:['free','low','mid','flexible'],strengths:['sources','quality'],privacy:'normal',why:'Strong when answers should stay grounded in a set of documents or sources you provide.'},
    midjourney:{name:'Midjourney',href:'/tools/midjourney/',tag:'Images',level:['beginner','mixed','developer'],budget:['low','mid','flexible'],strengths:['quality','speed'],privacy:'normal',why:'Strong for image-first creative exploration, composition and style work.'},
    runway:{name:'Runway',href:'https://runwayml.com/',tag:'Video',level:['beginner','mixed','developer'],budget:['low','mid','flexible'],strengths:['quality','speed'],privacy:'normal',why:'Strong fit for generative video, image-to-video and creative video workflows.',external:true},
    firefly:{name:'Adobe Firefly',href:'https://firefly.adobe.com/',tag:'Creative',level:['beginner','mixed','developer'],budget:['low','mid','flexible'],strengths:['integration','control'],privacy:'normal',why:'Useful when AI generation needs to fit a broader Adobe creative-editing workflow.',external:true},
    gamma:{name:'Gamma',href:'https://gamma.app/',tag:'Presentations',level:['beginner','mixed'],budget:['free','low','mid','flexible'],strengths:['speed','integration'],privacy:'normal',why:'Strong for quickly turning a prepared narrative into a polished presentation or document.',external:true},
    otter:{name:'Otter',href:'https://otter.ai/',tag:'Meetings',level:['beginner','mixed'],budget:['free','low','mid','flexible'],strengths:['integration','speed'],privacy:'important',why:'Strong when the first problem is transcription, searchable notes and meeting capture.',external:true},
    lovable:{name:'Lovable',href:'https://lovable.dev/',tag:'Website builder',level:['beginner','mixed'],budget:['free','low','mid','flexible'],strengths:['speed','quality'],privacy:'normal',why:'Useful for quickly turning a product or website brief into a working web app through natural-language iteration.',external:true},
    bolt:{name:'Bolt',href:'https://bolt.new/',tag:'Website builder',level:['beginner','mixed'],budget:['free','low','mid','flexible'],strengths:['speed','control'],privacy:'normal',why:'Useful for quickly prototyping and building browser-based applications from a prompt.',external:true},
    replit:{name:'Replit',href:'https://replit.com/',tag:'App builder',level:['beginner','mixed','developer'],budget:['free','low','mid','flexible'],strengths:['speed','integration'],privacy:'normal',why:'Useful when you want an AI-assisted build environment that can run and deploy the application.',external:true},
    n8n:{name:'n8n',href:'https://n8n.io/',tag:'Automation',level:['mixed','developer'],budget:['free','low','mid','flexible'],strengths:['control','integration'],privacy:'strict',why:'Strong for visual multi-step automation with APIs, AI steps and custom logic, especially when control matters.',external:true},
    make:{name:'Make',href:'https://www.make.com/',tag:'Automation',level:['beginner','mixed'],budget:['free','low','mid','flexible'],strengths:['integration','speed'],privacy:'normal',why:'Strong for visual business automation across many SaaS tools.',external:true},
    zapier:{name:'Zapier',href:'https://zapier.com/',tag:'Automation',level:['beginner','mixed'],budget:['free','low','mid','flexible'],strengths:['speed','integration'],privacy:'normal',why:'Strong for fast no-code automation across common business apps.',external:true}
  };

  const profiles=[
    {id:'website',words:['website','web site','landing page','web app','webapp','frontend','front end','build a site','saas app'],tools:['lovable','bolt','replit','cursor'],next:'/best/ai-coding-tools/',nextText:'Compare AI coding and building tools'},
    {id:'video',words:['video','short film','reel','animation','image to video','text to video','product video'],tools:['runway','firefly','chatgpt'],next:'/best/ai-video-tools/',nextText:'See the AI video buyer guide'},
    {id:'documents',words:['pdf','document','documents','summarize','summary','contract','report','paper','papers','source citations','citation'],tools:['notebooklm','claude','chatgpt','gemini'],next:'/workflows/research-to-brief/',nextText:'Use the research-to-brief workflow'},
    {id:'research',words:['research','sources','market research','company research','competitor','fact check','fact-check','current information'],tools:['perplexity','notebooklm','claude','chatgpt'],next:'/workflows/research-to-brief/',nextText:'Use the research-to-brief workflow'},
    {id:'automation',words:['automate','automation','workflow','integrate','trigger','webhook','repetitive task','process automation'],tools:['n8n','make','zapier','chatgpt'],next:'/guides/ai-agents/',nextText:'Understand AI agents and automation'},
    {id:'image',words:['image','photo','photograph','headshot','thumbnail','poster','logo','visual','product image','product photography'],tools:['midjourney','chatgpt','firefly'],next:'/prompts/image-generation/',nextText:'Use the image prompt gallery'},
    {id:'presentation',words:['presentation','slides','slide deck','deck','powerpoint','pitch deck'],tools:['gamma','chatgpt','claude','gemini'],next:'/guides/ai-presentations/',nextText:'Use the presentation workflow'},
    {id:'meeting',words:['meeting','transcript','meeting notes','minutes','action items'],tools:['otter','chatgpt','claude','gemini'],next:'/workflows/meeting-notes-to-actions/',nextText:'Use the meeting-notes workflow'},
    {id:'coding',words:['code','coding','developer','debug','refactor','repository','repo','api','software','program','bug','test automation'],tools:['cursor','claudeCode','copilot','chatgpt'],next:'/best/ai-coding-tools/',nextText:'Compare AI coding tools'},
    {id:'writing',words:['write','writing','email','rewrite','copy','blog','proposal','resume','cover letter','content'],tools:['chatgpt','claude','gemini'],next:'/prompts/writing-productivity/',nextText:'Use writing and productivity prompts'}
  ];

  const privacyRank={normal:1,important:2,strict:3};
  function classify(text){
    const t=text.toLowerCase();
    return profiles.map(p=>({p,score:p.words.reduce((n,w)=>n+(t.includes(w)?(w.includes(' ')?3:2):0),0)})).sort((a,b)=>b.score-a.score)[0];
  }
  function scoreTool(key,ctx,index){
    const t=tools[key]; let score=100-index*8; const reasons=[];
    if(ctx.skill!=='any'){
      if(t.level.includes(ctx.skill)){score+=12;reasons.push('matches your experience level');}
      else{score-=18;reasons.push('may require more or less technical control than you requested');}
    }
    if(ctx.budget!=='any'){
      if(t.budget.includes(ctx.budget)){score+=8;reasons.push('fits your stated budget preference');}
      else score-=12;
    }
    if(t.strengths.includes(ctx.priority)){score+=16;reasons.push('strong on '+ctx.priority);}
    if(ctx.privacy==='strict'){
      if(t.privacy==='strict'){score+=15;reasons.push('offers a workflow with stronger control options');}
      else{score-=18;reasons.push('review enterprise/privacy terms before using sensitive data');}
    }else if(ctx.privacy==='important' && privacyRank[t.privacy]>=2){score+=7;}
    return {key,score,reasons};
  }
  function fitLabel(rec){
    if(rec.score>=108) return 'Strong fit';
    if(rec.score>=92) return 'Moderate fit';
    return 'Conditional fit';
  }
  function tradeoff(rec,top,ctx){
    if(!top || rec.key===top.key) return '';
    const t=tools[rec.key], leader=tools[top.key];
    if(t.strengths.includes(ctx.priority) && !leader.strengths.includes(ctx.priority)) return 'Why consider it: stronger alignment with your '+ctx.priority+' priority.';
    if(ctx.skill!=='any' && t.level.includes(ctx.skill) && !leader.level.includes(ctx.skill)) return 'Why consider it: closer fit to your stated technical level.';
    if(ctx.privacy==='strict' && t.privacy==='strict' && leader.privacy!=='strict') return 'Why consider it: offers stronger control-oriented workflow options.';
    return 'Why not primary: useful alternative, but the primary recommendation better matches the combined constraints you selected.';
  }
  function card(rec,label,top,ctx){
    const t=tools[rec.key], rel=t.external?' target="_blank" rel="noopener"':'';
    const reason=rec.reasons.length?'<small>'+rec.reasons.slice(0,2).join(' · ')+'</small>':'';
    const trade=tradeoff(rec,top,ctx);
    return '<a class="finder-tool-card" href="'+t.href+'"'+rel+'><div><span>'+label+' · '+t.tag+'</span><strong>'+t.name+'</strong><p>'+t.why+'</p><small class="finder-fit-label">'+fitLabel(rec)+'</small>'+reason+(trade?'<small class="finder-tradeoff">'+trade+'</small>':'')+'</div><b>'+(t.external?'↗':'→')+'</b></a>';
  }
  function recommend(text){
    let match=classify(text);
    if(!match || match.score===0) match={p:{id:'general',tools:['chatgpt','claude','gemini'],next:'/tools/',nextText:'Browse tools by use case'}};
    const ctx={skill:$('skill').value,budget:$('budget').value,priority:$('priority').value,privacy:$('privacy').value};
    const ranked=match.p.tools.map((k,i)=>scoreTool(k,ctx,i)).sort((a,b)=>b.score-a.score);
    const top=ranked[0], alts=ranked.slice(1,4);
    summary.innerHTML='<strong>Task:</strong> '+match.p.id.replace(/-/g,' ')+' <span>·</span> <strong>Priority:</strong> '+ctx.priority+' <span>·</span> <strong>Skill:</strong> '+ctx.skill+' <span>·</span> <strong>Privacy:</strong> '+ctx.privacy;
    primary.innerHTML=card(top,'Primary recommendation',top,ctx);
    alternatives.innerHTML='<h3>Alternatives and tradeoffs</h3><div class="finder-alt-grid">'+alts.map((x,i)=>card(x,'Alternative '+(i+1),top,ctx)).join('')+'</div>';
    next.innerHTML='<span>Next best step</span><strong>'+match.p.nextText+'</strong><a href="'+match.p.next+'">Open workflow / guide →</a>';
    results.hidden=false; results.scrollIntoView({behavior:'smooth',block:'start'});
    window.dainTrack?.('tool_finder_result',{task:match.p.id,priority:ctx.priority,skill:ctx.skill,budget:ctx.budget,privacy:ctx.privacy,primary:top.key,query:text.toLowerCase().slice(0,180)});
  }
  const incoming=new URLSearchParams(window.location.search).get('q');
  if(incoming){input.value=incoming.slice(0,1200);input.closest('.finder-step')?.classList.add('prefilled');}
  form.addEventListener('submit',e=>{e.preventDefault();const text=(input.value||'').trim();if(text.length<4){input.focus();return;}recommend(text);});
  document.querySelectorAll('[data-example]').forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.example||'';input.focus();}));
  reset.addEventListener('click',()=>{results.hidden=true;input.value='';input.focus();});
})();