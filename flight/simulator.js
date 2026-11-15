(()=>{"use strict";
const page=document.querySelector("#app .body > .page:nth-of-type(3)");
if(!page||document.body.dataset.academy!=="flight")return;
page.classList.add("flight-simulator-page");
page.replaceChildren();
page.innerHTML=`
<div class="flight-console">
  <div class="fs-topline"><div><span class="fs-kicker">FLIGHT OPERATIONS / TRAINING LAB</span><h1>Flight Simulator</h1><p>Single-engine trainer · simplified instrument familiarization</p></div><span class="fs-status" id="fs-state">SIMULATION READY</span></div>
  <div class="fs-bar"><span>SCENARIO <b>01 / STRAIGHT & LEVEL</b></span><span>MODE <b>TRAINING</b></span><button id="fs-brief" class="fs-mini">Briefing</button></div>
  <div class="fs-viewport">
    <div class="fs-world" id="fs-world"><div class="fs-sky"></div><div class="fs-ground"></div><div class="fs-horizon"></div></div>
    <div class="fs-reticle">+</div><div class="fs-view-label">FORWARD VIEW · DEMONSTRATION</div>
    <div class="fs-view-bottom"><span id="fs-view-text">Level attitude · moderate power</span><span id="fs-pause-state">READY</span></div>
  </div>
  <div class="fs-gauges">
    <div class="fs-gauge"><span>AIRSPEED</span><strong id="fs-speed">90</strong><small>KNOTS · INDICATED</small><div class="fs-bar-meter"><i id="fs-speedmeter"></i></div></div>
    <div class="fs-gauge"><span>ALTITUDE</span><strong id="fs-alt">2,500</strong><small>FEET · INDICATED</small><div class="fs-bar-meter"><i id="fs-altmeter"></i></div></div>
    <div class="fs-gauge"><span>HEADING</span><strong id="fs-heading">270°</strong><small>DEGREES</small><div class="fs-bar-meter"><i id="fs-headingmeter"></i></div></div>
    <div class="fs-gauge"><span>VERTICAL SPEED</span><strong id="fs-vs">0</strong><small>FT/MIN</small><div class="fs-bar-meter"><i id="fs-vsmeter"></i></div></div>
  </div>
  <div class="fs-grid">
    <section class="fs-panel"><header><b>FLIGHT CONTROLS</b><small>MANUAL INPUT</small></header>
      <div class="fs-control"><label for="fs-throttle">Throttle <output id="fs-throttle-n">55%</output></label><input id="fs-throttle" type="range" min="0" max="100" value="55"></div>
      <div class="fs-control"><label for="fs-pitch">Pitch <output id="fs-pitch-n">0°</output></label><input id="fs-pitch" type="range" min="-12" max="12" value="0"></div>
      <div class="fs-control"><label for="fs-bank">Bank angle <output id="fs-bank-n">0°</output></label><input id="fs-bank" type="range" min="-35" max="35" value="0"></div>
      <div class="fs-control"><label for="fs-flaps">Flaps <output id="fs-flaps-n">0°</output></label><input id="fs-flaps" type="range" min="0" max="30" step="10" value="0"></div>
      <div class="fs-control"><label for="fs-trim">Elevator trim <output id="fs-trim-n">0%</output></label><input id="fs-trim" type="range" min="-20" max="20" value="0"></div>
      <div class="fs-actions"><button id="fs-start" class="fs-action-primary">Start Simulation</button><button id="fs-reset">Reset</button></div>
    </section>
    <section class="fs-panel"><header><b>TRAINING GUIDANCE</b><small>OBJECTIVE 01</small></header>
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
  $("fs-speedmeter").style.width=clamp(s.speed/150*100,0,100)+"%";
  $("fs-altmeter").style.width=clamp(s.alt/5000*100,0,100)+"%";
  $("fs-headingmeter").style.width=clamp(s.heading/360*100,0,100)+"%";
  $("fs-vsmeter").style.width=clamp((s.vs+1000)/2000*100,0,100)+"%";
  $("fs-world").style.transform="translateY("+(s.pitch*1.7)+"px) rotate("+(-s.bank)+"deg) scale(1.35)";
  $("fs-time").textContent=String(Math.floor(s.seconds/60)).padStart(2,"0")+":"+String(s.seconds%60).padStart(2,"0");
  $("fs-hold").textContent=s.hold+" / 15 s";
  $("fs-state").textContent=s.complete?"OBJECTIVE COMPLETE":s.running?"SIMULATION ACTIVE":"SIMULATION PAUSED";
  $("fs-pause-state").textContent=s.running?"RUNNING":s.complete?"COMPLETED":"PAUSED";
  $("fs-start").textContent=s.running?"Pause Simulation":s.seconds>0?"Resume Simulation":"Start Simulation";
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
document.addEventListener("visibilitychange",()=>{if(document.hidden&&s.running)stop();});
render();
})();