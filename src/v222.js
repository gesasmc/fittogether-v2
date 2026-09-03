// FitTogether V2.0.22: fix direct single-exercise flow.
// Keeps entered weight/reps across sets and asks RIR after every strength set.
const read222=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const write222=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
const norm222=s=>String(s||'').trim().toLowerCase()
const rec222=(rir,weight,reps)=>{const w=Number(weight)||0,r=Number(reps)||0;if(rir<=0)return`Sehr hart – nächstes Mal ${w?w+' kg halten und ':''}${Math.max(1,r-2)}–${Math.max(1,r-1)} Wdh. anpeilen.`;if(rir===1)return`Hart – ${w?w+' kg halten':'Gewicht halten'} und etwa ${Math.max(1,r-1)}–${r} Wdh. anpeilen.`;if(rir===2)return`Perfekt – ${w?w+' kg beibehalten':'Gewicht beibehalten'} und ${r} Wdh. bestätigen.`;if(rir===3)return`Noch Reserve – ${w?w+' kg halten und ':''}${r+1} Wdh. anpeilen.`;return w?`Zu leicht – nächstes Mal Gewicht leicht über ${w} kg steigern oder ${r+2} Wdh. anpeilen.`:`Zu leicht – nächstes Mal Widerstand oder Wiederholungen erhöhen.`}
const saveSet222=(name,weight,reps,rir)=>{
  const settings=read222('ft-exercise-settings',{}),key=norm222(name)
  settings[key]={...(settings[key]||{}),name,weight,reps,updatedAt:Date.now()}
  write222('ft-exercise-settings',settings)
  const history=read222('ft-exercise-history',[])
  history.push({exercise:name,weight,reps,rir,recommendation:rec222(rir,weight,reps),date:Date.now()})
  write222('ft-exercise-history',history.slice(-600))
}
const removePremature221Record=(name)=>{
  const history=read222('ft-exercise-history',[])
  const last=history.at(-1)
  if(last&&norm222(last.exercise)===norm222(name)&&Date.now()-Number(last.date||0)<1000&&last.rir===2&&String(last.recommendation||'').includes('Einzelübung gespeichert')){
    history.pop();write222('ft-exercise-history',history)
  }
}
const recordWorkout222=name=>{const key='ft-completed-workouts',old=read222(key,[]);write222(key,[...old,{date:Date.now(),exercises:1,name,single:true}].slice(-100))}
const showRir222=(overlay,{name,weight,reps,onDone})=>{
  overlay.querySelector('.rir-single-v222')?.remove()
  const modal=document.createElement('div');modal.className='rir-single-v222';modal.innerHTML=`<div class="rir-card-v222"><small>RIR NACH DEM SATZ</small><h2>Wie viele Wiederholungen wären noch gegangen?</h2><div class="rir-options-v222">${[0,1,2,3,4].map(v=>`<button data-rir="${v}"><strong>${v===4?'4+':v}</strong><span>${v===0?'Keine':v===1?'Eine':v===2?'Zwei':v===3?'Drei':'Vier oder mehr'}</span></button>`).join('')}</div></div>`
  modal.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{const rir=Number(btn.dataset.rir);saveSet222(name,weight,reps,rir);modal.remove();onDone(rir)})
  overlay.appendChild(modal)
}
const finish222=(overlay,name)=>{recordWorkout222(name);overlay.innerHTML=`<div class="single-finished-v220"><span>✓</span><h1>Übung abgeschlossen</h1><p>${name} wurde mit deinen Satzwerten gespeichert.</p><button>Fertig</button></div>`;overlay.querySelector('button').onclick=()=>{overlay.remove();location.reload()}}
const wireSingle222=()=>{
  const overlay=document.querySelector('.single-training-v220')
  if(!overlay)return
  const inputs=[...overlay.querySelectorAll('.single-inputs-v220 input')]
  const done=overlay.querySelector('.single-done-v220')
  if(inputs.length<2||!done||done.dataset.ft222)return
  done.dataset.ft222='1'
  if(!overlay.dataset.ft222Set)overlay.dataset.ft222Set='1'
  done.addEventListener('click',e=>{
    e.preventDefault();e.stopImmediatePropagation()
    const name=overlay.querySelector('h1')?.textContent?.trim()||overlay.querySelector('.single-head-v220 strong')?.textContent?.trim()||'Übung'
    const weight=Number(inputs[0].value)||0,reps=Number(inputs[1].value)||0
    removePremature221Record(name)
    const set=Number(overlay.dataset.ft222Set||1),sets=3
    showRir222(overlay,{name,weight,reps,onDone:()=>{
      if(set>=sets){finish222(overlay,name);return}
      const next=set+1;overlay.dataset.ft222Set=String(next)
      const progress=overlay.querySelector('.single-progress-v220 span');if(progress)progress.textContent=`SATZ ${next} VON ${sets}`
      const bar=overlay.querySelector('.single-progress-v220 i b');if(bar)bar.style.width=`${Math.round(next/sets*100)}%`
      const button=overlay.querySelector('.single-done-v220');if(button){button.textContent=next<sets?`Satz ${next} abschließen`:'Übung abschließen';button.dataset.ft222='';}
      // Keep exactly the values the user entered, including 0 kg for bodyweight exercises.
      const nextInputs=[...overlay.querySelectorAll('.single-inputs-v220 input')]
      if(nextInputs[0])nextInputs[0].value=String(weight)
      if(nextInputs[1])nextInputs[1].value=String(reps)
      wireSingle222()
    }})
  },true)
}
const updateVersion222=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&el.textContent?.includes('V2.0.21'))el.textContent=el.textContent.replaceAll('V2.0.21','V2.0.22')})
const enhance222=()=>{wireSingle222();updateVersion222()}
if(typeof document!=='undefined'){const obs222=new MutationObserver(enhance222);const start222=()=>{enhance222();obs222.observe(document.body,{childList:true,subtree:true})};document.body?start222():document.addEventListener('DOMContentLoaded',start222,{once:true})}
