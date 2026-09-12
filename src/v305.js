// FitTogether V2.0.129: BMI orientation + personal target weight in statistics.
const read305=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write305=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const num305=v=>{const n=Number(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0}
const fmt305=(v,d=1)=>num305(v).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d})
const bmi305=(weight,heightCm)=>{const h=num305(heightCm)/100,w=num305(weight);return h>0&&w>0?w/(h*h):0}
const bmiLabel305=b=>b<18.5?'Unter dem Referenzbereich':b<25?'Im Referenzbereich':b<30?'Über dem Referenzbereich':'Deutlich über dem Referenzbereich'
const refRange305=heightCm=>{const h=num305(heightCm)/100;if(!h)return null;return{min:18.5*h*h,max:24.9*h*h}}
const goalKey305='ft-weight-goal-v305'
const close305=()=>document.querySelector('.weight-goal-modal-v305')?.remove()
const openGoal305=()=>{
  close305();const profile=read305('ft-profile',{}),weights=read305('ft-weight-history',[]),current=num305(weights.at(-1)?.weight),stored=num305(read305(goalKey305,null)?.weight)
  const modal=document.createElement('div');modal.className='weight-goal-modal-v305';modal.innerHTML=`<div class="weight-goal-sheet-v305"><div class="weight-goal-head-v305"><div><small>ZIELGEWICHT</small><h2>Persönliches Ziel festlegen</h2></div><button type="button" data-close aria-label="Schließen">×</button></div><p>Das Ziel ist deine persönliche Vorgabe. Die BMI-Spanne darunter ist nur eine grobe Orientierung und berücksichtigt Muskelmasse nicht.</p><label><span>Zielgewicht in kg</span><input data-goal inputmode="decimal" placeholder="z. B. 90,0" value="${stored||''}"></label><div class="weight-goal-actions-v305"><button type="button" data-clear>Entfernen</button><button type="button" class="primary" data-save>Speichern</button></div></div>`;document.body.appendChild(modal)
  modal.querySelector('[data-close]').onclick=close305;modal.onclick=e=>{if(e.target===modal)close305()}
  modal.querySelector('[data-clear]').onclick=()=>{try{localStorage.removeItem(goalKey305)}catch{};window.FitTogetherCloud?.upload?.();close305();render305(true)}
  modal.querySelector('[data-save]').onclick=()=>{const weight=num305(modal.querySelector('[data-goal]').value);if(weight<30||weight>300)return;write305(goalKey305,{weight,updatedAt:Date.now(),heightAtSet:num305(profile.height),weightAtSet:current});window.FitTogetherCloud?.upload?.();close305();render305(true)}
}
const render305=(force=false)=>{
  const stats=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Deine Statistik'));if(!stats)return
  const grid=stats.querySelector('.stat-grid-v216'),history=stats.querySelector('.weight-history');if(!grid&&!history)return
  const profile=read305('ft-profile',{}),weights=read305('ft-weight-history',[]),current=num305(weights.at(-1)?.weight),height=num305(profile.height),goal=num305(read305(goalKey305,null)?.weight),bmi=bmi305(current,height),range=refRange305(height),signature=[current,height,goal,profile.goal,weights.length].join('|')
  let card=stats.querySelector('.body-stats-v305');if(!card){card=document.createElement('section');card.className='body-stats-v305';(history||grid)?.insertAdjacentElement(history?'beforebegin':'afterend',card)}if(!force&&card.dataset.signature===signature)return;card.dataset.signature=signature
  const diff=goal&&current?goal-current:0,progress=goal&&current?Math.max(0,Math.min(100,100-Math.abs(diff)/(Math.max(current,goal)*.25)*100)):0
  const goalText=!goal?'Noch kein Ziel gesetzt':Math.abs(diff)<.05?'Ziel erreicht':diff<0?`${fmt305(Math.abs(diff))} kg bis zum Ziel`:`${fmt305(diff)} kg über deinem Ziel`
  const ref=range?`${fmt305(range.min,0)}–${fmt305(range.max,0)} kg`:''
  card.innerHTML=`<div class="section-title"><span>Körper & Ziel</span></div><div class="body-cards-v305"><div class="body-card-v305"><small>BMI</small><strong>${bmi?fmt305(bmi):'–'}</strong><span>${bmi?bmiLabel305(bmi):'Größe und Gewicht im Profil eintragen'}</span></div><div class="body-card-v305"><small>ZIELGEWICHT</small><strong>${goal?`${fmt305(goal)} kg`:'–'}</strong><span>${goalText}</span></div></div>${goal&&current?`<div class="goal-progress-v305"><div><span>Aktuell ${fmt305(current)} kg</span><b>Ziel ${fmt305(goal)} kg</b></div><i><em style="width:${progress}%"></em></i></div>`:''}<div class="bmi-reference-v305"><div><strong>Orientierung nach Körpergröße</strong><span>${ref?`BMI-Referenzbereich 18,5–24,9: ca. ${ref}`:'Bitte zuerst deine Größe im Profil speichern.'}</span></div>${ref?`<p>Bei Muskelaufbau kann der BMI trotz guter Körperzusammensetzung höher ausfallen. Deshalb zeigt FitTogether diesen Bereich nur als Orientierung – nicht als „Sollgewicht“.</p>`:''}</div><button type="button" class="weight-goal-button-v305">${goal?'Zielgewicht ändern':'Zielgewicht festlegen'}</button>`
  card.querySelector('.weight-goal-button-v305').onclick=openGoal305
}
let queued305=false
const schedule305=()=>{if(queued305)return;queued305=true;requestAnimationFrame(()=>{queued305=false;render305()})}
if(typeof document!=='undefined'){const start=()=>{render305();new MutationObserver(schedule305).observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',schedule305);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule305()})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
