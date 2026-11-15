/* Flight Academy 3D runway prototype. Babylon.js is used for visual rendering only.
   Simplified educational kinematics; NOT certified or suitable for real flight. */
(()=>{"use strict";
const surface=document.getElementById("ls-world");
if(!surface)return;
const host=window.flightTrainer;
if(!window.BABYLON){host?.failed?.("3D library unavailable. Check your network and reload.");return;}
const B=window.BABYLON;
const canvas=document.createElement("canvas");
canvas.id="flight3d-canvas";
canvas.setAttribute("aria-label","Real-time three-dimensional airport, runway and moving pilot-eye camera");
canvas.style.cssText="width:100%;height:100%;display:block;touch-action:none";
surface.replaceChildren(canvas);
surface.classList.add("ls-3d-host");
let engine,scene,camera;
try{
engine=new B.Engine(canvas,true,{preserveDrawingBuffer:false,stencil:false,antialias:false,powerPreference:"low-power"});
engine.setHardwareScalingLevel(Math.max(1,Math.min(2.1,window.devicePixelRatio||1)));
scene=new B.Scene(engine);
scene.clearColor=new B.Color4(.53,.72,.86,1);
scene.fogMode=B.Scene.FOGMODE_LINEAR;scene.fogStart=550;scene.fogEnd=3600;scene.fogColor=new B.Color3(.66,.76,.82);
const light=new B.HemisphericLight("sky-light",new B.Vector3(0,1,0),scene);light.intensity=.9;
const sun=new B.DirectionalLight("sun",new B.Vector3(-.5,-.9,.35),scene);sun.intensity=.68;
const mat=(name,hex)=>{const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.03,.03,.03);return m;};
const grass=mat("grass","#5B7455"),field2=mat("field alternate","#6A8057"),runway=mat("asphalt","#414C55"),pavement=mat("taxiway","#626A6D"),white=mat("runway stripes","#E6E6DD"),yellow=mat("runway yellow","#DDC27C"),pine=mat("trees","#294F3D"),pine2=mat("trees 2","#38644D"),trunk=mat("trunk","#554B3E"),hanger=mat("hangars","#8B9CA3"),roof=mat("hangar roof","#425361"),lightmat=mat("runway edge lights","#E9DDA8");
function box(name,w,h,d,x,y,z,m){const mesh=B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);mesh.position.set(x,y,z);mesh.material=m;return mesh;}
const ground=B.MeshBuilder.CreateGround("terrain",{width:10000,height:10000,subdivisions:1},scene);ground.position.y=-.09;ground.material=grass;
for(let i=0;i<12;i++){box("field "+i,120+i%3*45,.02,400,-450-i*140,-.065,-1300+i*300,i%2?grass:field2);box("field east "+i,120,.02,350,430+i*130,-.065,-1250+i*250,i%2?grass:field2);}
box("runway 18/36",46,.08,1800,0,.00,0,runway);
box("parallel taxiway",15,.05,1600,110,-.003,20,pavement);
for(let z=-835;z<=840;z+=65)box("centerline "+z,1.5,.015,29,0,.05,z,white);
for(let z of [-810,810])for(let i=-2;i<=2;i++){box("threshold "+z+" "+i,2.3,.016,28,i*5,.055,z,white);}
for(let z=-870;z<=870;z+=65){for(const side of [-1,1]){box("edge light "+z+side,.65,.45,.65,side*23.5,.27,z,lightmat);}}
for(let i=0;i<36;i++){const z=-1100+i*86,x=100+((i*127)%250);for(const sign of [-1,1]){const tx=sign*x;const stem=B.MeshBuilder.CreateCylinder("tree trunk",{diameter:1.4,height:6,tessellation:5},scene);stem.position.set(tx,3,z);stem.material=trunk;const cone=B.MeshBuilder.CreateCylinder("fir",{diameterTop:0,diameterBottom:9+(i%4),height:17+(i%6)*2,tessellation:5},scene);cone.position.set(tx,13,z);cone.material=i%3?pine:pine2;}}
for(let i=0;i<8;i++){const x=190+(i%3)*48,z=380+Math.floor(i/3)*90;box("hangar "+i,36,16,42,x,8,z,hanger);box("roof "+i,40,3,46,x,17,z,roof);}
// Taxiway entrances, apron and runway touchdown-zone marks create visible parallax.
box("airport apron",180,.025,220,206,.02,510,pavement);
for(const z of [-550,-200,220,600]){
  box("taxiway connector "+z,130,.028,11,67,.035,z,pavement);
  for(const side of [-1,1])box("touchdown bar "+z+" "+side,8,.022,1.6,side*13,.065,z,white);
}
for(const z of [-775,775]){
  for(const side of [-1,1])for(let i=0;i<3;i++)box("threshold stripe "+z+" "+side+" "+i,2,.022,18,side*(4+i*5),.072,z,white);
}
for(let i=0;i<16;i++){
 const z=-1000+i*140;
 const x=(i%2===0?-1:1)*(365+(i%3)*70);
 const hill=B.MeshBuilder.CreateCylinder("distant hillside "+i,{diameterTop:0,diameterBottom:300,height:70+(i%4)*22,tessellation:5},scene);
 hill.position.set(x,10,z);hill.material=i%2?field2:grass;
}
box("tower",13,43,13,280,21,500,hanger);box("tower cab",22,9,22,280,46,500,roof);
for(let z=-1200;z<=1200;z+=100){box("far fence left "+z,1,1,12,-310,.4,z,roof);box("far fence right "+z,1,1,12,310,.4,z,roof);}
camera=new B.FreeCamera("pilot seat",new B.Vector3(0,2.0,-780),scene);
camera.fov=1.05;camera.minZ=.15;camera.maxZ=4500;camera.inputs.clear();scene.activeCamera=camera;
}catch(err){host?.failed?.("Could not initialize the 3D environment: "+err.message);try{engine?.dispose();}catch(_){}return;}
const start=()=>({x:0,z:-780,y:0,speed:0,vy:0,yaw:0,pitch:0,bank:0,heading:180,airborne:false,landed:false,offRunway:false,touchdowns:0,phase:"Ready for takeoff",elapsed:0,landingRating:"",scenario:"takeoff",groundRoll:0,touchedDown:false,touchdownSpeed:0,touchdownVSpeed:0,touchdownCrossTrack:0,score:0});
let plane=start(),controls={throttle:0,pitch:0,bank:0,trim:0,flaps:0,brake:0},running=false,emitElapsed=0,lastElapsed=performance.now();
function setControls(next){for(const k of Object.keys(controls))if(Number.isFinite(Number(next[k])))controls[k]=Number(next[k]);}
function reset(){plane=start();running=false;setControls({throttle:0,pitch:0,bank:0,trim:0,flaps:0,brake:0});paint();}
function landingPractice(){
 plane={...start(),x:0,z:-650,y:24,speed:35,vy:-1.3,airborne:true,phase:"Final approach",scenario:"landing"};
 running=false;setControls({throttle:36,pitch:-1,bank:0,trim:0,flaps:10,brake:0});paint();
}
function snapshot(){return {speed:plane.speed*1.943844,alt:plane.y*3.28084,vs:plane.vy*196.8504,heading:(180+plane.yaw*180/Math.PI+360)%360,airborne:plane.airborne,landed:plane.landed,offRunway:plane.offRunway,phase:plane.phase,x:plane.x,z:plane.z,elapsed:plane.elapsed,landingRating:plane.landingRating,scenario:plane.scenario,touchedDown:plane.touchedDown,score:plane.score,crossTrack:plane.x,runwayRemaining:900-plane.z,touchdownSpeed:plane.touchdownSpeed,touchdownVSpeed:plane.touchdownVSpeed};}
function advance(dt){
 if(!running||plane.landed||plane.offRunway)return;
 const p=plane,c=controls;
 p.elapsed+=dt;
 const throttle=clamp(c.throttle/100,0,1);
 // Simplified educational model, tuned for controllable mobile scenarios.
 const drag=.00115*p.speed*p.speed;
 const brakes=!p.airborne?clamp(c.brake,0,1)*5.2:0;
 const power=throttle*(p.airborne?3.9:4.6);
 const acceleration=power-(p.airborne?.8:.45)-drag-brakes;
 p.speed=clamp(p.speed+acceleration*dt,0,67);
 p.pitch+=(c.pitch-p.pitch)*Math.min(1,dt*2.1);
 p.bank+=(c.bank-p.bank)*Math.min(1,dt*1.7);
 if(!p.airborne){
   p.groundRoll+=p.speed*dt;
   if(p.scenario==="takeoff"&&!p.touchedDown&&p.speed>=27&&p.pitch>3){
     p.airborne=true;p.y=.3;p.vy=1.2;p.phase="Liftoff";
   }else if(p.touchedDown){
     p.phase=p.speed>2?"Landing rollout — use BRAKE":"Stopped on runway";
     if(p.speed<=2){
       p.landed=true;
       p.score=Math.round(clamp(100-Math.abs(p.touchdownCrossTrack)*2.2-Math.max(0,Math.abs(p.touchdownVSpeed)-200)*.08-Math.abs(p.touchdownSpeed-65)*.5,0,100));
       p.phase="Landing complete — "+p.score+"/100";
     }
   }else p.phase=p.speed<1?"Ready for takeoff":p.speed<27?"Takeoff roll":"Rotation speed reached";
 }else{
   const bankPenalty=Math.abs(p.bank)*.023;
   const energy=(p.speed-30)*.085;
   const climbTarget=clamp(p.pitch*.48+energy+c.trim*.034-bankPenalty-1,-6.5,5.8);
   p.vy+=(climbTarget-p.vy)*Math.min(1,dt*1.35);
   p.y+=p.vy*dt;
   p.phase=p.vy>0.6?"Climbing":p.vy<-.65?"Descending":"Level flight";
   if(p.scenario==="landing"&&p.y<45)p.phase="Final approach";
 }
 const turnFactor=clamp(p.speed/30,0,1.8);
 p.yaw+=p.bank*Math.PI/180*dt*turnFactor*.29;
 p.x+=Math.sin(p.yaw)*p.speed*dt;
 p.z+=Math.cos(p.yaw)*p.speed*dt;
 if(!p.airborne&&(Math.abs(p.x)>24||p.z>900||p.z < -900)&&p.speed>5){
   p.offRunway=true;p.phase=p.touchedDown?"Runway excursion after touchdown":"Runway excursion — reset";
 }
 if(p.airborne&&p.y<=0){
   p.y=0;p.airborne=false;
   const onRunway=Math.abs(p.x)<21&&Math.abs(p.z)<850;
   const stable=p.speed>=23&&p.speed<=45&&p.vy> -3.8&&Math.abs(p.bank)<12&&Math.abs(p.pitch)<11;
   p.touchdownSpeed=p.speed*1.943844;
   p.touchdownVSpeed=p.vy*196.8504;
   p.touchdownCrossTrack=p.x;
   p.landingRating=onRunway&&stable?"Controlled touchdown":onRunway?"Hard touchdown":"Outside runway";
   p.vy=0;
   if(onRunway&&stable){
     p.touchedDown=true;p.phase="Touchdown — reduce throttle and brake";
   }else{
     p.offRunway=true;p.phase=p.landingRating+" — reset";
   }
 }
 if(p.airborne&&p.speed<22)p.phase="Low airspeed — reduce pitch or increase power";
 if(p.airborne&&p.z>1350)p.phase="Past airfield — use Landing Practice";
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function paint(){const p=plane;
 const target=new B.Vector3(p.x,p.y+2.25,p.z);
 const blend=running?.17:1;
 camera.position=B.Vector3.Lerp(camera.position,target,blend);
 camera.rotation.x+=(-p.pitch*Math.PI/180-camera.rotation.x)*blend;
 camera.rotation.y+=(p.yaw-camera.rotation.y)*blend;
 camera.rotation.z+=(-p.bank*Math.PI/180-camera.rotation.z)*blend;
}
const onResize=()=>engine.resize();window.addEventListener("resize",onResize);
const observer=typeof ResizeObserver==="function"?new ResizeObserver(onResize):null;observer?.observe(surface);
engine.runRenderLoop(()=>{
const now=performance.now(),dt=clamp((now-lastElapsed)/1000,0,.05);lastElapsed=now;
const active=document.querySelector(".flight-simulator-page")?.classList.contains("active")&&!document.hidden;
if(active){if(running)advance(dt);paint();scene.render();emitElapsed+=dt;if(emitElapsed>.15){emitElapsed=0;host?.telemetry?.(snapshot());}}
});
document.addEventListener("visibilitychange",()=>{if(document.hidden)running=false;});
document.documentElement.dataset.flight3d="ready";window.flight3d={ready:true,setControls,setRunning(v){running=!!v;lastElapsed=performance.now();},reset,landingPractice,snapshot};
host?.ready?.();
})();