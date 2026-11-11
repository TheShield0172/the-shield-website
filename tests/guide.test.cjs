'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const G=require('../guide-core.js');
const allowed=['request','denial','partial','fee','overdue'];
for(const issue of allowed){
  test('safe and complete offline guidance for '+issue,()=>{
    const g=G.guidance(issue);
    assert(g.title.length>10);
    assert(g.intro.length>20);
    assert(g.steps.length>=3);
    assert(g.warning.length>40);
    assert(g.checklist.length>=5);
    assert(g.sourceLinks.length>0);
    for(const s of g.steps){assert(s.title.length>5);assert(s.detail.length>25);}
    for(const s of g.sourceLinks)assert(s.url.startsWith('https://www.legislature.mi.gov/Laws/MCL?')||s.url.startsWith('https://www.michigan.gov/'));
    assert(['request','denial','fee','followup'].includes(g.draft));
  });
}
test('fee route must not mistake clarification for statutory administrative appeal',()=>{
  const yes=G.guidance('fee','yes'),no=G.guidance('fee','no'),unknown=G.guidance('fee','unknown');
  assert.match(yes.additional,/published procedures offer a fee appeal/);
  assert.match(no.additional,/do not offer/);
  assert.match(unknown.additional,/locate the public body/);
  assert.match(no.warning,/not.*statutory fee appeal/i);
});
test('disclosure and fee appeal deadlines are distinct',()=>{
  const d=G.guidance('denial');
  const f=G.guidance('fee');
  assert(d.steps.some(s=>s.detail.includes('180-day')));
  assert(f.steps.some(s=>s.detail.includes('45-day')));
  assert(d.steps.some(s=>s.detail.includes('appeal')));
});
test('late response guidance warns that receipt and conditions matter',()=>{
  const x=G.guidance('overdue');
  assert(x.steps.some(s=>s.detail.includes('legal receipt')));
  assert(x.steps.some(s=>s.detail.includes('specified circumstances')));
});
test('unknown statuses and malformed fee-route flags are rejected',()=>{
  assert.throws(()=>G.guidance('federal'));
  assert.throws(()=>G.guidance('request','wrong'));
  assert.throws(()=>G.guidance('__proto__'));
});
test('checklist text is generic, not collected private information',()=>{
  const x=G.guidance('request');
  assert(x.checklist.every(s=>typeof s==='string'&&s.length>5));
  assert.deepEqual(x.checklist,G.guidance('denial').checklist);
});
