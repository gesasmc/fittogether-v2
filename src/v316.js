// FitTogether V2.0.148: lightweight contextual popup tutorial.
const TUTORIAL_DONE_316='ft-tutorial-v316-done'
const TUTORIAL_RESTART_316='ft-tutorial-v316-restart'
const steps316=[
 {sel:'.today',title:'Dein nächstes Workout',text:'Hier findest du dein nächstes Training und kommst direkt zu deinen Workouts.'},
 {sel:'.start-strip',title:'Training starten',text:'Mit diesem Button startest du direkt ins Training.'},
 {sel:'.profile-shortcut',title:'Profil & Gewicht',text:'Hier erreichst du dein Profil und deine Gewichtsdaten.'},
 {sel:'.bottom-nav button:nth-child(2),nav button:nth-child(2)',title:'Workouts',text:'Hier findest du Trainingspläne, freie Trainings und deine Übungen.'},
 {sel:'.bottom-nav button:nth-child(3),nav button:nth-child(3)',title:'Fortschritt',text:'Deine Statistiken und Trainingsentwicklung findest du hier.'},
 {sel:'.bottom-nav button:last-child,nav button:last-child',title:'Mehr & Einstellungen',text:'Unter Mehr findest du Einstellungen, Erinnerungen und kannst dieses Tutorial erneut starten.'}
]
let running316=false,index316=0,overlay316=null,target316=null
const find316=s=>{for(const q of s.split(',')){const el=document.querySelector(q.trim());if(el&&el.offsetParent!==null)return el}return null}
const clean316=()=>{target316?.classList.remove('ft-tutorial-target-v316');target316=null;overlay316?.remove();overlay316=null}
const finish316=(done=true)=>{clean316();running316=false;document.documentElement.classList.remove('ft-tutorial-open-v316');if(done)try{localStorage.setItem(TUTORIAL_DONE_316,'1')}catch{}}
const render316=()=>{clean316();if(!running316)return;let step=steps316[index316],el=find316(step.sel);if(!el){index316++;if(index316>=steps316.length)return finish316();return render316()}target316=el;el.classList.add('ft-tutorial-target-v316');el.scrollIntoView?.({behavior:'smooth',block:'center'});overlay316=document.createElement('div');overlay316.className='ft-tutorial-overlay-v316';overlay316.innerHTML=`<div class="ft-tutorial-dim-v316"></div><div class="ft-tutorial-pop-v316"><div class="ft-tutorial-count-v316">${index316+1} / ${steps316.length}</div><strong>${step.title}</strong><p>${step.text}</p><div class="ft-tutorial-actions-v316"><button class="ft-tutorial-skip-v316">Überspringen</button><button class="ft-tutorial-next-v316">${index316===steps316.length-1?'Fertig':'Weiter'}</button></div></div>`;document.body.appendChild(overlay316);const pop=overlay316.querySelector('.ft-tutorial-pop-v316');requestAnimationFrame(()=>{const r=el.getBoundingClientRect(),ph=pop.offsetHeight||170;const below=r.bottom+14,above=r.top-ph-14;pop.style.top=`${Math.max(12,(below+ph<innerHeight-12?below:above))}px`});overlay316.querySelector('.ft-tutorial-skip-v316').onclick=()=>finish316();overlay316.querySelector('.ft-tutorial-next-v316').onclick=()=>{index316++;if(index316>=steps316.length)finish316();else render316()}}
const start316=()=>{if(running316)return;const first=find316(steps316[0].sel);if(!first)return false;running316=true;index316=0;document.documentElement.classList.add('ft-tutorial-open-v316');render316();return true}
const addSettings316=()=>{const h1=[...document.querySelectorAll('.page-head h1,h1')].find(x=>x.textContent?.trim()==='Einstellungen');if(!h1)return;const page=h1.closest('.page')||h1.parentElement?.parentElement;if(!page||page.querySelector('.ft-tutorial-settings-v316'))return;const list=page.querySelector('.settings-list');if(!list)return;const b=document.createElement('button');b.type='button';b.className='ft-tutorial-settings-v316';b.innerHTML='<span><small>HILFE</small><strong>App-Tutorial starten</strong><em>Die wichtigsten Bereiche mit kurzen Hinweisen anzeigen</em></span><b>›</b>';b.onclick=()=>{try{localStorage.setItem(TUTORIAL_RESTART_316,'1')}catch{};location.reload()};list.appendChild(b)}
if(typeof document!=='undefined'){
 const obs=new MutationObserver(()=>requestAnimationFrame(addSettings316));
 const boot=()=>{obs.observe(document.body,{childList:true,subtree:true});addSettings316();let done=false,restart=false;try{done=localStorage.getItem(TUTORIAL_DONE_316)==='1';restart=localStorage.getItem(TUTORIAL_RESTART_316)==='1';if(restart)localStorage.removeItem(TUTORIAL_RESTART_316)}catch{};if(!done||restart){let tries=0;const timer=setInterval(()=>{tries++;if(start316()||tries>30)clearInterval(timer)},250)}};
 document.body?boot():document.addEventListener('DOMContentLoaded',boot,{once:true});
 window.addEventListener('resize',()=>{if(running316)render316()});
}
