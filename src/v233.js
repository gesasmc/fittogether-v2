// FitTogether V2.0.33: proper timed cardio workflow for single exercises.
export const FITTOGETHER_VERSION='V2.0.33'

const read233=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)??JSON.stringify(fallback))}catch{return fallback}}
const write233=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
const esc233=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const fmt233=seconds=>`${Math.floor(Math.max(0,seconds)/60)}:${String(Math.max(0,seconds)%60).padStart(2,'0')}`

const recommendation233=name=>{
  const goal=String(read233('ft-profile',{}).goal||'').toLowerCase()
  const n=String(name||'').toLowerCase()
  let minutes=/ruder/.test(n)?20:/laufband|laufen/.test(n)?25:/crosstrainer/.test(n)?25:/fahrrad|ergometer|radfahr/.test(n)?30:25
  if(goal.includes('muskelaufbau')&&goal.includes('fett'))minutes=Math.max(minutes,25)
  else if(goal.includes('muskelaufbau'))minutes=Math.max(15,minutes-5)
  else if(goal.includes('fett'))minutes=Math.max(minutes,30)
  else if(goal.includes('fitness'))minutes=Math.max(minutes,25)
  return minutes
}

const recordCardio233=({name,plannedSeconds,actualSeconds,usedTimer})=>{
  const key='ft-completed-workouts'
  const old=read233(key,[])
  const item={date:Date.now(),exercises:1,name,single:true,kind:'cardio',plannedSeconds,actualSeconds,durationSeconds:actualSeconds,usedTimer,version:FITTOGETHER_VERSION}
  write233(key,[...old,item].slice(-100))
  try{window.FitTogetherCloud?.upload?.()}catch{}
}

const enhanceCardio233=overlay=>{
  if(!overlay||overlay.dataset.ft233Cardio)return
  const progress=overlay.querySelector('.single-progress-v220 span')?.textContent?.trim()
  const oldDone=overlay.querySelector('.single-done-v220')
  if(progress!=='CARDIO'||!oldDone)return
  overlay.dataset.ft233Cardio='1'

  const name=overlay.querySelector('.single-head-v220 strong')?.textContent?.trim()||overlay.querySelector('h1')?.textContent?.trim()||'Cardio'
  const suggestedMinutes=recommendation233(name)
  let plannedSeconds=suggestedMinutes*60
  let remaining=plannedSeconds
  let elapsed=0
  let running=false
  let interval=null

  const oldCopy=[...overlay.querySelectorAll('p')].find(p=>p.textContent?.includes('Cardio-Block'))
  if(oldCopy)oldCopy.style.display='none'
  oldDone.style.display='none'

  const panel=document.createElement('section')
  panel.className='cardio-panel-v233'
  oldDone.insertAdjacentElement('beforebegin',panel)

  const stopInterval=()=>{if(interval){clearInterval(interval);interval=null}}
  const updateClock=()=>{
    const clock=panel.querySelector('.cardio-clock-v233 strong')
    const status=panel.querySelector('.cardio-clock-v233 span')
    const startBtn=panel.querySelector('[data-cardio-start]')
    if(clock)clock.textContent=fmt233(remaining)
    if(status)status.textContent=running?'LÄUFT':elapsed>0?'PAUSIERT':'BEREIT'
    if(startBtn)startBtn.textContent=running?'Pause':elapsed>0?'Weiter':'Timer starten'
  }
  const setPlanned=minutes=>{
    const n=Math.max(1,Math.min(240,Number(minutes)||0))
    plannedSeconds=Math.round(n*60)
    if(!running){remaining=plannedSeconds;elapsed=0}
    panel.querySelectorAll('[data-cardio-preset]').forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.cardioPreset)===n))
    const custom=panel.querySelector('[data-cardio-custom]')
    if(custom)custom.value=String(n)
    updateClock()
  }
  const showFinish=manual=>{
    running=false;stopInterval()
    const defaultActual=manual?'':fmt233(elapsed).split(':')
    const minValue=manual?'':String(Number(defaultActual[0]||0))
    const secValue=manual?'':String(Number(defaultActual[1]||0))
    panel.innerHTML=`<div class="cardio-finish-v233"><small>TRAINING BEENDEN</small><h2>Tatsächliche Zeit</h2><p>Geplante Zeit: <strong>${fmt233(plannedSeconds)}</strong>. Trage hier die wirkliche Dauer ein – auch wenn du sie aus einer anderen App übernimmst.</p><div class="cardio-actual-v233"><label><input data-actual-min inputmode="numeric" value="${esc233(minValue)}" placeholder="0"><span>MIN</span></label><b>:</b><label><input data-actual-sec inputmode="numeric" value="${esc233(secValue)}" placeholder="00"><span>SEK</span></label></div><p class="cardio-error-v233" aria-live="polite"></p><div class="cardio-finish-actions-v233"><button type="button" data-cardio-back>Zurück</button><button type="button" class="primary" data-cardio-save>Speichern</button></div></div>`
    panel.querySelector('[data-cardio-back]').onclick=()=>renderSetup()
    panel.querySelector('[data-cardio-save]').onclick=()=>{
      const min=Number(panel.querySelector('[data-actual-min]').value)||0
      const sec=Math.min(59,Number(panel.querySelector('[data-actual-sec]').value)||0)
      const actualSeconds=min*60+sec
      const error=panel.querySelector('.cardio-error-v233')
      if(actualSeconds<1){error.textContent='Bitte die tatsächliche Trainingszeit eintragen.';return}
      recordCardio233({name,plannedSeconds,actualSeconds,usedTimer:elapsed>0})
      overlay.innerHTML=`<div class="single-finished-v220"><span>✓</span><h1>Cardio gespeichert</h1><p>${esc233(name)} · ${fmt233(actualSeconds)} tatsächliche Zeit</p><button>Fertig</button></div>`
      overlay.querySelector('button').onclick=()=>{overlay.remove();location.reload()}
    }
  }
  const tick=()=>{
    if(!running)return
    remaining=Math.max(0,remaining-1);elapsed+=1;updateClock()
    if(remaining<=0){
      running=false;stopInterval();updateClock()
      try{if(read233('ft-vibration',true)&&navigator.vibrate)navigator.vibrate([150,80,150])}catch{}
      showFinish(false)
    }
  }
  const renderSetup=()=>{
    stopInterval();running=false
    if(elapsed>0)remaining=Math.max(0,plannedSeconds-elapsed);else remaining=plannedSeconds
    panel.innerHTML=`<div class="cardio-smart-v233"><span>SMARTER TRAINER</span><strong>${suggestedMinutes} Min. empfohlen</strong><small>Du kannst die Zeit jederzeit ändern.</small></div><div class="cardio-clock-v233"><strong>${fmt233(remaining)}</strong><span>${elapsed>0?'PAUSIERT':'BEREIT'}</span></div><div class="cardio-presets-v233">${[10,15,20,30,45,60].map(m=>`<button type="button" data-cardio-preset="${m}" class="${plannedSeconds===m*60?'active':''}">${m} Min.</button>`).join('')}</div><label class="cardio-custom-v233"><span>Eigene Zielzeit</span><div><input data-cardio-custom inputmode="numeric" value="${Math.round(plannedSeconds/60)}"><b>Min.</b></div></label><div class="cardio-controls-v233"><button type="button" data-cardio-start>${elapsed>0?'Weiter':'Timer starten'}</button><button type="button" data-cardio-finish>Training beenden</button></div><button type="button" class="cardio-manual-v233" data-cardio-manual>Ohne Timer / aus anderer App eintragen</button>`
    panel.querySelectorAll('[data-cardio-preset]').forEach(btn=>btn.onclick=()=>setPlanned(Number(btn.dataset.cardioPreset)))
    const custom=panel.querySelector('[data-cardio-custom]')
    custom.onchange=()=>setPlanned(custom.value)
    panel.querySelector('[data-cardio-start]').onclick=()=>{
      if(remaining<=0){remaining=plannedSeconds;elapsed=0}
      running=!running
      if(running&&!interval)interval=setInterval(tick,1000)
      if(!running)stopInterval()
      updateClock()
    }
    panel.querySelector('[data-cardio-finish]').onclick=()=>showFinish(false)
    panel.querySelector('[data-cardio-manual]').onclick=()=>showFinish(true)
    updateClock()
  }

  renderSetup()

  const cleanup=setInterval(()=>{if(!document.body.contains(overlay)){stopInterval();clearInterval(cleanup)}},1000)
}

let queued233=false
const enhance233=()=>{
  queued233=false
  document.querySelectorAll('.single-training-v220').forEach(enhanceCardio233)
  document.querySelectorAll('body *').forEach(el=>{
    if(el.children.length)return
    const text=el.textContent||''
    if(!/V2\.0\.(17|20|24|25|26|27|28|29|30|31|32)/.test(text))return
    el.textContent=text.replace(/V2\.0\.(17|20|24|25|26|27|28|29|30|31|32)/g,FITTOGETHER_VERSION)
  })
}
const schedule233=()=>{if(queued233)return;queued233=true;queueMicrotask(enhance233)}
if(typeof document!=='undefined'){
  const observer=new MutationObserver(schedule233)
  const start=()=>{enhance233();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
