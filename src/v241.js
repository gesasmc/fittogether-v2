// FitTogether V2.0.41: simple exercise actions + saved free-training list.
export const FITTOGETHER_VERSION='V2.0.41'
const KEY241='ft-free-library-v241'
const read241=()=>{try{return JSON.parse(localStorage.getItem(KEY241)||'[]')}catch{return[]}}
const write241=list=>{try{localStorage.setItem(KEY241,JSON.stringify(list))}catch{}}
const esc241=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

const currentDetail241=()=>{
  const detail=document.querySelector('.exercise-detail-copy')
  if(!detail)return null
  return {
    detail,
    name:detail.querySelector('h2')?.textContent?.trim()||'Übung',
    image:document.querySelector('.exercise-gif img')?.src||'',
    kind:document.querySelector('.page-head small')?.textContent?.trim()||''
  }
}
const isSaved241=name=>read241().some(x=>x.name===name)
const add241=item=>{
  const old=read241()
  if(old.some(x=>x.name===item.name))return
  write241([...old,item].slice(-40))
}
const remove241=name=>write241(read241().filter(x=>x.name!==name))

const enhanceDetail241=()=>{
  const info=currentDetail241();if(!info)return
  const {detail,name,image,kind}=info
  const existing=detail.querySelector('.detail-start-v220')
  if(existing){existing.textContent='Jetzt trainieren';existing.classList.add('detail-primary-v241')}
  let actions=detail.querySelector('.exercise-actions-v241')
  if(!actions){
    actions=document.createElement('div');actions.className='exercise-actions-v241'
    const add=document.createElement('button');add.type='button';add.className='detail-secondary-v241'
    actions.appendChild(add);detail.appendChild(actions)
    add.onclick=()=>{add241({name,image,kind});renderAddState241(add,name);window.FitTogetherCloud?.upload?.()}
  }
  renderAddState241(actions.querySelector('button'),name)
}
const renderAddState241=(btn,name)=>{
  if(!btn)return
  const saved=isSaved241(name)
  btn.textContent=saved?'Im freien Training ✓':'Zum freien Training hinzufügen'
  btn.disabled=saved
}

const renderFree241=()=>{
  if(window.__ft242Active)return
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Freies Training')
  if(!page)return
  const oldPicks=page.querySelector('.exercise-picks');const oldAction=page.querySelector('.primary-action')
  if(oldPicks)oldPicks.style.display='none';if(oldAction)oldAction.style.display='none'
  let box=page.querySelector('.free-library-v241')
  if(!box){box=document.createElement('section');box.className='free-library-v241';(oldPicks||page.querySelector('.page-head'))?.insertAdjacentElement('afterend',box)}
  const items=read241()
  const sig=JSON.stringify(items.map(x=>[x.name,x.kind,x.image]))
  if(box.dataset.sig241===sig)return
  box.dataset.sig241=sig
  box.innerHTML=items.length?`<div class="free-head-v241"><strong>Deine Übungen</strong><small>${items.length} gespeichert</small></div><div class="free-list-v241">${items.map((x,i)=>`<div class="free-row-v241"><span><strong>${esc241(x.name)}</strong><small>${esc241(x.kind||'Übung')}</small></span><div><button type="button" data-start="${i}">Starten</button><button type="button" data-remove="${i}" aria-label="Entfernen">×</button></div></div>`).join('')}</div>`:`<div class="free-empty-v241"><strong>Noch keine Übungen ausgewählt</strong><p>Öffne eine Übung in der Bibliothek und tippe auf „Zum freien Training hinzufügen“.</p></div>`
  box.querySelectorAll('[data-start]').forEach(btn=>btn.onclick=()=>{const item=read241()[Number(btn.dataset.start)];if(item)window.FitTogetherStartSingleExercise?.(item)})
  box.querySelectorAll('[data-remove]').forEach(btn=>btn.onclick=()=>{const item=read241()[Number(btn.dataset.remove)];if(item){remove241(item.name);renderFree241();window.FitTogetherCloud?.upload?.()}})
}

let queued241=false
const enhance241=()=>{
  queued241=false;enhanceDetail241();renderFree241()
  document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(/V2\.0\.40/.test(t))el.textContent=t.replaceAll('V2.0.40',FITTOGETHER_VERSION)})
}
const schedule241=()=>{if(queued241)return;queued241=true;requestAnimationFrame(enhance241)}
if(typeof document!=='undefined'){
  const observer=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule241()})
  const start=()=>{enhance241();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
