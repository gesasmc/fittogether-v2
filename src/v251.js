// FitTogether V2.0.52: reliable delete button on every training-plan card without page reload.
const FT251='V2.0.52'
const read251=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write251=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}

const deletePlan251=async(index,name,wrap)=>{
  if(!confirm(`„${name||'Plan'}“ wirklich löschen?`))return
  const plans=read251('ft-plans',[])
  if(!plans[index])return
  plans.splice(index,1)
  write251('ft-plans',plans)
  wrap?.remove()
  try{await window.FitTogetherCloud?.upload?.()}catch{}
}

const enhancePlans251=()=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Trainingspläne')
  if(!page)return
  const plans=read251('ft-plans',[])
  const wraps=[...page.querySelectorAll('.plan-wrap')]
  wraps.forEach((wrap,index)=>{
    const card=wrap.querySelector('.plan-card')
    const plan=plans[index]
    if(!card||!plan)return
    wrap.classList.add('deletable-wrap-v251')
    card.classList.add('plan-card-controls-v251')
    // Remove the old V2.0.50 nested delete button; nested buttons inside .plan-card caused the card click to fire.
    card.querySelectorAll('.plan-delete-v250').forEach(x=>x.remove())
    if(wrap.querySelector('.plan-delete-v251'))return
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
  if(/V2\.0\.(50|51)/.test(t))el.textContent=t.replace(/V2\.0\.(50|51)/g,FT251)
})
let q251=false
const enhance251=()=>{q251=false;enhancePlans251();version251()}
const schedule251=()=>{if(q251)return;q251=true;requestAnimationFrame(enhance251)}
if(typeof document!=='undefined'){
  const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule251()})
  const start=()=>{enhance251();obs.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
