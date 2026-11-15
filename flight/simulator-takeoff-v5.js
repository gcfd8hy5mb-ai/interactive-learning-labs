(()=>{"use strict";
if(document.body.dataset.academy!=="flight")return;
const page=document.querySelector("#app .body > .page:nth-of-type(3)");
if(!page)return;
page.classList.add("flight-simulator-page","landscape-trainer");
page.innerHTML=`\n<!-- FLIGHT_SIM_BUILD: TAKEOFF_V5 -->
<div class="ls-shell">
 <header class="ls-header"><button type="button" id="ls-exit" class="ls-secondary">‹ Academy</button><div><strong>FLIGHT ACADEMY</strong><small>SIMULATION LAB · SINGLE ENGINE TRAINER</small></div><button type="button" id="ls-brief" class="ls-secondary">Briefing</button></header>
 <div id="ls-rotate" class="ls-rotate"><span class="ls-rotate-icon">⟳</span><b>Turn your iPhone sideways</b><p>Landscape view is designed for the full pilot's-seat cockpit. You can still use this preview in portrait.</p><button type="button" id="ls-dismiss" class="ls-secondary">Use portrait anyway</button></div>
 <div class="ls-cockpit">
  <section class="ls-visual" aria-label="Simulated forward cockpit view">
    <div id="ls-world" class="ls-world"><div class="ls-sky"></div><div class="ls-mountains"></div><div class="ls-terrain"><div class="ls-runway"><div></div></div></div></div>
    <div class="ls-window-frame"></div>
    <div class="ls-training"><span>TRAINING MISSION · 01</span><strong>Take off & touch down</strong><p>Increase throttle, reach flying speed, lift off with the yoke, then descend for a runway landing.</p></div>
    <div class="ls-viewstatus"><span id="ls-flight-status">READY</span><span id="ls-clock">00:00</span></div>
  </section>
  <section class="ls-panel" aria-label="Aircraft instrument panel">
    <div class="ls-instruments">
     <div class="ls-dial-wrap"><label>AIRSPEED</label><div class="ls-dial"><i id="ls-speed-needle" class="ls-needle"></i><strong id="ls-speed">90</strong><small>KTS</small></div></div>
     <div class="ls-dial-wrap"><label>ATTITUDE</label><div class="ls-dial ls-attitude"><div id="ls-attitude-scene" class="ls-attitude-scene"><div class="ls-blue"></div><div class="ls-brown"></div></div><span class="ls-wings">━ ◆ ━</span></div></div>
     <div class="ls-dial-wrap"><label>ALTITUDE</label><div class="ls-dial"><i id="ls-alt-needle" class="ls-needle"></i><strong id="ls-alt">2500</strong><small>FT</small></div></div>
     <div class="ls-dial-wrap"><label>HEADING</label><div class="ls-dial ls-hdg"><div id="ls-compass" class="ls-compass">N &nbsp; E &nbsp; S &nbsp; W</div><strong id="ls-heading">270°</strong><small>HDG</small></div></div>
     <div class="ls-dial-wrap"><label>V/SPEED</label><div class="ls-dial"><i id="ls-vs-needle" class="ls-needle"></i><strong id="ls-vs">0</strong><small>FPM</small></div></div>
    </div>
    <div class="ls-controls">
      <div class="ls-yoke-panel"><div class="ls-control-title">TOUCH YOKE</div><div class="ls-yoke" id="ls-yoke" role="group" aria-label="Touch yoke: drag up or down for pitch, left or right for bank"><div class="ls-yoke-cross"></div><div id="ls-yoke-knob" class="ls-yoke-knob"><span>✛</span></div></div><div class="ls-control-value">PITCH <b id="ls-pitch">0°</b> · BANK <b id="ls-bank">0°</b></div><button class="ls-mini" id="ls-center">Center yoke</button></div>
      <div class="ls-throttle-panel"><div class="ls-control-title">THROTTLE</div><div class="ls-throttle" id="ls-throttle" role="slider" tabindex="0" aria-label="Throttle percentage" aria-valuemin="0" aria-valuemax="100" aria-valuenow="55" aria-valuetext="55 percent"><div class="ls-throttle-track"></div><div class="ls-throttle-markers"><span>100</span><span>75</span><span>50</span><span>25</span><span>IDLE</span></div><div id="ls-throttle-handle" class="ls-throttle-handle"></div></div><b class="ls-control-value"><span id="ls-throttle-text">55</span>%</b></div>
      <div class="ls-switches"><div class="ls-control-title">FLAPS</div><div id="ls-flap-options" class="ls-flaps"><button data-flaps="0" class="active">0°</button><button data-flaps="10">10°</button><button data-flaps="20">20°</button><button data-flaps="30">30°</button></div><div class="ls-control-title ls-trim-title">TRIM</div><div class="ls-trim"><button id="ls-trim-up" aria-label="Increase trim">▲</button><b id="ls-trim">0</b><button id="ls-trim-down" aria-label="Decrease trim">▼</button></div></div>
    </div>
   </section>
  <div class="ls-bottom"><span id="ls-guidance">Adjust controls, then start the training scenario.</span><span id="ls-hold">AWAITING TAKEOFF</span><button id="ls-start" class="ls-primary">Start</button><button id="ls-reset" class="ls-secondary">Reset</button></div>
 </div>
 <p class="ls-disclaimer">Concept demonstration only. Illustrative physics and visuals are not certified or suitable for real flight training.</p>
</div>`;
const $=id=>page.querySelector("#"+id);document.documentElement.dataset.flightBuild="takeoff-v5";const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const base=()=>({throttle:0,pitch:0,bank:0,flaps:0,trim:0,speed:0,alt:0,heading:180,vs:0,seconds:0,hold:0,running:false,complete:false,phase:"Ready for takeoff",airborne:false,offRunway:false});
let state=base(),timer=null,draggingYoke=false,draggingThrottle=false;
function stop(){state.running=false;window.flight3d?.setRunning(false);if(timer){clearInterval(timer);timer=null;}render();}
function reset(){stop();state=base();window.flight3d?.reset();render();}
function updateYoke(e){const box=$("ls-yoke").getBoundingClientRect();const x=clamp((e.clientX-box.left)/box.width,0,1),y=clamp((e.clientY-box.top)/box.height,0,1);state.bank=Math.round((x-.5)*60);state.pitch=Math.round((.5-y)*20);render();}
$("ls-yoke").addEventListener("pointerdown",e=>{draggingYoke=true;$("ls-yoke").setPointerCapture(e.pointerId);updateYoke(e);});
$("ls-yoke").addEventListener("pointermove",e=>{if(draggingYoke)updateYoke(e);});
function releaseYoke(){if(!draggingYoke)return;draggingYoke=false;state.bank=0;state.pitch=0;render();}
$("ls-yoke").addEventListener("pointerup",releaseYoke);$("ls-yoke").addEventListener("pointercancel",releaseYoke);
$("ls-center").addEventListener("click",()=>{state.bank=0;state.pitch=0;render();});
function updateThrottle(e){const track=$("ls-throttle").getBoundingClientRect();const margin=17;state.throttle=Math.round(clamp((track.bottom-margin-e.clientY)/(track.height-2*margin),0,1)*100);render();}
$("ls-throttle").addEventListener("pointerdown",e=>{draggingThrottle=true;$("ls-throttle").setPointerCapture(e.pointerId);updateThrottle(e);});
$("ls-throttle").addEventListener("pointermove",e=>{if(draggingThrottle)updateThrottle(e);});
$("ls-throttle").addEventListener("pointerup",()=>draggingThrottle=false);$("ls-throttle").addEventListener("pointercancel",()=>draggingThrottle=false);
$("ls-throttle").addEventListener("keydown",e=>{const delta=e.key==="ArrowUp"||e.key==="ArrowRight"?5:e.key==="ArrowDown"||e.key==="ArrowLeft"?-5:0;if(delta){e.preventDefault();state.throttle=clamp(state.throttle+delta,0,100);render();}});
$("ls-flap-options").addEventListener("click",e=>{const b=e.target.closest("button[data-flaps]");if(!b)return;state.flaps=Number(b.dataset.flaps);render();});
$("ls-trim-up").addEventListener("click",()=>{state.trim=clamp(state.trim+2,-20,20);render();});
$("ls-trim-down").addEventListener("click",()=>{state.trim=clamp(state.trim-2,-20,20);render();});
$("ls-start").addEventListener("click",()=>{if(state.complete||state.offRunway){reset();return;}if(state.running){stop();return;}if(!window.flight3d?.ready){$("ls-guidance").textContent="3D environment not ready. Check your connection and reload.";return;}state.running=true;window.flight3d.setRunning(true);timer=setInterval(tick,1000);render();});
$("ls-reset").addEventListener("click",reset);
$("ls-brief").addEventListener("click",()=>alert("Takeoff and landing demonstration: push throttle forward, accelerate down the runway, pull back on the virtual yoke above approximately 55 knots, then reduce pitch and power to descend and touch down. Simplified educational physics, not real flight procedures."));
$("ls-exit").addEventListener("click",()=>{stop();const home=document.querySelector("#app .nav button");home?.click();});
$("ls-dismiss").addEventListener("click",()=>{$("ls-rotate").classList.add("dismissed");});
function tick(){
 if(!state.running)return;
 if(!window.flight3d?.ready){stop();return;}
 applyTelemetry(window.flight3d.snapshot());
}
function applyTelemetry(t){
 if(!t)return;
 Object.assign(state,{speed:t.speed,alt:t.alt,vs:t.vs,heading:t.heading,airborne:t.airborne,offRunway:t.offRunway,phase:t.phase,seconds:Math.floor(t.elapsed)});
 if(t.landed){state.complete=true;stop();}
 else if(t.offRunway){stop();}
 else render();
}
window.flightTrainer={
 ready(){window.flight3d?.setControls(state);render();},
 telemetry(t){applyTelemetry(t);},
 failed(msg){$("ls-guidance").textContent=msg;$("ls-start").disabled=true;}
};
function render(){const s=state;
 $("ls-speed").textContent=Math.round(s.speed);$("ls-alt").textContent=Math.round(s.alt).toLocaleString("en-US");$("ls-heading").textContent=Math.round(s.heading)+"°";$("ls-vs").textContent=Math.round(s.vs);
 $("ls-pitch").textContent=s.pitch+"°";$("ls-bank").textContent=s.bank+"°";$("ls-trim").textContent=s.trim;$("ls-throttle-text").textContent=s.throttle;
 $("ls-throttle").setAttribute("aria-valuenow",String(s.throttle));$("ls-throttle").setAttribute("aria-valuetext",s.throttle+" percent");
 $("ls-yoke-knob").style.left=(50+s.bank/30*37)+"%";$("ls-yoke-knob").style.top=(50-s.pitch/10*37)+"%";$("ls-throttle-handle").style.bottom="calc("+s.throttle+"% * .68 + 11%)";
 if(!window.flight3d?.ready)$("ls-world").style.transform="none";window.flight3d?.setControls(s);
 $("ls-attitude-scene").style.transform="translateY("+(s.pitch*1.5)+"px) rotate("+(-s.bank)+"deg) scale(1.7)";
 $("ls-speed-needle").style.transform="translateX(-50%) rotate("+(-115+clamp(s.speed/160,0,1)*230)+"deg)";
 $("ls-alt-needle").style.transform="translateX(-50%) rotate("+((s.alt%1000)/1000*360-135)+"deg)";
 $("ls-vs-needle").style.transform="translateX(-50%) rotate("+(clamp(s.vs/1200,-1,1)*105)+"deg)";
 $("ls-compass").style.transform="translate(-50%,-50%) rotate("+(-s.heading)+"deg)";
 for(const b of $("ls-flap-options").querySelectorAll("button")){b.classList.toggle("active",Number(b.dataset.flaps)===s.flaps);b.setAttribute("aria-pressed",String(Number(b.dataset.flaps)===s.flaps));}
 $("ls-clock").textContent=String(Math.floor(s.seconds/60)).padStart(2,"0")+":"+String(s.seconds%60).padStart(2,"0");
 $("ls-flight-status").textContent=s.complete?"LANDED":s.offRunway?"RESTART REQUIRED":s.running?"SIM ACTIVE":s.seconds?"PAUSED":"READY";
 $("ls-hold").textContent=s.phase.toUpperCase();$("ls-start").textContent=s.complete||s.offRunway?"Try Again":s.running?"Pause":s.seconds?"Resume":"Start";
 $("ls-guidance").textContent=s.complete?"Successful runway touchdown! Reset to try again.":s.offRunway?"You left the runway area. Reset the scenario.":!s.running?"Set throttle to idle, press Start, then increase power for takeoff.":s.airborne?"Airborne: adjust pitch, bank, and power to approach the runway.":s.speed<50?"Accelerating: keep aligned with the runway and build airspeed.":"Apply gentle nose-up yoke input when ready to lift off.";
}
const focus=()=>{const active=page.classList.contains("active");document.body.classList.toggle("flight-sim-focus",active);if(!active&&state.running)stop();};
new MutationObserver(focus).observe(page,{attributes:true,attributeFilter:["class"]});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&state.running)stop();});
focus();render();
})();