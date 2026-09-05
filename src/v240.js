// FitTogether V2.0.40: compact exercise filters + duplicate cardio-save guard.
export const FITTOGETHER_VERSION='V2.0.40'

const read240=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}

// Some older cardio handlers can write the same finished ride twice within milliseconds.
// Guard only completed-workout writes and only collapse near-identical cardio records.
if(typeof window!=='undefined'&&!window.__ft240StorageGuard){
  window.__ft240StorageGuard=true
  const rawSet=Storage.prototype.setItem
  Storage.prototype.setItem=function(key,value){
    if(key==='ft-completed-workouts'){
      try{
        const list=JSON.parse(value)
        if(Array.isArray(list)&&list.length>1){
          const clean=[]
          for(const item of list){
            if(item?.kind==='cardio'){
              const duplicate=clean.some(prev=>prev?.kind==='cardio'&&String(prev?.name||'')===String(item?.name||'')&&Number(prev?.actualSeconds||0)===Number(item?.actualSeconds||0)&&Number(prev?.plannedSeconds||0)===Number(item?.plannedSeconds||0)&&Math.abs(Number(prev?.date||0)-Number(item?.date||0))<5000)
              if(duplicate)continue
            }
            clean.push(item)
          }
          value=JSON.stringify(clean)
        }
      }catch{}
    }
    return rawSet.call(this,key,value)
  }
}

const compactFilters240=()=>{
  const box=document.querySelector('.exercise-advanced-v238')
  if(!box)return
  if(box.dataset.compact240==='1')return
  box.dataset.compact240='1'

  const head=box.querySelector('.exercise-availability-head-v238')
  const count=box.querySelector('.exercise-count-v238')
  const chips=box.querySelector('.equipment-chips-v238')
  const onlyLabel=box.querySelector('.only-mine-v238 span')
  const info=box.querySelector('p')
  if(count)count.style.display='none'
  if(onlyLabel)onlyLabel.textContent='Nur meine Ausstattung'
  if(info)info.remove()
  if(!chips)return

  chips.hidden=true
  const toggle=document.createElement('button')
  toggle.type='button'
  toggle.className='equipment-toggle-v240'
  toggle.textContent='Ausstattung ändern'
  toggle.onclick=()=>{
    chips.hidden=!chips.hidden
    toggle.textContent=chips.hidden?'Ausstattung ändern':'Ausstattung schließen'
  }
  head?.insertAdjacentElement('afterend',toggle)
}

let queued240=false
const enhance240=()=>{
  queued240=false
  compactFilters240()
  document.querySelectorAll('body *').forEach(el=>{
    if(el.children.length)return
    const t=el.textContent||''
    if(/V2\.0\.3[7-9]/.test(t))el.textContent=t.replace(/V2\.0\.3[7-9]/g,FITTOGETHER_VERSION)
  })
}
const schedule240=()=>{if(queued240)return;queued240=true;requestAnimationFrame(enhance240)}
if(typeof document!=='undefined'){
  const observer=new MutationObserver(schedule240)
  const start=()=>{enhance240();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
