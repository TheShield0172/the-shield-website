'use strict';
/* THE SHIELD FOIA Next Steps — deterministic Michigan educational guide.
 * No user text, no AI service, no network calls, no tracking.
 * All links go to public primary-source guidance.
 */
(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ShieldGuide = api;
})(typeof globalThis === 'object' ? globalThis : this, function() {
  const sources = Object.freeze({
    request:{label:'MCL 15.233 — Request requirements',url:'https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-15-233'},
    response:{label:'MCL 15.235 — Responses and denials',url:'https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-15-235'},
    deny:{label:'MCL 15.240 — Disclosure appeals and judicial review',url:'https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-15-240'},
    fee:{label:'MCL 15.240a — Excessive fee review',url:'https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-15-240a'},
    costs:{label:'MCL 15.234 — Fee calculation',url:'https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-15-234'},
    separation:{label:'MCL 15.244 — Nonexempt records and redactions',url:'https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-15-244'},
    ag:{label:'Michigan Attorney General FOIA information',url:'https://www.michigan.gov/ag/resources/foia'}
  });
  const step=(title,detail)=>({title,detail});
  const list={
    request:{
      title:'Start with a focused request', intro:'Ask a Michigan public body for identifiable existing records. You do not have to explain why you want them.',
      steps:[
        step('Identify existing records','Describe the documents, communications, date ranges, custodians or systems clearly enough for the public body to find the records. A FOIA request generally cannot require an agency to create a new report.'),
        step('Use the right recipient','Find the public body’s FOIA coordinator and published procedures. Include your complete name, mailing address and a valid email or phone number unless a statutory exception applies.'),
        step('Request a usable format','Specify electronic copies or inspection when appropriate. Keep a copy of what you send and your proof of transmission.'),
        step('Track lawful receipt and the response','Most initial responses are due within five business days after legal receipt, with one extension of no more than ten business days. Electronic delivery has special receipt rules.')
      ],warning:'No automatic filing or deadline calculation. Check the actual agency procedures and current law.',sources:['request','response','ag'],draft:'request'
    },
    denial:{
      title:'Review the disclosure denial',intro:'A written denial or partial denial may be appealed to the head of the public body or challenged in court, subject to the statute.',
      steps:[
        step('Save the original decision','Keep the complete request, delivery proof, all response letters, stated exemptions, and dates. Identify exactly what was withheld.'),
        step('Check the grounds','Compare each stated reason with the statute and ask whether nonexempt portions can be separated. The fact of a denial alone does not prove it was unlawful.'),
        step('Prepare a specific appeal','A Michigan administrative disclosure appeal must specifically state the word “appeal” and explain the reasons for reversing the denial. Address it to the head of the public body under its procedures.'),
        step('Protect possible court deadlines','MCL 15.240 describes a 180-day period tied to the final denial for a court action. An administrative appeal and the type of public body can affect the route. Obtain legal advice promptly rather than relying on this tool to calculate a date.')
      ],warning:'The head generally has ten business days after receiving a written appeal to act, with a possible one-time extension of up to ten business days. Boards/commissions have special receipt rules.',sources:['response','deny','separation'],draft:'denial'
    },
    fee:{
      title:'Challenge a questionable FOIA fee',intro:'Michigan provides different routes for reviewing fees than for appealing disclosure denials.',
      steps:[
        step('Get the detailed itemization','Compare the fee notice, the public body’s published procedures, and MCL 15.234. Identify the particular cost components you dispute.'),
        step('Confirm the appeal procedure','Check whether this public body provides an administrative fee appeal to its head. Michigan makes that route conditional on its published procedures.'),
        step('Explain the disputed calculation','If an administrative fee appeal is provided, it must use the word “appeal” and identify how the fee exceeds the agency procedures or MCL 15.234.'),
        step('Do not miss the court route','MCL 15.240a includes a 45-day window for a fee-reduction court action following the relevant fee notice or appeal determination, subject to statutory prerequisites. A lawyer should check the dates.')
      ],warning:'A letter asking for clarification may NOT count as a statutory fee appeal and may not preserve court deadlines.',sources:['costs','fee'],draft:'fee'
    },
    overdue:{
      title:'Check whether a FOIA response is late',intro:'Legal receipt, electronic submission, extensions and the exact request language matter.',
      steps:[
        step('Establish legal receipt','Gather your original request, recipient, email submission evidence, and any agency acknowledgement. Under MCL 15.235, electronic requests have special receipt rules, including spam-folder situations.'),
        step('Check extensions','Michigan generally requires an initial response within five business days after legal receipt and permits one notice extending the period by no more than ten business days.'),
        step('Request status without conceding rights','Send a dated follow-up asking for the legal receipt date, the extension notice if any, and the response status. Do not assume following up restarts a deadline.'),
        step('Escalate carefully','Under MCL 15.235(3), failure to respond can constitute a final denial in specified circumstances. It is not safe to assume every late response automatically satisfies those conditions. Consider prompt legal review.')
      ],warning:'No business-day calculator is used here; holidays, board meeting schedules, receipt rules and case facts can change the analysis.',sources:['response','deny','ag'],draft:'followup'
    },
    partial:{
      title:'Address records that were withheld or omitted',intro:'First distinguish an actual partial denial from a response stating that no additional responsive records exist.',
      steps:[
        step('Compare request against response','Make a record-by-record list of what you requested, what arrived, and what the response says was withheld or not found.'),
        step('Identify stated reasons','A written partial denial should explain the basis for withheld materials; MCL 15.244 addresses separable nonexempt information.'),
        step('Use the correct challenge','If all or part was formally denied, a written disclosure appeal can identify the reasons for reversal. A claim that records do not exist may require a different factual explanation.'),
        step('Preserve the full timeline','Keep proof of dates and communication and check the statutory avenues and possible judicial-review deadline before choosing a strategy.')
      ],warning:'A missing document is not by itself proof the public body possesses it or violated the law. Seek independent advice for disputed facts.',sources:['request','response','deny','separation'],draft:'denial'
    }
  };
  const shared=[
    'Original FOIA request and any attachment',
    'Proof of delivery and the agency’s acknowledgement',
    'Full response, denial or fee calculation',
    'Dates and names of relevant correspondence',
    'Public body FOIA procedures and any exemption or fee citations',
    'A copy of the final letter you actually submit'
  ];
  function guidance(issue, feeRoute='unknown') {
    if (!Object.prototype.hasOwnProperty.call(list,issue)) throw Error('Unsupported Michigan FOIA situation.');
    if (!['unknown','yes','no'].includes(feeRoute)) throw Error('Unsupported fee procedure selection.');
    const base=list[issue],steps=base.steps.slice();
    let extra='';
    let draft=base.draft;
    if(issue==='fee'){
      if(feeRoute==='yes') extra='The public body’s published procedures offer a fee appeal. THE SHIELD’s draft builder can prepare an administrative fee appeal; verify its wording and delivery method first.';
      if(feeRoute==='no'){extra='The public body’s published procedures do not offer a head-of-body fee appeal. Do not label a clarification request as an available administrative appeal. The statute provides a conditional court route with a short deadline.';draft='fee';}
      if(feeRoute==='unknown')extra='Before sending a statutory fee appeal, locate the public body’s written procedures to confirm whether this route exists. The draft builder defaults to a clarification request unless you confirm that it does.';
    }
    return Object.freeze({
      title:base.title,intro:base.intro,steps:steps.map(x=>({...x})),
      warning:base.warning,additional:extra,
      draft, sourceLinks:base.sources.map(key=>sources[key]),
      checklist:shared.slice()
    });
  }
  return Object.freeze({guidance,sources});
});
