(()=>{"use strict";
const academy=document.body.dataset.academy;
const unit=window.academyTextbookV1?.[academy];
if(!unit)return;
const page=document.querySelector("#app .body > .page:nth-of-type(2)");
const list=page?.querySelector(".curriculum-list"),reader=page?.querySelector(".curriculum-reader");
if(!list||!reader)return;
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
function attach(i){
 reader.querySelector(".academy-textbook-v1")?.remove();
 if(i!==unit.module||reader.hidden)return;
 const section=el("section","academy-textbook-v1");
 section.append(el("div","eyebrow","TEXTBOOK READING · LEVEL "+unit.level),el("h2","curriculum-deep-title",unit.title));
 const intro=el("p","curriculum-textbook-intro","Read at your own pace. The short review at the end is optional; there is no examination or written-assignment requirement for this unit.");
 section.append(intro);
 for(const [heading,p1,p2] of unit.sections){
  const chapter=el("section","curriculum-textbook-section");
  chapter.append(el("h3","",heading),el("p","",p1),el("p","",p2));section.append(chapter);
 }
 const worked=el("section","curriculum-textbook-section");
 worked.append(el("h3","","Worked example"),el("p","",unit.worked));section.append(worked);
 const optional=el("details","curriculum-textbook-optional"),summary=el("summary","","Optional further exploration");
 optional.append(summary,el("p","",unit.optionalPrompt));section.append(optional);
 const q=unit.questions?.[0];
 if(q){
  const review=el("details","curriculum-textbook-optional"),heading=el("summary","","Optional one-question review"),group=el("div","curriculum-options"),feedback=el("p","curriculum-feedback");
  feedback.hidden=true;review.append(heading,el("p","",q[0]));
  q[1].forEach((answer,j)=>{
   const button=el("button","curriculum-option",String.fromCharCode(65+j)+". "+answer);
   button.type="button";button.addEventListener("click",()=>{
    group.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
    button.classList.add("selected");feedback.hidden=false;
    feedback.textContent=(j===q[2]?"Correct. ":"Not quite. ")+q[3];
   });group.append(button);
  });review.append(group,feedback);section.append(review);
 }
 reader.append(section);
}
list.querySelectorAll(".curriculum-module").forEach((b,i)=>b.addEventListener("click",()=>queueMicrotask(()=>attach(i))));
const previous=window.academyOpenLesson;
if(typeof previous==="function")window.academyOpenLesson=i=>{previous(i);queueMicrotask(()=>attach(i));};
})();