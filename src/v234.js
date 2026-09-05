// FitTogether V2.0.34: editable completed-training history in statistics.
export const FITTOGETHER_VERSION='V2.0.34'
const KEY234='ft-completed-workouts'
const read234=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)??JSON.stringify(f))}catch{return f}}
const write234=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc234=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const fmtDuration234=s=>{const n=Math.max(0,Number(s)||0);return n?`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')} Min.`:''}
const sync234=()=>{try{window.FitTogetherCloud?.upload?.()}catch{}}

const defaultTitle234=x=>x.name||x.planTitle||(x.kind==='cardio'?'Cardio':x.single?'Einzelübung':`Training · ${x.exercises||0} Übungen`)
const dateInput234=ts=>{const d=new Date(Number(ts)||Date.now());const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}

let currentIndex234=null
const closeModal234=()=>document.querySelector('.history-modal-v234')?.remove()
const openEditor234=index=>{
  closeModal234();const rows=read234(KEY234,[]),x=rows[index];if(!x)return
  const modal=document.createElement('div');modal.className='history-modal-v234'
  const cardio=x.kind==='cardio'||x.actualSeconds!=null
  modal.innerHTML=`<div class="history-editor-v234"><div class="history-editor-head-v234"><div><small>TRAINING BEARBEITEN</small><h2>${esc234(defaultTitle234(x))}</h2></div><button type="button" data-close>×</button></div><label><span>Titel</span><input data-title value="${esc234(defaultTitle234(x))}"></label><label><span>Datum</span><input data-date type="date" value="${dateInput234(x.date)}"></label>${cardio?`<div class="history-time-v234"><span>Tatsächliche Zeit</span><div><label><input data-min inputmode="numeric" value="${Math.floor((Number(x.actualSeconds)||0)/60)}"><small>MIN</small></label><b>:</b><label><input data-sec inputmode="numeric" value="${(Number(x.actualSeconds)||0)%60}"><small>SEK</small></label></div></div>`:''}<div class="history-editor-actions-v234"><button type="button" class="danger" data-delete>Löschen</button><button type="button" class="primary" data-save>Speichern</button></div></div>`
  document.body.appendChild(modal);currentIndex234=index
  modal.querySelector('[data-close]').onclick=closeModal234
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal234()})
  modal.querySelector('[data-save]').onclick=()=>{
    const all=read234(KEY234,[]),item={...all[index]};if(!item)return
    item.name=(modal.querySelector('[data-title]').value||'Training').trim()
    const ds=modal.querySelector('[data-date]').value
    if(ds){const old=new Date(Number(item.date)||Date.now());const [y,m,d]=ds.split('-').map(Number);old.setFullYear(y,m-1,d);item.date=old.getTime()}
    if(cardio){const min=Math.max(0,Number(modal.querySelector('[data-min]').value)||0),sec=Math.max(0,Math.min(59,Number(modal.querySelector('[data-sec]').value)||0));item.actualSeconds=min*60+sec;item.durationSeconds=item.actualSeconds}
    all[index]=item;write234(KEY234,all);sync234();closeModal234();refreshHistory234()
  }
  modal.querySelector('[data-delete]').onclick=()=>{
    if(!confirm('Dieses Training wirklich löschen?'))return
    const all=read234(KEY234,[]);all.splice(index,1);write234(KEY234,all);sync234();closeModal234();refreshHistory234()
  }
}

const refreshHistory234=()=>{
  const stats=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Statistik'))
  if(!stats)return
  let box=stats.querySelector('.training-history-v234')
  if(!box){box=document.createElement('section');box.className='training-history-v234';const profileBtn=[...stats.querySelectorAll('button')].find(b=>b.textContent?.includes('Profil & Gewicht'));if(profileBtn)profileBtn.insertAdjacentElement('beforebegin',box);else stats.appendChild(box)}
  const rows=read234(KEY234,[])
  box.innerHTML=`<div class="section-title"><span>Trainingsverlauf</span></div>${rows.length===0?'<p class="history-empty-v234">Noch keine abgeschlossenen Trainings vorhanden.</p>':`<div class="history-list-v234">${rows.map((x,i)=>{const d=new Date(Number(x.date)||Date.now()).toLocaleDateString('de-DE');const cardio=x.kind==='cardio'||x.actualSeconds!=null;const detail=cardio?(fmtDuration234(x.actualSeconds||x.durationSeconds)||'Cardio'):(x.planTitle?`Plan · ${esc234(x.planTitle)}`:`${x.exercises||1} ${Number(x.exercises||1)===1?'Übung':'Übungen'}`);return `<button type="button" data-history-index="${i}"><span><strong>${esc234(defaultTitle234(x))}</strong><small>${esc234(d)} · ${detail}</small></span><b>Bearbeiten</b></button>`}).reverse().join('')}</div>`}`
  box.querySelectorAll('[data-history-index]').forEach(btn=>btn.onclick=()=>openEditor234(Number(btn.dataset.historyIndex)))
}

// Remember which saved-plan session was started, so future completed entries can be labelled.
const capturePlan234=()=>{
  document.querySelectorAll('.plan-days button').forEach(btn=>{if(btn.dataset.ft234)return;btn.dataset.ft234='1';btn.addEventListener('click',()=>{const text=btn.querySelector('span')?.textContent?.trim()||'';write234('ft-pending-plan-title',text)},{capture:true})})
  document.querySelectorAll('.primary-action').forEach(btn=>{if(btn.dataset.ft234Complete)return;if(!btn.textContent?.includes('Training speichern & beenden'))return;btn.dataset.ft234Complete='1';btn.addEventListener('click',()=>{const pending=read234('ft-pending-plan-title','');if(!pending)return;setTimeout(()=>{const all=read234(KEY234,[]);if(!all.length)return;const last={...all[all.length-1]};if(!last.planTitle){last.planTitle=pending;last.name=last.name||pending.split(' · ')[0];all[all.length-1]=last;write234(KEY234,all);write234('ft-pending-plan-title','');sync234()}},80)},{capture:true})})
}

let queued234=false
const enhance234=()=>{queued234=false;capturePlan234();refreshHistory234();document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.33'))el.textContent=t.replaceAll('V2.0.33',FITTOGETHER_VERSION)})}
const schedule234=()=>{if(queued234)return;queued234=true;queueMicrotask(enhance234)}
if(typeof document!=='undefined'){const o=new MutationObserver(schedule234);const start=()=>{enhance234();o.observe(document.body,{childList:true,subtree:true})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
