// FitTogether V2.0.50: custom plan builder, deletable plan cards, filtered exercise picker with GIF previews.
const FT249='V2.0.50'
const MUSCLES249=['abductors','abs','adductors','biceps','calves','cardio','delts','forearms','glutes','hamstrings','lats','levator-scapulae','pectorals','quads','serratus-anterior','spine','traps','triceps','upper-back']
const API249='https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/api/en/muscles/'
const DAYS249=[['Mo','Montag'],['Di','Dienstag'],['Mi','Mittwoch'],['Do','Donnerstag'],['Fr','Freitag'],['Sa','Samstag'],['So','Sonntag']]
const read249=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write249=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc249=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
let db249=null,loading249=null
const loadDb249=()=>db249?Promise.resolve(db249):(loading249||(loading249=Promise.all(MUSCLES249.map(m=>fetch(`${API249}${m}.json`).then(r=>r.ok?r.json():{exercises:[]}).then(g=>(g.exercises||[]).map(x=>({...x,muscle:m}))))).then(x=>{db249=x.flat();return db249}).catch(()=>[])))
const pretty249=name=>String(name||'').replaceAll('-',' ').replace(/\bbarbell\b/gi,'Langhantel').replace(/\bdumbbell\b/gi,'Kurzhantel').replace(/\bbench press\b/gi,'Bankdrücken').replace(/\bshoulder press\b/gi,'Schulterdrücken').replace(/\bbiceps curl\b/gi,'Bizeps-Curl').replace(/\btriceps\b/gi,'Trizeps').replace(/\bsquat\b/gi,'Kniebeuge').replace(/\bdeadlift\b/gi,'Kreuzheben').replace(/\blateral raise\b/gi,'Seitheben').replace(/\bpush up\b/gi,'Liegestütz')
const prettyMuscle249=m=>String(m||'').replace('pectorals','Brust').replace('quads','Quadrizeps').replace('delts','Schultern').replace('lats','Latissimus').replace('abs','Bauch').replace('glutes','Gesäß').replace('hamstrings','Beinbeuger').replace('calves','Waden').replace('upper-back','Oberer Rücken').replace('forearms','Unterarme').replace('adductors','Adduktoren').replace('abductors','Abduktoren').replace('traps','Trapez').replace('spine','Rückenstrecker').replace('serratus-anterior','Serratus').replace('levator-scapulae','Schulterblattheber').replace(/\b\w/g,c=>c.toUpperCase())
const equipmentGroup249=e=>{const s=String(e||'').toLowerCase();if(/dumbbell|kurzhantel/.test(s))return 'Kurzhantel';if(/barbell|langhantel|ez bar/.test(s))return 'Langhantel';if(/body|none|bodyweight/.test(s))return 'Körpergewicht';if(/band/.test(s))return 'Band';if(/cable|machine/.test(s))return 'Kabel/Maschine';return e||'Sonstige'}

const openBuilder249=()=>{
  const overlay=document.createElement('div');overlay.className='plan-builder-v249'
  const state={name:'Mein Trainingsplan',days:['Mo'],sessions:{Mo:[]}}
  let pickerDay=null,query='',muscleFilter='all',equipmentFilter='all'
  const render=()=>{
    overlay.innerHTML=`<div class="plan-builder-head-v249"><button type="button" data-close>×</button><div><small>EIGENER PLAN</small><h1>Plan erstellen</h1></div></div><div class="plan-builder-body-v249"><label class="plan-name-v249"><span>Name</span><input data-name value="${esc249(state.name)}"></label><div class="plan-days-title-v249">Trainingstage</div><div class="plan-day-pills-v249">${DAYS249.map(([k])=>`<button type="button" data-day="${k}" class="${state.days.includes(k)?'active':''}">${k}</button>`).join('')}</div><div class="plan-session-list-v249">${state.days.map(k=>{const full=DAYS249.find(x=>x[0]===k)?.[1]||k;const list=state.sessions[k]||[];return `<section><div class="plan-session-head-v249"><div><small>${full.toUpperCase()}</small><strong>${list.length} Übungen</strong></div><button type="button" data-add="${k}">+ Übung</button></div>${list.length?`<div class="plan-ex-list-v249">${list.map((x,i)=>`<div><span><strong>${esc249(x.name)}</strong><small><input data-sets="${k}:${i}" inputmode="numeric" value="${x.sets}"> Sätze · <input data-reps="${k}:${i}" inputmode="numeric" value="${x.reps}"> Wdh.</small></span><button type="button" data-remove="${k}:${i}">×</button></div>`).join('')}</div>`:'<p class="plan-empty-v249">Noch keine Übungen hinzugefügt.</p>'}</section>`}).join('')}</div><button type="button" class="plan-save-v249" data-save ${state.days.some(k=>(state.sessions[k]||[]).length)?'':'disabled'}>Plan speichern</button></div>`
    overlay.querySelector('[data-close]').onclick=()=>overlay.remove()
    const name=overlay.querySelector('[data-name]');name.oninput=()=>state.name=name.value
    overlay.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{const k=b.dataset.day;if(state.days.includes(k)){if(state.days.length===1)return;state.days=state.days.filter(x=>x!==k)}else{state.days.push(k);state.days.sort((a,b)=>DAYS249.findIndex(x=>x[0]===a)-DAYS249.findIndex(x=>x[0]===b));state.sessions[k]??=[]}render()})
    overlay.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>openPicker249(b.dataset.add))
    overlay.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const[k,i]=b.dataset.remove.split(':');state.sessions[k].splice(Number(i),1);render()})
    overlay.querySelectorAll('[data-sets]').forEach(inp=>inp.onchange=()=>{const[k,i]=inp.dataset.sets.split(':');state.sessions[k][Number(i)].sets=Math.max(1,Number(inp.value)||1)})
    overlay.querySelectorAll('[data-reps]').forEach(inp=>inp.onchange=()=>{const[k,i]=inp.dataset.reps.split(':');state.sessions[k][Number(i)].reps=Math.max(1,Number(inp.value)||1)})
    const save=overlay.querySelector('[data-save]');if(save)save.onclick=()=>{const sessions=state.days.map(k=>({title:DAYS249.find(x=>x[0]===k)?.[1]||k,day:k,exercises:(state.sessions[k]||[]).map(x=>({name:x.name,query:x.query||x.rawName||x.name,sets:x.sets,reps:String(x.reps),equipment:x.equipment||'',image:x.image||''}))}));const plans=read249('ft-plans',[]);plans.push({name:state.name.trim()||'Mein Trainingsplan',days:state.days.length,weekdays:[...state.days],custom:true,sessions,createdAt:Date.now()});write249('ft-plans',plans);window.FitTogetherCloud?.upload?.();overlay.remove();location.reload()}
  }
  const filterItems249=()=> (db249||[]).filter(x=>{
    const q=query.trim().toLowerCase(),name=String(x.name||'').toLowerCase(),eq=equipmentGroup249(x.equipment)
    return (!q||name.includes(q)||pretty249(name).toLowerCase().includes(q))&&(muscleFilter==='all'||x.muscle===muscleFilter)&&(equipmentFilter==='all'||eq===equipmentFilter)
  })
  const openPicker249=day=>{
    pickerDay=day;query='';muscleFilter='all';equipmentFilter='all'
    let picker=overlay.querySelector('.plan-picker-v249');if(!picker){picker=document.createElement('div');picker.className='plan-picker-v249';overlay.appendChild(picker)}
    const draw=()=>{
      const items=filterItems249(),equipmentOptions=[...new Set((db249||[]).map(x=>equipmentGroup249(x.equipment)).filter(Boolean))].sort()
      picker.innerHTML=`<div class="plan-picker-card-v249"><div class="plan-picker-head-v249"><strong>Übung hinzufügen</strong><button type="button">×</button></div><input class="plan-picker-search-v249" placeholder="Übung suchen" value="${esc249(query)}"><div class="plan-picker-filters-v250"><select data-muscle><option value="all">Alle Muskeln</option>${MUSCLES249.map(m=>`<option value="${m}" ${muscleFilter===m?'selected':''}>${prettyMuscle249(m)}</option>`).join('')}</select><select data-equipment><option value="all">Alle Geräte</option>${equipmentOptions.map(e=>`<option value="${esc249(e)}" ${equipmentFilter===e?'selected':''}>${esc249(e)}</option>`).join('')}</select></div><div class="plan-picker-count-v250">${items.length} Übungen</div><div class="plan-picker-results-v249">${items.slice(0,100).map((x,i)=>`<button type="button" data-pick="${i}">${x.thumbUrl||x.gifUrl?`<img src="${esc249(x.thumbUrl||x.gifUrl)}" loading="lazy" alt="">`:'<i class="plan-picker-noimg-v250">—</i>'}<span><strong>${esc249(pretty249(x.name))}</strong><small>${esc249(prettyMuscle249(x.muscle))} · ${esc249(equipmentGroup249(x.equipment))}</small></span><b>+</b></button>`).join('')||'<p>Keine Übungen gefunden.</p>'}</div></div>`
      picker.querySelector('.plan-picker-head-v249 button').onclick=()=>picker.remove()
      const search=picker.querySelector('.plan-picker-search-v249');search.oninput=()=>{query=search.value;draw()}
      picker.querySelector('[data-muscle]').onchange=e=>{muscleFilter=e.target.value;draw()}
      picker.querySelector('[data-equipment]').onchange=e=>{equipmentFilter=e.target.value;draw()}
      picker.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const x=filterItems249()[Number(b.dataset.pick)];if(!x)return;state.sessions[pickerDay]??=[];state.sessions[pickerDay].push({name:pretty249(x.name),rawName:x.name,query:x.name,sets:3,reps:10,equipment:x.equipment||'',image:x.thumbUrl||x.gifUrl||''});picker.remove();render()})
    }
    picker.innerHTML='<div class="plan-picker-card-v249"><p>Übungen werden geladen …</p></div>';loadDb249().then(()=>{if(picker.isConnected)draw()})
  }
  document.body.appendChild(overlay);render()
}

const deletePlan249=(index,name)=>{
  if(!confirm(`„${name||'Plan'}“ wirklich löschen?`))return
  const plans=read249('ft-plans',[]);if(!plans[index])return;plans.splice(index,1);write249('ft-plans',plans);window.FitTogetherCloud?.upload?.();location.reload()
}
const enhancePlans249=()=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Trainingspläne')
  if(!page)return
  let btn=page.querySelector('.custom-plan-create-v249')
  if(!btn){btn=document.createElement('button');btn.type='button';btn.className='custom-plan-create-v249';btn.textContent='+ Eigenen Plan erstellen';page.querySelector('.page-head')?.insertAdjacentElement('afterend',btn);btn.onclick=openBuilder249}
  const plans=read249('ft-plans',[])
  page.querySelectorAll('.plan-card').forEach(card=>{
    if(card.querySelector('.plan-delete-v250'))return
    const text=card.textContent||''
    const idx=plans.findIndex(p=>p?.custom&&text.includes(p.name||''))
    if(idx<0)return
    card.classList.add('deletable-card-v250')
    const del=document.createElement('button');del.type='button';del.className='plan-delete-v250';del.textContent='×';del.setAttribute('aria-label','Plan löschen')
    del.onclick=e=>{e.preventDefault();e.stopPropagation();deletePlan249(idx,plans[idx]?.name)}
    card.appendChild(del)
  })
}
const version249=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(/V2\.0\.(47|48|49)/.test(t))el.textContent=t.replace(/V2\.0\.(47|48|49)/g,FT249)})
let q249=false
const enhance249=()=>{q249=false;enhancePlans249();version249()}
const schedule249=()=>{if(q249)return;q249=true;requestAnimationFrame(enhance249)}
if(typeof document!=='undefined'){
 const obs=new MutationObserver(m=>{if(document.querySelector('.plan-builder-v249'))return;if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule249()})
 const start=()=>{enhance249();obs.observe(document.body,{childList:true,subtree:true})}
 document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
