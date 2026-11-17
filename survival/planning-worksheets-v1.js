(()=>{"use strict";
if(document.body.dataset.academy!=="survival")return;
const page=document.querySelector("#app .body > .page:nth-of-type(2)");
const list=page?.querySelector(".curriculum-list"),reader=page?.querySelector(".curriculum-reader");
if(!list||!reader)return;
const items=[
 {name:"Land navigation & safe route verification",fields:[["route","Verified destination and source","text"],["map","Map edition, datum and coordinate format","text"],["checkpoints","Checkpoints, closures and official access updates","textarea"],["fallback","Safe turnaround, alternative and communication plan","textarea"]],checks:["Start and destination independently verified","Map date, access and local hazards checked","Turnaround and safe fallback identified","Travel and accessibility needs considered"]},
 {name:"Medical continuity & communications",fields:[["medical","Clinician-approved medication and device continuity requirements (avoid sensitive details)","textarea"],["contacts","Accessible healthcare and pharmacy contact plan","textarea"],["backup","Verified backup support and transportation arrangements","textarea"],["signals","When and how to seek professional assistance","textarea"]],checks:["Individual care instructions reviewed with qualified provider","Device power and charging compatibility professionally confirmed","Refill and transportation routes verified","Essential contacts available offline"]},
 {name:"30 / 90 / 180 day dependency planning",fields:[["services","Known functioning, limited and unavailable local services","textarea"],["30days","First 30 days: supplies and outside assistance","textarea"],["90days","Days 31–90: replenishment, maintenance and alternatives","textarea"],["180days","Days 91–180: sustainable routines and recovery options","textarea"]],checks:["Status verified rather than assumed","Independent replenishment route identified","Community and public services included","Conditions for relocating or seeking help documented"]},
 {name:"Water & food inventory calculator",fields:[["people","Household members","number"],["liters","Verified safe water available (liters)","number"],["perday","Illustrative total liters per person per day (your planning assumption)","number"],["food","Food inventory, storage and preparation constraints","textarea"],["resupply","Verified safe-water resupply and official advisory sources","textarea"]],checks:["Water source and storage safety verified","Current water advisories checked","Food preparation and sanitation needs considered","Alternative safe supply identified"]},
 {name:"Shelter & evacuation decision log",fields:[["hazards","Current hazard, official instruction and timestamp","textarea"],["conditions","Shelter habitability and individual accessibility needs","textarea"],["destination","Verified accessible destination and current capacity","textarea"],["route","Open, legal route plus fallback if travel becomes unsafe","textarea"]],checks:["Official alerts and orders checked","Hazards of staying versus travelling compared","Destination accessibility confirmed","Contacts and backup arrangements known"]},
 {name:"Household power & maintenance calculator",fields:[["watts","Combined running watts for selected loads","number"],["hours","Hours of planned use per day","number"],["capacity","Verified usable energy capacity in watt-hours (if known)","number"],["support","Safe charging, generator/CO precautions and professional equipment guidance","textarea"],["maintenance","Inspection, replacement and replenishment schedule","textarea"]],checks:["Peak simultaneous load checked","Usable capacity and charging compatibility verified","Carbon-monoxide and electrical hazards addressed","Maintenance and alternate assistance identified"]}
];
const prefix="survival-worksheet-v1-";
const node=(tag,cls,label)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(label!==undefined)x.textContent=label;return x};
const safeRead=k=>{try{const v=JSON.parse(localStorage.getItem(prefix+k)||"{}");return v&&typeof v==="object"?v:{}}catch(_){return {}}};
function attach(i){
 reader.querySelectorAll(".survival-planning-worksheet").forEach(x=>x.remove());
 if(reader.hidden||!Number.isInteger(i)||i<0||i>=items.length)return;
 const model=items[i],data=safeRead(i),card=node("details","survival-planning-worksheet"),summary=node("summary","","Practical planning worksheet · "+model.name);
 card.append(summary);
 const intro=node("p","survival-worksheet-intro","Optional learning tool. Values are hypothetical planning inputs, not official safety thresholds or emergency instructions. Notes remain in this browser on this device.");
 card.append(intro);
 const form=node("div","survival-worksheet-form");card.append(form);
 const inputs={};
 const status=node("p","survival-worksheet-status");status.setAttribute("aria-live","polite");
 const output=node("div","survival-worksheet-output");output.setAttribute("aria-live","polite");
 function persist(){const values={};for(const [key,ctrl] of Object.entries(inputs))values[key]=ctrl.type==="checkbox"?ctrl.checked:ctrl.value;try{localStorage.setItem(prefix+i,JSON.stringify(values));status.textContent="Saved on this device."}catch(_){status.textContent="Local storage unavailable. Copy your notes before leaving."}compute()}
 function number(key){const v=inputs[key]?.value;if(v===""||v===undefined)return null;const x=Number(v);return Number.isFinite(x)&&x>=0?x:null}
 function compute(){
  output.textContent="";
  if(i===3){const people=number("people"),liters=number("liters"),rate=number("perday");if(people!==null&&people>0&&liters!==null&&rate!==null&&rate>0){output.textContent="Illustrative water coverage: "+(liters/(people*rate)).toFixed(1)+" days, based solely on your assumed daily use. This does not certify water safety or that your assumption meets actual needs.";}}
  if(i===5){const watts=number("watts"),hours=number("hours"),cap=number("capacity");if(watts!==null&&hours!==null){const wh=watts*hours;output.textContent="Ideal daily energy: "+wh.toFixed(1)+" Wh."+(cap!==null&&wh>0?" Nominal arithmetic coverage: "+(cap/wh).toFixed(1)+" days without recharge, ignoring losses and limits.":"")+" Not a safety or compatibility guarantee.";}}
 }
 for(const [key,label,type] of model.fields){
  const field=node("label","survival-worksheet-field"),span=node("span","",label);
  const ctrl=type==="textarea"?node("textarea",""):node("input","");
  if(type==="number"){ctrl.type="number";ctrl.min="0";ctrl.step="any";}
  if(type==="text")ctrl.type="text";
  ctrl.value=typeof data[key]==="string"?data[key]:"";
  ctrl.addEventListener("input",persist);field.append(span,ctrl);form.append(field);inputs[key]=ctrl;
 }
 const checklist=node("fieldset","survival-worksheet-checks");checklist.append(node("legend","","Verification checkpoints (not a score)"));
 for(let j=0;j<model.checks.length;j++){const key="check"+j,label=node("label",""),c=node("input","");c.type="checkbox";c.checked=data[key]===true;c.addEventListener("change",persist);inputs[key]=c;label.append(c,node("span","",model.checks[j]));checklist.append(label)}
 form.append(checklist,output,status);
 const buttons=node("div","survival-worksheet-actions"),copy=node("button","","Copy worksheet"),clear=node("button","","Clear saved worksheet");copy.type=clear.type="button";
 copy.addEventListener("click",()=>{const lines=[model.name,...model.fields.map(([key,label])=>label+": "+(inputs[key].value||"Not entered")),...model.checks.map((label,j)=>(inputs["check"+j].checked?"[x] ":"[ ] ")+label),output.textContent].filter(Boolean);const text=lines.join("\n");if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>status.textContent="Copied.").catch(()=>status.textContent="Copy unavailable; select and copy your notes manually.")}else{status.textContent="Clipboard unavailable in this browser.";}}); 
 clear.addEventListener("click",()=>{if(!window.confirm("Clear this worksheet saved on this device?"))return;for(const ctrl of Object.values(inputs)){if(ctrl.type==="checkbox")ctrl.checked=false;else ctrl.value=""}persist()});
 buttons.append(copy,clear);form.append(buttons);compute();
 const pathway=reader.querySelector(".academy-textbook-pathway");if(pathway)pathway.insertAdjacentElement("afterend",card);else reader.prepend(card);
}
list.querySelectorAll(".curriculum-module").forEach((btn,i)=>btn.addEventListener("click",()=>queueMicrotask(()=>attach(i))));
const previous=window.academyOpenLesson;
if(typeof previous==="function")window.academyOpenLesson=i=>{previous(i);queueMicrotask(()=>attach(i));};
})();