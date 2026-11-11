// Browser integration checks using fictional test data only.
// Run in CI with: npm install --no-save playwright@1.56.1 && npx playwright install chromium
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const REPO = path.resolve(import.meta.dirname, '../../');
const PORT = 18773;
const BASE = `http://127.0.0.1:${PORT}/vault-lab/`;
const pass = 'Fictional-only Test Vault Passphrase 2026';
const server = spawn('python3', ['-m','http.server',String(PORT),'--bind','127.0.0.1'], {cwd:REPO, stdio:'ignore'});
let browser;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function awaitServer(){for(let i=0;i<40;i++){try{const r=await fetch(BASE);if(r.ok)return;}catch{}await sleep(250);}throw Error('Test server did not start');}
async function clickAndCheck(page, selector, visible){await page.locator(selector).click();await page.locator(visible).waitFor({state:'visible',timeout:15000});}
try{
 await awaitServer();
 browser = await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 const context = await browser.newContext({acceptDownloads:true,viewport:{width:1280,height:900}});
 const page = await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',request=>{if(new URL(request.url()).origin!==new URL(BASE).origin)errors.push('Unexpected network request: '+request.url());});
 await page.goto(BASE,{waitUntil:'load'});
 assert.match(await page.title(),/Case Vault/);
 await page.locator('#pass').fill(pass);
 await page.locator('#confirm-pass').fill(pass);
 await clickAndCheck(page,'#open','#vault-pane');
 await page.locator('#case-name').fill('Fictional Supervisor Dispute');
 await page.locator('#add-case').click();
 await page.waitForFunction(()=>document.querySelector('#case-count').textContent==='1 case(s)');
 await page.locator('#event-title').fill('Imaginary meeting');
 await page.locator('#event-body').fill('No real people, records, or agency information.');
 await page.locator('#event-form button[type=submit]').click();
 await page.locator('#events').getByText('Imaginary meeting').waitFor();
 await page.locator('#foia-agency').fill('Fictional City Records Office');
 await page.locator('#foia-description').fill('Fictional policy records for testing only');
 await page.locator('#foia-form button[type=submit]').click();
 await page.locator('#foias').getByText('Fictional City Records Office').waitFor();
 await page.setInputFiles('#attachment-file',{name:'example.txt',mimeType:'text/plain',buffer:Buffer.from('FICTIONAL ATTACHMENT BYTES ONLY')});
 await page.locator('#attachments').getByText('example.txt').waitFor();
 const pending = page.waitForEvent('download'); await page.locator('#export').click();
 const downloaded=await pending;const backup=await readFile(await downloaded.path());
 assert(backup.toString().includes('THE_SHIELD_CASE_PACK'));
 assert(!backup.toString().includes('Fictional Supervisor Dispute'));
 assert(!backup.toString().includes('FICTIONAL ATTACHMENT BYTES'));
 await clickAndCheck(page,'#lock','#lock-pane');
 await page.locator('#pass').fill('wrong attempt wrong attempt wrong');
 await page.locator('#open').click();
 await page.getByText('Incorrect passphrase or encrypted pack was altered.').waitFor();
 await page.locator('#pass').fill(pass);
 await clickAndCheck(page,'#open','#vault-pane');
 await page.waitForFunction(()=>document.querySelector('#case-count').textContent==='1 case(s)');
 // A second unlocked tab must not silently overwrite a first tab's update.
 const page2=await context.newPage();page2.on('pageerror',e=>errors.push(e.message));
 await page2.goto(BASE);
 await page2.locator('#pass').fill(pass);
 await clickAndCheck(page2,'#open','#vault-pane');
 await page.locator('#case-name').fill('New case written by first tab');
 await page.locator('#add-case').click();
 await page2.locator('#case-name').fill('Stale conflicting case');
 await page2.locator('#add-case').click();
 await page2.locator('#lock-pane').waitFor({state:'visible'});
 assert.match(await page2.locator('#lock-status').innerText(),/Another tab or restore changed this vault/);
 await page2.close();
 // Delete only the browser's encrypted copy and restore using authenticated backup.
 await page.locator('#lock').click();
 page.once('dialog',async dialog=>{await dialog.accept('DELETE');});
 await page.locator('#delete-local').click();
 await page.locator('#confirm-pane').waitFor({state:'visible'});
 await page.locator('#pass').fill(pass);
 await page.setInputFiles('#backup-file',{name:'backup.shieldvault',mimeType:'application/json',buffer:backup});
 await page.getByText('Verified encrypted backup restored.').waitFor();
 await page.locator('#pass').fill(pass);
 await clickAndCheck(page,'#open','#vault-pane');
 await page.waitForFunction(()=>document.querySelector('#case-count').textContent==='1 case(s)');
 // Mobile layout should not require horizontal scrolling.
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'Mobile page overflow');
 assert.deepEqual(errors,[]);
 console.log('PASS: Chromium e2e creates/edits/imports/exports, rejects wrong key and stale-tab overwrite, restores backup, checks mobile layout');
} finally {
 if(browser)await browser.close();
 server.kill('SIGTERM');
}
