(()=>{"use strict";
if(document.body.dataset.academy!=="survival")return;
const content=window.survivalSpecializationV1;if(!content)return;
const library=document.querySelector("#app .body > .page:nth-of-type(2)"),list=library?.querySelector(".curriculum-list"),reader=library?.querySelector(".curriculum-reader");
if(!list||!reader)return;
const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n};
const getKey=key=>"survival-specialization-v1-"+key;
const read=key=>{try{const v=JSON.parse(localStorage.getItem(getKey(key))||"[]");return Array.isArray(v)?v:[]}catch(_){return []}};
const store=(key,arr)=>{try{localStorage.setItem(getKey(key),JSON.stringify(arr));return true}catch(_){return false}};
function attach(index){
 const isNav=index===0,isCollapse=index===2;
 if(!isNav&&!isCollapse||reader.hidden)return;
 reader.querySelector(".survival-specialization")?.remove();
 const kind=isNav?"navigation":"collapse",data=content[kind],record=read(kind);
 const section=el("section","survival-specialization");
 section.append(el("div","eyebrow",isNav?"FIELD SPECIALIZATION · LAND NAVIGATION":"LONG-TERM SURVIVAL · SYSTEMS COLLAPSE"),el("h2","",isNav?"Land navigation: advanced study path":"Long-term survival after infrastructure failure"),el("p","",isNav?"Build map and compass literacy, terrain judgment, route planning, error correction, and safe lost-person decisions. Navigation exercises should be conducted on designated, safe routes.":"Study how to preserve health and cooperate through prolonged disruptions of water, electricity, food supply, healthcare, communications and local services. Scenario-based planning does not presume collapse is inevitable."));
 section.append(el("p","survival-specialization-count",record.length+" / "+data.length+" specialist lessons completed locally"));
 data.forEach((unit,i)=>{
 const article=el("details","survival-specialist-lesson"),title=el("summary","",String(i+1).padStart(2,"0")+" · "+unit[0]+(record.includes(i)?" ✓":""));article.append(title);
 article.append(el("h3","","Theory and decision principles"),el("p","",unit[1]),el("h3","","Applied field or planning exercise"),el("p","",unit[2]),el("h3","","Knowledge check"),el("p","",unit[3]));
 const opts=el("div","curriculum-options"),feedback=el("div","curriculum-feedback");feedback.hidden=true;
 const done=el("button","curriculum-done",record.includes(i)?"Lesson completed ✓":"Record specialist lesson");done.disabled=true;
 let correct=false;
 unit[4].forEach((answer,j)=>{const btn=el("button","curriculum-option",String.fromCharCode(65+j)+". "+answer);btn.type="button";btn.onclick=()=>{correct=j===unit[5];opts.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");feedback.hidden=false;feedback.textContent=(correct?"Correct. ":"Review this section. ")+unit[6];done.disabled=!correct};opts.append(btn)});
 done.onclick=()=>{if(!correct)return;const current=read(kind);if(!current.includes(i))current.push(i);if(!store(kind,current)){feedback.hidden=false;feedback.textContent="Your answer is correct, but local storage is unavailable on this device.";return;}done.disabled=true;done.textContent="Lesson completed ✓";title.textContent=String(i+1).padStart(2,"0")+" · "+unit[0]+" ✓";section.querySelector(".survival-specialization-count").textContent=read(kind).length+" / "+data.length+" specialist lessons completed locally"};
 article.append(opts,feedback,done);section.append(article)
 });
 const source=el("p","curriculum-note",isNav?"Reference: USGS Finding Your Way With Map and Compass, plus current local mapping and declination data.":"References: CDC emergency water guidance and locally applicable emergency-management instructions. This is educational preparation, not a guarantee of safety.");
 section.append(source);
 reader.append(section);
}
const buttons=[...list.querySelectorAll(".curriculum-module")];
[0,2].forEach(i=>buttons[i]?.addEventListener("click",()=>queueMicrotask(()=>attach(i))));
const original=window.academyOpenLesson;
if(typeof original==="function")window.academyOpenLesson=i=>{original(i);queueMicrotask(()=>attach(i))};
})();