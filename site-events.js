(() => {
  const script=document.createElement('script');
  script.src='/analytics.js';
  script.defer=true;
  document.head.appendChild(script);
  const css=document.createElement('link');css.rel='stylesheet';css.href='/growth.css';document.head.append(css);
  function enhancements(){['task-context.js','affiliate-links.js','worked-examples.js'].forEach(name=>{const s=document.createElement('script');s.src='/'+name;document.head.append(s);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhancements,{once:true});else enhancements();
  function outcomeFeedback(){
    if(!/^\/(tool-finder|prompt-builder|prompt-lab|workflows|use-cases)(\/|$)/.test(location.pathname)||document.querySelector('[data-feedback-widget]'))return;
    const root=document.createElement('div');root.dataset.feedbackWidget='';root.dataset.context=location.pathname;
    (document.querySelector('article')||document.querySelector('main'))?.append(root);
    const s=document.createElement('script');s.src='/feedback.js';document.head.append(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',outcomeFeedback,{once:true});else outcomeFeedback();
})();
