// FitTogether V2.0.123: editable completed-training history with automatic cardio duration + exercise summary.
export const FITTOGETHER_VERSION='V2.0.123'
const KEY234='ft-completed-workouts'
const read234=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)??JSON.stringify(f))}catch{return f}}
const write234=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc234=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const fmtDuration234=s=>{const n=Math.max(0,Number(s)||0);return n?`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')} Min.`:''}
const sync234=()=>{try{window.FitTogetherCloud?.upload?.()}catch{}}
const setRows234=x=>Array.isArray(x?.sets)?x.sets:[]
const exerciseNames234=x=>[...new Set(setRows234(x).map(s=>String(s?.exercise||'').trim()).filter(Boolean))]
const cardioSeconds234=x=>{const direct=Number(x?.actualSeconds??x?.durationSeconds)||0;if(direct>0)return direct;const cardio=setRows234(x).filter(s=>s?.kind==='cardio'||s?.loadType==='cardio');if(!cardio.length)return 0;return cardio.reduce((a,s)=>a+(Number(s.durationSeconds)||Number(s.durationMinutes)*60||0),0)}
const isCardio234=x=>x?.kind==='cardio'||x?.actualSeconds!=null||x?.durationSeconds!=null||setRows234(x).some(s=>s?.kind==='cardio'||s?.loadType==='cardio')
const defaultTitle234=x=>{if(x.name&&x.name!=='Training')return x.name;if(x.planTitle)return x.planTitle;const names=exerciseNames234(x);if(isCardio234(x)&&names.length===1)return names[0];if(isCardio234(x))return'Cardio';return x.single?'Einzelübung':`Training · ${x.exercises||names.length||0} Übungen`}
const exerciseSummary234=x=>{const names=exerciseNames234(x);if(!names.length)return'';if(names.length<=3)return names.join(' · ');return `${names.slice(0,3).join(' · ')} · +${names.length-3}`}
const dateInput234=ts=>{const d=new Date(Number(ts)||Date.now());const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
const closeModal234=()=>document.querySelector('.history-modal-v234')?.remove()

const openEditor234=index=>{
  closeModal234();const rows=read234(KEY234,[]),x=rows[index];if(!x)return
  const modal=document.createElement('div');modal.className='history-modal-v234';const cardio=isCardio234(x),seconds=cardioSeconds234(x)
  modal.innerHTML=`<div class="history-editor-v234"><div class="history-editor-head-v234"><div><small>TRAINING BEARBEITEN</small><h2>${esc234(defaultTitle234(x))}</h2></div><button type="button" data-close>×</button></div><label><span>Titel</span><input data-title value="${esc234(defaultTitle234(x))}"></label><label><span>Datum</span><input data-date type="date" value="${dateInput234(x.date)}"></label>${cardio?`<div class="history-time-v234"><span>Tatsächliche Zeit</span><div><label><input data-min inputmode="numeric" value="${Math.floor(seconds/60)}"><small>MIN</small></label><b>:</b><label><input data-sec inputmode="numeric" value="${seconds%60}"><small>SEK</small></label></div></div>`:''}<div class="history-editor-actions-v234"><button type="button" class="danger" data-delete>Löschen</button><button type="button" class="primary" data-save>Speichern</button></div></div>`
  document.body.appendChild(modal);modal.querySelector('[data-close]').onclick=closeModal234;modal.addEventListener('click',e=>{if(e.target===modal)closeModal234()})
  modal.querySelector('[data-save]').onclick=()=>{const all=read234(KEY234,[]),item={...all[index]};if(!item)return;item.name=(modal.querySelector('[data-title]').value||'Training').trim();const ds=modal.querySelector('[data-date]').value;if(ds){const old=new Date(Number(item.date)||Date.now());const [y,m,d]=ds.split('-').map(Number);old.setFullYear(y,m-1,d);item.date=old.getTime()}if(cardio){const min=Math.max(0,Number(modal.querySelector('[data-min]').value)||0),sec=Math.max(0,Math.min(59,Number(modal.querySelector('[data-sec]').value)||0));item.actualSeconds=min*60+sec;item.durationSeconds=item.actualSeconds}all[index]=item;write234(KEY234,all);sync234();closeModal234();refreshHistory234(true)}
  modal.querySelector('[data-delete]').onclick=()=>{if(!confirm('Dieses Training wirklich löschen?'))return;const all=read234(KEY234,[]);all.splice(index,1);write234(KEY234,all);sync234();closeModal234();refreshHistory234(true)}
}

const refreshHistory234=(force=false)=>{
  const stats=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Statistik'));if(!stats)return
  let box=stats.querySelector('.training-history-v234');if(!box){box=document.createElement('section');box.className='training-history-v234';const profileBtn=[...stats.querySelectorAll('button')].find(b=>b.textContent?.includes('Profil & Gewicht'));if(profileBtn)profileBtn.insertAdjacentElement('beforebegin',box);else stats.appendChild(box)}
  const rows=read234(KEY234,[]);const signature=JSON.stringify(rows.map(x=>[x.date,x.name,x.planTitle,x.kind,x.actualSeconds,x.durationSeconds,x.exercises,setRows234(x).map(s=>[s.exercise,s.durationSeconds,s.durationMinutes,s.kind])]))
  if(!force&&box.dataset.signature===signature)return
  box.dataset.signature=signature
  box.innerHTML=`<div class="section-title"><span>Trainingsverlauf</span></div>${rows.length===0?'<p class="history-empty-v234">Noch keine abgeschlossenen Trainings vorhanden.</p>':`<div class="history-list-v234">${rows.map((x,i)=>{const d=new Date(Number(x.date)||Date.now()).toLocaleDateString('de-DE'),cardio=isCardio234(x),seconds=cardioSeconds234(x),names=exerciseNames234(x),summary=exerciseSummary234(x);const detail=cardio?(fmtDuration234(seconds)||'Cardio'):(x.planTitle?`Plan · ${esc234(x.planTitle)}`:`${x.exercises||names.length||1} ${Number(x.exercises||names.length||1)===1?'Übung':'Übungen'}`);return `<button type="button" data-history-index="${i}"><span><strong>${esc234(defaultTitle234(x))}</strong><small>${esc234(d)} · ${detail}</small>${summary?`<em>${esc234(summary)}</em>`:''}</span><b>Bearbeiten</b></button>`}).reverse().join('')}</div>`}`
  box.querySelectorAll('[data-history-index]').forEach(btn=>btn.onclick=()=>openEditor234(Number(btn.dataset.historyIndex)))
}

const capturePlan234=()=>{document.querySelectorAll('.plan-days button').forEach(btn=>{if(btn.dataset.ft234)return;btn.dataset.ft234='1';btn.addEventListener('click',()=>{write234('ft-pending-plan-title',btn.querySelector('span')?.textContent?.trim()||'')},{capture:true})});document.querySelectorAll('.primary-action').forEach(btn=>{if(btn.dataset.ft234Complete||!btn.textContent?.includes('Training speichern & beenden'))return;btn.dataset.ft234Complete='1';btn.addEventListener('click',()=>{const pending=read234('ft-pending-plan-title','');if(!pending)return;setTimeout(()=>{const all=read234(KEY234,[]);if(!all.length)return;const last={...all[all.length-1]};if(!last.planTitle){last.planTitle=pending;last.name=last.name||pending.split(' · ')[0];all[all.length-1]=last;write234(KEY234,all);write234('ft-pending-plan-title','');sync234()}},80)},{capture:true})})}

let queued234=false
const enhance234=()=>{queued234=false;capturePlan234();refreshHistory234()}
const schedule234=()=>{if(queued234)return;queued234=true;requestAnimationFrame(enhance234)}
if(typeof document!=='undefined'){const o=new MutationObserver(schedule234);const start=()=>{enhance234();o.observe(document.body,{childList:true,subtree:true})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
