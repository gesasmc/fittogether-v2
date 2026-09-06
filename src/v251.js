// FitTogether V2.0.78: stable plan deletion with tombstones and immediate rebinding.
const FT251='V2.0.78'
const read251=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write251=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const key251=plan=>plan?.createdAt?`created:${plan.createdAt}`:`legacy:${String(plan?.name||'').trim().toLowerCase()}|${JSON.stringify(plan?.weekdays||plan?.days||'')}|${JSON.stringify((plan?.sessions||[]).map(s=>typeof s==='string'?s:s?.title||''))}`

const deletePlan251=async(index,name,wrap)=>{
  if(!confirm(`„${name||'Plan'}“ wirklich löschen?`))return
  const plans=read251('ft-plans',[])
  const plan=plans[index]
  if(!plan)return
  const tombstones=new Set(read251('ft-plan-deletions',[]))
  tombstones.add(key251(plan))
  write251('ft-plan-deletions',[...tombstones])
  plans.splice(index,1)
  write251('ft-plans',plans)
  wrap?.remove()
  enhancePlans251()
  try{await window.FitTogetherCloud?.upload?.()}catch{}
}

const enhancePlans251=()=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Trainingspläne')
  if(!page)return
  const plans=read251('ft-plans',[])
  const wraps=[...page.querySelectorAll('.plan-wrap')]
  wraps.forEach(wrap=>wrap.querySelectorAll('.plan-delete-v250,.plan-delete-v251').forEach(x=>x.remove()))
  wraps.forEach((wrap,index)=>{
    const card=wrap.querySelector('.plan-card')
    const plan=plans[index]
    if(!card||!plan)return
    wrap.classList.add('deletable-wrap-v251')
    card.classList.add('plan-card-controls-v251')
    const del=document.createElement('button')
    del.type='button'
    del.className='plan-delete-v251'
    del.textContent='×'
    del.setAttribute('aria-label','Plan löschen')
    del.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()})
    del.onclick=e=>{e.preventDefault();e.stopPropagation();deletePlan251(index,plan.name,wrap)}
    wrap.appendChild(del)
  })
}

const version251=()=>document.querySelectorAll('body *').forEach(el=>{
  if(el.children.length)return
  const t=el.textContent||''
  if(/V2\.0\.(50|51|52)/.test(t))el.textContent=t.replace(/V2\.0\.(50|51|52)/g,FT251)
})
let q251=false
const enhance251=()=>{q251=false;enhancePlans251();version251()}
const schedule251=()=>{if(document.querySelector('.rest-overlay')||q251)return;q251=true;requestAnimationFrame(enhance251)}
if(typeof document!=='undefined'){
  const obs=new MutationObserver(m=>{if(document.querySelector('.rest-overlay'))return;if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule251()})
  const start=()=>{enhance251();obs.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
