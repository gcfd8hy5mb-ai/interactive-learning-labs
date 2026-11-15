(()=>{"use strict";
const academy=document.body.dataset.academy;
const chapters=window.academyAppliedBatch4?.[academy];
if(!Array.isArray(chapters))return;
const page=document.querySelector("#app .body > .page:nth-of-type(2)");
const list=page?.querySelector(".curriculum-list"),reader=page?.querySelector(".curriculum-reader");
if(!list||!reader)return;
const key="academy-applied-batch4-"+academy;
const make=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
const records=()=>{try{const x=JSON.parse(localStorage.getItem(key)||"{}");return x&&typeof x==="object"&&!Array.isArray(x)?x:{}}catch(_){return {}}};
const save=x=>{try{localStorage.setItem(key,JSON.stringify(x));return true}catch(_){return false}};
function attach(i){
 if(reader.hidden||!Number.isInteger(i))return;
 reader.querySelector(".academy-applied-batch4")?.remove();
 const selected=chapters.filter(c=>c.module===i);
 if(!selected.length)return;
 const section=make("section","academy-applied-batch4");
 section.append(make("div","eyebrow","APPLIED COURSEWORK · BATCH 4"),make("h2","curriculum-deep-title","Deep-dive lessons"),make("p","","Work through the underlying concepts, interpret a worked example, complete an assignment, and verify understanding. Practice records are separate from earlier grades."));
 for(const c of selected){
   const details=make("details","curriculum-sublesson"),summary=make("summary","",c.title+(records()[c.title]?" ✓":""));
   details.append(summary,make("h3","","Theory and mechanisms"),make("p","",c.theory),make("h3","","Worked example and reasoning"),make("p","",c.worked),make("h3","","Written application"),make("p","",c.assignment));
   const draft=make("textarea","curriculum-draft"),draftKey=key+"-draft-"+c.title;
   draft.rows=6;draft.setAttribute("aria-label","Written application for "+c.title);draft.placeholder="Record your assumptions, calculations, alternatives and conclusion here…";
   try{draft.value=localStorage.getItem(draftKey)||""}catch(_){}
   draft.addEventListener("input",()=>{try{localStorage.setItem(draftKey,draft.value)}catch(_){}});
   details.append(draft,make("h3","","Knowledge check"),make("p","",c.question));
   const choices=make("div","curriculum-options"),feedback=make("div","curriculum-feedback");feedback.hidden=true;
   const action=make("button","curriculum-done",records()[c.title]?"Practice recorded ✓":"Record practice");action.type="button";action.disabled=true;
   let correct=false;
   c.choices.forEach((option,j)=>{const button=make("button","curriculum-option",String.fromCharCode(65+j)+". "+option);button.type="button";button.onclick=()=>{correct=j===c.answer;choices.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));button.classList.add("selected");feedback.hidden=false;feedback.textContent=(correct?"Correct. ":"Not yet. ")+c.explanation;action.disabled=!correct;};choices.append(button)});
   action.onclick=()=>{if(!correct)return;if(draft.value.trim().length<80){feedback.hidden=false;feedback.textContent="Please add at least 80 characters of written reasoning before recording practice.";return;}const x=records();x[c.title]=true;if(!save(x)){feedback.hidden=false;feedback.textContent="The answer is correct, but this browser could not save your practice result.";return;}summary.textContent=c.title+" ✓";action.textContent="Practice recorded ✓";action.disabled=true;feedback.hidden=false;feedback.textContent="Knowledge check and written practice recorded locally. Written answers are not professionally graded.";};
   details.append(choices,feedback,action);section.append(details);
 }
 reader.append(section);
}
[...list.querySelectorAll(".curriculum-module")].forEach((b,i)=>b.addEventListener("click",()=>queueMicrotask(()=>attach(i))));
const prev=window.academyOpenLesson;
if(typeof prev==="function")window.academyOpenLesson=i=>{prev(i);queueMicrotask(()=>attach(i));};
})();