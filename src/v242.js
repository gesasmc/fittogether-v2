// FitTogether V2.0.43: responsive free-workout flow without mutation rerender loops.
export const FITTOGETHER_VERSION='V2.0.43'
if(typeof window!=='undefined')window.__ft242Active=true
const KEY242='ft-free-library-v241'
const read242=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write242=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc242=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

const move242=(index,dir)=>{
  const list=read242(KEY242,[]),next=index+dir
  if(next<0||next>=list.length)return
  ;[list[index],list[next]]=[list[next],list[index]]
  write242(KEY242,list);renderFree242(true);window.FitTogetherCloud?.upload?.()
}
const finishWorkout242=items=>{
  const key='ft-completed-workouts',old=read242(key,[])
  const item={date:Date.now(),exercises:items.length,name:'Freies Training',source:'Freies Training',kind:'strength',version:FITTOGETHER_VERSION}
  write242(key,[...old,item].slice(-100));window.FitTogetherCloud?.upload?.()
}
const startWorkout242=items=>{
  if(!items.length)return
  let index=0,set=1,sets=3
  const overlay=document.createElement('div');overlay.className='free-workout-v242'
  const render=()=>{
    const item=items[index],lastExercise=index===items.length-1,lastSet=set===sets
    overlay.innerHTML=`<div class="free-workout-head-v242"><button type="button" data-close>×</button><span>ÜBUNG ${index+1} / ${items.length}</span></div><div class="free-workout-card-v242">${item.image?`<img src="${esc242(item.image)}" alt="">`:''}<small>SATZ ${set} VON ${sets}</small><h1>${esc242(item.name)}</h1><div class="free-workout-inputs-v242"><label><input data-weight inputmode="decimal" value="10"><span>kg</span></label><label><input data-reps inputmode="numeric" value="10"><span>Wdh.</span></label></div><button type="button" data-next>${lastExercise&&lastSet?'Training abschließen':lastSet?'Nächste Übung':`Satz ${set} abschließen`}</button></div>`
    overlay.querySelector('[data-close]').onclick=()=>overlay.remove()
    overlay.querySelector('[data-next]').onclick=()=>{
      if(!lastSet){set++;render();return}
      if(!lastExercise){index++;set=1;render();return}
      finishWorkout242(items)
      overlay.innerHTML=`<div class="free-workout-finished-v242"><span>✓</span><h1>Training gespeichert</h1><p>${items.length} Übungen abgeschlossen.</p><button type="button">Fertig</button></div>`
      overlay.querySelector('button').onclick=()=>{overlay.remove();location.reload()}
    }
  }
  document.body.appendChild(overlay);render()
}

const renderFree242=(force=false)=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Freies Training')
  if(!page)return
  const box=page.querySelector('.free-library-v241');if(!box)return
  const items=read242(KEY242,[])
  const sig=JSON.stringify(items.map(x=>[x.name,x.kind,x.image]))
  if(!force&&box.dataset.sig242===sig)return
  box.dataset.sig242=sig
  if(!items.length){box.innerHTML='<div class="free-empty-v241"><strong>Noch keine Übungen ausgewählt</strong><p>Öffne eine Übung in der Bibliothek und füge sie zum freien Training hinzu.</p></div>';return}
  box.innerHTML=`<div class="free-head-v241"><strong>Deine Übungen</strong><small>${items.length} ausgewählt</small></div><div class="free-list-v241">${items.map((x,i)=>`<div class="free-row-v242"><span><strong>${esc242(x.name)}</strong><small>${i+1}. Position</small></span><div class="free-order-v242"><button type="button" data-up="${i}" ${i===0?'disabled':''}>↑</button><button type="button" data-down="${i}" ${i===items.length-1?'disabled':''}>↓</button><button type="button" data-remove="${i}">×</button></div></div>`).join('')}</div><button type="button" class="free-start-all-v242">Training starten</button>`
  box.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>move242(Number(b.dataset.up),-1))
  box.querySelectorAll('[data-down]').forEach(b=>b.onclick=()=>move242(Number(b.dataset.down),1))
  box.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const list=read242(KEY242,[]);list.splice(Number(b.dataset.remove),1);write242(KEY242,list);renderFree242(true);window.FitTogetherCloud?.upload?.()})
  box.querySelector('.free-start-all-v242').onclick=()=>startWorkout242(read242(KEY242,[]))
}

let queued242=false
const enhance242=()=>{
  queued242=false;renderFree242()
  document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(/V2\.0\.(41|42)/.test(t))el.textContent=t.replace(/V2\.0\.(41|42)/g,FITTOGETHER_VERSION)})
}
const schedule242=()=>{if(queued242)return;queued242=true;requestAnimationFrame(enhance242)}
if(typeof document!=='undefined'){
 const observer=new MutationObserver(m=>{
   if(document.querySelector('.free-workout-v242'))return
   if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule242()
 })
 const start=()=>{enhance242();observer.observe(document.body,{childList:true,subtree:true})}
 document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
