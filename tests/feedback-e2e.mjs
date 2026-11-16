// THE SHIELD feedback browser checks. Mock remote submissions; no personal data or real emails.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const port=18778;
const base='http://127.0.0.1:'+port+'/feedback.html';
const target='https://formspree.io/f/abcdefgh';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
async function waitServer(){for(let i=0;i<40;i++){try{const res=await fetch(base);if(res.ok)return;}catch{}await new Promise(r=>setTimeout(r,250));}throw Error('Local website not started');}
async function configuredPage(context,replyStatus){
 const page=await context.newPage(),requests=[];
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/feedback-config.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:'window.SHIELD_FEEDBACK_ENDPOINT = "'+target+'";'}));
 await page.route(target,async route=>{
   requests.push({method:route.request().method(),postData:route.request().postData()});
   await route.fulfill({status:replyStatus,contentType:'application/json',
     headers:{'access-control-allow-origin':'*','cache-control':'no-store'},
     body:replyStatus===200?'{"ok":true}':'{"error":"rate limited"}'});
 });
 await page.goto(base,{waitUntil:'load'});
 return {page,requests,errors};
}
try{
 await waitServer();
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const pending=await context.newPage();
 await pending.goto(base,{waitUntil:'load'});
 await pending.getByText('Feedback collection is being connected.').waitFor();
 assert(await pending.locator('#feedback-submit').isDisabled(),'A new site must not claim a submission inbox without a verified endpoint.');
 await pending.close();
 const {page,requests,errors}=await configuredPage(context,200);
 await page.getByText('Feedback is open. Submit without an account or payment.').waitFor();
 assert(await page.locator('#feedback-submit').isEnabled());
 assert.equal(requests.length,0,'Opening the survey must not send entered fields anywhere.');
 await page.locator('#tried').selectOption('foia-guide');
 await page.locator('#priority').selectOption('better-foia');
 await page.locator('#suggestion').fill('Please add an agency-specific FOIA checklist.');
 await page.locator('#consent').check();
 await page.locator('#feedback-submit').click();
 await page.getByText('Thank you! Your suggestion was submitted successfully.').waitFor({timeout:12000});
 assert.equal(requests.length,1,'One submission should produce exactly one POST.');
 assert.equal(requests[0].method,'POST');
 assert.match(requests[0].postData,/agency-specific FOIA checklist/);
 assert(!requests[0].postData.includes('tquimby'),'The form must never add the owner\'s personal name.');
 assert(await page.locator('#feedback-fields').evaluate(el=>el.disabled),'Successful form must be locked to prevent duplicate posting.');
 assert.deepEqual(errors,[],'No JavaScript errors allowed');
 // A failed or limited request must not show a successful thank-you.
 const {page:limited,requests:failed,errors:errorEvents}=await configuredPage(context,429);
 await limited.locator('#tried').selectOption('not-yet');
 await limited.locator('#priority').selectOption('mobile');
 await limited.locator('#suggestion').fill('Please make the interface easier on a mobile phone.');
 await limited.locator('#consent').check();
 await limited.locator('#feedback-submit').click();
 await limited.getByText('We are receiving too many suggestions right now.').waitFor({timeout:12000});
 assert.equal(failed.length,1);
 assert(await limited.locator('#feedback-submit').isEnabled(),'Retry button should be enabled after a rate limit.');
 assert(!(await limited.locator('#feedback-fields').evaluate(el=>el.disabled)),'Failed submission must not clear answers.');
 assert.deepEqual(errorEvents,[],'No JavaScript errors in failure flow');
 await context.close();
 console.log('PASS: Anonymous form remains disabled until connected, sends one mocked submission, honors success, handles 429 without false confirmation, and works at mobile width.');
}finally{
 if(browser)await browser.close();
 server.kill('SIGTERM');
}
