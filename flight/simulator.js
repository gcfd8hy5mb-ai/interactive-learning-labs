(()=>{"use strict";
const page=document.querySelector("#app .body > .page:nth-of-type(3)");
if(!page||document.body.dataset.academy!=="flight")return;
page.classList.add("flight-simulator-page");
page.replaceChildren();
page.innerHTML=`
<div class="flight-console">
  <div class="fs-topline"><button id="fs-exit" class="fs-exit" aria-label="Exit simulator">‹ Academy</button><div class="fs-topline-title"><span class="fs-kicker">FLIGHT TRAINING / SCENARIO 01</span><h1>Single-Engine Flight Trainer</h1></div><span class="fs-status" id="fs-state">READY</span></div>
  <div class="fs-bar"><span>SCENARIO <b>STRAIGHT & LEVEL</b></span><span>TRAINING MODE <b>CONCEPT DEMO</b></span><button id="fs-brief" class="fs-mini">Briefing</button></div>
  <div class="fs-viewport">
    <div class="fs-world" id="fs-world"><div class="fs-sky"></div><div class="fs-ground"><div class="fs-runway"><div class="fs-centerline"></div></div></div><div class="fs-horizon"></div></div><div class="fs-windshield"><i></i><i></i></div><div class="fs-dash-shadow"></div>
    <div class="fs-reticle"><span>┄┄</span>＋<span>┄┄</span></div><div class="fs-view-label">FORWARD VIEW · DEMONSTRATION</div>
    <div class="fs-view-bottom"><span id="fs-view-text">Level attitude · moderate power</span><span id="fs-pause-state">READY</span></div>
  </div>
  <div class="fs-instrument-panel">
    <div class="fs-instrument"><span class="fs-dial-title">AIRSPEED</span><div class="fs-dial fs-airspeed"><i id="fs-speed-needle" class="fs-needle"></i><b id="fs-speed">90</b><small>KTS</small></div></div>
    <div class="fs-instrument"><span class="fs-dial-title">ATTITUDE</span><div class="fs-dial fs-attitude"><div id="fs-attitude-scene" class="fs-attitude-scene"><div class="fs-attitude-sky"></div><div class="fs-attitude-ground"></div></div><div class="fs-attitude-wings">━ ◆ ━</div></div></div>
    <div class="fs-instrument"><span class="fs-dial-title">ALTITUDE</span><div class="fs-dial fs-altitude"><i id="fs-alt-needle" class="fs-needle"></i><b id="fs-alt">2,500</b><small>FT</small></div></div>
    <div class="fs-instrument"><span class="fs-dial-title">HEADING</span><div class="fs-dial fs-heading"><div id="fs-compass" class="fs-compass-ring">N · E · S · W</div><b id="fs-heading">270°</b><small>HDG</small></div></div>
  </div>
  <div class="fs-secondary-readouts"><span>VERTICAL SPEED <b id="fs-vs">0</b> FT/MIN</span><span>THROTTLE <b id="fs-quick-throttle">55</b>%</span><span>FLAPS <b id="fs-quick-flaps">0</b>°</span></div>
  <div class="fs-primary-actions"><button id="fs-start" class="fs-action-primary">Start Simulation</button><button id="fs-reset">Reset</button></div>
  <div class="fs-grid">
    <section class="fs-panel"><header><b>FLIGHT CONTROLS</b><small>LIVE INPUT</small></header>
      <div class="fs-control"><label for="fs-throttle">Throttle <output id="fs-throttle-n">55%</output></label><input id="fs-throttle" type="range" min="0" max="100" value="55"></div>
      <div class="fs-control"><label for="fs-pitch">Pitch <output id="fs-pitch-n">0°</output></label><input id="fs-pitch" type="range" min="-12" max="12" value="0"></div>
      <div class="fs-control"><label for="fs-bank">Bank angle <output id="fs-bank-n">0°</output></label><input id="fs-bank" type="range" min="-35" max="35" value="0"></div>
      <div class="fs-control"><label for="fs-flaps">Flaps <output id="fs-flaps-n">0°</output></label><input id="fs-flaps" type="range" min="0" max="30" step="10" value="0"></div>
      <div class="fs-control"><label for="fs-trim">Elevator trim <output id="fs-trim-n">0%</output></label><input id="fs-trim" type="range" min="-20" max="20" value="0"></div>
      
    </section>
    <section class="fs-panel fs-training-panel"><header><b>TRAINING GUIDANCE</b><small>OBJECTIVE 01</small></header>
      <div class="fs-objective">Maintain a stable, nearly level flight attitude for 15 simulated seconds.</div>
      <p class="fs-guidance" id="fs-guidance" aria-live="polite">Use the controls to explore how a conceptual trainer responds. Start the scenario when ready.</p>
      <div class="fs-data"><span>ELAPSED SIM TIME</span><strong id="fs-time">00:00</strong></div>
      <div class="fs-data"><span>OBJECTIVE HOLD</span><strong id="fs-hold">0 / 15 s</strong></div>
      <div class="fs-data"><span>LESSON STATUS</span><strong id="fs-objective-status">NOT STARTED</strong></div>
      <div class="fs-disclaimer">Educational prototype only. Simplified instrument values are illustrative, not validated aircraft dynamics or flight instruction.</div>
    </section>
  </div>
</div>`;
const $=id=>page.querySelector("#"+id);
const initial=()=>({throttle:55,pitch:0,bank:0,flaps:0,trim:0,speed:90,alt:2500,heading:270,vs:0,seconds:0,hold:0,running:false,complete:false});
let s=initial(),timer=null;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function readInputs(){for(const id of ["throttle","pitch","bank","flaps","trim"])s[id]=Number($("fs-"+id).value);}
function render(){
  for(const [id,suffix] of [["throttle","%"],["pitch","°"],["bank","°"],["flaps","°"],["trim","%"]])$("fs-"+id+"-n").textContent=s[id]+suffix;
  $("fs-speed").textContent=Math.round(s.speed);
  $("fs-alt").textContent=Math.round(s.alt).toLocaleString("en-US");
  $("fs-heading").textContent=Math.round(s.heading)+"°";
  $("fs-vs").textContent=Math.round(s.vs);
  $("fs-speed-needle").style.transform="translateX(-50%) rotate("+(-120+clamp(s.speed/160,0,1)*240)+"deg)";
  $("fs-alt-needle").style.transform="translateX(-50%) rotate("+((s.alt%1000)/1000*360-135)+"deg)";
  $("fs-compass").style.transform="translate(-50%,-50%) rotate("+(-s.heading)+"deg)";
  $("fs-attitude-scene").style.transform="translateY("+(s.pitch*1.5)+"px) rotate("+(-s.bank)+"deg) scale(1.7)";
  $("fs-quick-throttle").textContent=s.throttle;
  $("fs-quick-flaps").textContent=s.flaps;
  $("fs-world").style.transform="translateY("+(s.pitch*2.4)+"px) rotate("+(-s.bank)+"deg) scale(1.45)";
  $("fs-time").textContent=String(Math.floor(s.seconds/60)).padStart(2,"0")+":"+String(s.seconds%60).padStart(2,"0");
  $("fs-hold").textContent=s.hold+" / 15 s";
  $("fs-state").textContent=s.complete?"COMPLETE":s.running?"ACTIVE":s.seconds>0?"PAUSED":"READY";
  $("fs-pause-state").textContent=s.running?"RUNNING":s.complete?"COMPLETED":"PAUSED";
  $("fs-start").textContent=s.running?"Pause":s.seconds>0?"Resume":"Start Simulation";
  $("fs-objective-status").textContent=s.complete?"COMPLETE":s.running?"IN PROGRESS":"NOT STARTED";
  const stable=Math.abs(s.pitch)<=2&&Math.abs(s.bank)<=5&&s.speed>=70&&s.speed<=120;
  $("fs-view-text").textContent=stable?"Stable attitude · monitor instruments":Math.abs(s.bank)>5?"Bank angle outside training target":Math.abs(s.pitch)>2?"Adjust pitch toward level":"Check indicated airspeed";
  $("fs-guidance").textContent=s.complete?"Objective completed in the conceptual simulator. Reset to try again.":!s.running?"Review the flight instruments and press Start to begin.":stable?"Good. Maintain the current attitude and airspeed to accumulate objective time.":"Adjust pitch and bank toward zero; aim for an indicated speed of 70–120 knots.";
}
function step(){if(!s.running)return;readInputs();s.seconds++;
  const targetSpeed=clamp(90+(s.throttle-55)*.75-s.pitch*1.8-s.flaps*.5,35,155);
  s.speed+=(targetSpeed-s.speed)*.2;
  s.vs=clamp(s.pitch*85+(s.trim*.5)-(s.flaps*2),-1200,1200);
  s.alt=clamp(s.alt+s.vs/60,0,8000);
  s.heading=(s.heading+s.bank*.2+360)%360;
  const stable=Math.abs(s.pitch)<=2&&Math.abs(s.bank)<=5&&s.speed>=70&&s.speed<=120;
  s.hold=stable?s.hold+1:0;
  if(s.hold>=15){s.complete=true;s.running=false;clearInterval(timer);timer=null;}
  render();
}
function stop(){s.running=false;if(timer){clearInterval(timer);timer=null;}render();}
$("fs-start").addEventListener("click",()=>{if(s.complete)return;if(s.running){stop();return;}readInputs();s.running=true;timer=setInterval(step,1000);render();});
$("fs-reset").addEventListener("click",()=>{stop();s=initial();for(const id of ["throttle","pitch","bank","flaps","trim"])$("fs-"+id).value=s[id];render();});
for(const id of ["throttle","pitch","bank","flaps","trim"])$("fs-"+id).addEventListener("input",()=>{readInputs();render();});
$("fs-brief").addEventListener("click",()=>{alert("MISSION BRIEFING — STRAIGHT AND LEVEL\\n\\nAdjust the conceptual throttle, pitch and bank controls. Hold pitch within ±2°, bank within ±5°, and indicated airspeed within 70–120 knots for 15 consecutive simulated seconds.\\n\\nThis is an educational demonstration, not a pilot certification or real-world flight model.");});
const syncFocus=()=>{document.body.classList.toggle("flight-sim-focus",page.classList.contains("active"));if(!page.classList.contains("active")&&s.running)stop();};
new MutationObserver(syncFocus).observe(page,{attributes:true,attributeFilter:["class"]});
$("fs-exit").addEventListener("click",()=>{stop();const home=document.querySelector("#app .nav button");if(home)home.click();});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&s.running)stop();});
syncFocus();
render();
})();