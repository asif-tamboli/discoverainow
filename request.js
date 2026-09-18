(() => {
 const form=document.getElementById('requestForm'),thanks=document.getElementById('requestThanks');
 form.addEventListener('submit',e=>{
   e.preventDefault();
   const type=document.getElementById('requestType').value;
   const role=document.getElementById('requestRole').value;
   const text=document.getElementById('requestText').value.trim();
   if(text.length<8)return;
   window.dainTrack?.('content_request_submit',{type,role,text:text.slice(0,500)});
   form.reset(); thanks.hidden=false; thanks.scrollIntoView({behavior:'smooth',block:'center'});
 });
})();