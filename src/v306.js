// FitTogether V2.0.130: compact accordion statistics hub for body data and weight.
const read306=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write306=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const num306=v=>{const n=Number(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0}
const statsPage306=()=>[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Deine Statistik'))
const rerender306=()=>{document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('pageshow'))}
const bodyPanel306=()=>{
  const profile=read306('ft-profile',{name:'',age:'',height:'',goal:'Muskelaufbau & Fettabbau'})
  const d=document.createElement('details');d.className='stats-accordion-v306 body-data-v306';d.innerHTML=`<summary><span><small>KÖRPERDATEN</small><strong>Größe, Alter & Ziel</strong></span><b>›</b></summary><div class="stats-accordion-body-v306"><div class="stats-fields-v306"><label><span>Größe in cm</span><input data-height306 inputmode="numeric" value="${profile.height||''}"></label><label><span>Alter</span><input data-age306 inputmode="numeric" value="${profile.age||''}"></label></div><label><span>Trainingsziel</span><select data-goal306><option>Muskelaufbau & Fettabbau</option><option>Muskelaufbau</option><option>Kraft</option><option>Fettabbau</option><option>Allgemeine Fitness</option></select></label><button type="button" data-save306>Körperdaten speichern</button></div>`
  d.querySelector('[data-goal306]').value=profile.goal||'Muskelaufbau & Fettabbau'
  d.querySelector('[data-save306]').onclick=()=>{const height=num306(d.querySelector('[data-height306]').value),age=num306(d.querySelector('[data-age306]').value),goal=d.querySelector('[data-goal306]').value;const next={...profile,height:height||'',age:age||'',goal};write306('ft-profile',next);window.FitTogetherCloud?.upload?.();rerender306()}
  return d
}
const weightPanel306=()=>{
  const weights=read306('ft-weight-history',[]),current=num306(weights.at(-1)?.weight)
  const d=document.createElement('details');d.className='stats-accordion-v306 weight-entry-v306';d.innerHTML=`<summary><span><small>GEWICHT</small><strong>${current?`${current.toLocaleString('de-DE',{maximumFractionDigits:1})} kg`:'Noch kein Gewicht'}</strong></span><b>›</b></summary><div class="stats-accordion-body-v306"><label><span>Neues Gewicht in kg</span><div class="weight-inline-v306"><input data-weight306 inputmode="decimal" placeholder="z. B. 98,0"><button type="button" data-add306>Eintragen</button></div></label><small class="stats-note-v306">Neue Einträge erscheinen direkt im Verlauf und in deinen BMI-/Zielwerten.</small></div>`
  d.querySelector('[data-add306]').onclick=()=>{const n=num306(d.querySelector('[data-weight306]').value);if(n<30||n>300)return;const history=read306('ft-weight-history',[]);write306('ft-weight-history',[...history,{date:Date.now(),weight:n}].slice(-100));window.FitTogetherCloud?.upload?.();rerender306()}
  return d
}
const wrapSection306=(node,title,kicker)=>{
  if(!node||node.closest('.stats-accordion-v306'))return null
  const d=document.createElement('details');d.className='stats-accordion-v306';d.innerHTML=`<summary><span><small>${kicker}</small><strong>${title}</strong></span><b>›</b></summary><div class="stats-accordion-body-v306"></div>`
  node.parentNode.insertBefore(d,node);d.querySelector('.stats-accordion-body-v306').appendChild(node);return d
}
const enhance306=()=>{
  const stats=statsPage306();if(!stats)return
  let hub=stats.querySelector('.stats-hub-v306');if(!hub){hub=document.createElement('section');hub.className='stats-hub-v306';const anchor=stats.querySelector('.stat-grid-v216');anchor?.insertAdjacentElement('afterend',hub)}
  if(!hub)return
  if(!hub.querySelector('.body-data-v306'))hub.appendChild(bodyPanel306())
  if(!hub.querySelector('.weight-entry-v306'))hub.appendChild(weightPanel306())
  const body=stats.querySelector('.body-stats-v305');if(body&&!body.closest('.stats-accordion-v306')){const wrapped=wrapSection306(body,'BMI & Zielgewicht','KÖRPER & ZIEL');if(wrapped)hub.appendChild(wrapped)}
  const history=stats.querySelector('.weight-history');if(history&&!history.closest('.stats-accordion-v306')){const wrapped=wrapSection306(history,'Gewichtsverlauf','VERLAUF');if(wrapped)hub.appendChild(wrapped)}
  const oldButton=[...stats.querySelectorAll('.primary-action')].find(b=>/Profil.*Gewicht/i.test(b.textContent||''));if(oldButton)oldButton.style.display='none'
}
let q306=false
const schedule306=()=>{if(q306)return;q306=true;requestAnimationFrame(()=>{q306=false;enhance306()})}
if(typeof document!=='undefined'){const start=()=>{enhance306();new MutationObserver(schedule306).observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',schedule306);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule306()})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
