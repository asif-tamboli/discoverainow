(() => {
  const key='dain_task_context_v1', $=id=>document.getElementById(id);
  const pages={
    '/':{goal:'globalSearch'},
    '/tool-finder/':{goal:'requirement'},
    '/prompt-builder/':{goal:'pbGoal',constraints:'pbConstraints',type:'pbType'},
    '/prompt-lab/':{goal:'plGoal',constraints:'plConstraints'},
    '/verify-ai-output/':{goal:'ovSource'}
  };
  const fields=pages[location.pathname]||(/^\/workflows\//.test(location.pathname)?{}:null); if(!fields)return;
  let saved={},available=true;
  try{saved=JSON.parse(sessionStorage.getItem(key)||'{}')||{};if(saved.version!==1)saved={};}
  catch{available=false;}
  const typeMap={code:'coding',website:'coding',automation:'coding',video:'writing',documents:'research',presentation:'writing',meeting:'writing',general:'writing'};
  const hadGoal=!!$(fields.goal)?.value;
  function persist(){try{sessionStorage.setItem(key,JSON.stringify({...saved,version:1}));}catch{available=false;status.textContent='Session storage unavailable; your current form still works.';}}
  Object.entries(fields).forEach(([name,id])=>{
    const el=$(id);if(!el||!saved[name]||el.value&&name!=='type')return;
    if(name==='type'&&hadGoal)return;
    const value=name==='type'?(typeMap[saved.type]||saved.type):saved[name];
    if(el.tagName==='SELECT'&&![...el.options].some(o=>o.value===value))return;
    el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));
  });
  const bar=document.createElement('aside');bar.className='task-context-bar';
  bar.innerHTML='<label><input type="checkbox" checked> Carry my task to the next step in this tab</label><small>Goal and constraints stay in session storage. Source documents and AI results are not saved.</small><nav aria-label="Continue your task"><a href="/tool-finder/">Choose AI</a><a href="/prompt-builder/">Build prompt</a><a href="/workflows/">Workflow</a><a href="/verify-ai-output/">Verify result</a><button type="button">Clear saved task</button></nav><small role="status"></small>';
  const main=document.querySelector('main');main?.append(bar);
  const status=bar.querySelector('[role="status"]'),opt=bar.querySelector('input');
  try{opt.checked=sessionStorage.getItem(key+'_disabled')!=='1';}catch{opt.checked=false;}
  status.textContent=available?(saved.goal?'Your previous task is available. Existing entries were preserved.':''):'Session storage is unavailable.';
  function clear(){try{sessionStorage.removeItem(key);}catch{}saved={};status.textContent='Saved task cleared. Current form entries remain until you clear them.';}
  bar.querySelector('button').onclick=()=>{clear();opt.checked=false;try{sessionStorage.setItem(key+'_disabled','1');}catch{}};
  opt.onchange=()=>{try{sessionStorage.setItem(key+'_disabled',opt.checked?'0':'1');}catch{}if(!opt.checked)clear();};
  // Save on intentional navigation or submission, not on every keystroke.
  function capture(){
    if(!opt.checked||!available||location.pathname==='/verify-ai-output/')return;
    const goal=$(fields.goal)?.value.trim();if(!goal)return;
    const constraints=fields.constraints?$(fields.constraints)?.value.trim()||'':goal===saved.goal?saved.constraints||'':'';
    saved={version:1,goal:goal.slice(0,4000),constraints:constraints.slice(0,4000),type:$(fields.type)?.value||$('toolFinderForm')?.dataset.taskType||(goal===saved.goal?saved.type:'')||''};
    persist();
  }
  document.addEventListener('submit',capture);
  document.addEventListener('click',e=>{if(e.target.closest('a'))capture();});
  if(location.pathname==='/verify-ai-output/'&&saved.constraints&&$('ovSource').value===saved.goal)
    $('ovSource').value=saved.goal+'\nConstraints: '+saved.constraints;
})();
