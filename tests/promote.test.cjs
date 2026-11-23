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

test("Police, Fire and EMS previews are visible with direct track links", () => {
  const html = load("promote.html");
  for (const track of ["police", "fire", "ems"]) {
    assert.match(html, new RegExp('data-track="' + track + '"'));
    assert.match(html, new RegExp('promote\\.html\\?track=' + track + '#demo'));
  }
  for (const id of ["track-title", "track-intro", "scene-designator", "scene-tag",
                    "scene-caption", "scene-summary", "scenario-rationale"]) {
    assert.ok(html.includes('id="' + id + '"'), "missing track UI " + id);
  }
  assert.match(html, /not a validated promotional test|not validated for selection|not validated for employment|not validated for actual personnel/i);
});
test("Every assessment has scenario stages, non-scored reviews and illustrative assessor dimensions", () => {
  const source = load("promote.js");
  for (const title of ["Police Sergeant", "Fire Company Officer", "EMS Field Supervisor"]) {
    assert.ok(source.includes(title), "missing assessment " + title);
  }
  for (const dimension of ["Fireground size-up", "Clinical oversight", "Resource allocation"]) {
    assert.ok(source.includes(dimension), "missing competency dimension " + dimension);
  }
  assert.match(source, /consequences\[picks\[index - 1\]\]/);
  assert.match(source, /Your reasoning:/);
  assert.match(source, /no numerical score/i);
  assert.doesNotMatch(source, /speechRecognition|face-api|sentiment|aiRank|finalScore|passFail/);
});
