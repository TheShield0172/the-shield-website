"use strict";
/*
 * SHIELD PROMOTE public proof-of-concept.
 * No score, ranking, candidate account, persistence, telemetry or network calls.
 * This is a developmental exercise, NOT an employment selection instrument.
 * Use fictional inputs only. Clinical and emergency response decisions are
 * illustrative supervisory prompts, never field directions or treatment orders.
 */
(() => {
  const tracks = {
    police: {
      label: "Police Sergeant",
      intro: "You are an acting patrol sergeant. Evaluate competing legal, personnel and operational responsibilities across a fictional night shift.",
      scene: "SCENE 001 / INTERNAL REVIEW",
      tag: "SHIFT COMMAND",
      caption: "Two urgent calls. One difficult question.",
      summary: "Night shift • Competing supervisory obligations",
      stages: [
        {
          title: "Two incidents, one acting sergeant",
          story: "23:47. After a contentious arrest, one officer raises a concern about possible excessive force. Dispatch reports another high-priority call with no other supervisor immediately available. The subject's medical status, the second call's threat level and the availability of relief are not yet confirmed. What do you prioritize and how do you communicate it?",
          options: [
            "Clarify immediate threats and medical needs at both scenes, assign qualified coverage if available, and initiate evidence preservation and required command notifications.",
            "Respond personally to the second call after assigning a designated supervisor or qualified unit to preserve the arrest scene and coordinate urgent care.",
            "Remain at the arrest until its immediate risks are stabilized while seeking the nearest command relief and confirming who is responsible for the other incident."
          ],
          dimension: "Situational judgment and resource allocation",
          notes: "Review the candidate's treatment of unknown risks, triage rationale, coverage, preservation and supervisory accountability; no single path is sufficient without agency facts.",
          consequences: [
            "Dispatch confirms the second incident involves a reported weapon. The arrest subject asks for medical care. Your assignments now require explicit confirmation.",
            "Your relief officer reports they are newly trained and uncertain what evidence to secure. The arrest subject requests care.",
            "The second scene now has conflicting radio reports. You must verify coverage while preserving the arrest investigation."
          ]
        },
        {
          "title": "Staffing conflict after the first call",
          "followUpByPriorChoice": ["Your earlier approach prioritized broad triage; command now asks which qualified person owns each scene and how you will confirm assignments.","You previously delegated arrest-scene preservation; the assigned officer reports uncertainty about the required handoff.","You previously remained at the arrest; dispatch asks who is responsible for confirming the second call's immediate safety."],
          "followUpOptionsByPriorChoice": [["Assign named qualified owners to both incidents and require explicit acknowledgments, accepting verification time.","Prioritize immediate caller-safety verification while a designated custodian maintains evidence security.","Recommend a specific coverage plan to command and document any gap before relief arrives."],["Pause the handoff until a qualified custodian confirms the evidence inventory, arranging another response.","Transfer custody with an itemized acknowledgment and send relief to the new call.","Request staffing while personally verifying the disputed custody handoff and arranging caller-safety checks."],["Confirm who is handling the new call, then transfer arrest-scene duties to qualified relief.","Remain at the arrest and request mutual aid for the new call, documenting the delay.","Seek an immediate command decision while maintaining explicit scene ownership and dispatch updates."]],
          "followUpConsequencesByPriorChoice": [["Both assignments are acknowledged, but dispatch reports a possible delay.","The caller disconnects before the safety check finishes.","Command asks you to implement your recommended plan before relief arrives."],["An inventory discrepancy is documented while a second unit handles the caller.","The receiving custodian flags an item for reconciliation.","Staffing is unavailable and command requests an interim plan."],["Relief asks which arrest-scene tasks remain unresolved.","Mutual aid reports an extended response time.","Dispatch confirms a new threat requiring reassessment."]],
          "story": "00:21. Dispatch reports a domestic disturbance while your relief officer is securing evidence at the arrest. The caller's safety is unknown and no investigator has arrived. How do you manage the competing duties?",
          "options": [
            "Keep relief on evidence preservation while requesting outside assistance, accepting a possible delay to the new call.",
            "Transfer preservation responsibility to a qualified custodian and reassign relief to the new call, documenting the coverage and evidence risks.",
            "Escalate the coverage conflict to command, arrange immediate caller-safety checks, and revise assignments when risk is confirmed."
          ],
          "dimension": "Dynamic staffing and accountability",
          "notes": "Examine explicit tradeoffs, duty transfers, urgency, uncertainty and the reasoning behind delayed or reassigned coverage.",
          "consequences": [
            "The caller disconnects before additional help arrives.",
            "The replacement custodian discovers an inventory discrepancy.",
            "Command asks for a concrete recommendation rather than a general escalation."
          ]
        },
        {
          title: "A witness describes possible misconduct",
          story: "An uninvolved officer says force may have continued after the subject was restrained. The involved officer disputes the account; BWC footage is not yet reviewed. A ranking supervisor wants preliminary facts immediately. How do you preserve a fair process while addressing the operational risks?",
          options: [
            "Document the disclosure without prejudging it, ensure medical needs and scene security, arrange evidence preservation and initiate the notifications required by policy.",
            "Use an uninvolved qualified supervisor for initial witness coordination and evidence security while maintaining operational command and following the agency's investigative separation requirements.",
            "Request an appropriate investigative response, identify immediate preservation tasks and avoid informal group questioning that could affect independent accounts."
          ],
          dimension: "Integrity, evidence handling and procedural fairness",
          notes: "Review impartiality, evidence preservation, separation of roles, affected persons' rights, applicable labor protections and whether the candidate recognizes when to elevate the inquiry.",
          consequences: [
            "Command asks whether you can confirm a violation. The available information is incomplete.",
            "An investigator asks which evidence and accounts are already independently preserved, and where operational command resides.",
            "A witness is preparing to leave; records-retention and timely witness contact require coordination under policy."
          ]
        },
        {
          title: "Command wants a public update",
          story: "A supervisor suggests making an immediate public statement. The arrest video has not been reviewed; the second call is still developing. Your shift is transitioning and you must brief the incoming commander. What information do you communicate and what do you withhold?",
          options: [
            "Provide confirmed and unconfirmed information separately, explain outstanding safety and evidence issues, and refer public messaging to designated agency personnel.",
            "Prepare a documented command handoff including command assignments, preservation status, notifications and unresolved leads, with communications routed through policy.",
            "Give an operational update with a clear factual timeline, identify contradictory reports and recommend postponing unverified claims pending authorized review."
          ],
          dimension: "Command communication, judgment and accountability",
          notes: "Review candor, handoff quality, limits on disclosure, time-sensitive tasks and the reasoned distinction between facts and speculation.",
          consequences: ["The incident moves to formal review.", "A documented handoff is completed.", "The event remains under investigation."]
        },
        {
          "title": "Supervisory coaching after the incident",
          "story": "01:05. An officer who was not involved says the shift is blaming the reporting witness. The officer asks you to address the team before morning briefing. An investigator cautions that witness accounts must remain independent. How do you lead without contaminating the inquiry?",
          "options": [
            "Hold a short standards-focused briefing without discussing allegations, while documenting and referring possible retaliation concerns.",
            "Meet privately with the reporting officer first, accepting a delay in addressing team rumors while confirming appropriate support and protection.",
            "Ask command and investigators to coordinate an immediate communication plan, accepting a slower response to the shift's concerns."
          ],
          "dimension": "Coaching, impartiality and organizational trust",
          "notes": "Consider anti-retaliation safeguards, confidentiality, non-prejudgment, team leadership and timeliness.",
          "consequences": [
            "The shift requests clearer behavioral expectations.",
            "A witness reports feeling isolated.",
            "Command requests a documented plan for supervisor follow-up."
          ]
        },
        {
          "title": "Shift handoff under contradictory reports",
          "story": "06:42. The incoming supervisor finds two contradictory dispatch timestamps, a pending witness interview and an unresolved unit-coverage request. Your shift ends in ten minutes. Which responsibility do you personally retain, and what do you delegate?",
          "options": [
            "Remain to reconcile the timestamps before handing off, accepting a delayed shift transition and possible loss of timely witness contact.",
            "Transfer the verified timeline and unresolved discrepancies to incoming command, explicitly assign the witness and coverage follow-ups, and remain available for clarification.",
            "Prioritize the time-sensitive witness contact while assigning the timeline reconciliation to an uninvolved qualified supervisor, documenting the split responsibilities."
          ],
          "dimension": "Handoff, prioritization and accountability",
          "notes": "Review assignment ownership, facts versus uncertainty, time-sensitive tasks and quality of the transition.",
          "consequences": [
            "The incoming commander asks for a named owner for the witness follow-up.",
            "A new dispatch log clarifies one timestamp but not the other.",
            "The witness becomes unavailable until the following day."
          ]
        }
      ]
    },
    fire: {
      label: "Fire Company Officer",
      intro: "You are first-arriving company officer at a residential fire, balancing rescue information, crew accountability and deteriorating conditions.",
      scene: "SCENE 002 / FIREGROUND COMMAND",
      tag: "FIRST-ARRIVING COMPANY",
      caption: "A reported rescue. Limited resources.",
      summary: "Multi-unit residential building • Fireground leadership",
      stages: [
        {
          title: "A rescue report with missing information",
          story: "02:16. Your engine arrives at a three-story multi-unit residence with smoke on the second floor. A bystander reports a resident may still be upstairs, but no one has confirmed the location. The next company is several minutes away, the water supply is not established and visible conditions are changing. How do you structure the first actions?",
          options: [
            "Give an initial size-up, declare the command and accountability plan, coordinate urgent rescue information and tactical priorities within current crew and resource limitations.",
            "Establish immediate command and hazard assessment, request resources, and determine whether any proposed entry meets staffing, protective and operational requirements.",
            "Delegate a rapid exterior information-gathering and utility/hazard check, communicate the known rescue report and set clear conditions for any tactical commitment."
          ],
          dimension: "Fireground size-up and risk management",
          notes: "Evaluate the candidate's recognition of reported versus verified life risk, building hazards, staffing, accountability, resource requests and alignment with applicable procedures.",
          consequences: [
            "An occupant gives a conflicting report about the upstairs location, and smoke is pushing into a stairwell.",
            "A second occupant states someone may be inside, but a company member identifies worsening structural indicators.",
            "Dispatch adds an unverified report of a person at a rear window. Communication and accountability are now critical."
          ]
        },
        {
          "title": "Withdrawal threshold under uncertain rescue conditions",
          "followUpOptionsByPriorChoice": [
            [
              "Confirm the reported occupant location through command while setting explicit crew accountability and reassessment checkpoints.",
              "Hold the current crew at its established limit while a qualified team verifies the unconfirmed report.",
              "Request a time-bound command decision and communicate interim withdrawal triggers to all assigned crews."
            ],
            [
              "Reconcile the staged company's assignment with command before changing the conservative operating posture.",
              "Ask the incoming officer to verify personnel and communications while command reviews the uncertain rescue report.",
              "Maintain the existing perimeter and obtain a new hazard assessment before requesting a change of objective."
            ],
            [
              "Set a specific deadline for the outstanding verification and identify who can authorize a revised objective.",
              "Keep the crew within its current assignment while a second source checks the report, documenting the uncertainty.",
              "Escalate the unresolved rescue report to command and require an acknowledged interim crew-safety plan."
            ]
          ],
          "followUpConsequencesByPriorChoice": [
            [
              "The reported location remains unverified and command asks who owns the next reassessment.",
              "The verification team reports conflicting information as conditions change.",
              "A crew reports that the interim withdrawal trigger was not acknowledged by every member."
            ],
            [
              "The incoming company reports a staffing mismatch that requires a new assignment.",
              "A radio problem delays confirmation of the accountability check.",
              "The new assessment identifies a change in the operating area that command must review."
            ],
            [
              "The verification deadline passes without an agreed source of information.",
              "A second report contradicts the first and the crew requests direction.",
              "Command requests an explicit owner and deadline for the next update."
            ]
          ],
          "followUpByPriorChoice": ["Your initial size-up left the rescue report unresolved; command requests your explicit risk threshold.","You initially directed a more conservative resource posture; an incoming crew asks when the search objective may be reconsidered.","You previously sought additional verification; a crew now requests a clear decision deadline."],
          "story": "02:31. Conditions worsen near a search crew. One firefighter reports hearing a possible occupant, but the location is unconfirmed. An incoming company is staged outside. What supervisory tradeoff do you make?",
          "options": [
            "Continue the search only within explicit reassessment and withdrawal criteria, accepting continued crew exposure.",
            "Withdraw for a new exterior assessment, accepting delay in searching for a possible occupant.",
            "Pause new commitments, seek an updated crew conditions report and clarify a time-limited reassessment with command."
          ],
          "dimension": "Risk-benefit judgment and crew welfare",
          "notes": "Review recognition of uncertainty, rescue urgency, crew safety, accountability and communication. Fictional only, not field guidance.",
          "consequences": [
            "The reported voice cannot be located as conditions worsen.",
            "An occupant disputes the reported location.",
            "The crew reports a delay acknowledging the reassessment order."
          ]
        },
        {
          title: "Crew accountability under pressure",
          story: "A crew member reports intermittent radio problems. One member urges a rapid interior push to search for the reported occupant. Another identifies deteriorating conditions near the stairwell. An additional company has arrived, but the tactical plan and crew assignments are not yet fully reconciled. What is your supervisory response?",
          options: [
            "Reassess conditions, verify personnel and communications, explain a controlled plan with clear assignments and enforce the applicable entry and withdrawal criteria.",
            "Direct an immediate accountability and resource check, establish communications redundancies and adjust objectives based on the current rescue profile.",
            "Coordinate incoming crew roles with the incident commander or retain command as appropriate, clearly state hazards and confirm each team understands its limits."
          ],
          dimension: "Crew leadership, communication and accountability",
          notes: "Look for command clarity, crew integrity, a dynamic hazard reassessment and recognition of applicable incident command and personnel safety standards.",
          consequences: [
            "The stairwell conditions shift again. A neighboring unit reports possible fire extension.",
            "A crew cannot confirm receipt of its revised assignment, and a radio transmission is partially garbled.",
            "An incoming officer questions the revised objective and asks who is responsible for accountability."
          ]
        },
        {
          title: "Changing conditions and command transfer",
          story: "A chief officer arrives and requests a concise transfer-of-command briefing. A firefighter reports a possible near miss during the operation. The civilian rescue report remains unconfirmed. What do you address, and how will you protect both operational continuity and learning?",
          options: [
            "Present confirmed observations, life-safety priorities, actions taken, staffing, accountability and unresolved hazards, and flag the near miss through appropriate channels.",
            "Use a structured transfer of command with current objectives and resource assignments, noting outstanding rescue information and the need for a separate safety review.",
            "Provide a time-stamped command summary, preserve factual accounts of the near miss and direct ongoing tactical decisions through the established command system."
          ],
          dimension: "Command transition and learning culture",
          notes: "Review factual completeness, crew welfare, hazard reporting and distinction between immediate operations and subsequent nonpunitive learning or formal investigation as required.",
          consequences: ["Command transitions with unresolved hazards documented.", "A formal safety follow-up is assigned.", "A supervisory debrief is scheduled."]
        },
        {
          "title": "A near miss during demobilization",
          "story": "03:02. After command transfer, a firefighter privately reports an equipment problem that may have contributed to a near miss. The apparatus is scheduled for another assignment. The crew is fatigued and the incident review is not yet complete. How do you balance readiness and accountability?",
          "options": [
            "Keep the apparatus available with a documented limitation and seek an authorized equipment assessment, accepting reduced operational flexibility.",
            "Request the affected equipment be taken out of service pending authorized inspection, and coordinate replacement coverage despite staffing strain.",
            "Elevate the safety report to command and logistics, document the risk and request an explicit service-status decision before redeployment."
          ],
          "dimension": "Safety culture, readiness and supervision",
          "notes": "Consider immediate hazard control, authority, accurate reporting, crew welfare and system coverage.",
          "consequences": [
            "A replacement apparatus is delayed.",
            "Dispatch requests the unit's availability status.",
            "A crew member asks whether reporting the near miss will affect discipline."
          ]
        },
        {
          "title": "Disputed accountability after command transfer",
          "story": "04:10. A crew member disputes the personnel accountability record from the earlier operation. The chief officer is handling another incident, and the disputed record may affect the near-miss review. What do you do before the shift ends?",
          "options": [
            "Correct the record after comparing available logs, clearly documenting uncertainty and preserving the original entry.",
            "Request an independent reconciliation with the accountability officer while keeping the original record intact and advising command of the discrepancy.",
            "Conduct a focused crew debrief to identify the missing assignment details, while protecting individual accounts for any formal review."
          ],
          "dimension": "Documentation integrity and command accountability",
          "notes": "Review record preservation, impartiality, command notification and distinction between operational correction and investigative fact-finding.",
          "consequences": [
            "A radio log conflicts with a handwritten entry.",
            "A member asks whether the discrepancy implies misconduct.",
            "The chief requests an immediate status update before the reconciliation is complete."
          ]
        }
      ]
    },
    ems: {
      label: "EMS Field Supervisor",
      intro: "You are the on-duty field supervisor managing simultaneous patient care demands, unit limitations and clinical oversight.",
      scene: "SCENE 003 / EMS OPERATIONS",
      tag: "FIELD SUPERVISION",
      caption: "Multiple patients. Competing priorities.",
      summary: "Regional EMS system • Resource and clinical oversight",
      stages: [
        {
          title: "The resource shortage",
          story: "17:28. Two ambulances are transporting and one crew is already on a high-acuity call. Dispatch reports a multi-vehicle crash with several possible patients. A neighboring service may be available, but arrival time is uncertain. What is your immediate command-and-coordination response?",
          options: [
            "Confirm scene safety and patient numbers as they become known, request appropriate mutual aid and advise dispatch of a clear escalation and resource-coverage plan.",
            "Direct an initial incident assessment within available response protocols, establish who coordinates patient triage and transport, and request additional resources based on evolving facts.",
            "Coordinate with dispatch and partner agencies to protect system coverage while assigning the most appropriate available units to immediate life threats."
          ],
          dimension: "System-level prioritization and incident coordination",
          notes: "Examine the candidate's triage of uncertainties, local MCI activation criteria, dispatch communication, mutual-aid requests and avoidance of unsupported assumptions.",
          consequences: [
            "Dispatch advises one caller now reports a person trapped, while reliable patient counts remain unavailable.",
            "The first unit reports a confusing scene perimeter and asks who is coordinating resource staging.",
            "Mutual aid asks for a patient count and transport plan you cannot yet verify."
          ]
        },
        {
          "title": "A transport decision strains system coverage",
          "followUpByPriorChoice": ["Your initial incident coordination requested mutual aid; dispatch now needs a specific contingency if aid is delayed.","You previously assigned triage coordination; the transport crew asks who can authorize reassignment.","You initially prioritized system coverage; medical direction requests your documented rationale for the next allocation."],
          "followUpOptionsByPriorChoice": [
            ["Confirm the mutual-aid delay with dispatch and establish an interim coverage threshold, preserving the current patient's handoff.", "Ask the transporting crew for an updated clinical and operational status before considering reassignment, while dispatch checks other units.", "Escalate the uncovered response area to system command with a concrete contingency and a named dispatcher to monitor new calls."],
            ["Clarify the clinical versus operational authority for any reassignment, and require a documented transfer plan before changing the transport.", "Retain the assigned transport while directing dispatch to verify the respiratory-distress report and seek the nearest appropriate response.", "Arrange a time-limited coverage plan with the receiving facility and dispatch, subject to medical-direction approval where required."],
            ["Explain the verified resource picture to medical direction and dispatch, identifying which patients and units remain unconfirmed.", "Request a system-level allocation decision while preserving continuity for the active transport and documenting response gaps.", "Assign a qualified coordinator to track diversion and mutual-aid status while you verify the new call's urgency and available coverage."]
          ],
          "followUpConsequencesByPriorChoice": [
            ["Mutual aid remains delayed and dispatch requests a deadline for revisiting coverage.", "The crew reports that a safe handoff cannot be completed immediately.", "System command requests a named owner for the uncovered district."],
            ["The transport team requests clarification on who may approve a change.", "Dispatch cannot yet verify the caller's reported acuity.", "The receiving facility advises that the proposed handoff window has changed."],
            ["Medical direction asks which facts remain uncertain.", "The transport crew asks who will update the receiving facility.", "The coordinator identifies a second uncovered response zone."]
          ],
          "story": "18:04. A hospital reports temporary diversion. The only nearby ambulance is committed to a lower-acuity transport when dispatch receives an incomplete report of respiratory distress. Mutual aid has no confirmed ETA. How do you supervise the allocation?",
          "options": [
            "Maintain the scheduled transport while requesting mutual aid, acknowledging the unknown response delay.",
            "Reconsider the existing assignment with dispatch and medical direction where appropriate, ensuring continuity and a documented handoff.",
            "Seek system command's allocation decision while arranging interim coverage and confirming the new patient's acuity."
          ],
          "dimension": "System coverage and ethical resource allocation",
          "notes": "Review acuity uncertainty, authority, continuity of care, resource tradeoffs and communication. Fictional only, not treatment guidance.",
          "consequences": [
            "Mutual aid cannot confirm an ETA.",
            "The transport crew raises a continuity-of-care concern.",
            "Dispatch asks who can authorize reassignment."
          ]
        },
        {
          title: "A crew raises a patient-safety concern",
          story: "At the crash, a paramedic privately reports that another provider may have departed from the service's clinical protocol on an earlier call. The allegation is not verified. A current patient is deteriorating, several responders are seeking assignments and medical control is available. How do you protect patients and preserve a fair review?",
          options: [
            "Address the active patient's care through authorized providers and medical direction, maintain scene coordination, and initiate the appropriate patient-safety reporting route for the separate allegation.",
            "Assign a qualified leader to operational coordination, support necessary medical-control consultation, and ensure the concern is documented without a premature finding.",
            "Separate urgent clinical supervision from the later fact-finding process, protect the involved staff's rights and follow the applicable quality-assurance escalation procedure."
          ],
          dimension: "Clinical oversight, ethics and operational supervision",
          notes: "Assess recognition of immediate patient needs, boundaries of clinical authority, medical direction, confidentiality and nonretaliatory quality improvement.",
          consequences: [
            "The provider asks whether they will be removed from duty before the allegation has been investigated.",
            "The receiving hospital requests an accurate handoff, while staff ask how the incident should be documented.",
            "The crew seeks clarification about which details can be shared outside the protected review process."
          ]
        },
        {
          title: "Briefing after a difficult response",
          story: "A hospital liaison requests a summary; a patient's family has unanswered questions; an operations manager wants to know why mutual aid was delayed. You have incomplete information and a potential quality-review concern. What is your leadership response?",
          options: [
            "Provide an authorized factual operational timeline and clear outstanding uncertainties, protect patient privacy and route clinical and quality-review details through approved processes.",
            "Document dispatch/resource decisions, assign follow-up for coverage and communication gaps, and ensure the appropriate supervisor handles the family-facing response.",
            "Prepare separate operational and confidential quality-review handoffs, identify system learning questions and avoid speculating about provider fault."
          ],
          dimension: "Confidentiality, systems leadership and communication",
          notes: "Review respect for patient privacy, accurate command reporting, cross-agency cooperation and a quality-improvement mindset without unsupported fault findings.",
          consequences: ["A structured operations review is initiated.", "The resource coordination plan is revisited.", "A quality-assurance follow-up is documented."]
        },
        {
          "title": "Supporting a crew after a difficult call",
          "story": "19:12. A crew reports fatigue and concern about an earlier clinical decision. The service is short staffed and a manager asks that the unit return immediately to service. No current patient is assigned. How do you handle welfare, coverage and quality review?",
          "options": [
            "Request a brief relief period and arrange temporary coverage, documenting the operational gap and referral route for the clinical concern.",
            "Return the unit to service with a clear escalation pathway if fatigue impairs readiness, accepting the risk of reduced recovery time.",
            "Seek an immediate supervisory readiness determination and alternative coverage options, separating crew support from confidential quality review."
          ],
          "dimension": "Staff welfare, operational readiness and accountability",
          "notes": "Consider staff safety, medical-direction boundaries, continuity of service, confidentiality and nonretaliation.",
          "consequences": [
            "Coverage remains tight while relief is arranged.",
            "A crew member questions whether they can safely continue.",
            "Management requests a written readiness rationale."
          ]
        },
        {
          "title": "Contradictory records at shift change",
          "story": "20:15. Dispatch's transport timeline conflicts with a unit status entry. A hospital liaison wants an explanation for delayed arrival, and a confidential clinical review remains pending. How do you structure the handoff?",
          "options": [
            "Give the incoming supervisor a verified operational timeline and explicitly flag unresolved timestamps, while separating confidential review information.",
            "Ask dispatch to reconcile the records before responding to the hospital, accepting a delayed explanation and documenting the request.",
            "Assign a qualified operations reviewer to the timeline discrepancy and provide only authorized confirmed information to the liaison."
          ],
          "dimension": "Documentation, privacy and shift accountability",
          "notes": "Review separation of operational and confidential information, evidence quality, ownership and timely communication.",
          "consequences": [
            "The incoming supervisor requests a deadline for reconciliation.",
            "Dispatch cannot verify one of the timestamps.",
            "The liaison asks whether a named clinician caused the delay."
          ]
        }
      ]
    }
  };

  // Public-only fictional samples; never import private assessment material.
  const rankSamples = [
["fire-engineer","Fire Engineer","fire","A recurring apparatus inspection discrepancy requires documented review.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
["fire-captain","Fire Captain","fire","Company training and staffing commitments conflict.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
["fire-division-chief","Fire Division Chief","fire","Two districts request the same reserve resources.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
["fire-deputy-chief","Fire Deputy Chief","fire","Multiple divisions face competing continuity priorities.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
["ems-fto","EMS FTO","ems","A trainee repeatedly omits handoff documentation.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
["ems-lieutenant","EMS Lieutenant","ems","Two crews request relief while coverage is limited.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
["ems-captain","EMS Captain","ems","Several teams have overdue competency reviews.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
["ems-deputy-chief","EMS Deputy Chief","ems","Clinical oversight and operations disagree on implementation timing.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
["ems-director","EMS Director","ems","The governing board requests a regional service strategy.","Verify the facts and coordinate a documented response.","Seek authorized review while maintaining safeguards.","Present alternatives and identify follow-up responsibility."],
    ["police-corporal","Police Corporal","police","A new officer repeatedly omits required report details while calls are waiting.","Coach the officer and arrange a documented follow-up.","Arrange immediate peer assistance and review the next report.","Notify the supervisor and propose a focused remediation plan."],
    ["police-lieutenant","Police Lieutenant","police","Two shift supervisors disagree about staffing and an unresolved complaint requires independent review.","Reallocate coverage and designate an independent reviewer.","Request temporary support while establishing review deadlines.","Convene supervisors to resolve coverage and preserve complaint records."],
    ["police-captain","Police Captain","police","Overtime is rising while complaint response times and training completion deteriorate.","Review workload and establish measurable corrective priorities.","Pilot a staffing adjustment with defined safeguards.","Request a cross-unit review and interim service standards."],
    ["police-commander","Police Commander","police","Multiple divisions report inconsistent implementation of a new department policy.","Establish common implementation measures and division accountability.","Commission a focused compliance review with interim guidance.","Convene division leads and set a phased implementation schedule."],
    ["police-deputy-chief","Deputy Chief","police","A major service disruption exposes conflicting division priorities and uncertain public information.","Coordinate division continuity plans and verified public updates.","Assign an independent review lead and establish executive checkpoints.","Seek mutual support while documenting resource and communication decisions."],
    ["police-chief","Chief of Police","police","City leadership requests immediate budget reductions while community confidence and service capacity are under pressure.","Present transparent service tradeoffs and protected core functions.","Propose phased reductions with public performance measures.","Request a joint budget review and publish decision criteria."],
    ["fire-lieutenant","Fire Lieutenant","fire","A crew member reports a recurring equipment inspection omission before a scheduled drill.","Verify readiness and coach the assigned crew member.","Arrange a replacement check and document the discrepancy.","Notify command and establish a corrective inspection plan."],
    ["fire-battalion-chief","Fire Battalion Chief","fire","Two stations face simultaneous staffing shortages and an apparatus is unavailable.","Coordinate temporary coverage and notify command.","Request mutual support and reassess station availability.","Prioritize coverage gaps and establish a documented contingency."],
    ["fire-chief","Fire Chief","fire","A proposed station closure creates competing fiscal, response coverage and community concerns.","Present a transparent coverage and budget analysis.","Commission a service impact review and consult stakeholders.","Propose phased alternatives with measurable response safeguards."],
    ["ems-manager","EMS Operations Manager","ems","Repeated hospital delays are reducing available ambulance coverage across districts.","Coordinate with hospitals and establish escalation thresholds.","Review deployment patterns and arrange temporary coverage.","Convene clinical and operations leads to address system delays."],
    ["ems-chief","EMS Chief","ems","A funding reduction threatens clinical education and geographic service coverage.","Present clinical and coverage risks with budget alternatives.","Develop phased changes with quality monitoring.","Seek partner support and establish transparent service priorities."]
  ];
  for(const [id,label,base,story,...choices] of rankSamples){
    const source=tracks[base];
    tracks[id]={...source,label,intro:"A short fictional leadership sample for "+label+".",caption:label+" leadership rehearsal",summary:story,stages:[{title:"Leadership decision",story,options:choices,dimension:"Role-specific judgment and accountability",notes:"Consider authority, evidence, communication, proportionality and follow-up.",consequences:["A stakeholder requests a documented rationale.","A colleague identifies an unresolved constraint.","Leadership requests a follow-up deadline."]},{title:"Follow-through",story:"New information challenges your initial assumptions. How will you verify the impact of your decision?",options:["Review available records and establish a measurable follow-up.","Seek independent input and document remaining uncertainty.","Reassess the decision with affected stakeholders and communicate changes."],dimension:"Verification and adaptive leadership",notes:"Consider evidence quality, ownership and corrective action.",consequences:["A review identifies a missing record.","A stakeholder requests clarification.","A follow-up meeting is scheduled."]}]};
  }
  const rankGroup=document.querySelector(".track-switch");
  if(rankGroup){
    const groups=[
      ["Police",["police-corporal","police","police-lieutenant","police-captain","police-commander","police-deputy-chief","police-chief"]],
      ["Fire",["fire-engineer","fire-lieutenant","fire","fire-captain","fire-battalion-chief","fire-division-chief","fire-deputy-chief","fire-chief"]],
      ["EMS",["ems-fto","ems","ems-lieutenant","ems-captain","ems-manager","ems-deputy-chief","ems-director","ems-chief"]]
    ];
    rankGroup.replaceChildren();
    Object.assign(rankGroup.style,{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:"16px",alignItems:"start"});
    for(const [name,ids] of groups){
      const section=document.createElement("section");
      section.setAttribute("aria-label",name+" ranks");
      Object.assign(section.style,{display:"grid",gap:"8px",padding:"14px",border:"1px solid currentColor",borderRadius:"12px",minWidth:"0"});
      const heading=document.createElement("h3");heading.textContent=name;heading.style.margin="0 0 6px";section.appendChild(heading);
      for(const id of ids){
        if(!tracks[id])continue;
        const b=document.createElement("button");b.type="button";b.className="track-choice";b.dataset.track=id;b.textContent=tracks[id].label;b.setAttribute("aria-pressed","false");
        Object.assign(b.style,{width:"100%",whiteSpace:"normal",textAlign:"left"});section.appendChild(b);
      }
      rankGroup.appendChild(section);
    }
  }
  const el = id => document.getElementById(id);
  const title = el("scenario-title"), story = el("scenario-story");
  const options = el("scenario-options"), note = el("scenario-reason");
  const next = el("scenario-next"), reset = el("scenario-reset");
  const progress = el("progress-fill"), step = el("scenario-step");
  const rationale = el("scenario-rationale");
  const buttons = Array.from(document.querySelectorAll(".track-choice"));
  if (![title, story, options, note, next, reset, progress, step, rationale,
         el("track-title"), el("track-intro"), el("scene-designator"),
         el("scene-tag"), el("scene-caption"), el("scene-summary")].every(Boolean)) return;

  let trackId = "police", index = 0, selection = -1;
  let picks = [], reasons = [];
  const current = () => tracks[trackId];
  const stageOptions = (stage, prior) => stage.followUpOptionsByPriorChoice?.[prior] || stage.options;
  const stageConsequences = (stage, prior) => stage.followUpConsequencesByPriorChoice?.[prior] || stage.consequences;

  function updateHero() {
    const track = current();
    el("track-title").textContent = track.label + " assessment";
    el("track-intro").textContent = track.intro + " The sample is unscored and its choices have not been validated for selection.";
    el("scene-designator").textContent = track.scene;
    el("scene-tag").textContent = track.tag;
    el("scene-caption").textContent = track.caption;
    el("scene-summary").textContent = track.summary;
    el("program-name").textContent = track.label.toUpperCase();
    document.body.dataset.assessmentTrack = trackId;
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.track === trackId)));
  }

  function render() {
    const stage = current().stages[index];
    title.textContent = stage.title;
    // Move keyboard/screen-reader focus to the newly presented decision.
    title.setAttribute("tabindex", "-1");
    // Keep a short fictional decision trail so earlier choices still matter later.
    // The same core question remains for every participant; no scoring or persistence.
    const trailStart = Math.max(0, index - 2);
    const trail = current().stages.slice(trailStart, index).map((prior, offset) => {
      const priorIndex = trailStart + offset;
      return "Earlier development " + (priorIndex + 1) + ": " + stageConsequences(prior, picks[priorIndex - 1])[picks[priorIndex]];
    });
    // Only the next decision gets a choice-specific supervisory complication.
    // The common decision and its options remain the same for every path.
    const conditional = index > 0 && stage.followUpByPriorChoice
      ? stage.followUpByPriorChoice[picks[index - 1]] : "";
    story.textContent = (trail.length ? trail.join("\n") + "\n\n" : "")
      + (conditional ? "Your earlier decision changes this briefing: " + conditional + "\n\n" : "")
      + stage.story;
    step.textContent = "Decision " + (index + 1) + " of " + current().stages.length;
    const percent = Math.round((index + 1) / current().stages.length * 100);
    progress.style.width = percent + "%";
    el("scenario-progress").setAttribute("aria-valuenow", String(percent));
    el("scenario-progress").setAttribute("aria-valuetext", "Decision " + (index + 1) + " of " + current().stages.length);
    note.hidden = true;
    note.textContent = "";
    next.textContent = index === current().stages.length - 1 ? "Review your decisions" : "Continue";
    next.disabled = true;
    next.hidden = false;
    options.replaceChildren();
    rationale.hidden = false;
    rationale.value = "";
    const rationaleLabel = document.querySelector(".rationale-label");
    if (rationaleLabel) rationaleLabel.hidden = false;
    selection = -1;
    // Rotate presentation order across stages; keep canonical option IDs for branches.
    // This is presentation balancing, NOT psychometric validation or randomization.
    const availableOptions = stageOptions(stage, picks[index - 1]);
    const order = availableOptions.map((_, i) => (i + index) % availableOptions.length);
    order.forEach((optionId, i) => {
      const response = availableOptions[optionId];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-btn";
      button.textContent = String.fromCharCode(65 + i) + " · " + response;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        selection = optionId;
        options.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
        note.hidden = false;
        note.textContent = "Choice selected. Explain any assumptions or missing facts if you wish, then continue. No score is calculated.";
        next.disabled = false;
      });
      options.appendChild(button);
    });
  }

  function summary() {
    title.textContent = current().label + " — decision review";
    title.setAttribute("tabindex", "-1");
    story.textContent = "The responses below are a personal reflection only. There is no numerical score, ranking or pass/fail. A real assessment would require agency job analysis, equivalent administration and trained assessors with validated evidence-based rubrics.";
    step.textContent = "Sample exercise complete";
    progress.style.width = "100%";
    el("scenario-progress").setAttribute("aria-valuenow", "100");
    el("scenario-progress").setAttribute("aria-valuetext", "Exercise complete");
    options.replaceChildren();
    rationale.hidden = true;
    const rationaleLabel = document.querySelector(".rationale-label");
    if (rationaleLabel) rationaleLabel.hidden = true;
    current().stages.forEach((stage, i) => {
      const card = document.createElement("div");
      card.className = "promote-review-card";
      const heading = document.createElement("strong");
      heading.textContent = (i + 1) + ". " + stage.dimension;
      const choice = document.createElement("p");
      choice.textContent = "Your selection: " + stageOptions(stage, picks[i - 1])[picks[i]];
      const explanation = document.createElement("p");
      explanation.textContent = "Your reasoning: " + (reasons[i] || "Not provided");
      const review = document.createElement("p");
      review.textContent = "Illustrative trained assessor considerations: " + stage.notes;
      const outcome = document.createElement("p");
      outcome.textContent = "Fictional development: " + stageConsequences(stage, picks[i - 1])[picks[i]];
      // Preserve the actual choice-dependent briefing in the final reflection.
      // This is descriptive context, not an assessor score or recommendation.
      const conditional = i > 0 && stage.followUpByPriorChoice
        ? stage.followUpByPriorChoice[picks[i - 1]] : "";
      if (conditional) {
        const briefing = document.createElement("p");
        briefing.textContent = "Choice-dependent briefing: " + conditional;
        card.appendChild(briefing);
      }
      card.append(heading, choice, outcome, explanation, review);
      options.appendChild(card);
    });
    note.hidden = false;
    note.textContent = "These observations are illustrative, not a determination of promotion readiness. No selection recommendation has been made, and no information has been transmitted or saved.";
    next.disabled = true;
    next.hidden = true;
    reset.textContent = "Try again";
    addAssessorWorkspace();
    // Only fixed fictional choice indices cross the same-origin frame boundary.
    // Free-text reasoning and observations are deliberately excluded.
    if (window.parent !== window && new URL(window.location.href).searchParams.get("adminDemo") === "1") {
      window.parent.postMessage({type:"shield-demo-complete",track:trackId,choices:picks.slice(),decisions:current().stages.map((stage,i)=>({dimension:stage.dimension,choice:stageOptions(stage,picks[i-1])[picks[i]],outcome:stageConsequences(stage,picks[i-1])[picks[i]]}))},window.location.origin);
    }
  }

  // Fictional assessor handoff; browser memory only, never a selection decision.
  function addAssessorWorkspace() {
    const panel = document.createElement("section");
    panel.className = "promote-review-card";
    const heading = document.createElement("h3");
    heading.textContent = "Human assessor workspace — fictional rehearsal";
    const intro = document.createElement("p");
    intro.textContent = "Review the decision trail above. Record only fictional observations, not ratings or promotion recommendations. Restart clears this workspace.";
    panel.append(heading, intro);
    current().stages.forEach((stage, i) => {
      const label = document.createElement("label");
      label.textContent = "Decision " + (i + 1) + ": observable behavior, missing evidence and follow-up question";
      const field = document.createElement("textarea");
      field.id = "assessor-observation-" + i;
      field.maxLength = 700;
      field.rows = 3;
      label.setAttribute("for", field.id);
      panel.append(label, field);
    });
    const finish = document.createElement("button");
    finish.type = "button";
    finish.className = "option-btn";
    finish.textContent = "Prepare fictional review handoff";
    const output = document.createElement("div");
    output.setAttribute("role", "status");
    finish.addEventListener("click", () => {
      output.replaceChildren();
      const title = document.createElement("h4");
      title.textContent = current().label + " — fictional review handoff (unscored)";
      output.appendChild(title);
      current().stages.forEach((stage, i) => {
        const item = document.createElement("p");
        item.textContent = "Decision " + (i + 1) + " — " + (el("assessor-observation-" + i).value.trim() || "No observation recorded");
        output.appendChild(item);
      });
    });
    panel.append(finish, output);
    options.appendChild(panel);
  }

  function setTrack(id) {
    if (!Object.hasOwn(tracks, id)) id = "police";
    trackId = id; index = 0; selection = -1; picks = []; reasons = [];
    reset.textContent = "Restart";
    updateHero();
    render();
  }

  next.addEventListener("click", () => {
    if (selection < 0) return;
    picks.push(selection);
    reasons.push(rationale.value.trim().slice(0, 700));
    index += 1;
    if (index < current().stages.length) render();
    else summary();
    title.focus();
  });
  reset.addEventListener("click", () => setTrack(trackId));
  buttons.forEach(button => button.addEventListener("click", () => {
    setTrack(button.dataset.track);
    title.focus();
  }));

  // Agency setup is a local rehearsal, not a real applicant administration portal.
  const setup = document.createElement("section");
  setup.className = "promote-review-card";
  const setupHeading = document.createElement("h3");
  setupHeading.textContent = "Agency administrator — fictional session setup";
  const setupInfo = document.createElement("p");
  setupInfo.textContent = "Select a profession and rank above. Start a fresh fictional candidate session, complete the decisions, then open the human assessor handoff. No accounts, candidate identifiers or scores.";
  const launch = document.createElement("button");
  launch.type = "button";
  launch.className = "option-btn";
  launch.textContent = "Start fictional candidate session";
  launch.addEventListener("click", () => {
    setTrack(trackId);
    title.focus();
  });
  setup.append(setupHeading, setupInfo, launch);
  const switcher = document.querySelector(".track-switch");
  if (switcher && typeof switcher.after === "function") switcher.after(setup);

  const requested = new URL(window.location.href).searchParams.get("track");
  setTrack(requested || "police");
})();