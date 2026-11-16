'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const files=['index.html','legal.html','subscriptions.html','refunds.html','terms.html','use-policy.html','privacy.html','desk.html','guide.html','pilot.html','starter-kit.html'];
const read=n=>fs.readFileSync(path.join(root,n),'utf8');

test('published policy center has all required accessible policy links',()=>{
 const hub=read('legal.html');
 for(const target of ['subscriptions.html','refunds.html','terms.html','use-policy.html','privacy.html']) {
  assert(hub.includes('href="'+target+'"'),target+' missing from policy hub');
 }
 const landing=read('index.html');
 for(const target of ['legal.html','subscriptions.html','refunds.html'])assert(landing.includes('href="'+target+'"'),target+' missing from pricing page');
});

test('all local HTML and CSS links in policy pages exist in repository',()=>{
 for(const filename of files){
  const html=read(filename);
  for(const [,target] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(target.startsWith('https://')||target.startsWith('http://')||target.startsWith('mailto:')||target.startsWith('#')) continue;
   assert(!target.startsWith('//')&&!target.includes('..'),filename+' unsafe local URL '+target);
   const stripped=target.split('#')[0].split('?')[0];
   assert(fs.existsSync(path.join(root,stripped)),filename+' broken local link to '+target);
  }
 }
});

test('policy pages are static, use an external stylesheet and carry clear prelaunch boundaries',()=>{
 for(const filename of ['legal.html','subscriptions.html','refunds.html','terms.html','use-policy.html','privacy.html']){
  const html=read(filename);
  assert(html.includes('<title>')&&html.includes('<h1>'),filename+' needs title and h1');
  assert(html.includes('Content-Security-Policy'),filename+' missing CSP');
  assert(html.includes('href="policies.css"'),filename+' missing policy stylesheet');
  assert(!/<script\b|\sstyle=|\sonclick=/i.test(html),filename+' has potentially unsafe inline executable content');
  assert(/prelaunch|not.*active|not.*live/i.test(html),filename+' does not clarify launch status');
 }
});

test('pricing and refund windows are consistent across published pages',()=>{
 const home=read('index.html'),policy=read('subscriptions.html'),refund=read('refunds.html');
 for(const amount of ['$6.99','$69.90','$12.99','$129.90']) {
  assert(home.includes(amount),'homepage missing '+amount);
  assert(policy.includes(amount),'subscription policy missing '+amount);
 }
 assert.equal((6.99*10).toFixed(2),'69.90');
 assert.equal((12.99*10).toFixed(2),'129.90');
 assert(refund.includes('14 calendar days'),'first purchase guarantee must be explicit');
 assert(refund.includes('7 calendar days'),'monthly renewal window must be explicit');
 assert(refund.includes('Annual renewals:')&&refund.includes('Monthly renewals:'),'two distinct renewal situations needed');
 assert(policy.includes('30 days before'),'annual renewal reminder must be stated');
 assert(policy.includes('Account → Billing → Cancel subscription'),'planned cancel flow must be unambiguous');
 assert(policy.includes('No cancellation portal or subscription-support mailbox exists'),'do not imply operational cancellation exists today');
});

test('no live checkout and no fake active subscriptions in legal pages',()=>{
 for(const filename of ['index.html','legal.html','subscriptions.html','refunds.html','terms.html','use-policy.html','privacy.html']) {
  const html=read(filename);
  assert(!/https:\/\/(?:checkout|buy)\.stripe\.com/i.test(html),filename+' includes forbidden live checkout URL');
  assert(!/stripe\.com\/payment_links\//i.test(html),filename+' includes forbidden payment URL');
 }
 assert(read('index.html').includes('No subscription checkout is active.'));
 assert(read('privacy.html').includes('No paid accounts or payment processing are available'));
 assert(read('legal.html').includes('not yet an operative agreement'));
});

test('current privacy remains distinct from proposed service and explains sensitive risks',()=>{
 const p=read('privacy.html');
 for(const s of ['IndexedDB','GitHub','hosting','passphrase','not approved','paid-service','browser'])assert(p.toLowerCase().includes(s.toLowerCase()),'privacy missing '+s);
 assert(read('use-policy.html').includes('CJIS'));
 assert(read('terms.html').includes('not legal'));
});
