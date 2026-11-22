
(function(){
"use strict";

const authority = {
  rodriguez:{name:"Rodriguez v. United States, 575 U.S. 348 (2015)",url:"https://www.law.cornell.edu/supremecourt/text/13-9972"},
  johnson:{name:"Arizona v. Johnson, 555 U.S. 323 (2009)",url:"https://www.law.cornell.edu/supremecourt/text/07-1122"},
  bostick:{name:"Florida v. Bostick, 501 U.S. 429 (1991)",url:"https://www.law.cornell.edu/supremecourt/text/501/429"},
  schneckloth:{name:"Schneckloth v. Bustamonte, 412 U.S. 218 (1973)",url:"https://supreme.justia.com/cases/federal/us/412/218/"},
  hensley:{name:"United States v. Hensley, 469 U.S. 221 (1985)",url:"https://www.law.cornell.edu/supremecourt/text/469/221"},
  terry:{name:"Terry v. Ohio, 392 U.S. 1 (1968)",url:"https://supreme.justia.com/cases/federal/us/392/1/"},
  riley:{name:"Riley v. California, 573 U.S. 373 (2014)",url:"https://www.law.cornell.edu/supremecourt/text/13-132"}
};
const scenes = {
  stop:{
    label:"01 / THE CONTACT",shot:"windshield",radio:"Unit 17, your traffic stop is logged.",speaker:"Driver",
    dialogue:"Evening. Is something wrong, officer?",
    narrative:"11:42 PM • Light rain beads on the windshield. A dark blue sedan is stopped for a defective taillight. Assume the equipment violation provides a lawful basis for the stop. Nothing else suggests a crime. The driver offers a license and registration.",
    facts:["Taillight violation supplies the stated basis for the stop","No independent evidence of another crime"],unknown:["No reason yet to search the car or phone"],
    prompt:"How do you begin the traffic investigation?",
    options:[
      {label:"Explain the stop and diligently conduct ordinary traffic checks.",grade:"supported",result:"The driver nods. The radio crackles as you begin a routine license and registration check. The warning is being prepared.",why:"Ordinary inquiries tied to the traffic mission are permitted. A valid stop alone does not authorize an unrelated vehicle or phone search.",refs:["rodriguez"],next:"consent"},
      {label:"Demand the phone and start reviewing messages for unrelated crimes.",grade:"unsupported",result:"The driver pulls the phone back: 'You stopped me for a light.' The encounter changes sharply, and the phone request has no supplied legal basis.",why:"The facts contain no warrant, consent or recognized exception allowing access to digital contents. Even search incident to arrest generally requires a warrant for cell phone data under Riley; no arrest is assumed here.",refs:["riley","rodriguez"],next:"phoneRepair"},
      {label:"Open the car's console because an equipment stop permits a vehicle search.",grade:"unsupported",result:"The driver protests as you reach into the console. This action exceeds the identified reason for the stop.",why:"A traffic-violation seizure does not itself establish any vehicle-search exception. The facts contain no separate warrant, valid consent, probable cause or other justification.",refs:["rodriguez"],next:"carRepair"}
    ]
  },
  phoneRepair:{
    label:"02 / RECOVER OR ESCALATE",shot:"driver",radio:"Dispatch: license check remains in progress.",speaker:"Driver",
    dialogue:"I didn't give you permission to look through my phone. Please stop.",
    narrative:"The driver objects. There is still no additional factual basis for the intrusion. An officer can stop the unsupported action, but doing so does not erase what already occurred.",
    facts:["Driver expressly objects","Original traffic investigation remains incomplete"],unknown:["No independent authority to access phone data"],
    prompt:"You have a chance to change course. What do you do?",
    options:[
      {label:"Stop the unsupported search, return the phone, document the issue and resume the traffic mission.",grade:"supported",result:"The phone goes back to the driver. You return to the warning. The earlier action still requires accurate documentation and review.",why:"Ceasing an unsupported intrusion prevents continuing it but does not retroactively make the original search lawful. Departmental reporting and review procedures still apply.",refs:["riley"],next:"consent"},
      {label:"Keep searching because the phone was already in your hand.",grade:"unsupported",result:"The driver objects again. The unsupported digital search continues.",why:"Being partway through an unsupported search does not create a valid exception. No lawful basis was established in the fictional facts.",refs:["riley"],next:"endSearch"},
      {label:"Arrest the driver solely for refusing to unlock the phone.",grade:"unsupported",result:"The driver is taken into custody without a supplied arrest basis.",why:"Refusing a warrantless phone-search request is not, by itself, a supplied arrest justification in this scenario. The case does not give probable cause for a separate arrest.",refs:["bostick","riley"],next:"endSearch"}
    ]
  },
  carRepair:{
    label:"02 / CONSENT IS NOT IMPLIED",shot:"driver",radio:"Dispatch: records check pending.",speaker:"Driver",
    dialogue:"I didn't say you could search. What does my glove box have to do with the taillight?",
    narrative:"The driver objects to the entry into the vehicle. The equipment violation itself provides no new search authority.",
    facts:["Traffic stop based solely on taillight","Driver did not consent"],unknown:["No identified vehicle-search exception"],
    prompt:"What is your next move?",
    options:[
      {label:"Stop the unsupported search, acknowledge the objection, document it and continue traffic tasks.",grade:"supported",result:"You stop the search. The driver remains concerned, and the earlier conduct will be reflected in the debrief.",why:"Stopping is appropriate, but remediation does not erase the initial unsupported intrusion. Nothing in the facts authorizes further searching.",refs:["rodriguez","schneckloth"],next:"consent"},
      {label:"Search the rest of the vehicle because you are already inside.",grade:"unsupported",result:"The search expands without any identified warrant, consent or exception.",why:"Prior unauthorized access does not supply a legal basis for more searching.",refs:["rodriguez"],next:"endSearch"},
      {label:"Insist the defective taillight automatically supplies probable cause to search the entire vehicle.",grade:"unsupported",result:"The driver repeats the objection as the search continues.",why:"Probable cause concerning an equipment violation is not a blanket basis for an unrelated evidentiary search of the vehicle.",refs:["rodriguez"],next:"endSearch"}
    ]
  },
  consent:{
    label:"03 / THE REFUSAL",shot:"window",radio:"K9 is eight minutes out if requested. Traffic checks are still processing. There may also be a vehicle-theft bulletin; details not yet confirmed.",speaker:"Driver",
    dialogue:"No, I do not consent to a search. Is the warning almost done?",
    narrative:"You requested consent to search; the driver refused. The warning and ordinary traffic checks remain in progress. You have no other grounds to detain or search at this point.",
    facts:["Driver refused consent","K9 ETA: eight minutes","Traffic mission not complete"],unknown:["No independent suspicion of a separate offense"],
    prompt:"What happens while the traffic work continues?",
    options:[
      {label:"Respect the refusal, finish routine checks without delay, and move to the end of the stop.",grade:"supported",result:"You acknowledge the answer and proceed with the warning. The radio quiets, and no other report interrupts the process.",why:"The refusal does not create independent grounds for a search or extended detention. Unrelated inquiry does not necessarily invalidate an ongoing stop if it does not measurably prolong it.",refs:["johnson","bostick","schneckloth"],next:"finish"},
      {label:"Continue the traffic mission and ask dispatch to clarify an unrelated, newly mentioned vehicle bulletin without delaying work.",grade:"supported",result:"You continue preparing the warning. Dispatch says there may be a vehicle bulletin and offers details; the original traffic tasks are not paused.",why:"An unrelated inquiry can occur during otherwise diligent traffic processing if it does not measurably prolong the stop. Whether an independent investigative basis exists depends on the actual bulletin facts.",refs:["johnson","rodriguez"],next:"bulletin"},
      {label:"Stop writing the warning and hold the driver solely until K9 arrives.",grade:"unsupported",result:"Eight minutes becomes the plan. The original traffic mission is put on hold for a dog sniff without new suspicion.",why:"A dog sniff is not part of the ordinary traffic mission. Absent independent reasonable suspicion or another lawful basis, officers may not prolong the stop simply to await the dog.",refs:["rodriguez"],next:"delayRepair"}
    ]
  },
  delayRepair:{
    label:"04 / THE CLOCK",shot:"clock",radio:"Dispatch: K9 still eight minutes away. No other alerts.",speaker:"Driver",
    dialogue:"I thought you were only giving me a warning. Why am I waiting?",
    narrative:"The warning was paused to wait for a drug-detection dog. No independent suspicion has arisen. You can correct course, but the earlier delay still matters.",
    facts:["Only traffic violation documented","No new independent suspicion"],unknown:["No basis to extend solely for K9"],
    prompt:"What is the legally supportable next step?",
    options:[
      {label:"Resume the traffic task immediately; end the stop once complete.",grade:"supported",result:"You restart the warning and finish the traffic business. The unsupported pause remains part of the incident history.",why:"Resuming prevents additional off-mission delay, though it does not nullify an earlier unreasonable extension.",refs:["rodriguez"],next:"finish"},
      {label:"Continue holding the driver until the dog arrives because the pause is only eight minutes.",grade:"unsupported",result:"The dog arrives after the additional detention. No separate justification was established.",why:"Rodriguez rejects treating a short added dog-sniff delay as automatically permissible after the traffic mission should have concluded.",refs:["rodriguez"],next:"endDelay"},
      {label:"Repeat completed checks merely to occupy the time until the dog arrives.",grade:"unsupported",result:"Routine checks are repeated without a traffic purpose, extending the detention.",why:"Artificially adding time to the traffic mission to facilitate unrelated investigation does not solve a Rodriguez problem.",refs:["rodriguez"],next:"endDelay"}
    ]
  },
  finish:{
    label:"04 / TRAFFIC MISSION COMPLETE",shot:"warning",radio:"License clear. Warning finished. K9 remains eight minutes away.",speaker:"Driver",
    dialogue:"Thank you. Am I free to leave now?",
    narrative:"The driver has the completed warning and documents. There are no additional facts supporting another seizure. The only proposed reason to remain is the K9 unit's arrival.",
    facts:["All traffic tasks completed","No new independent reasonable suspicion"],unknown:["No further lawful basis for detention supplied"],
    prompt:"What action fits the facts as given?",
    options:[
      {label:"End the detention and permit the driver to leave.",grade:"supported",result:"The driver pulls away. The legal basis for the traffic seizure has ended and you do not prolong it.",why:"Once tasks tied to the traffic mission are complete or reasonably should be complete, continuing detention for an unrelated dog sniff requires an independent lawful basis, absent here.",refs:["rodriguez"],next:"endRelease"},
      {label:"Hold the driver solely for the drug dog, because eight additional minutes is minimal.",grade:"unsupported",result:"The driver stays parked while the dog travels to the scene. The stop lasts longer for an unrelated investigation.",why:"A delay is not categorically constitutional simply because it is short. Rodriguez expressly addresses this problem.",refs:["rodriguez"],next:"endDelay"},
      {label:"Create a second unnecessary traffic check solely to fill the wait.",grade:"unsupported",result:"The driver continues waiting while completed tasks are artificially repeated.",why:"Prolongation cannot be justified by contrived mission-related activity after traffic tasks are otherwise done.",refs:["rodriguez"],next:"endDelay"}
    ]
  },
  bulletin:{
    label:"04 / THE UNCONFIRMED BULLETIN",shot:"radio",radio:"Possible theft bulletin: dark sedan somewhere near the downtown corridor. No plate, make, year, reporter or timing available.",speaker:"Driver",
    dialogue:"I see you finishing up. Is there a problem?",
    narrative:"You are still processing the warning. Dispatch supplied a very broad description that could match many vehicles. The message does not yet identify a specific person or particular vehicle. It is not a verified plate hit.",
    facts:["Only generic 'dark sedan' description","Traffic checks remain underway"],unknown:["Source and reliability","Exact plate, make/model, timing and location","Whether bulletin actually concerns this vehicle"],
    prompt:"What additional facts matter before deciding whether the detention can expand?",
    options:[
      {label:"Ask dispatch for a reliable source, specific plate or vehicle features, timing and location while continuing traffic tasks.",grade:"supported",result:"You do not pause the warning. Dispatch contacts the originating agency and returns with a more specific report.",why:"An objective, particularized basis for a separate investigative stop depends on the totality of reliable facts. A vague descriptor, by itself in these stipulated circumstances, is not enough.",refs:["terry","hensley","rodriguez"],next:"details"},
      {label:"Treat 'dark sedan' by itself as sufficient and suspend the warning for an unrelated search.",grade:"unsupported",result:"You stop processing the traffic violation based only on a common vehicle color and type.",why:"This description alone has not established individualized reasonable suspicion or search authority. More specific and reliable information is missing.",refs:["terry","hensley"],next:"endThin"},
      {label:"Finish the traffic tasks and release the driver if nothing more specific arrives before completion.",grade:"supported",result:"No further report arrives before the warning is done. You end the traffic encounter without manufacturing an extension.",why:"A general message does not oblige prolonging the stop without a sufficient, independently justified basis. This branch assumes no new specific facts arrive before the mission finishes.",refs:["rodriguez","terry"],next:"endRelease"}
    ]
  },
  details:{
    label:"05 / WHAT IS STILL UNKNOWN?",shot:"analysis",radio:"Dispatch: I can request source confirmation. Your warning is still being processed.",speaker:"Officer — internal monologue",
    dialogue:"A vague bulletin is not the same as a specific, verified report. What facts would change the analysis?",
    narrative:"This is the missing-facts decision. The radio channel is open while ordinary traffic work continues. Choose the investigative question that targets reliability and particularity instead of assuming a legal answer.",
    facts:["Vehicle is a dark blue four-door sedan","No documented matching plate yet"],unknown:["Whether originating agency confirms the bulletin","Exact plate and vehicle description","Time and reliability of the report"],
    prompt:"What do you need from dispatch?",
    options:[
      {label:"Confirm source, exact plate, make/model, report recency and whether the originating agency has a sufficient basis.",grade:"supported",result:"Dispatch verifies a recent report with the originating agency. The update changes the facts before the traffic mission concludes.",why:"A confirmed, sufficiently specific police bulletin can furnish independent grounds for a limited investigative detention when the originating agency itself had sufficient objective grounds. Its scope still must be justified.",refs:["hensley","terry"],next:"verified"},
      {label:"Nothing else. A dark sedan is enough; stop traffic work to wait for K9.",grade:"unsupported",result:"The officer stops the warning for a narcotics dog without verifying any facts linking the car to a separate crime.",why:"Generic descriptions without adequate particularity and reliability do not automatically establish reasonable suspicion. The drug-detection delay has no independent justification here.",refs:["terry","rodriguez"],next:"endThin"},
      {label:"Demand the driver's phone to check whether the vehicle was stolen.",grade:"unsupported",result:"The driver refuses to unlock the phone. The bulletin did not create an automatic digital-search exception.",why:"A vehicle alert does not itself authorize a general search of phone contents. Riley reflects the strong privacy interest in phone data even after arrest.",refs:["riley","hensley"],next:"endSearch"}
    ]
  },
  verified:{
    label:"06 / FACTS CHANGE THE QUESTION",shot:"verified",radio:"Originating agency confirms a recent owner-reported vehicle theft. The currently active bulletin includes the exact plate and make/model; all match this stopped sedan. The originating agency documents specific facts supporting reasonable suspicion of a reported felony vehicle theft.",speaker:"Driver",
    dialogue:"Why are you asking about the car now? I thought this was about the light.",
    narrative:"The dispatch confirmation arrived while routine checks were still underway. For this training example, assume the originating agency had sufficient objective grounds to issue the particularized bulletin, and that the officer reasonably relies on it. The new issue is a suspected vehicle theft—not a general narcotics search.",
    facts:["Current, specifically matching vehicle-theft bulletin","Originating agency verified and has supporting facts","Independent suspected offense now identified"],unknown:["Driver's relationship to the vehicle","Whether the theft alert is mistaken","Any warrant/search exception beyond detention"],
    prompt:"What should the changed facts authorize—and what do they not automatically authorize?",
    options:[
      {label:"Investigate the specifically reported vehicle theft within a justified, limited detention; verify the report and follow policy.",grade:"supported",result:"You identify the new basis for the encounter and initiate a separate, appropriately limited theft inquiry. The K9 drug search is not treated as automatically authorized.",why:"Given the explicitly assumed reliable, specific bulletin, Hensley supports an objectively reasonable investigative stop for a completed felony when the issuing agency had a valid basis. This does not automatically license a phone search or a dog-sniff delay unrelated to that suspicion. Scope and duration still matter.",refs:["hensley","terry","rodriguez"],next:"endVerified"},
      {label:"Hold the driver solely for the narcotics dog because a theft bulletin now exists.",grade:"unsupported",result:"The detention is redirected to an unrelated drug search instead of the verified theft inquiry.",why:"The new factual basis concerns a suspected vehicle theft. It is not automatically reasonable suspicion of narcotics or an unrestricted license to prolong detention for a drug dog. Analyze the actual mission and duration.",refs:["hensley","rodriguez"],next:"endDog"},
      {label:"Search every message on the driver's phone to see whether they bought the car.",grade:"unsupported",result:"The driver objects. The particularized theft report has been turned into a blanket digital search without identified authority.",why:"Independent grounds for a limited theft investigation are not a general warrant or recognized phone-search exception.",refs:["riley","hensley"],next:"endSearch"}
    ]
  }
};
const endings={
  endRelease:{title:"A CLEAN RELEASE",type:"resolved",desc:"The original traffic task concludes. No additional grounds support keeping the car. The driver leaves without an unnecessary extension.",lesson:"Lawful restraint is a skill. A finished traffic mission and no independent factual basis mean the stop ends."},
  endVerified:{title:"A NEW, LIMITED INVESTIGATION",type:"resolved",desc:"The verified and sufficiently particularized stolen-vehicle report supplies an assumed independent reason to investigate the suspected theft. You separate that purpose from the original traffic matter and from an unrelated K9 request.",lesson:"New facts may change detention authority. They do not automatically change search authority. The reliability, particularity, scope and duration of further action require ongoing review."},
  endDelay:{title:"AN UNSUPPORTED DELAY",type:"caution",desc:"The completed (or artificially stalled) traffic mission becomes an eight-minute wait for a drug-detection dog without independently supported grounds.",lesson:"A short delay is still an extension if it is caused by off-mission investigation without another legal basis."},
  endSearch:{title:"A SEARCH WITHOUT A SUPPLIED BASIS",type:"caution",desc:"A traffic or vehicle-theft investigation turns into a digital or vehicle search without identified warrant, valid consent or applicable exception.",lesson:"Being lawfully present during a traffic encounter does not erase independent legal requirements for a search."},
  endThin:{title:"A THIN DESCRIPTION",type:"caution",desc:"A broad, unverified 'dark sedan' message is treated as enough to expand detention and searching without more particularized facts.",lesson:"The totality of objective, reliable facts matters. Color and type, standing alone on these stated facts, do not establish a sufficient independent basis."},
  endDog:{title:"THE WRONG INVESTIGATION",type:"caution",desc:"A confirmed report of a specific suspected vehicle theft is used as a general justification to wait for an unrelated narcotics dog.",lesson:"A changed factual basis may permit a distinct limited investigation, not an unlimited search for any unrelated offense."}
};
let current="stop",history=[],chosen=false,narrator=false,pressure=false,cinemaMode=false,beatIndex=0,interval=null,seconds=20;
const $=id=>document.getElementById(id);
const mainScene=$("main-scene");
mainScene.appendChild(document.querySelector(".intro .scene svg").cloneNode(true));
const frame=document.createElement("div");frame.className="film-frame";frame.setAttribute("aria-hidden","true");mainScene.appendChild(frame);
const caption=document.createElement("div");caption.className="cinema-caption";mainScene.appendChild(caption);
const quote=document.createElement("div");quote.className="scene-quote";quote.setAttribute("aria-hidden","true");quote.hidden=true;mainScene.appendChild(quote);
const readout=document.createElement("div");readout.className="scene-readout";readout.setAttribute("aria-hidden","true");mainScene.appendChild(readout);
const factsBox=document.createElement("div");factsBox.className="facts-panel";factsBox.setAttribute("aria-label","Known and missing facts");
$("prompt").after(factsBox);
function set(id,val){$(id).textContent=val;}
function speak(s){if(!narrator||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.rate=.94;u.pitch=.93;window.speechSynthesis.speak(u);}
function silence(){if("speechSynthesis" in window)window.speechSynthesis.cancel();}
function stopTimer(){if(interval!==null){clearInterval(interval);interval=null;}}
function drawTimer(){set("seconds",seconds===0?"Clock elapsed — think, then decide":seconds+" seconds");$("timer-progress").style.width=seconds/20*100+"%";$("timer").classList.toggle("expired",seconds===0);}
function beginTimer(){stopTimer();$("timer-wrap").hidden=!pressure;if(!pressure)return;seconds=20;drawTimer();interval=setInterval(()=>{seconds=Math.max(0,seconds-1);drawTimer();if(!seconds)stopTimer();},1000);}
function view(which){$("intro").hidden=which!=="intro";$("game").hidden=which!=="game";$("debrief").hidden=which!=="debrief";$("restart-top").hidden=which==="intro";}
function infoPanel(node){
 factsBox.replaceChildren();
 const sections=[["KNOWN FACTS",node.facts],["WHAT REMAINS UNKNOWN",node.unknown]];
 for(const [title,items] of sections){
   const section=document.createElement("section");
   const h=document.createElement("h3");h.textContent=title;section.appendChild(h);
   const ul=document.createElement("ul");
   items.forEach(item=>{const li=document.createElement("li");li.textContent=item;ul.appendChild(li);});
   section.appendChild(ul);factsBox.appendChild(section);
 }
}

/* Learner-paced cinema: no auto-answer and no new network request. */
function startScenePlayback(node){
 stopTimer();
 $("cinema-controls").hidden=false;
 $("cinema-gate").hidden=false;
 $("choices").hidden=true;
 $("prompt").hidden=true;
 $("timer-wrap").hidden=true;
 beatIndex=0;
 showBeat(node);
}
function showBeat(node){
 const beats=[
  {speaker:"Dispatch / Radio",text:node.radio},
  {speaker:node.speaker,text:node.dialogue},
  {speaker:"Officer / Scene",text:node.narrative}
 ];
 const beat=beats[beatIndex];
 $("radio-line").hidden=false;
 $("driver-line").hidden=beatIndex<1;
 $("narrative").hidden=beatIndex<2;
 quote.hidden=false;
 quote.replaceChildren();
 const heading=document.createElement("strong");heading.textContent=beat.speaker;
 const wording=document.createElement("span");wording.textContent=beat.text;
 quote.append(heading,wording);
 set("beat-status","Scene beat "+(beatIndex+1)+" of 3 · "+beat.speaker);
 $("beat-next").textContent=beatIndex===2?"Continue to decisions →":"Next scene beat →";
 speak(beat.speaker+". "+beat.text);
}
function revealChoices(){
 quote.hidden=true;
 $("cinema-controls").hidden=true;
 $("cinema-gate").hidden=true;
 $("radio-line").hidden=false;
 $("driver-line").hidden=false;
 $("narrative").hidden=false;
 $("choices").hidden=false;
 $("prompt").hidden=false;
 beginTimer();
 if($("choices").children.length)$("choices").children[0].focus();
}
function nextBeat(){
 if($("cinema-controls").hidden)return;
 if(beatIndex<2){beatIndex++;showBeat(scenes[current]);}
 else revealChoices();
}
function sceneView(){
 chosen=false;view("game");
 const node=scenes[current];
 const chapter=history.length+1;
 set("stage-label","Decision "+chapter+" · Branching story");
 set("phase-title",node.label);
 set("game-title","The Eight-Minute Wait");
 set("decision-title",current==="details"?"Investigate the missing facts":current==="verified"?"New report. New limits.":"Make your call");
 set("dispatch",node.radio);set("speaker",node.speaker);set("dialogue",node.dialogue);set("narrative",node.narrative);set("prompt",node.prompt);
 mainScene.dataset.scene=String(chapter%5+1);
 mainScene.dataset.shot=node.shot;
 caption.textContent=node.label+" · FICTIONAL INCIDENT · 23:42";
 const sceneReadouts={stop:"STOP BASIS: TAILLIGHT\nOTHER OFFENSES: NONE",consent:"CONSENT: DECLINED\nK9 ETA: 08:00",finish:"WARNING: COMPLETE\nOTHER GROUNDS: NONE",bulletin:"BULLETIN: UNCONFIRMED\nPLATE: UNKNOWN",details:"FACTS NEEDED:\nSOURCE / PLATE / TIME",verified:"BULLETIN: VERIFIED\nVEHICLE: EXACT MATCH",delayRepair:"TRAFFIC TASK: PAUSED\nADDED DELAY: 08:00",phoneRepair:"PHONE SEARCH: OBJECTED\nAUTHORITY: NOT SHOWN",carRepair:"VEHICLE ENTRY: OBJECTED\nAUTHORITY: NOT SHOWN"};
 readout.textContent=sceneReadouts[current]||"FICTIONAL TRAINING SCENE";
 frame.textContent=current==="verified"?"VERIFIED VEHICLE ALERT":current==="details"?"SOURCE CONFIRMATION":current==="bulletin"?"RADIO BULLETIN":current==="finish"?"TRAFFIC MISSION COMPLETE":"BODY CAMERA / TRAINING";
 infoPanel(node);
 const progress=$("steps");progress.replaceChildren();
 for(let i=0;i<Math.max(3,chapter);i++){const marker=document.createElement("span");marker.className=i<chapter-1?"done":i===chapter-1?"active":"";progress.appendChild(marker);}
 const choices=$("choices");choices.replaceChildren();
 node.options.forEach((option,index)=>{
   const button=document.createElement("button");button.type="button";button.className="choice";
   const letter=document.createElement("b");letter.textContent=String.fromCharCode(65+index);
   const content=document.createElement("span");content.textContent=option.label;
   button.append(letter,content);button.addEventListener("click",()=>choose(index));
   choices.appendChild(button);
 });
 $("consequence").hidden=true;$("next").hidden=true;
 if(cinemaMode)startScenePlayback(node);
 else{revealChoices();speak(node.radio+". "+node.dialogue+". "+node.narrative+". "+node.prompt);}
 $("decision-title").setAttribute("tabindex","-1");
 if(cinemaMode)$("beat-next").focus();else $("decision-title").focus();
 window.scrollTo({top:0,behavior:"auto"});
}
function choose(index){
 if(chosen)return;
 const node=scenes[current];const option=node.options[index];if(!option)return;
 chosen=true;stopTimer();
 history.push({scene:current,index,grade:option.grade,label:node.label,choice:option.label,result:option.result,why:option.why,refs:option.refs,next:option.next});
 document.querySelectorAll("#choices button").forEach(button=>button.disabled=true);
 const consequence=$("consequence");consequence.replaceChildren();
 const heading=document.createElement("strong");heading.textContent="SCENE CONSEQUENCE";
 const body=document.createElement("span");body.textContent=option.result;
 consequence.append(heading,body);consequence.hidden=false;
 $("next").hidden=false;
 $("next").textContent=endings[option.next]?"Open after-action review →":"Continue the story →";
 speak(option.result);
 $("next").focus();
}
function sourceLink(key){
 const source=authority[key];const link=document.createElement("a");
 link.href=source.url;link.target="_blank";link.rel="noopener noreferrer";link.textContent=source.name;
 return link;
}
function renderDebrief(endKey){
 stopTimer();silence();quote.hidden=true;view("debrief");const ending=endings[endKey];
 const supported=history.filter(x=>x.grade==="supported").length;
 set("score",supported+" / "+history.length);
 set("summary",ending.title);
 set("evaluation",ending.desc+" "+ending.lesson+" The fraction above is the number of decisions supported by these stipulated facts—not a certification, grade of field competence, or assessment of actual legal exposure.");
 const reviews=$("reviews");reviews.replaceChildren();
 history.forEach((item,index)=>{
   const block=document.createElement("article");block.className="review";
   const tag=document.createElement("div");tag.className="tag "+(item.grade==="supported"?"good":"risk");tag.textContent=item.grade==="supported"?"Supported on these facts":"Unsupported on these facts";
   const title=document.createElement("h3");title.textContent="Decision "+(index+1)+" · "+item.label;
   const selected=document.createElement("p");const strong=document.createElement("strong");strong.textContent="Your call: ";selected.append(strong,document.createTextNode(item.choice));
   const consequence=document.createElement("p");const consequenceLabel=document.createElement("strong");consequenceLabel.textContent="What happened: ";consequence.append(consequenceLabel,document.createTextNode(item.result));
   const explanation=document.createElement("p");explanation.textContent=item.why;
   const links=document.createElement("div");links.className="sources";
   item.refs.forEach(key=>links.appendChild(sourceLink(key)));
   block.append(tag,title,selected,consequence,explanation,links);reviews.appendChild(block);
 });
 window.scrollTo({top:0,behavior:"auto"});$("debrief-title").focus();
}
function reset(){stopTimer();silence();quote.hidden=true;current="stop";history=[];chosen=false;view("intro");window.scrollTo({top:0,behavior:"auto"});}
$("start").addEventListener("click",()=>{history=[];current="stop";sceneView();});
$("next").addEventListener("click",()=>{if(!chosen||!history.length)return;const next=history[history.length-1].next;if(endings[next])renderDebrief(next);else{current=next;sceneView();}});
$("replay").addEventListener("click",()=>{stopTimer();silence();history=[];current="stop";sceneView();});
$("restart-top").addEventListener("click",reset);
$("beat-next").addEventListener("click",nextBeat);
$("beat-skip").addEventListener("click",revealChoices);
$("cinema").addEventListener("click",function(){
 cinemaMode=!cinemaMode;
 this.setAttribute("aria-pressed",String(cinemaMode));
 this.textContent="Scene playback: "+(cinemaMode?"on":"off");
 if(!$("game").hidden&&!chosen){
  silence();
  if(cinemaMode)startScenePlayback(scenes[current]);
  else revealChoices();
 }
});
$("prepare-feedback").addEventListener("click",function(){
 const role=$("tester-role").value||"Prefer not to say";
 const clarity=$("tester-clear").value||"Not rated";
 const realism=$("tester-real").value||"Not rated";
 const learning=$("tester-learn").value||"Not rated";
 const remarks=String($("tester-feedback").value||"").trim().slice(0,1000);
 $("tester-export").value=[
  "THE SHIELD DECISION POINT — OPTIONAL PILOT FEEDBACK",
  "Version: 0.3 | Fictional scenario: The Eight Minute Wait",
  "Field: "+role,
  "Explanation clarity: "+clarity,
  "Decision realism: "+realism,
  "Knowledge impact: "+learning,
  "Suggestions: "+(remarks||"No additional comments"),
  "No names, scores or choice history included automatically."
 ].join("\n");
 $("feedback-result").hidden=false;
 if(typeof $("tester-export").select==="function")$("tester-export").select();
});
$("pressure").addEventListener("click",function(){pressure=!pressure;this.setAttribute("aria-pressed",String(pressure));this.textContent="Pressure: "+(pressure?"on":"off");if(!$("game").hidden&&!chosen){
  if(!$("cinema-controls").hidden){stopTimer();$("timer-wrap").hidden=true;}
  else beginTimer();
 }
});
$("narration").addEventListener("click",function(){
 if(!("speechSynthesis" in window)){this.textContent="Narration unavailable";this.disabled=true;return;}
 narrator=!narrator;this.setAttribute("aria-pressed",String(narrator));this.textContent="Narration: "+(narrator?"on":"off");
 if(!narrator)silence();else if(!$("game").hidden&&!chosen){
  const node=scenes[current];
  if(!$("cinema-controls").hidden){
    const beats=[node.radio,node.dialogue,node.narrative];
    speak(beats[beatIndex]);
  }else speak(node.radio+". "+node.dialogue+". "+node.narrative+". "+node.prompt);
 }
});
window.addEventListener("pagehide",()=>{stopTimer();silence();});
})();
