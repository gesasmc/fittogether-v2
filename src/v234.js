// FitTogether V2.0.127: detailed completed-training history with per-exercise/set breakdown.
export const FITTOGETHER_VERSION='V2.0.127'
const KEY234='ft-completed-workouts'
const read234=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)??JSON.stringify(f))}catch{return f}}
const write234=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc234=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const fmtDuration234=s=>{const n=Math.max(0,Math.round(Number(s)||0));if(!n)return'';const h=Math.floor(n/3600),m=Math.floor((n%3600)/60),sec=n%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${m}:${String(sec).padStart(2,'0')}`}
const sync234=()=>{try{window.FitTogetherCloud?.upload?.()}catch{}}
const setRows234=x=>Array.isArray(x?.sets)?x.sets:[]
const exerciseNames234=x=>[...new Set(setRows234(x).map(s=>String(s?.exercise||'').trim()).filter(Boolean))]
const cardioSet234=s=>s?.kind==='cardio'||s?.loadType==='cardio'
const cardioSeconds234=x=>{const direct=Number(x?.actualSeconds??x?.durationSeconds)||0;if(direct>0)return direct;const cardio=setRows234(x).filter(cardioSet234);return cardio.reduce((a,s)=>a+(Number(s.durationSeconds)||Number(s.durationMinutes)*60||0),0)}
const pureCardio234=x=>{const sets=setRows234(x);if(sets.length)return sets.every(cardioSet234);return x?.kind==='cardio'||x?.actualSeconds!=null||x?.durationSeconds!=null}
const hasCardio234=x=>pureCardio234(x)||setRows234(x).some(cardioSet234)
const defaultTitle234=x=>{if(x.name&&x.name!=='Training')return x.name;if(x.planTitle)return x.planTitle;const names=exerciseNames234(x);if(pureCardio234(x)&&names.length===1)return names[0];if(pureCardio234(x))return'Cardio';return x.single?'Einzelübung':`Training · ${x.exercises||names.length||0} Übungen`}
const exerciseSummary234=x=>{const names=exerciseNames234(x);if(!names.length)return'';if(names.length<=3)return names.join(' · ');return `${names.slice(0,3).join(' · ')} · +${names.length-3}`}
const dateInput234=ts=>{const d=new Date(Number(ts)||Date.now());const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
const closeModal234=()=>document.querySelector('.history-modal-v234')?.remove()
const loadLabel234=s=>{if(cardioSet234(s))return fmtDuration234(Number(s.durationSeconds)||Number(s.durationMinutes)*60)||'Cardio';const reps=s.actualReps??s.reps??s.plannedReps,weight=s.actualWeight??s.weight??s.plannedWeight,extra=s.actualExtraWeight??s.extraWeight,load=s.loadType;const bits=[];if(reps!==undefined&&reps!==null&&reps!=='')bits.push(`${reps} Wdh.`);if(load!=='bodyweight'&&weight!==undefined&&weight!==null&&weight!=='')bits.push(`${weight} kg`);if(extra!==undefined&&extra!==null&&Number(extra)>0)bits.push(`+${extra} kg`);if(s.rir!==undefined&&s.rir!==null&&s.rir!=='')bits.push(`RIR ${s.rir}`);return bits.join(' · ')||'Satz abgeschlossen'}
const groups234=x=>{const map=new Map();for(const s of setRows234(x)){const name=String(s?.exercise||'Übung').trim()||'Übung';if(!map.has(name))map.set(name,[]);map.get(name).push(s)}return[...map.entries()].map(([name,sets])=>({name,sets}))}
const type234=x=>pureCardio234(x)?'Cardio':hasCardio234(x)?'Kraft + Cardio':'Krafttraining'

const openEditor234=index=>{
  closeModal234();const rows=read234(KEY234,[]),x=rows[index];if(!x)return
  const modal=document.createElement('div');modal.className='history-modal-v234';const cardio=pureCardio234(x),seconds=cardioSeconds234(x)
  modal.innerHTML=`<div class="history-editor-v234"><div class="history-editor-head-v234"><div><small>TRAINING BEARBEITEN</small><h2>${esc234(defaultTitle234(x))}</h2></div><button type="button" data-close>×</button></div><label><span>Titel</span><input data-title value="${esc234(defaultTitle234(x))}"></label><label><span>Datum</span><input data-date type="date" value="${dateInput234(x.date)}"></label>${cardio?`<div class="history-time-v234"><span>Tatsächliche Zeit</span><div><label><input data-min inputmode="numeric" value="${Math.floor(seconds/60)}"><small>MIN</small></label><b>:</b><label><input data-sec inputmode="numeric" value="${seconds%60}"><small>SEK</small></label></div></div>`:''}<div class="history-editor-actions-v234"><button type="button" class="danger" data-delete>Löschen</button><button type="button" class="primary" data-save>Speichern</button></div></div>`
  document.body.appendChild(modal);modal.querySelector('[data-close]').onclick=closeModal234;modal.addEventListener('click',e=>{if(e.target===modal)closeModal234()})
  modal.querySelector('[data-save]').onclick=()=>{const all=read234(KEY234,[]),item={...all[index]};if(!item)return;item.name=(modal.querySelector('[data-title]').value||'Training').trim();const ds=modal.querySelector('[data-date]').value;if(ds){const old=new Date(Number(item.date)||Date.now());const[y,m,d]=ds.split('-').map(Number);old.setFullYear(y,m-1,d);item.date=old.getTime()}if(cardio){const min=Math.max(0,Number(modal.querySelector('[data-min]').value)||0),sec=Math.max(0,Math.min(59,Number(modal.querySelector('[data-sec]').value)||0));item.actualSeconds=min*60+sec;item.durationSeconds=item.actualSeconds}all[index]=item;write234(KEY234,all);sync234();closeModal234();refreshHistory234(true)}
  modal.querySelector('[data-delete]').onclick=()=>{if(!confirm('Dieses Training wirklich löschen?'))return;const all=read234(KEY234,[]);all.splice(index,1);write234(KEY234,all);sync234();closeModal234();refreshHistory234(true)}
}

const openDetail234=index=>{
  closeModal234();const rows=read234(KEY234,[]),x=rows[index];if(!x)return
  const groups=groups234(x),date=new Date(Number(x.date)||Date.now()).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'}),seconds=cardioSeconds234(x),cardio=pureCardio234(x),mixed=hasCardio234(x)&&!cardio
  const strengthSets=setRows234(x).filter(s=>!cardioSet234(s)).length,cardioSets=setRows234(x).filter(cardioSet234).length
  const modal=document.createElement('div');modal.className='history-modal-v234 history-detail-modal-v234'
  const statBits=[`<div><small>TYP</small><strong>${esc234(type234(x))}</strong></div>`]
  if(cardio&&seconds)statBits.push(`<div><small>DAUER</small><strong>${esc234(fmtDuration234(seconds))}</strong></div>`)
  else{statBits.push(`<div><small>ÜBUNGEN</small><strong>${groups.length||x.exercises||0}</strong></div>`);if(strengthSets)statBits.push(`<div><small>SÄTZE</small><strong>${strengthSets}</strong></div>`);if(mixed&&seconds)statBits.push(`<div><small>CARDIO</small><strong>${esc234(fmtDuration234(seconds))}</strong></div>`)}
  const list=groups.length?groups.map((g,gi)=>{const gCardio=g.sets.length&&g.sets.every(cardioSet234);const total=gCardio?g.sets.reduce((a,s)=>a+(Number(s.durationSeconds)||Number(s.durationMinutes)*60||0),0):0;return `<section class="history-exercise-v234"><div class="history-exercise-head-v234"><span>${gi+1}</span><div><strong>${esc234(g.name)}</strong><small>${gCardio?(fmtDuration234(total)||'Cardio'):`${g.sets.length} ${g.sets.length===1?'Satz':'Sätze'}`}</small></div></div><div class="history-set-list-v234">${g.sets.map((s,si)=>`<div><b>${gCardio?'CARDIO':`SATZ ${s.set||si+1}`}</b><span>${esc234(loadLabel234(s))}</span>${!gCardio&&s.rirTarget!==undefined&&s.rirTarget!==null?`<em>Ziel RIR ${esc234(s.rirTarget)}</em>`:''}</div>`).join('')}</div></section>`}).join(''):`<p class="history-empty-v234">Für dieses ältere Training sind noch keine Satzdetails gespeichert.</p>`
  modal.innerHTML=`<div class="history-detail-v234"><div class="history-detail-head-v234"><button type="button" data-close aria-label="Schließen">←</button><div><small>TRAININGSDETAILS</small><h2>${esc234(defaultTitle234(x))}</h2><p>${esc234(date)}${x.source?` · ${esc234(x.source)}`:''}</p></div><button type="button" data-edit>Bearbeiten</button></div><div class="history-detail-stats-v234">${statBits.join('')}</div><div class="history-detail-scroll-v234">${list}</div></div>`
  document.body.appendChild(modal);modal.querySelector('[data-close]').onclick=closeModal234;modal.querySelector('[data-edit]').onclick=()=>openEditor234(index);modal.addEventListener('click',e=>{if(e.target===modal)closeModal234()})
}

const refreshHistory234=(force=false)=>{
  const stats=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Statistik'));if(!stats)return
  let box=stats.querySelector('.training-history-v234');if(!box){box=document.createElement('section');box.className='training-history-v234';const profileBtn=[...stats.querySelectorAll('button')].find(b=>b.textContent?.includes('Profil & Gewicht'));if(profileBtn)profileBtn.insertAdjacentElement('beforebegin',box);else stats.appendChild(box)}
  const rows=read234(KEY234,[]);const signature=JSON.stringify(rows.map(x=>[x.date,x.name,x.planTitle,x.kind,x.actualSeconds,x.durationSeconds,x.exercises,setRows234(x).map(s=>[s.exercise,s.durationSeconds,s.durationMinutes,s.kind,s.set,s.actualReps,s.reps,s.actualWeight,s.weight,s.rir])]))
  if(!force&&box.dataset.signature===signature)return
  box.dataset.signature=signature
  box.innerHTML=`<div class="section-title"><span>Trainingsverlauf</span></div>${rows.length===0?'<p class="history-empty-v234">Noch keine abgeschlossenen Trainings vorhanden.</p>':`<div class="history-list-v234">${rows.map((x,i)=>{const d=new Date(Number(x.date)||Date.now()).toLocaleDateString('de-DE'),cardio=pureCardio234(x),seconds=cardioSeconds234(x),names=exerciseNames234(x),summary=exerciseSummary234(x);const detail=cardio?(fmtDuration234(seconds)||'Cardio'):(x.planTitle?`Plan · ${esc234(x.planTitle)}`:`${x.exercises||names.length||1} ${Number(x.exercises||names.length||1)===1?'Übung':'Übungen'}`);return `<button type="button" data-history-index="${i}"><span><strong>${esc234(defaultTitle234(x))}</strong><small>${esc234(d)} · ${detail}</small>${summary?`<em>${esc234(summary)}</em>`:''}</span><b>Details ›</b></button>`}).reverse().join('')}</div>`}`
  box.querySelectorAll('[data-history-index]').forEach(btn=>btn.onclick=()=>openDetail234(Number(btn.dataset.historyIndex)))
}

const capturePlan234=()=>{document.querySelectorAll('.plan-days button').forEach(btn=>{if(btn.dataset.ft234)return;btn.dataset.ft234='1';btn.addEventListener('click',()=>{write234('ft-pending-plan-title',btn.querySelector('span')?.textContent?.trim()||'')},{capture:true})});document.querySelectorAll('.primary-action').forEach(btn=>{if(btn.dataset.ft234Complete||!btn.textContent?.includes('Training speichern & beenden'))return;btn.dataset.ft234Complete='1';btn.addEventListener('click',()=>{const pending=read234('ft-pending-plan-title','');if(!pending)return;setTimeout(()=>{const all=read234(KEY234,[]);if(!all.length)return;const last={...all[all.length-1]};if(!last.planTitle){last.planTitle=pending;last.name=last.name||pending.split(' · ')[0];all[all.length-1]=last;write234(KEY234,all);write234('ft-pending-plan-title','');sync234()}},80)},{capture:true})})}

let queued234=false
const enhance234=()=>{queued234=false;capturePlan234();refreshHistory234()}
const schedule234=()=>{if(queued234)return;queued234=true;requestAnimationFrame(enhance234)}
if(typeof document!=='undefined'){const o=new MutationObserver(schedule234);const start=()=>{enhance234();o.observe(document.body,{childList:true,subtree:true})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
