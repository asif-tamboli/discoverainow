(() => {
 const $=id=>document.getElementById(id);
 const tool={
  cursor:{name:'Cursor',href:'/tools/cursor/',role:'Coding workspace',fit:'Strong fit',why:'AI-native editor for building, refactoring and reviewing real codebases.',overlap:'Overlaps with Copilot and Claude Code on coding assistance.'},
  copilot:{name:'GitHub Copilot',href:'/tools/github-copilot/',role:'IDE / GitHub assistant',fit:'Conditional fit',why:'Best when GitHub and IDE integration matter more than replacing the whole editor.',overlap:'May be redundant if Cursor already covers your IDE workflow.'},
  claudeCode:{name:'Claude Code',href:'/tools/claude-code/',role:'Repository agent',fit:'Strong fit',why:'Useful for repo-wide inspection and terminal-oriented agentic work.',overlap:'Overlaps with Cursor agents; keep it when terminal/repo workflows justify a separate tool.'},
  chatgpt:{name:'ChatGPT',href:'/tools/chatgpt/',role:'General workbench',fit:'Strong fit',why:'Flexible for planning, writing, analysis, coding support and iterative creative work.',overlap:'Broad overlap with Claude and Gemini; usually one general assistant is enough.'},
  claude:{name:'Claude',href:'/tools/claude/',role:'Analysis / long-form',fit:'Strong fit',why:'Strong for long documents, synthesis, writing and careful analysis.',overlap:'Broad overlap with ChatGPT; keep both only if your workflows benefit from different strengths.'},
  gemini:{name:'Gemini',href:'/tools/gemini/',role:'Google ecosystem',fit:'Conditional fit',why:'Useful when your work is centered on Google files, services and multimodal workflows.',overlap:'Can overlap heavily with general assistants if Google integration is not important.'},
  perplexity:{name:'Perplexity',href:'/tools/perplexity/',role:'Open-web research',fit:'Strong fit',why:'Useful for current web discovery and source-oriented research.',overlap:'Less redundant when current public-web evidence is a regular need.'},
  notebooklm:{name:'NotebookLM',href:'/tools/notebooklm/',role:'Grounded source work',fit:'Strong fit',why:'Useful when answers should remain grounded in documents you supply.',overlap:'Complements web research rather than replacing it.'},
  midjourney:{name:'Midjourney',href:'/tools/midjourney/',role:'Visual generation',fit:'Strong fit',why:'Useful for image-first visual exploration and polished creative directions.',overlap:'Optional when image creation is infrequent or your general assistant already meets the need.'},
  n8n:{name:'n8n',href:'https://n8n.io/',role:'Automation',fit:'Strong fit',why:'Useful for multi-step automations where control, APIs and custom logic matter.',overlap:'Avoid adding another automation platform unless a connector or ease-of-use gap justifies it.',external:true},
  gamma:{name:'Gamma',href:'https://gamma.app/',role:'Presentation production',fit:'Conditional fit',why:'Useful when converting a prepared narrative into polished slides is frequent.',overlap:'Optional if presentations are occasional.'}
 };
 const roleStacks={
  developer:['cursor','perplexity','claudeCode','chatgpt','n8n'],
  qa:['cursor','chatgpt','perplexity','notebooklm','n8n'],
  researcher:['perplexity','notebooklm','claude','chatgpt','gamma'],
  marketer:['chatgpt','perplexity','midjourney','gamma','n8n'],
  product:['claude','notebooklm','perplexity','gamma','chatgpt'],
  business:['chatgpt','perplexity','gamma','n8n','gemini']
 };
 function adjust(list,ctx){
   let arr=[...list];
   if(ctx.priority==='sources'){
     ['perplexity','notebooklm'].reverse().forEach(x=>{if(arr.includes(x)){arr=arr.filter(y=>y!==x);arr.unshift(x)}});
   }
   if(ctx.priority==='control' && ctx.skill==='developer' && !arr.includes('claudeCode')) arr.unshift('claudeCode');
   if(ctx.priority==='automation' && !arr.includes('n8n')) arr.unshift('n8n');
   if(ctx.budget==='lean') arr=arr.slice(0,3);
   else if(ctx.budget==='balanced') arr=arr.slice(0,4);
   if(ctx.skill==='beginner') arr=arr.filter(x=>x!=='claudeCode'||ctx.priority==='control');
   return [...new Set(arr)].slice(0,5);
 }
 function card(key,i){
   const t=tool[key], ext=t.external?' target="_blank" rel="noopener"':'';
   return '<a class="stack-card" href="'+t.href+'"'+ext+'><span>'+(i===0?'Core':'Add if useful')+' · '+t.fit+'</span><strong>'+t.name+'</strong><small>'+t.role+'</small><p>'+t.why+'</p><b>Why not everything?</b><em>'+t.overlap+'</em></a>';
 }
 $('stackForm').addEventListener('submit',e=>{
   e.preventDefault();
   const ctx={role:$('stackRole').value,skill:$('stackSkill').value,budget:$('stackBudget').value,priority:$('stackPriority').value,need:$('stackNeed').value.trim()};
   const keys=adjust(roleStacks[ctx.role],ctx);
   $('stackSummary').innerHTML='<strong>Role:</strong> '+ctx.role+' <span>·</span> <strong>Priority:</strong> '+ctx.priority+' <span>·</span> <strong>Budget:</strong> '+ctx.budget;
   $('stackCards').innerHTML=keys.map(card).join('');
   $('stackOverlap').innerHTML='<strong>Overlap rule</strong><p>Start with the smallest stack that covers distinct jobs. Add a second general assistant, coding assistant or automation platform only when a specific workflow gap justifies another subscription.</p>';
   $('stackResult').hidden=false;$('stackResult').scrollIntoView({behavior:'smooth',block:'start'});
   $('stackSave').onclick=()=>{window.dainWorkspace?.save({type:'stack',title:'AI stack for '+ctx.role,url:'/ai-stack-builder/',meta:{keys,ctx}});$('stackSave').textContent='Saved';};
   window.dainTrack?.('stack_builder_result',{role:ctx.role,skill:ctx.skill,budget:ctx.budget,priority:ctx.priority,tools:keys.join(',')});
 });
 $('stackReset').addEventListener('click',()=>{$('stackForm').reset();$('stackResult').hidden=true;});
})();