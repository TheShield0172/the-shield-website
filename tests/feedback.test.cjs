'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {allowedEndpoint,postFeedback}=require('../feedback.js');
const root=path.resolve(__dirname,'..');
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
test('feedback receiver allowlist rejects unverified or unsafe endpoints',()=>{
 assert.equal(allowedEndpoint(''),false);
 assert.equal(allowedEndpoint('https://formspree.io/f/abcdefgh'),true);
 for(const s of ['https://formspree.io.evil.example/f/abcxyz','http://formspree.io/f/abcxyz','https://evil.example/f/abcxyz','https://formspree.io/f/','https://formspree.io/f/abc?x=1','mailto:private@example.com','https://formspree.io/f/abc/../../x'])assert.equal(allowedEndpoint(s),false,s);
});
test('anonymous submission posts only to the exact verified endpoint, without credentials',async()=>{
 const endpoint='https://formspree.io/f/abcdefgh',sent=[];
 const fakeFetch=async(url,options)=>{sent.push({url,options});return {ok:true,status:200};};
 const formData=new FormData();formData.set('suggestion','Please provide better document search.');
 assert.equal(await postFeedback(endpoint,formData,fakeFetch),true);
 assert.equal(sent.length,1);
 assert.equal(sent[0].url,endpoint);assert.equal(sent[0].options.method,'POST');
 assert.equal(sent[0].options.credentials,'omit');assert.equal(sent[0].options.referrerPolicy,'no-referrer');
 assert.equal(sent[0].options.headers.Accept,'application/json');assert.equal(sent[0].options.body,formData);
});
test('network failures and spam limits never show false success',async()=>{
 const d=new FormData();d.set('suggestion','Suggestion text.');
 await assert.rejects(()=>postFeedback('https://formspree.io/f/abcdefgh',d,async()=>({ok:false,status:422})),/not delivered/);
 await assert.rejects(()=>postFeedback('https://formspree.io/f/abcdefgh',d,async()=>({ok:false,status:429})),/too many/);
 await assert.rejects(()=>postFeedback('https://evil.example',d,async()=>({ok:true,status:200})),/not connected/);
});
test('short mobile form avoids required PII and never collects files or passwords',()=>{
 const h=read('feedback.html');
 for(const id of ['role','tried','priority','suggestion','interest','email','consent','website','feedback-fields','feedback-result','feedback-submit'])
   assert(h.includes('id="'+id+'"'),id+' field missing');
 assert(h.includes('name="suggestion" required'));assert(h.includes('name="consent" value='));
 assert(h.includes('id="email" name="email" type="email"')&&!h.includes('id="email" name="email" type="email" required'),'email must be optional');
 assert(!/type="file"|type="password"/i.test(h),'no sensitive uploads or credentials');
 assert(h.includes('No GitHub login'));assert(h.includes('Formspree'));assert(h.includes('not a secure evidence'));
 assert(h.includes('fieldset id="feedback-fields" disabled'),'must start disabled until receiver connected');
 assert(h.includes('Content-Security-Policy'));assert(h.includes("connect-src https://formspree.io"));
});
test('delivery is disabled until owner provides an actual verified endpoint',()=>{
 const c=read('feedback-config.js');
 assert(/SHIELD_FEEDBACK_ENDPOINT\s*=\s*''/.test(c),'endpoint must not be invented');
 assert(!c.includes('@gmail.com'),'no personal receiver email in public source');
 const js=read('feedback.js');
 assert(js.includes('fields.disabled=!active'));assert(js.includes('button.disabled=!active'));assert(js.includes('not connected yet; nothing has been sent.'));
});
test('public pages link the feedback page and hosting permits only expected submission origin',()=>{
 for(const p of ['index.html','pilot.html','starter-kit.html','guide.html','desk.html','privacy.html'])assert(read(p).includes('href="feedback.html"'),p+' lacks feedback link');
 const y=read('render.yaml');
 assert(y.includes("connect-src 'self' https://formspree.io;"));assert(y.includes("form-action 'none'"));
});
