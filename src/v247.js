// FitTogether V2.0.48: free training respects available weights/bodyweight and remains reusable after exit.
const FT247='V2.0.48'
const LIB247='ft-free-library-v241'
const LOAD247='ft-exercise-loads-v247'
const read247=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write247=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc247=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const num247=v=>Number(String(v??'').replace(',','.'))||0

const equipment247=item=>{
  const raw=`${item?.equipment||''} ${item?.kind||''} ${item?.name||''}`.toLowerCase()
  if(/kurzhantel|dumbbell/.test(raw))return 'dumbbell'
  if(/langhantel|barbell|sz-stange/.test(raw))return 'barbell'
  if(/körpergewicht|body.?weight|dehn|stretch|yoga/.test(raw))return 'bodyweight'
  if(/widerstandsband|band/.test(raw))return 'band'
  if(/kabel|maschine|cable|machine/.test(raw))return 'machine'
  return 'bodyweight'
}
const weights247=item=>{
  const eq=equipment247(item)
  const values=eq==='dumbbell'?read247('ft-dumbbell-weights',[]):eq==='barbell'?read247('ft-barbell-weights',[]):[]
  return [...new Set((Array.isArray(values)?values:[]).map(num247).filter(v=>v>0))].sort((a,b)=>a-b)
}
const nextWeight247=(list,current,dir)=>{
  if(!list.length)return current
  const exact=list.findIndex(v=>v===current)
  if(exact>=0)return list[Math.max(0,Math.min(list.length-1,exact+dir))]
  if(dir>0)return list.find(v=>v>current)??list.at(-1)
  return [...list].reverse().find(v=>v<current)??list[0]
}
const enrichSaved247=()=>{
  const detail=document.querySelector('.exercise-detail-copy');if(!detail)return
  const name=detail.querySelector('h2')?.textContent?.trim();if(!name)return
  const info=document.querySelector('.detail-page .page-head p')?.textContent||''
  const equipment=info.split('·').at(-1)?.trim()||''
  if(!equipment)return
  const list=read247(LIB247,[]);const i=list.findIndex(x=>x.name===name);if(i<0)return
  if(list[i].equipment===equipment)return
  list[i]={...list[i],equipment};write247(LIB247,list)
}

const finish247=(items,logs)=>{
  const key='ft-completed-workouts',old=read247(key,[])
  old.push({date:Date.now(),exercises:items.length,name:'Freies Training',source:'Freies Training',kind:'strength',sets:logs,version:FT247})
  write247(key,old.slice(-100));window.FitTogetherCloud?.upload?.()
}
const start247=items=>{
  if(!items?.length)return
  document.querySelector('.free-workout-v247')?.remove()
  let index=0,set=1,sets=3
  const logs=[]
  const savedLoads=read247(LOAD247,{})
  let weight=0,reps=10,hint=''
  const overlay=document.createElement('div');overlay.className='free-workout-v247'
  const resetForExercise=()=>{
    const item=items[index],choices=weights247(item),saved=savedLoads[item.name]||{}
    weight=choices.length?(choices.includes(num247(saved.weight))?num247(saved.weight):choices[0]):0
    reps=Math.max(1,Number(saved.reps)||10);hint=''
  }
  const closeWorkout=()=>{overlay.remove()}
  const complete=()=>{
    finish247(items,logs)
    overlay.innerHTML=`<div class="free-finished-v247"><span>✓</span><h1>Training gespeichert</h1><p>${items.length} Übungen abgeschlossen.</p><button type="button">Fertig</button></div>`
    overlay.querySelector('button').onclick=()=>{overlay.remove()}
  }
  const advance=()=>{
    if(set<sets){set++;render();return}
    if(index<items.length-1){index++;set=1;resetForExercise();render();return}
    complete()
  }
  const applyRir=(rir,item)=>{
    const choices=weights247(item),beforeW=weight,beforeR=reps
    if(rir<=1){
      if(choices.length>1)weight=nextWeight247(choices,weight,-1)
      else reps=Math.max(1,reps-1)
      hint=weight!==beforeW?`Nächster Satz: ${weight} kg statt ${beforeW} kg`:`Nächster Satz: ${reps} statt ${beforeR} Wdh.`
    }else if(rir===2){hint='Passt gut – Werte bleiben gleich.'}
    else if(rir===3){reps+=1;hint=`Nächster Satz: ${reps} Wdh.`}
    else{
      if(choices.length>1)weight=nextWeight247(choices,weight,1)
      else reps+=2
      hint=weight!==beforeW?`Zu leicht: nächster Satz ${weight} kg.`:`Zu leicht: nächster Satz ${reps} Wdh.`
    }
    savedLoads[item.name]={weight,reps};write247(LOAD247,savedLoads)
    logs.push({exercise:item.name,exerciseIndex:index,set,weight:beforeW,reps:beforeR,rir:rir>=4?'4+':rir})
    advance()
  }
  const askRir=item=>{
    const card=overlay.querySelector('.free-card-v247');if(!card)return
    card.innerHTML=`<small>SATZ ${set} VON ${sets}</small><h1>${esc247(item.name)}</h1><div class="rir-v247"><span>RIR</span><h2>Wie viele Wiederholungen wären noch gegangen?</h2><div><button data-rir="0">0</button><button data-rir="1">1</button><button data-rir="2">2</button><button data-rir="3">3</button><button data-rir="4">4+</button></div></div>`
    card.querySelectorAll('[data-rir]').forEach(b=>b.onclick=()=>applyRir(Number(b.dataset.rir),item))
  }
  const render=()=>{
    const item=items[index],eq=equipment247(item),choices=weights247(item)
    const weightUi=(eq==='dumbbell'||eq==='barbell')
      ?(choices.length?`<label><select data-weight>${choices.map(v=>`<option value="${v}" ${v===weight?'selected':''}>${String(v).replace('.',',')} kg</option>`).join('')}</select><span>${eq==='dumbbell'?'pro Arm':'gesamt'}</span></label>`:`<div class="bodyweight-v247"><strong>Keine Gewichte hinterlegt</strong><span>In Einstellungen Gewichte hinzufügen</span></div>`)
      :`<div class="bodyweight-v247"><strong>${eq==='bodyweight'?'Körpergewicht':'Ohne Gewichtsangabe'}</strong><span>${eq==='bodyweight'?'Kein Zusatzgewicht nötig':'Wiederholungen werden gespeichert'}</span></div>`
    overlay.innerHTML=`<div class="free-head-v247"><button type="button" data-close>×</button><span>ÜBUNG ${index+1} / ${items.length}</span></div><div class="free-card-v247">${item.image?`<img src="${esc247(item.image)}" alt="">`:''}<small>SATZ ${set} VON ${sets}</small><h1>${esc247(item.name)}</h1>${hint?`<p class="adjust-v247">${esc247(hint)}</p>`:''}<div class="inputs-v247">${weightUi}<label><input data-reps inputmode="numeric" value="${reps}"><span>Wdh.</span></label></div><button type="button" data-next>Satz ${set} abschließen</button></div>`
    overlay.querySelector('[data-close]').onclick=closeWorkout
    overlay.querySelector('[data-next]').onclick=()=>{
      const w=overlay.querySelector('[data-weight]');if(w)weight=num247(w.value)
      reps=Math.max(1,Number(overlay.querySelector('[data-reps]')?.value)||reps)
      savedLoads[item.name]={weight,reps};write247(LOAD247,savedLoads)
      askRir(item)
    }
  }
  resetForExercise();document.body.appendChild(overlay);render()
}
window.FitTogetherStartFreeWorkout247=start247

const intercept247=e=>{
  const btn=e.target.closest('button');if(!btn)return
  if(btn.matches('.detail-secondary-v241'))setTimeout(enrichSaved247,20)
  if(btn.matches('.free-start-all-v242')){
    e.preventDefault();e.stopImmediatePropagation();start247(read247(LIB247,[]));return
  }
  if(btn.matches('.training-overlay .begin-button')){
    const title=document.querySelector('.training-overlay h1')?.textContent?.trim()||''
    const items=read247(LIB247,[])
    if((title==='Training'||title==='Freies Training')&&items.length){
      e.preventDefault();e.stopImmediatePropagation()
      // Close React's start overlay through its own close handler so the state resets.
      document.querySelector('.training-overlay .close-training')?.click()
      setTimeout(()=>start247(items),0)
    }
  }
}
const version247=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(/V2\.0\.(46|47)/.test(t))el.textContent=t.replace(/V2\.0\.(46|47)/g,FT247)})
let q247=false
const enhance247=()=>{q247=false;version247()}
const schedule247=()=>{if(q247)return;q247=true;requestAnimationFrame(enhance247)}
if(typeof document!=='undefined'){
 document.addEventListener('click',intercept247,true)
 const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule247()})
 const start=()=>{enhance247();obs.observe(document.body,{childList:true,subtree:true})}
 document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
