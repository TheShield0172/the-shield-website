'use strict';
(()=>{
  const valid=new Set(['timeline','documents','foia','review','draft']);
  const buttons=[...document.querySelectorAll('button[data-tab]')];
  const panels=[...document.querySelectorAll('div[data-panel]')];
  function openTab(tab){
    if(!valid.has(tab))return;
    buttons.forEach(b=>{const active=b.dataset.tab===tab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    panels.forEach(p=>p.classList.toggle('hidden',p.id!==tab));
  }
  buttons.forEach((b,i)=>{
    b.addEventListener('click',()=>openTab(b.dataset.tab));
    b.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let j=i;if(['ArrowDown','ArrowRight'].includes(e.key))j=(i+1)%buttons.length;else if(['ArrowUp','ArrowLeft'].includes(e.key))j=(i+buttons.length-1)%buttons.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=buttons.length-1;openTab(buttons[j].dataset.tab);buttons[j].focus();});
  });
  openTab('timeline');
})();