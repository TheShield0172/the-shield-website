"use strict";
(() => {
const tracks={police:"Police Sergeant",fire:"Fire Company Officer",ems:"EMS Field Supervisor"};
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
if(!Array.isArray(d.choices)||d.choices.length<1||d.choices.length>20||!d.choices.every(n=>Number.isInteger(n)&&n>=0&&n<=2)||!Array.isArray(d.decisions)||d.decisions.length!==d.choices.length||!d.decisions.every(x=>x&&["dimension","choice","outcome"].every(k=>typeof x[k]==="string"&&x[k].length<=2000)))return;
const s=selected;s.decisions=d.decisions.map(x=>({dimension:x.dimension,choice:x.choice,outcome:x.outcome}));s.status="review";closeWorkspace();render();el("notice").textContent=s.id+" completed; awaiting assessor review.";el("filter").focus();
});
function review(s){
if(selected&&selected.status==="active"){el("notice").textContent="Finish or remove the active session first.";return;}
closeWorkspace();selected=s;const w=el("workspace");w.append(make("h2",s.id+" — "+(s.status==="done"?"Fictional report":"Assessor review")),make("p","Unscored rehearsal. Use fixed observation categories only; no real personnel information."));
const fields=[];
s.decisions.forEach((d,i)=>{const card=document.createElement("article");card.className="panel";card.append(make("h3",(i+1)+". "+d.dimension),make("p",d.choice),make("p",d.outcome));const label=make("label","Observation");const field=document.createElement("select");field.id="observation-"+i;label.htmlFor=field.id;for(const value of ["Not reviewed","Discuss assumptions","Discuss tradeoffs","Discuss communication","Discuss follow-up"]){const opt=make("option",value);opt.value=value;field.appendChild(opt);}field.value=s.observations?.[i]||"Not reviewed";field.disabled=s.status==="done";fields.push(field);card.append(label,field);w.appendChild(card);});
if(s.status==="review")w.appendChild(button("Prepare review",()=>{if(fields.some(f=>f.value==="Not reviewed")){el("notice").textContent="Choose an observation for every decision.";return;}s.observations=fields.map(f=>f.value);s.status="done";render();review(s);}));
else {const out=make("p","Integrity digest not yet generated.");w.append(out,button("Generate SHA-256 report digest",async()=>{try{const payload=JSON.stringify({version:1,id:s.id,track:s.track,decisions:s.decisions,observations:s.observations});const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(payload));out.textContent="SHA-256 (fictional report content, not a signature): "+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");}catch{out.textContent="Digest unavailable in this browser.";}}),button("Print report",()=>window.print()));}
}
el("create").addEventListener("click",()=>{const track=el("track").value;if(!Object.hasOwn(tracks,track))return;const id="DEMO-"+String(++serial).padStart(3,"0");sessions.push({id,track,status:"ready"});el("filter").value="all";render();el("notice").textContent=id+" created.";});
el("filter").addEventListener("change",render);render();
})();