// FitTogether V2.0.128: compact exercise library controls without touching training logic.
const read304=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write304=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const fire304=el=>{if(!el)return;el.dispatchEvent(new Event('change',{bubbles:true}));el.dispatchEvent(new Event('input',{bubbles:true}))}
const visibleCards304=()=>[...document.querySelectorAll('.exercise-grid .exercise-card-v2')].filter(x=>!x.hidden&&!x.hasAttribute('data-shortcut-hide'))
const updateCount304=()=>{const bar=document.querySelector('.exercise-library-bar-v304'),grid=document.querySelector('.exercise-grid');if(!bar||!grid)return;const total=grid.querySelectorAll('.exercise-card-v2').length,visible=visibleCards304().length;const count=bar.querySelector('[data-count304]');if(count)count.textContent=`${visible} von ${total} Übungen`}
const reset304=()=>{
  const search=document.querySelector('.search-box input');if(search){const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;setter?.call(search,'');search.dispatchEvent(new Event('input',{bubbles:true}));search.dispatchEvent(new Event('change',{bubbles:true}))}
  document.querySelectorAll('.filter-row select').forEach(s=>{s.value='Alle';fire304(s)})
  const muscle=document.querySelector('.muscle-filter-v239');if(muscle){muscle.value='Alle';fire304(muscle)}
  const only=document.querySelector('.only-mine-v238 input');if(only?.checked){only.checked=false;only.dispatchEvent(new Event('change',{bubbles:true}))}
  document.querySelector('.exercise-shortcuts-v292 [data-mode="all"]')?.click()
  document.querySelector('.exercise-kind-tabs button')?.click()
  setTimeout(updateCount304,60)
}
const wrapEquipment304=()=>{const advanced=document.querySelector('.exercise-advanced-v238');if(!advanced||advanced.closest('.exercise-equipment-wrap-v304'))return;const wrap=document.createElement('details');wrap.className='exercise-equipment-wrap-v304';const summary=document.createElement('summary');summary.innerHTML='<span><strong>Meine Ausstattung</strong><small>Geräte & verfügbare Übungen</small></span><b>›</b>';advanced.parentNode.insertBefore(wrap,advanced);wrap.append(summary,advanced)}
const quickFilters304=bar=>{if(bar.querySelector('.exercise-quick-v304'))return;const quick=document.createElement('div');quick.className='exercise-quick-v304';quick.innerHTML='<button type="button" data-kind="Kraft">Kraft</button><button type="button" data-kind="Cardio">Cardio</button><button type="button" data-kind="Yoga">Yoga</button><button type="button" data-kind="Dehnen">Dehnen</button>';bar.appendChild(quick);quick.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{const target=[...document.querySelectorAll('.exercise-kind-tabs button')].find(x=>x.textContent.trim()===btn.dataset.kind);target?.click();setTimeout(updateCount304,50)})}
const enhance304=()=>{
  const grid=document.querySelector('.exercise-grid'),search=document.querySelector('.search-box');if(!grid||!search)return
  document.body.classList.add('exercise-library-clean-v304')
  let bar=document.querySelector('.exercise-library-bar-v304');if(!bar){bar=document.createElement('section');bar.className='exercise-library-bar-v304';bar.innerHTML='<div><strong>Übungen finden</strong><small data-count304>Übungen werden geladen…</small></div><button type="button" data-reset304>Zurücksetzen</button>';search.insertAdjacentElement('beforebegin',bar);bar.querySelector('[data-reset304]').onclick=reset304;quickFilters304(bar)}
  wrapEquipment304();updateCount304()
}
let q304=false
const schedule304=()=>{if(q304||document.querySelector('.active-training,.rest-overlay'))return;q304=true;requestAnimationFrame(()=>{q304=false;enhance304();setTimeout(updateCount304,80)})}
if(typeof document!=='undefined'){
  const start=()=>{enhance304();new MutationObserver(schedule304).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','data-shortcut-hide']});document.addEventListener('input',e=>{if(e.target.closest?.('.search-box,.filter-row,.exercise-advanced-v238'))setTimeout(updateCount304,40)},true);document.addEventListener('change',e=>{if(e.target.closest?.('.filter-row,.exercise-advanced-v238'))setTimeout(updateCount304,40)},true)}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
