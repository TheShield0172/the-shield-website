"use strict";
(() => {
const catalog=[["police","Police Sergeant",6],["fire","Fire Company Officer",6],["ems","EMS Field Supervisor",6],["fire-engineer","Fire Engineer",2],["fire-captain","Fire Captain",2],["fire-division-chief","Fire Division Chief",2],["fire-deputy-chief","Fire Deputy Chief",2],["ems-fto","EMS FTO",2],["ems-lieutenant","EMS Lieutenant",2],["ems-captain","EMS Captain",2],["ems-deputy-chief","EMS Deputy Chief",2],["ems-director","EMS Director",2],["police-corporal","Police Corporal",2],["police-lieutenant","Police Lieutenant",2],["police-captain","Police Captain",2],["police-commander","Police Commander",2],["police-deputy-chief","Deputy Chief",2],["police-chief","Chief of Police",2],["fire-lieutenant","Fire Lieutenant",2],["fire-battalion-chief","Fire Battalion Chief",2],["fire-chief","Fire Chief",2],["ems-manager","EMS Operations Manager",2],["ems-chief","EMS Chief",2]];
const groups=[["Police",["police-corporal","police","police-lieutenant","police-captain","police-commander","police-deputy-chief","police-chief"]],["Fire",["fire-engineer","fire-lieutenant","fire","fire-captain","fire-battalion-chief","fire-division-chief","fire-deputy-chief","fire-chief"]],["EMS",["ems-fto","ems","ems-lieutenant","ems-captain","ems-manager","ems-deputy-chief","ems-director","ems-chief"]]];
const tracks=Object.fromEntries(catalog.map(([id,label])=>[id,label]));
const counts=Object.fromEntries(catalog.map(([id,,count])=>[id,count]));
const labels={ready:"Ready",active:"In progress",review:"Awaiting review",done:"Review prepared"};
const sessions=[];let serial=0,selected=null,frame=null;
const el=id=>document.getElementById(id);
const make=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n;};
const button=(text,fn)=>{const n=make("button",text);n.type="button";n.addEventListener("click",fn);return n;};
function closeWorkspace(){frame=null;selected=null;el("workspace").replaceChildren();}
function render(){
el("total").textContent=String(sessions.length);
for(const status of ["active","review","done"])el(status).textContent=String(sessions.filter(s=>s.status===status).length);
const list=el("sessions");list.replaceChildren();
const visible=sessions.filter(s=>el("filter").value==="all"||s.status===el("filter").value);
if(!visible.length){list.textContent="No sessions in this view.";return;}
for(const s of visible){
const row=document.createElement("article");row.className="session";
const details=document.createElement("div");details.append(make("strong",s.id+" · "+tracks[s.track]),make("p",labels[s.status]));row.appendChild(details);
if(s.status==="ready"||s.status==="active")row.appendChild(button(s.status==="ready"?"Launch candidate":"Restart candidate",()=>launch(s)));
else row.appendChild(button(s.status==="review"?"Open assessor review":"View report",()=>review(s)));
row.appendChild(button("Remove "+s.id,()=>{if(selected===s)closeWorkspace();sessions.splice(sessions.indexOf(s),1);render();el("notice").textContent=s.id+" removed.";el("filter").focus();}));list.appendChild(row);
}}
function launch(s){
if(selected&&selected!==s&&selected.status==="active"){el("notice").textContent="Finish or remove the active session first.";return;}
closeWorkspace();selected=s;s.status="active";render();
const w=el("workspace");w.append(make("h2",s.id+" — candidate rehearsal"),make("p","Complete the exercise below. Only fictional selected choices are returned; free text stays in the exercise."));
frame=document.createElement("iframe");frame.title="Fictional candidate exercise";frame.src="promote.html?track="+s.track+"&adminDemo=1#demo";w.appendChild(frame);frame.focus();
}
window.addEventListener("message",event=>{
const d=event.data;
if(!frame||!selected||selected.status!=="active"||event.origin!==window.location.origin||event.source!==frame.contentWindow||!d||d.type!=="shield-demo-complete"||d.track!==selected.track)return;
if(!Array.isArray(d.choices)||d.choices.length!==counts[selected.track]||!d.choices.every(n=>Number.isInteger(n)&&n>=0&&n<=2)||!Array.isArray(d.decisions)||d.decisions.length!==d.choices.length||!d.decisions.every(x=>x&&["dimension","choice","outcome"].every(k=>typeof x[k]==="string"&&x[k].trim().length>0&&x[k].length<=2000)))return;
const s=selected;s.decisions=d.decisions.map(x=>({dimension:x.dimension,choice:x.choice,outcome:x.outcome}));s.status="review";closeWorkspace();render();el("notice").textContent=s.id+" completed; awaiting assessor review.";el("filter").focus();
});
function review(s){
if(selected&&selected.status==="active"){el("notice").textContent="Finish or remove the active session first.";return;}
closeWorkspace();selected=s;const w=el("workspace");w.append(make("h2",s.id+" — "+(s.status==="done"?"Fictional report":"Assessor review")),make("p","Unscored rehearsal. Use fixed observation categories only; no real personnel information."));
const fields=[];
s.decisions.forEach((d,i)=>{const card=document.createElement("article");card.className="panel";card.append(make("h3",(i+1)+". "+d.dimension),make("p",d.choice),make("p",d.outcome));const label=make("label","Observation");const field=document.createElement("select");field.id="observation-"+i;label.htmlFor=field.id;for(const value of ["Not reviewed","Discuss assumptions","Discuss tradeoffs","Discuss communication","Discuss follow-up"]){const opt=make("option",value);opt.value=value;field.appendChild(opt);}field.value=s.observations?.[i]||"Not reviewed";field.disabled=s.status==="done";fields.push(field);card.append(label,field);w.appendChild(card);});
if(s.status==="review")w.appendChild(button("Prepare review",()=>{if(fields.some(f=>f.value==="Not reviewed")){el("notice").textContent="Choose an observation for every decision.";return;}s.observations=fields.map(f=>f.value);s.status="done";render();review(s);}));
else {let digestAttempt=0,verifiedDigest=null;const out=make("p","Integrity digest not yet generated.");w.append(out,button("Generate SHA-256 report digest",async()=>{const attempt=++digestAttempt;verifiedDigest=null;out.textContent="Generating integrity digest…";try{const payload=JSON.stringify({version:1,id:s.id,track:s.track,decisions:s.decisions,observations:s.observations});const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(payload));if(attempt!==digestAttempt)return;const hex=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");if(!/^[a-f0-9]{64}$/.test(hex))throw Error("Invalid digest");verifiedDigest=hex;out.textContent="SHA-256 (fictional report content, not a signature): "+hex;}catch{if(attempt===digestAttempt)out.textContent="Digest unavailable in this browser.";}}),button("Print report",()=>{if(!verifiedDigest){el("notice").textContent="Generate the report digest before printing.";return;}window.print();}));}
}
const picker=el("track");picker.replaceChildren();
for(const [name,ids] of groups){const group=document.createElement("optgroup");group.label=name;for(const id of ids){const option=make("option",tracks[id]);option.value=id;group.appendChild(option);}picker.appendChild(group);}
picker.value="police";
el("create").addEventListener("click",()=>{const track=el("track").value;if(!Object.hasOwn(tracks,track))return;const id="DEMO-"+String(++serial).padStart(3,"0");sessions.push({id,track,status:"ready"});el("filter").value="all";render();el("notice").textContent=id+" created.";});
el("filter").addEventListener("change",render);render();
})();