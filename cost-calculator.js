(() => {
 const rows=document.getElementById('costRows'),fmt=n=>'$'+n.toFixed(2);
 const cats=['General assistant','Coding','Research','Documents','Images','Video','Automation','Presentations','Other'];
 function add(data={}){
   const r=document.createElement('div');r.className='cost-row';
   r.innerHTML='<input class="cr-name" placeholder="Tool name" value="'+(data.name||'').replace(/"/g,'&quot;')+'"><select class="cr-cat">'+cats.map(c=>'<option'+(c===data.cat?' selected':'')+'>'+c+'</option>').join('')+'</select><input class="cr-price" type="number" min="0" step="0.01" placeholder="Monthly price" value="'+(data.price??'')+'"><input class="cr-seats" type="number" min="1" step="1" value="'+(data.seats||1)+'"><button type="button" class="cr-remove">×</button>';
   rows.appendChild(r);r.querySelectorAll('input,select').forEach(x=>x.addEventListener('input',calc));r.querySelector('.cr-remove').onclick=()=>{r.remove();calc();};
 }
 function data(){return [...rows.children].map(r=>({name:r.querySelector('.cr-name').value.trim()||'Unnamed tool',cat:r.querySelector('.cr-cat').value,price:Math.max(0,Number(r.querySelector('.cr-price').value)||0),seats:Math.max(1,Number(r.querySelector('.cr-seats').value)||1)}));}
 function calc(){
   const d=data(),base=d.reduce((s,x)=>s+x.price*x.seats,0),tax=Math.max(0,Number(document.getElementById('taxPct').value)||0),disc=Math.min(100,Math.max(0,Number(document.getElementById('discountPct').value)||0)),monthly=base*(1+tax/100),annual=monthly*12,discounted=annual*(1-disc/100);
   document.getElementById('monthlyTotal').textContent=fmt(monthly);document.getElementById('annualTotal').textContent=fmt(annual);document.getElementById('discountedTotal').textContent=fmt(discounted);
   const counts={};d.forEach(x=>counts[x.cat]=(counts[x.cat]||0)+1);const overlaps=Object.entries(counts).filter(([k,v])=>v>1&&k!=='Other');
   document.getElementById('costOverlap').innerHTML='<strong>Overlap check</strong><p>'+(overlaps.length?'You have multiple paid tools in: '+overlaps.map(x=>x[0]+' ('+x[1]+')').join(', ')+'. That is not automatically wasteful—but each duplicate category should justify a distinct workflow.':'No obvious duplicate categories yet. Add categories honestly to make this useful.')+'</p>';
   return {d,monthly,annual,discounted};
 }
 document.getElementById('addCostRow').onclick=()=>add();
 document.getElementById('taxPct').addEventListener('input',calc);document.getElementById('discountPct').addEventListener('input',calc);
 document.getElementById('saveCostPlan').onclick=()=>{const x=calc();window.dainWorkspace?.save({type:'cost-plan',title:'AI cost plan · '+fmt(x.monthly)+'/mo',url:'/ai-cost-calculator/',meta:x});document.getElementById('saveCostPlan').textContent='Saved';window.dainTrack?.('cost_plan_save',{monthly:Math.round(x.monthly),tools:x.d.length});};
 add({name:'',cat:'General assistant',seats:1});add({name:'',cat:'Coding',seats:1});calc();
})();