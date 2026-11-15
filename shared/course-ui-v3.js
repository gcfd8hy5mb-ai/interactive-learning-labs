(()=>{"use strict";
const academy=document.body.dataset.academy;
const courses=window.academyCourseUnitsV3?.[academy];
if(!Array.isArray(courses)||courses.length!==6)return;
const app=document.getElementById("app");
const library=app?.querySelector(".body > .page:nth-of-type(2)");
const reader=library?.querySelector(".curriculum-reader");
const list=library?.querySelector(".curriculum-list");
const progress=app?.querySelector(".body > .page:nth-of-type(5)");
if(!reader||!list||!progress)return;
const key="academy-module-exam-v3-"+academy;
const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;};
const load=()=>{try{const x=JSON.parse(localStorage.getItem(key)||"{}");return x&&typeof x==="object"&&!Array.isArray(x)?x:{}}catch(_){return {}}};
const save=records=>{try{localStorage.setItem(key,JSON.stringify(records));return true}catch(_){return false}};
function progressPanel(){
 const previous=progress.querySelector("#academy-module-exam-v3");previous?.remove();
 const records=load(),passCount=courses.filter((_,i)=>records[i]?.passed).length;
 const panel=el("section","learning-register");panel.id="academy-module-exam-v3";
 panel.append(el("h2","","Module exams"),el("p","",passCount+" of 6 module exams passed. These results are separate from existing lessons and written assignments."));
 courses.forEach((_,i)=>{
  const title=list.querySelectorAll(".curriculum-module")[i]?.querySelector("strong")?.textContent||"Module "+(i+1);
  const record=records[i];
  panel.append(el("div","learning-progress-row",(record?.passed?"✓ ":"○ ")+title+(Number.isInteger(record?.score)?" · "+record.score+"/3":"")));
 });
 progress.append(panel);
}
function extend(i){
 if(i<0||i>=courses.length||reader.hidden||reader.querySelector(".curriculum-course-v3"))return;

 const subjects=courses[i];
 const block=el("section","curriculum-course-v3");
 block.append(el("h2","curriculum-deep-title","Additional course lessons"));
 subjects.forEach((unit,j)=>{
   const lesson=el("section","curriculum-sublesson");
   lesson.append(el("div","eyebrow","MODULE "+(i+1)+" · LESSON "+(j+3)),el("h3","",unit[0]),el("p","",unit[1]),el("h4","","Practice activity"),el("p","",unit[2]));
   block.append(lesson);
 });
 const exams=[...subjects.map(u=>u[3])];
 const deep=window.academyDeepChapters?.[academy]?.[i];
 if(deep?.quiz)exams.push(deep.quiz);
 if(exams.length!==3)return;
 const exam=el("section","curriculum-exam");
 const previous=load()[i];
 exam.append(el("h3","","Module examination"),el("p","","Three questions assess the additional lessons and expanded chapter. Answer all questions; at least 2 correct are required to pass."));
 const status=el("p","curriculum-exam-status",previous?.passed?"Previously passed · "+previous.score+"/3":"Not yet passed");
 exam.append(status);
 const picked=Array(3).fill(-1);
 exams.forEach((q,qi)=>{
   const field=el("fieldset","curriculum-exam-question");
   field.append(el("legend","",(qi+1)+". "+q[0]));
   q[1].forEach((answer,ai)=>{
     const label=el("label","curriculum-exam-answer"),input=el("input");
     input.type="radio";input.name="course-v3-"+academy+"-"+i+"-"+qi;
     input.value=String(ai);input.onchange=()=>{picked[qi]=ai;feedback.hidden=true};
     label.append(input,el("span","",answer));field.append(label);
   });
   exam.append(field);
 });
 const feedback=el("div","curriculum-feedback");feedback.hidden=true;feedback.style.whiteSpace="pre-line";
 const submit=el("button","curriculum-done","Grade examination");
 submit.onclick=()=>{
   if(picked.includes(-1)){feedback.hidden=false;feedback.textContent="Answer all three questions before grading.";return;}
   const score=exams.reduce((n,q,qi)=>n+(picked[qi]===q[2]?1:0),0),passed=score>=2;
   status.textContent=(passed?"Passed: ":"Attempt: ")+score+"/3";
   feedback.hidden=false;
   feedback.textContent=(passed?"Passed":"Not passed")+" — "+score+"/3.\n"+exams.map((q,qi)=>(qi+1)+". "+(picked[qi]===q[2]?"Correct":"Review needed")+". "+q[3]).join("\n");
   const records=load(),old=records[i];
   if(!old||score>old.score||(passed&&!old.passed))records[i]={score,passed};
   if(!save(records))feedback.textContent+="\nThis device did not allow progress storage.";
   progressPanel();
 };
 exam.append(feedback,submit);block.append(exam);
 reader.append(block);
}
window.academyCourseExtend=extend;
const moduleButtons=[...list.querySelectorAll(".curriculum-module")];
moduleButtons.forEach((b,i)=>b.addEventListener("click",()=>queueMicrotask(()=>extend(i))));
progressPanel();
})();