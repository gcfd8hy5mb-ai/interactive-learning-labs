(()=>{"use strict";
const page=document.querySelector("#app .body > .page:nth-of-type(2)");
const list=page?.querySelector(".curriculum-list"),reader=page?.querySelector(".curriculum-reader");
if(!list||!reader)return;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
let selectedView="reading";
function extractRange(parent,start,end){
 const nodes=[...parent.children],a=nodes.indexOf(start),b=end?nodes.indexOf(end):nodes.length;
 if(a<0||b<a)return[];
 return nodes.slice(a,b);
}
function moveRange(parent,start,end,dest){for(const node of extractRange(parent,start,end))dest.append(node);}
function heading(node,title){return node?.tagName==="H3"&&node.textContent.trim()===title;}
function promoteQuestion(container,title,begin,end){
 const nodes=[...container.children],start=nodes.find(n=>heading(n,begin));
 if(!start)return null;
 const stop=end?nodes.find(n=>heading(n,end)):null;
 const block=el("section","academy-questions-item");
 block.append(el("h3","",title));
 moveRange(container,start,stop,block);
 return block;
}
function attach(i){
 if(reader.hidden||reader.querySelector(".academy-lesson-tabs"))return;
 const bank=el("section","academy-question-bank"),reading=el("div","academy-reading-pane");
 bank.id="academy-question-bank-"+document.body.dataset.academy+"-"+i;
 bank.append(el("h2","","Questions & assessments"),el("p","academy-questions-note","All questions and practice assessments for this course are collected here. You can read the chapters without opening this tab."));
 const add=(item)=>{if(item)bank.append(item)};
 // Extract the written portfolio before moving the adjacent mastery question.
 const written=promoteQuestion(reader,"Expanded chapter · Written portfolio","Written portfolio assignment","Chapter mastery question");
 add(written);
 const mastery=promoteQuestion(reader,"Expanded chapter · Mastery question","Chapter mastery question","Knowledge check");
 add(mastery);
 // The original foundational knowledge check consists of five adjacent nodes.
 const knowledge=[...reader.children].find(n=>heading(n,"Knowledge check"));
 if(knowledge){
  const nodes=[...reader.children],index=nodes.indexOf(knowledge),block=el("section","academy-questions-item");
  block.append(el("h3","","Foundational lesson · Knowledge check"));
  for(const node of nodes.slice(index,index+5))block.append(node);
  add(block);
 }
 // Three-question module exam: leave explanatory sublessons in the reading tab.
 const exam=reader.querySelector(".curriculum-course-v3 > .curriculum-exam");
 if(exam){const wrapper=el("section","academy-questions-item");wrapper.append(el("h3","","Module examination"),exam);add(wrapper);}
 // Applied deep-dive chapters: move written prompts and checks, not explanatory content.
 reader.querySelectorAll(".academy-applied-batch4 .curriculum-sublesson").forEach(item=>{
  const title=item.querySelector("summary")?.textContent||"Applied chapter";
  const practice=promoteQuestion(item,title+" · Application and review","Written application",null);
  add(practice);
 });
 // The Survival specialist chapter questions stay functional after moving their DOM elements.
 reader.querySelectorAll(".survival-specialist-lesson").forEach(item=>{
  const title=item.querySelector("summary")?.textContent||"Specialist lesson";
  const question=promoteQuestion(item,title+" · Knowledge check","Knowledge check",null);
  add(question);
 });
 // Textbook single-question reviews are optional and can be opened from the Questions tab.
 reader.querySelectorAll(".academy-textbook-v1 .curriculum-textbook-optional").forEach(item=>{
  if(item.querySelector("summary")?.textContent.trim()==="Optional one-question review"){
   const wrapper=el("section","academy-questions-item");
   const title=item.closest(".academy-textbook-v1")?.querySelector("h2")?.textContent||"Textbook unit";
   wrapper.append(el("h3","",title),item);add(wrapper);
  }
 });
 // Now create compact controls at the start; preserve the original Back to lessons button.
 const tabs=el("div","academy-lesson-tabs");
 tabs.setAttribute("role","tablist");tabs.setAttribute("aria-label","Lesson sections");
 const readBtn=el("button","academy-lesson-tab","Read"),questionBtn=el("button","academy-lesson-tab","Questions");
 readBtn.type=questionBtn.type="button";
 readBtn.setAttribute("role","tab");questionBtn.setAttribute("role","tab");
 tabs.append(readBtn,questionBtn);
 const other=[...reader.children].filter(n=>!n.classList.contains("curriculum-back"));
 for(const node of other)reading.append(node);
 const back=reader.querySelector(".curriculum-back");
 if(back)back.after(tabs,reading,bank);else reader.append(tabs,reading,bank);
 function switchTo(view){
  selectedView=view;
  const isReading=view==="reading";
  reading.hidden=!isReading;bank.hidden=isReading;
  reading.style.display=isReading?"block":"none";bank.style.display=isReading?"none":"block";
  readBtn.classList.toggle("active",isReading);questionBtn.classList.toggle("active",!isReading);
  readBtn.setAttribute("aria-selected",String(isReading));questionBtn.setAttribute("aria-selected",String(!isReading));
 }
 readBtn.onclick=()=>switchTo("reading");questionBtn.onclick=()=>switchTo("questions");
 switchTo("reading");
}
const buttons=[...list.querySelectorAll(".curriculum-module")];
buttons.forEach((b,i)=>b.addEventListener("click",()=>queueMicrotask(()=>attach(i))));
const previous=window.academyOpenLesson;
if(typeof previous==="function")window.academyOpenLesson=i=>{previous(i);queueMicrotask(()=>attach(i));};
})();