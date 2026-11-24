"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const admin=fs.readFileSync("promote-admin.js","utf8"),candidate=fs.readFileSync("promote.js","utf8"),html=fs.readFileSync("promote-admin.html","utf8");
test("connected dashboard scripts parse and workspace is available",()=>{new vm.Script(admin);new vm.Script(candidate);assert.match(html,/id="workspace"/);assert.match(html,/frame-src 'self'/);});
test("completion is constrained to selected same-origin frame and track",()=>{assert.match(admin,/event.origin!==window.location.origin/);assert.match(admin,/event.source!==frame.contentWindow/);assert.match(admin,/d.track!==selected.track/);assert.match(candidate,/window.parent.postMessage/);assert.doesNotMatch(admin,/Simulate:/);});
test("fictional review uses SHA-256 and no persistent storage",()=>{assert.match(admin,/crypto.subtle.digest\("SHA-256"/);assert.doesNotMatch(admin,/localStorage|sessionStorage|indexedDB|fetch\(/);assert.match(admin,/window.print/);});
