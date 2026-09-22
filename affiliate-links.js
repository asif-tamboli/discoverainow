(() => {
 // Only reviewed, approved, explicitly configured destinations can be monetized.
 fetch('/affiliate-links.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(config=>{
  const partners=(config.partners||[]).filter(p=>{
   try{return p.approved===true&&p.tool&&p.disclosure&&new URL(p.destination).protocol==='https:'&&new URL(p.affiliate_url).protocol==='https:';}catch{return false;}
  });
  if(!partners.length)return;
  function enhance(){
   document.querySelectorAll('a[href]').forEach(a=>{
    if(a.dataset.affiliateApplied)return;
    const partner=partners.find(p=>a.href===p.destination);
    if(!partner)return;
    a.href=partner.affiliate_url;a.rel='sponsored noopener';a.dataset.event='affiliate_click';a.dataset.track='affiliate_click';a.dataset.affiliateApplied='true';a.dataset.affiliateTool=partner.tool;
    const note=document.createElement('small');note.className='affiliate-note';note.textContent=partner.disclosure;
    a.append(note);
   });
  }
  enhance();new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
 }).catch(()=>{}); // Ordinary vendor links remain usable when configuration cannot load.
})();
