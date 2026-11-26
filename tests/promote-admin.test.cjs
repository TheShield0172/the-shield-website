"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const admin=fs.readFileSync("promote-admin.js","utf8"),candidate=fs.readFileSync("promote.js","utf8"),html=fs.readFileSync("promote-admin.html","utf8");
test("connected dashboard scripts parse and workspace is available",()=>{new vm.Script(admin);new vm.Script(candidate);assert.match(html,/id="workspace"/);assert.match(html,/frame-src 'self'/);});
test("completion is constrained to selected same-origin frame and track",()=>{assert.match(admin,/event.origin!==window.location.origin/);assert.match(admin,/event.source!==frame.contentWindow/);assert.match(admin,/d.track!==selected.track/);assert.match(candidate,/window.parent.postMessage/);assert.doesNotMatch(admin,/Simulate:/);});
test("fictional review uses SHA-256 and no persistent storage",()=>{assert.match(admin,/crypto.subtle.digest\("SHA-256"/);assert.doesNotMatch(admin,/localStorage|sessionStorage|indexedDB|fetch\(/);assert.match(admin,/window.print/);});


test("fictional report print gate blocks before digest and after digest failure", async()=>{
  class Node {
    constructor(tag){this.tag=tag;this.children=[];this.textContent="";this.value="";this.events={};this.contentWindow={};}
    append(...nodes){this.children.push(...nodes);}
    appendChild(node){this.append(node);return node;}
    replaceChildren(){this.children=[];}
    addEventListener(name,fn){this.events[name]=fn;}
    focus(){}
  }
  const ids=Object.fromEntries(["total","active","review","done","sessions","filter","workspace","notice","create","track"].map(id=>[id,new Node("div")]));
  ids.track.value="police";
  const handlers={};let prints=0,fail=false;
  const window={location:{origin:"https://fictional.invalid"},addEventListener:(name,fn)=>{handlers[name]=fn;},print:()=>{prints++;}};
  const crypto={subtle:{digest:async(algorithm,bytes)=>{if(fail)throw Error("synthetic failure");return require("node:crypto").webcrypto.subtle.digest(algorithm,bytes);}}};
  vm.runInNewContext(admin,{document:{getElementById:id=>ids[id],createElement:tag=>new Node(tag)},window,crypto,TextEncoder});
  const all=node=>[node,...node.children.flatMap(all)];
  const click=(node,label)=>{const button=all(node).find(n=>n.tag==="button"&&n.textContent===label);assert.ok(button,label);return button.events.click();};
  ids.create.events.click();
  click(ids.sessions,"Launch candidate");
  const frame=all(ids.workspace).find(n=>n.tag==="iframe");
  handlers.message({origin:window.location.origin,source:frame.contentWindow,data:{type:"shield-demo-complete",track:"police",choices:Array(6).fill(0),decisions:Array.from({length:6},()=>({dimension:"Fictional dimension",choice:"Fictional choice",outcome:"Fictional outcome"}))}});
  click(ids.sessions,"Open assessor review");
  all(ids.workspace).filter(n=>n.tag==="select").forEach(n=>{n.value="Discuss assumptions";});
  click(ids.workspace,"Prepare review");
  click(ids.workspace,"Print report");
  assert.equal(prints,0);
  assert.match(ids.notice.textContent,/Generate the report digest/);
  await click(ids.workspace,"Generate SHA-256 report digest");
  assert.ok(all(ids.workspace).some(n=>/^SHA-256 .*: [a-f0-9]{64}$/.test(n.textContent)));
  click(ids.workspace,"Print report");
  assert.equal(prints,1);
  fail=true;
  await click(ids.workspace,"Generate SHA-256 report digest");
  click(ids.workspace,"Print report");
  assert.equal(prints,1);
});
