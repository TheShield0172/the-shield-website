'use strict';
/* Local, zero-API Michigan FOIA guide UI. Never collect case details here. */
(() => {
  const $=id=>document.getElementById(id);
  const core=window.ShieldGuide;
  const el=(tag,text)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;return x;};
  let latest=null;
  const permitted=new Set(['request','denial','partial','fee','overdue']);
  function update(){
    const issue=$('guide-issue').value;
    if(!permitted.has(issue))return;
    $('fee-route-box').hidden=issue!=='fee';
    latest=core.guidance(issue,$('guide-fee-route').value);
    $('guide-title').textContent=latest.title;
    $('guide-intro').textContent=latest.intro;
    $('guide-warning').textContent=latest.warning;
    $('guide-additional').hidden=!latest.additional;
    $('guide-additional').textContent=latest.additional||'';
    const ol=$('guide-steps');ol.replaceChildren();
    for(const item of latest.steps){
      const li=el('li'),heading=el('strong',item.title),desc=el('p',item.detail);
      li.append(heading,desc);ol.append(li);
    }
    const checks=$('guide-checklist');checks.replaceChildren();
    for(const item of latest.checklist){
      const label=el('label'),input=el('input');input.type='checkbox';
      const text=el('span',item);label.append(input,text);checks.append(label);
    }
    const sources=$('guide-sources');sources.replaceChildren();
    for(const source of latest.sourceLinks){
      const a=el('a',source.label);
      a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';
      sources.append(a);
    }
    $('guide-desk-link').href='desk.html?type='+encodeURIComponent(latest.draft);
    $('guide-message').textContent='';
  }
  $('guide-issue').addEventListener('change',update);
  $('guide-fee-route').addEventListener('change',update);
  $('guide-copy').addEventListener('click',async()=>{
    if(!latest)return;
    const text=[
      'THE SHIELD — Michigan FOIA Next-Step Checklist',
      latest.title,'',latest.intro,'',
      ...latest.steps.map((s,i)=>(i+1)+'. '+s.title+'\n'+s.detail+'\n'),
      'IMPORTANT: '+latest.warning,
      latest.additional||'',
      'Keep these records:',
      ...latest.checklist.map(s=>'[ ] '+s),
      '',
      'Official sources:',...latest.sourceLinks.map(s=>s.label+': '+s.url),
      '',
      'Educational information only; not legal advice. This checklist does not calculate deadlines or submit filings.'
    ].join('\n');
    try{await navigator.clipboard.writeText(text);$('guide-message').textContent='Copied. You can paste this checklist into your own notes.';}
    catch{const status=$('guide-message');status.textContent='Clipboard access blocked by your browser. Use Print checklist to save a PDF instead.';}
  });
  $('guide-print').addEventListener('click',()=>window.print());
  update();
})();