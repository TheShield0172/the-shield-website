"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const load = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("PROMOTE landing page has clear concept-only selection restrictions", () => {
  const html = load("promote.html");
  assert.match(html, /PROMOTE/);
  assert.match(html, /Not validated, certified, or authorized for hiring, promotion/);
  assert.match(html, /No candidate information is collected/);
  assert.match(html, /not included in this prototype/);
  assert.match(html, /promote\.js/);
  assert.match(html, /promote\.css/);
  assert.match(html, /Content-Security-Policy/);
  assert.doesNotMatch(html, /<form\b/i);
  for (const id of ["scenario-step","scenario-title","scenario-story","scenario-options","scenario-reason","scenario-next","scenario-reset","progress-fill"]) {
    assert.ok(html.includes('id="' + id + '"'), "missing " + id);
  }
});
test("PROMOTE interactive sample is syntactically valid and does not transmit data", () => {
  const script = load("promote.js");
  new vm.Script(script, { filename: "promote.js" });
  assert.match(script, /No score, ranking, candidate account/);
  for (const forbidden of ["fetch(", "XMLHttpRequest", "localStorage", "sessionStorage", "sendBeacon", "indexedDB"]) {
    assert.ok(!script.includes(forbidden), "forbidden prototype data operation: " + forbidden);
  }
  assert.match(script, /Decision /);
  assert.match(script, /trained assessors/);
});
test("PROMOTE is discoverable from the public home page", () => {
  const html = load("index.html");
  assert.match(html, /href="promote\.html"/);
  assert.match(html, /THE SHIELD PROMOTE/);
});
