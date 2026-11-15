(()=>{"use strict";
if(document.body.dataset.academy!=="survival")return;
const chapters=window.survivalAppliedV2;
const page=document.querySelector("#app .body > .page:nth-of-type(2)");
const list=page?.querySelector(".curriculum-list"),reader=page?.querySelector(".curriculum-reader");
if(!Array.isArray(chapters)||chapters.length!==6||!reader||!list)return;
const make=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
const storageKey="survival-applied-v2";
const load=()=>{try{const x=JSON.parse(localStorage.getItem(storageKey)||"{}");return x&&typeof x==="object"&&!Array.isArray(x)?x:{}}catch(_){return {}}};
function extend(index){
 if(!Number.isInteger(index)||index<0||index>=6||reader.hidden)return;
 reader.querySelector(".survival-applied-v2")?.remove();
 const section=make("section","survival-specialization survival-applied-v2");
 section.append(make("div","eyebrow","APPLIED COURSEWORK · LEVEL 1–2"),make("h2","","Field & Resilience Applications"),make("p","","Work through the decisions, identify the uncertainties, and test your understanding. Completing a question records practice on this device; these activities do not provide professional qualifications."));
 const past=load();
 chapters[index].forEach((unit,j)=>{
  const id=index+"-"+j,article=make("details","survival-specialist-lesson"),summary=make("summary","",String(j+1).padStart(2,"0")+" · "+unit[0]+(past[id]?" ✓":""));
  article.append(summary,make("h3","","Conceptual framework"),make("p","",unit[1]),make("h3","","Key mechanisms and constraints"),make("p","",unit[2]),make("h3","","Applied exercise"),make("p","",unit[3]),make("h3","","Knowledge check"),make("p","",unit[4]));
  const options=make("div","curriculum-options"),notice=make("div","curriculum-feedback");notice.hidden=true;
  let answer=-1;
  unit[5].forEach((text,j)=>{
   const b=make("button","curriculum-option",String.fromCharCode(65+j)+". "+text);b.type="button";
   b.onclick=()=>{answer=j;options.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");notice.hidden=false;notice.textContent=(answer===unit[6]?"Correct. ":"Review the explanation. ")+unit[7];record.disabled=answer!==unit[6];};
   options.append(b);
  });
  const record=make("button","curriculum-done",past[id]?"Previously recorded ✓":"Record knowledge check");record.type="button";record.disabled=true;
  record.onclick=()=>{if(answer!==unit[6])return;const x=load();x[id]=true;try{localStorage.setItem(storageKey,JSON.stringify(x));summary.textContent=String(j+1).padStart(2,"0")+" · "+unit[0]+" ✓";record.textContent="Recorded ✓";record.disabled=true;}catch(_){notice.hidden=false;notice.textContent="Correct, but browser storage is unavailable; no completion was saved."}};
  article.append(options,notice,record);section.append(article);
 });
 reader.append(section);
}
const buttons=[...list.querySelectorAll(".curriculum-module")];
buttons.forEach((b,i)=>b.addEventListener("click",()=>queueMicrotask(()=>extend(i))));
const prev=window.academyOpenLesson;
if(typeof prev==="function")window.academyOpenLesson=i=>{prev(i);queueMicrotask(()=>extend(i))};
})();