"use strict";
(() => {
const tracks={police:"Police Sergeant",fire:"Fire Company Officer",ems:"EMS Field Supervisor"};
const labels={ready:"Ready",active:"In progress",review:"Awaiting review",done:"Review prepared"};
const transitions={ready:"active",active:"review",review:"done"};
const sessions=[];let serial=0;
const el=id=>document.getElementById(id);
function render(){
el("total").textContent=String(sessions.length);
for(const status of ["active","review","done"])el(status).textContent=String(sessions.filter(s=>s.status===status).length);
const list=el("sessions");list.replaceChildren();
const visible=sessions.filter(s=>el("filter").value==="all"||s.status===el("filter").value);
if(!visible.length){list.textContent="No sessions in this view.";return;}
for(const s of visible){
const row=document.createElement("article");row.className="session";
const details=document.createElement("div");const heading=document.createElement("strong");heading.textContent=s.id+" · "+tracks[s.track];
const status=document.createElement("p");status.textContent=labels[s.status]+" — manually simulated status";details.append(heading,status);row.appendChild(details);
const link=document.createElement("a");link.href="promote.html?track="+s.track+"#demo";link.target="_blank";link.rel="noopener noreferrer";link.textContent="Open independent candidate demo";row.appendChild(link);
if(transitions[s.status]){const advance=document.createElement("button");advance.type="button";advance.textContent="Simulate: "+labels[transitions[s.status]];advance.addEventListener("click",()=>{s.status=transitions[s.status];render();el("notice").textContent=s.id+" updated to "+labels[s.status]+". No candidate result was received.";el("filter").focus();});row.appendChild(advance);}
const remove=document.createElement("button");remove.type="button";remove.textContent="Remove "+s.id;remove.addEventListener("click",()=>{sessions.splice(sessions.indexOf(s),1);render();el("notice").textContent=s.id+" removed.";el("filter").focus();});row.appendChild(remove);list.appendChild(row);
}}
el("create").addEventListener("click",()=>{const track=el("track").value;if(!Object.hasOwn(tracks,track))return;const id="DEMO-"+String(++serial).padStart(3,"0");sessions.push({id,track,status:"ready"});el("filter").value="all";render();el("notice").textContent=id+" created.";});
el("filter").addEventListener("change",render);render();
})();