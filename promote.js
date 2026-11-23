"use strict";
/*
 * SHIELD PROMOTE public proof-of-concept.
 * No score, ranking, candidate account, persistence, telemetry or network calls.
 * This is a developmental exercise, NOT an employment selection instrument.
 */
(() => {
  const stages = [
    {
      title: "Two incidents, one acting sergeant",
      story: "23:47. You arrive after a contentious arrest. One officer is asking you to review possible excessive force. Dispatch reports another high-priority call with limited supervisory coverage. Both situations may require immediate action. What do you do first, and what information do you need?",
      options: [
        "Stabilize both incidents through the available command structure, check immediate safety and medical needs, and identify who can preserve time-sensitive evidence.",
        "Personally attend the second call while directing a designated qualified person to secure the arrest scene, evidence and required notifications.",
        "Remain at the arrest, arrange a clear relief and response plan for the second call, and establish the immediate facts needed for appropriate escalation."
      ],
      dimension: "Resource prioritization and situational judgment",
      notes: "An assessor would examine how the candidate establishes urgency, allocates available resources, maintains command accountability, identifies immediate medical needs and explains the tradeoffs. No single action can be graded fairly without relevant staffing and policy facts."
    },
    {
      title: "A potential policy violation",
      story: "A newer officer tells you that force may have continued after the subject was controlled. The veteran involved denies wrongdoing. Body-camera footage is not yet reviewed. A ranking supervisor has not arrived. What is your immediate supervisory approach?",
      options: [
        "Address safety and medical needs, protect evidence, obtain independent initial accounts as allowed by policy and make the required notifications without prejudging the incident.",
        "Secure scene continuity and send immediate notifications, while assigning an uninvolved supervisor or investigator to conduct the required independent fact-gathering.",
        "Escalate through the department's formal critical-incident protocol, document urgent preservation directions and separate operational supervision from any investigation as required."
      ],
      dimension: "Integrity, evidence preservation and procedural fairness",
      notes: "A trained assessor would evaluate whether the candidate recognizes relevant policy thresholds, prevents contamination of accounts, preserves relevant footage and records, respects representation and due-process rights, and follows applicable investigative procedures."
    },
    {
      title: "Pressure from command",
      story: "The incident is attracting public attention. A command officer asks for an immediate status update, and another supervisor wants to release a short statement. You have incomplete information and must hand off portions of the incident. What is your response?",
      options: [
        "Give command a time-stamped summary separating confirmed facts from unknowns, recommend approved public-information channels and document the handoff.",
        "Prepare a concise incident briefing with outstanding investigative needs and route public communication through the agency's designated authority.",
        "Coordinate a documented transfer of command, confirm the evidence and notification status, and advise what can be accurately disclosed at this stage."
      ],
      dimension: "Communication, leadership and accountability",
      notes: "A trained assessor would consider accuracy, public trust, confidentiality, handoff quality and adherence to agency communications policy. Justification matters; these sample options are not validated or ordered by correctness."
    }
  ];
  const el = (id) => document.getElementById(id);
  const title = el("scenario-title"), story = el("scenario-story");
  const options = el("scenario-options"), note = el("scenario-reason");
  const next = el("scenario-next"), reset = el("scenario-reset");
  const progress = el("progress-fill"), step = el("scenario-step");
  if (![title,story,options,note,next,reset,progress,step].every(Boolean)) return;
  let index = 0;
  let picks = [];
  let selection = -1;
  function render() {
    const stage = stages[index];
    title.textContent = stage.title;
    story.textContent = stage.story;
    step.textContent = "Decision " + (index + 1) + " of " + stages.length;
    progress.style.width = ((index + 1) / stages.length * 100) + "%";
    note.hidden = true;
    note.textContent = "";
    next.textContent = index === stages.length - 1 ? "Review your decisions" : "Continue";
    next.disabled = true;
    options.replaceChildren();
    selection = -1;
    stage.options.forEach((response, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-btn";
      button.textContent = String.fromCharCode(65 + i) + " · " + response;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        selection = i;
        options.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
        note.hidden = false;
        note.textContent = "Response recorded in this browser session only. Continue without seeing a score; in a real assessment, trained assessors would also review your reasoning.";
        next.disabled = false;
      });
      options.appendChild(button);
    });
  }
  function summary() {
    title.textContent = "Your decision review";
    story.textContent = "These are your three selected actions. There is no numerical score or pass/fail. A defensible promotional assessment would also collect explanations, evaluate equivalent forms and use trained assessors applying validated, job-related behavior anchors.";
    step.textContent = "Sample exercise complete";
    progress.style.width = "100%";
    options.replaceChildren();
    stages.forEach((stage, i) => {
      const card = document.createElement("div");
      card.className = "promote-review-card";
      const heading = document.createElement("strong");
      heading.textContent = (i + 1) + ". " + stage.dimension;
      const choice = document.createElement("p");
      choice.textContent = "Your selection: " + stage.options[picks[i]];
      const review = document.createElement("p");
      review.textContent = "Illustrative assessor considerations: " + stage.notes;
      card.append(heading, choice, review);
      options.appendChild(card);
    });
    note.hidden = false;
    note.textContent = "Reflection: Which additional facts, agency policies, or available resources could change your decisions? Real candidate-specific material must not be entered into this public demonstration.";
    next.disabled = true;
    next.hidden = true;
    reset.textContent = "Try again";
  }
  next.addEventListener("click", () => {
    if (selection < 0) return;
    picks.push(selection);
    index += 1;
    if (index < stages.length) render();
    else summary();
  });
  reset.addEventListener("click", () => {
    index = 0; picks = []; selection = -1;
    next.hidden = false;
    reset.textContent = "Restart";
    render();
  });
  render();
})();