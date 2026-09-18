(() => {
 const $=id=>document.getElementById(id);
 const T={
  chatgpt:['ChatGPT','/tools/chatgpt/'],claude:['Claude','/tools/claude/'],gemini:['Gemini','/tools/gemini/'],cursor:['Cursor','/tools/cursor/'],copilot:['GitHub Copilot','/tools/github-copilot/'],perplexity:['Perplexity','/tools/perplexity/'],notebooklm:['NotebookLM','/tools/notebooklm/'],midjourney:['Midjourney','/tools/midjourney/'],
  claudeCode:['Claude Code','/tools/claude-code/'],n8n:['n8n','https://n8n.io/'],firefly:['Adobe Firefly','https://firefly.adobe.com/'],make:['Make','https://www.make.com/']
 };
 const map={
  cost:{chatgpt:['claude','gemini'],claude:['chatgpt','gemini'],gemini:['chatgpt','claude'],cursor:['copilot','claudeCode'],copilot:['cursor','claudeCode'],perplexity:['chatgpt','gemini'],notebooklm:['gemini','chatgpt'],midjourney:['firefly','chatgpt'],zapier:['make','n8n']},
  sources:{chatgpt:['perplexity','notebooklm'],claude:['notebooklm','perplexity'],gemini:['perplexity','notebooklm'],cursor:['perplexity','notebooklm'],copilot:['perplexity','notebooklm'],perplexity:['notebooklm','chatgpt'],notebooklm:['perplexity','claude'],midjourney:['chatgpt','gemini'],zapier:['n8n','make']},
  privacy:{chatgpt:['claude','gemini'],claude:['chatgpt','gemini'],gemini:['claude','chatgpt'],cursor:['claudeCode','copilot'],copilot:['cursor','claudeCode'],perplexity:['notebooklm','claude'],notebooklm:['claude','chatgpt'],midjourney:['firefly','chatgpt'],zapier:['n8n','make']},
  coding:{chatgpt:['cursor','claudeCode'],claude:['claudeCode','cursor'],gemini:['cursor','copilot'],cursor:['claudeCode','copilot'],copilot:['cursor','claudeCode'],perplexity:['cursor','claudeCode'],notebooklm:['cursor','claudeCode'],midjourney:['cursor','chatgpt'],zapier:['n8n','claudeCode']},
  integration:{chatgpt:['gemini','n8n'],claude:['n8n','gemini'],gemini:['n8n','chatgpt'],cursor:['copilot','n8n'],copilot:['cursor','n8n'],perplexity:['n8n','chatgpt'],notebooklm:['gemini','n8n'],midjourney:['firefly','chatgpt'],zapier:['make','n8n']},
  creative:{chatgpt:['midjourney','firefly'],claude:['chatgpt','midjourney'],gemini:['chatgpt','midjourney'],cursor:['chatgpt','midjourney'],copilot:['chatgpt','midjourney'],perplexity:['chatgpt','midjourney'],notebooklm:['chatgpt','midjourney'],midjourney:['firefly','chatgpt'],zapier:['chatgpt','firefly']},
  documents:{chatgpt:['notebooklm','claude'],claude:['notebooklm','chatgpt'],gemini:['notebooklm','claude'],cursor:['notebooklm','claude'],copilot:['notebooklm','claude'],perplexity:['notebooklm','claude'],notebooklm:['claude','chatgpt'],midjourney:['chatgpt','claude'],zapier:['notebooklm','claude']}
 };
 const why={
  perplexity:'Better when current public-web discovery and source links are central.',notebooklm:'Better when the answer must stay grounded in a bounded source set.',claude:'Better when long-form analysis and document work matter.',chatgpt:'Broad general-purpose replacement with strong task flexibility.',gemini:'Useful when Google ecosystem integration matters.',cursor:'Better for an AI-native coding workspace and codebase editing.',copilot:'Better when GitHub/IDE integration is the center of the workflow.',claudeCode:'Better for repository and terminal agent workflows.',n8n:'Better when automation control and custom logic matter.',make:'Useful when visual business automation is the priority.',midjourney:'Better for visual-first creative exploration.',firefly:'Better when AI creation belongs inside an Adobe-oriented creative workflow.'
 };
 $('replaceForm').addEventListener('submit',e=>{
  e.preventDefault();const current=$('replaceTool').value,reason=$('replaceReason').value,job=$('replaceJob').value.trim();const keys=(map[reason]?.[current]||['chatgpt','claude']).filter(x=>x!==current);
  $('replaceCards').innerHTML=keys.map((k,i)=>{const t=T[k],ext=t[1].startsWith('http')?' target="_blank" rel="noopener"':'';return '<a class="stack-card" href="'+t[1]+'"'+ext+'><span>'+(i===0?'Strong fit':'Alternative')+'</span><strong>'+t[0]+'</strong><p>'+why[k]+'</p><b>Tradeoff</b><em>Verify that it still covers your exact workflow, integrations, privacy requirements and current pricing before switching.</em></a>';}).join('');
  $('replaceNote').innerHTML='<strong>Why not automatically switch?</strong><p>A replacement is only better if it solves the reason you are leaving without creating a worse gap elsewhere.'+(job?' Your stated job: '+job.replace(/[<>]/g,'')+'.':'')+'</p>';
  $('replaceResult').hidden=false;$('replaceResult').scrollIntoView({behavior:'smooth',block:'start'});
  $('replaceSave').onclick=()=>{window.dainWorkspace?.save({type:'shortlist',title:'Alternatives to '+T[current][0],url:'/replace-ai-tool/',meta:{current,reason,keys,job}});$('replaceSave').textContent='Saved';};
  window.dainTrack?.('replacement_finder_result',{current,reason,alternatives:keys.join(',')});
 });
 $('replaceReset').addEventListener('click',()=>{$('replaceForm').reset();$('replaceResult').hidden=true;});
})();