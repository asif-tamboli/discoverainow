(() => {
 const KEY='dain_workspace_v1';
 function all(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
 function write(v){localStorage.setItem(KEY,JSON.stringify(v.slice(0,100)))}
 function save(item){const v=all();const row={id:crypto?.randomUUID?.()||String(Date.now()),saved_at:new Date().toISOString(),...item};v.unshift(row);write(v);window.dainTrack?.('workspace_save',{type:item.type||'item'});return row}
 function remove(id){write(all().filter(x=>x.id!==id))}
 function clear(){localStorage.removeItem(KEY);window.dainTrack?.('workspace_clear',{})}
 function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
 function render(root,empty){const v=all();if(empty)empty.hidden=!!v.length;if(!root)return;root.innerHTML=v.map(x=>'<div class="workspace-item"><div><span>'+esc(x.type||'saved')+'</span><strong>'+esc(x.title||'Saved item')+'</strong><small>Saved '+new Date(x.saved_at).toLocaleDateString()+'</small></div><div><a href="'+esc(x.url||'/')+'">Open →</a><button data-remove="'+x.id+'" type="button">Remove</button></div></div>').join('');root.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{remove(b.dataset.remove);render(root,empty);});}
 window.dainWorkspace={all,save,remove,clear,render};
})();