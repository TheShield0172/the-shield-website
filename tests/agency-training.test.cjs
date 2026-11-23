"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {allowedEndpoint,postInquiry}=require("../agency-training.js");
const html=fs.readFileSync("agency-training.html","utf8");
const js=fs.readFileSync("agency-training.js","utf8");
test("only owner-provided HTTPS Formspree endpoints pass",()=>{
 assert.equal(allowedEndpoint("https://formspree.io/f/mdegepdb"),true);
 assert.equal(allowedEndpoint("https://evil.example/collect"),false);
 assert.equal(allowedEndpoint("javascript:alert(1)"),false);
});
test("response failure cannot be represented as successful send",async()=>{
 await assert.rejects(postInquiry("https://formspree.io/f/mdegepdb",{},async()=>({ok:false,status:500})),/could not be delivered/);
 assert.equal(await postInquiry("https://formspree.io/f/mdegepdb",{},async()=>({ok:true,status:200})),true);
});
test("the training page forbids employment scoring and payments",()=>{
 assert.match(html,/not a validated employment-selection instrument/i);
 assert.match(html,/must not be used to hire, promote, rank/i);
 assert.match(html,/no contract, deposit/i);
 assert.doesNotMatch(html,/stripe\.com|checkout\.stripe\.com/i);
});
test("privacy, safe intake and CSP are present",()=>{
 assert.match(html,/Content-Security-Policy/);
 assert.match(html,/connect-src https:\/\/formspree\.io/);
 assert.match(html,/name="email" type="email" required/);
 assert.match(html,/contact_consent/);
 assert.match(html,/privacy\.html/);
 assert.match(js,/new FormData\(form\)/);
 assert.doesNotMatch(js,/localStorage|sendBeacon|innerHTML/);
});
