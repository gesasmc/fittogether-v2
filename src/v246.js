// FitTogether V2.0.46: warm-up choice for Smart Trainer + robust training start overlay.
const FT246='V2.0.46'
const WARM_KEY='ft-smart-warmup'
const readWarm246=()=>{try{return JSON.parse(localStorage.getItem(WARM_KEY)??'true')}catch{return true}}
const writeWarm246=v=>{try{localStorage.setItem(WARM_KEY,JSON.stringify(v))}catch{}}

const enhanceCoach246=()=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Smarter Trainer')
  if(!page)return
  const settings=page.querySelector('.coach-settings');if(!settings)return
  let row=page.querySelector('.warmup-choice-v246')
  if(!row){
    row=document.createElement('label');row.className='warmup-choice-v246'
    row.innerHTML='<span><strong>Aufwärmen</strong><small>Dehnübungen vor dem Krafttraining</small></span><input type="checkbox">'
    settings.appendChild(row)
    const input=row.querySelector('input');input.checked=readWarm246();input.onchange=()=>{writeWarm246(input.checked);updateCoachCopy246(page,input.checked)}
  }
  updateCoachCopy246(page,row.querySelector('input')?.checked??true)
}
const updateCoachCopy246=(page,warm)=>{
  page.querySelectorAll('.coach-plan-preview span').forEach(span=>{
    const t=span.textContent||''
    if(/inkl\. Dehn-Aufwärmen/.test(t)||/ohne Aufwärmen/.test(t))span.textContent=t.replace(/inkl\. Dehn-Aufwärmen|ohne Aufwärmen/g,warm?'inkl. Dehn-Aufwärmen':'ohne Aufwärmen')
  })
}
const stripWarmups246=()=>{
  if(readWarm246())return
  try{
    const plans=JSON.parse(localStorage.getItem('ft-plans')||'[]');if(!plans.length)return
    const i=plans.length-1,p=plans[i]
    if(!String(p?.name||'').startsWith('Smart Plan'))return
    p.warmup=false
    p.sessions=(p.sessions||[]).map(s=>typeof s==='string'?s:{...s,exercises:(s.exercises||[]).filter(x=>!x?.warmup)})
    plans[i]=p;localStorage.setItem('ft-plans',JSON.stringify(plans));window.FitTogetherCloud?.upload?.()
  }catch{}
}
const click246=e=>{
  const btn=e.target.closest('button');if(!btn)return
  if(btn.textContent?.includes('Plan speichern'))setTimeout(stripWarmups246,0)
}
const version246=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.45'))el.textContent=t.replaceAll('V2.0.45',FT246)})
let q246=false
const enhance246=()=>{q246=false;enhanceCoach246();version246()}
const schedule246=()=>{if(q246)return;q246=true;requestAnimationFrame(enhance246)}
if(typeof document!=='undefined'){
  document.addEventListener('click',click246,true)
  const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule246()})
  const start=()=>{enhance246();obs.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
