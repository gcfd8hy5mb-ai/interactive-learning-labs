(()=>{"use strict";
const academy=document.body.dataset.academy;
const raw=window.academyTextbookV1?.[academy];
const units=Array.isArray(raw)?raw:raw?[raw]:[];
if(!units.length)return;
const page=document.querySelector("#app .body > .page:nth-of-type(2)");
const list=page?.querySelector(".curriculum-list"),reader=page?.querySelector(".curriculum-reader");
if(!list||!reader)return;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
function attach(i){
 reader.querySelectorAll(".academy-textbook-v1").forEach(n=>n.remove());
 if(reader.hidden||!Number.isInteger(i))return;
 for(const unit of units.filter(v=>v.module===i)){
  const section=el("section","academy-textbook-v1");
  section.append(el("div","eyebrow","TEXTBOOK READING · LEVEL "+unit.level),el("h2","curriculum-deep-title",unit.title));
  section.append(el("p","curriculum-textbook-intro","This is reading-first coursework. Optional exploration and a single review question are available at the end; no mandatory written assignment or examination is added."));
  for(const [heading,p1,p2] of unit.sections){
    const ch=el("section","curriculum-textbook-section");
    ch.append(el("h3","",heading),el("p","",p1),el("p","",p2));section.append(ch);
  }
  const worked=el("section","curriculum-textbook-section");
  worked.append(el("h3","","Worked example and interpretation"),el("p","",unit.worked));section.append(worked);
  if(unit.optionalPrompt){
    const extra=el("details","curriculum-textbook-optional");
    extra.append(el("summary","","Optional further exploration"),el("p","",unit.optionalPrompt));section.append(extra);
  }
  const q=unit.questions?.[0];
  if(q){
   const review=el("details","curriculum-textbook-optional"),group=el("div","curriculum-options"),feedback=el("p","curriculum-feedback");
   feedback.hidden=true;review.append(el("summary","","Optional one-question review"),el("p","",q[0]));
   q[1].forEach((answer,j)=>{
    const b=el("button","curriculum-option",String.fromCharCode(65+j)+". "+answer);
    b.type="button";b.onclick=()=>{
     group.querySelectorAll("button").forEach(btn=>btn.classList.remove("selected"));b.classList.add("selected");
     feedback.hidden=false;feedback.textContent=(j===q[2]?"Correct. ":"Not quite. ")+q[3];
    };group.append(b);
   });review.append(group,feedback);section.append(review);
  }
  reader.append(section);
 }
}
list.querySelectorAll(".curriculum-module").forEach((btn,i)=>btn.addEventListener("click",()=>queueMicrotask(()=>attach(i))));
const previous=window.academyOpenLesson;
if(typeof previous==="function")window.academyOpenLesson=i=>{previous(i);queueMicrotask(()=>attach(i));};
})();