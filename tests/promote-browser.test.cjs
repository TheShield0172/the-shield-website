const {test}=require("node:test");
const assert=require("node:assert/strict");
const {chromium}=require("playwright");
const http=require("node:http"),fs=require("node:fs"),path=require("node:path");
test("real Chromium: all three fictional assessment lifecycles",async()=>{
 const server=http.createServer((req,res)=>{const name=new URL(req.url,"http://localhost").pathname.slice(1);if(!/^promote[\w.-]*$/.test(name)){res.writeHead(404);return res.end();}try{const data=fs.readFileSync(path.join(process.cwd(),name));res.setHeader("Content-Type",name.endsWith(".js")?"text/javascript":name.endsWith(".css")?"text/css":"text/html");res.end(data);}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,"127.0.0.1",r));
 let browser;
 try{
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:"+server.address().port+"/promote-admin.html");
 for(const [i,track] of ["police","fire","ems"].entries()){
 await page.locator("#track").selectOption(track);
 await page.locator("#create").click();
 const row=page.locator("#sessions article").filter({hasText:"DEMO-00"+(i+1)});
 await row.getByRole("button",{name:"Launch candidate"}).click();
 assert.equal(await page.locator("#active").innerText(),"1");
 // Reject forged completion from the parent window, even with matching origin and track.
 await page.evaluate(track=>window.postMessage({type:"shield-demo-complete",track,choices:[0],decisions:[{dimension:"Synthetic",choice:"Synthetic",outcome:"Synthetic"}]},location.origin),track);
 await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,50)));
 assert.equal(await page.locator("#active").innerText(),"1");
 assert.equal(await page.locator("#review").innerText(),"0");
 // Reject wrong-track and malformed messages from the actual candidate frame.
 await page.frameLocator("#workspace iframe").locator("body").evaluate((body,track)=>{
 const w=body.ownerDocument.defaultView;
 w.parent.postMessage({type:"shield-demo-complete",track:track==="police"?"fire":"police",choices:[0],decisions:[{dimension:"Synthetic",choice:"Synthetic",outcome:"Synthetic"}]},w.location.origin);
 w.parent.postMessage({type:"shield-demo-complete",track,choices:[99],decisions:[]},w.location.origin);
 },track);
 await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,50)));
 assert.equal(await page.locator("#active").innerText(),"1");
 assert.equal(await page.locator("#review").innerText(),"0");
 // A correct-origin, correct-track message must still contain all six nonempty decisions.
 await page.frameLocator("#workspace iframe").locator("body").evaluate((body,track)=>{
 const w=body.ownerDocument.defaultView;
 const valid={dimension:"Synthetic",choice:"Synthetic",outcome:"Synthetic"};
 for(const count of [0,1,5,7]){
 w.parent.postMessage({type:"shield-demo-complete",track,choices:Array(count).fill(0),decisions:Array(count).fill(valid)},w.location.origin);
 }
 for(const key of ["dimension","choice","outcome"]){
 const decisions=Array.from({length:6},()=>({...valid}));
 decisions[2][key]="   ";
 w.parent.postMessage({type:"shield-demo-complete",track,choices:Array(6).fill(0),decisions},w.location.origin);
 }
 },track);
 await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,100)));
 assert.equal(await page.locator("#active").innerText(),"1");
 assert.equal(await page.locator("#review").innerText(),"0");
 const frame=page.frameLocator("#workspace iframe");
 for(let n=0;n<6;n++){await frame.locator("#scenario-options button").first().click();await frame.locator("#scenario-next").click();}
 await row.getByRole("button",{name:"Open assessor review"}).waitFor();
 assert.equal(await page.locator("#review").innerText(),"1");
 await row.getByRole("button",{name:"Open assessor review"}).click();
 const fields=page.locator("#workspace select");assert.equal(await fields.count(),6);
 await page.getByRole("button",{name:"Prepare review"}).click();
 assert.equal(await page.locator("#review").innerText(),"1");
 for(let n=0;n<6;n++)await fields.nth(n).selectOption("Discuss tradeoffs");
 await page.getByRole("button",{name:"Prepare review"}).click();
 assert.equal(await page.locator("#done").innerText(),String(i+1));
 await page.getByRole("button",{name:"Generate SHA-256 report digest"}).click();
 await page.getByText(/SHA-256 \(fictional report content, not a signature\): [a-f0-9]{64}/).waitFor();
 await page.emulateMedia({media:"print"});await page.pdf();await page.emulateMedia({media:"screen"});
 }
 assert.deepEqual(errors,[]);
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
});
