// FitTogether V2.0.20: start one exercise directly from the exercise library.
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))
const recordSingleWorkout=name=>{try{const key='ft-completed-workouts';const old=JSON.parse(localStorage.getItem(key)||'[]');localStorage.setItem(key,JSON.stringify([...old,{date:Date.now(),exercises:1,name,single:true}].slice(-100)))}catch{}}
const startSingleExercise=({name,image,kind})=>{
  if(document.querySelector('.single-training-v220'))return
  const cardio=/cardio/i.test(kind||'')
  const mobility=/yoga|dehnen/i.test(kind||'')
  let set=1,sets=cardio?1:mobility?2:3
  const overlay=document.createElement('div');overlay.className='single-training-v220'
  const render=()=>{overlay.innerHTML=`<div class="single-head-v220"><button class="single-close-v220" aria-label="Schließen">×</button><div><small>EINZELÜBUNG</small><strong>${esc(name)}</strong></div><b>V2.0.20</b></div><div class="single-progress-v220"><span>${cardio?'CARDIO':mobility?'MOBILITÄT':`SATZ ${set} VON ${sets}`}</span><i><b style="width:${cardio?100:Math.round(set/sets*100)}%"></b></i></div><div class="single-media-v220">${image?`<img src="${esc(image)}" alt="${esc(name)}">`:'<div>Übung</div>'}</div><h1>${esc(name)}</h1>${cardio?'<p>Starte die Übung und beende sie, wenn dein Cardio-Block abgeschlossen ist.</p>':mobility?'<p>Führe die Position kontrolliert aus. Standard: 2 Durchgänge.</p>':'<div class="single-inputs-v220"><label><input inputmode="decimal" value="10"><small>kg</small></label><label><input inputmode="numeric" value="10"><small>Wdh.</small></label></div>'}<button class="single-done-v220">${cardio?'Cardio abschließen':set<sets?`Satz ${set} abschließen`:'Übung abschließen'}</button>`
    overlay.querySelector('.single-close-v220').onclick=()=>overlay.remove()
    overlay.querySelector('.single-done-v220').onclick=()=>{if(!cardio&&set<sets){set++;render();return}recordSingleWorkout(name);overlay.innerHTML=`<div class="single-finished-v220"><span>✓</span><h1>Übung abgeschlossen</h1><p>${esc(name)} wurde als Training gespeichert.</p><button>Fertig</button></div>`;overlay.querySelector('button').onclick=()=>{overlay.remove();location.reload()}}
  }
  document.body.appendChild(overlay);render()
}
if(typeof window!=='undefined')window.FitTogetherStartSingleExercise=startSingleExercise
const enhanceLibrary=()=>{
  document.querySelectorAll('.exercise-card-v2').forEach(card=>{if(card.dataset.quickStart220)return;card.dataset.quickStart220='1';const badge=document.createElement('span');badge.className='quick-start-v220';badge.innerHTML='▶';badge.setAttribute('aria-label','Übung direkt starten');badge.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const name=card.querySelector('strong')?.textContent?.trim()||'Übung';const image=card.querySelector('img')?.src||'';const kind=card.querySelector('small')?.textContent||'';startSingleExercise({name,image,kind})});card.appendChild(badge)})
  const detail=document.querySelector('.exercise-detail-copy');if(detail&&!detail.querySelector('.detail-start-v220')){const btn=document.createElement('button');btn.className='detail-start-v220';btn.textContent='▶ Diese Übung starten';btn.onclick=()=>{const name=detail.querySelector('h2')?.textContent?.trim()||'Übung';const image=document.querySelector('.exercise-gif img')?.src||'';const kind=document.querySelector('.page-head small')?.textContent||'';startSingleExercise({name,image,kind})};detail.appendChild(btn)}
  document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&el.textContent?.includes('V2.0.19'))el.textContent=el.textContent.replaceAll('V2.0.19','V2.0.20')})
}
if(typeof document!=='undefined'){const obs=new MutationObserver(enhanceLibrary);const start=()=>{enhanceLibrary();obs.observe(document.body,{childList:true,subtree:true})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
