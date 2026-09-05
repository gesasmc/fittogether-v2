// FitTogether V2.0.49: simple custom plan builder with weekday and exercise selection.
const FT249='V2.0.49'
const MUSCLES249=['abductors','abs','adductors','biceps','calves','cardio','delts','forearms','glutes','hamstrings','lats','levator-scapulae','pectorals','quads','serratus-anterior','spine','traps','triceps','upper-back']
const API249='https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/api/en/muscles/'
const DAYS249=[['Mo','Montag'],['Di','Dienstag'],['Mi','Mittwoch'],['Do','Donnerstag'],['Fr','Freitag'],['Sa','Samstag'],['So','Sonntag']]
const read249=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write249=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc249=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
let db249=null,loading249=null
const loadDb249=()=>db249?Promise.resolve(db249):(loading249||(loading249=Promise.all(MUSCLES249.map(m=>fetch(`${API249}${m}.json`).then(r=>r.ok?r.json():{exercises:[]}))).then(x=>{db249=x.flatMap(g=>g.exercises||[]);return db249}).catch(()=>[])))
const pretty249=name=>String(name||'').replaceAll('-',' ').replace(/\bbarbell\b/gi,'Langhantel').replace(/\bdumbbell\b/gi,'Kurzhantel').replace(/\bbench press\b/gi,'Bankdrücken').replace(/\bshoulder press\b/gi,'Schulterdrücken').replace(/\bbiceps curl\b/gi,'Bizeps-Curl').replace(/\btriceps\b/gi,'Trizeps').replace(/\bsquat\b/gi,'Kniebeuge').replace(/\bdeadlift\b/gi,'Kreuzheben').replace(/\blateral raise\b/gi,'Seitheben').replace(/\bpush up\b/gi,'Liegestütz')

const openBuilder249=()=>{
  const overlay=document.createElement('div');overlay.className='plan-builder-v249'
  const state={name:'Mein Trainingsplan',days:['Mo'],sessions:{Mo:[]}}
  let pickerDay=null,query=''
  const render=()=>{
    overlay.innerHTML=`<div class="plan-builder-head-v249"><button type="button" data-close>×</button><div><small>EIGENER PLAN</small><h1>Plan erstellen</h1></div></div><div class="plan-builder-body-v249"><label class="plan-name-v249"><span>Name</span><input data-name value="${esc249(state.name)}"></label><div class="plan-days-title-v249">Trainingstage</div><div class="plan-day-pills-v249">${DAYS249.map(([k,n])=>`<button type="button" data-day="${k}" class="${state.days.includes(k)?'active':''}">${k}</button>`).join('')}</div><div class="plan-session-list-v249">${state.days.map(k=>{const full=DAYS249.find(x=>x[0]===k)?.[1]||k;const list=state.sessions[k]||[];return `<section><div class="plan-session-head-v249"><div><small>${full.toUpperCase()}</small><strong>${list.length} Übungen</strong></div><button type="button" data-add="${k}">+ Übung</button></div>${list.length?`<div class="plan-ex-list-v249">${list.map((x,i)=>`<div><span><strong>${esc249(x.name)}</strong><small><input data-sets="${k}:${i}" inputmode="numeric" value="${x.sets}"> Sätze · <input data-reps="${k}:${i}" inputmode="numeric" value="${x.reps}"> Wdh.</small></span><button type="button" data-remove="${k}:${i}">×</button></div>`).join('')}</div>`:'<p class="plan-empty-v249">Noch keine Übungen hinzugefügt.</p>'}</section>`}).join('')}</div><button type="button" class="plan-save-v249" data-save ${state.days.some(k=>(state.sessions[k]||[]).length)?'':'disabled'}>Plan speichern</button></div>`
    overlay.querySelector('[data-close]').onclick=()=>overlay.remove()
    const name=overlay.querySelector('[data-name]');name.oninput=()=>state.name=name.value
    overlay.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{const k=b.dataset.day;if(state.days.includes(k)){if(state.days.length===1)return;state.days=state.days.filter(x=>x!==k)}else{state.days.push(k);state.days.sort((a,b)=>DAYS249.findIndex(x=>x[0]===a)-DAYS249.findIndex(x=>x[0]===b));state.sessions[k]??=[]}render()})
    overlay.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>openPicker249(b.dataset.add))
    overlay.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const[k,i]=b.dataset.remove.split(':');state.sessions[k].splice(Number(i),1);render()})
    overlay.querySelectorAll('[data-sets]').forEach(inp=>inp.onchange=()=>{const[k,i]=inp.dataset.sets.split(':');state.sessions[k][Number(i)].sets=Math.max(1,Number(inp.value)||1)})
    overlay.querySelectorAll('[data-reps]').forEach(inp=>inp.onchange=()=>{const[k,i]=inp.dataset.reps.split(':');state.sessions[k][Number(i)].reps=Math.max(1,Number(inp.value)||1)})
    const save=overlay.querySelector('[data-save]');if(save)save.onclick=()=>{const sessions=state.days.map(k=>({title:DAYS249.find(x=>x[0]===k)?.[1]||k,day:k,exercises:(state.sessions[k]||[]).map(x=>({name:x.name,query:x.query||x.rawName||x.name,sets:x.sets,reps:String(x.reps),equipment:x.equipment||'',image:x.image||''}))}));const plans=read249('ft-plans',[]);plans.push({name:state.name.trim()||'Mein Trainingsplan',days:state.days.length,weekdays:[...state.days],custom:true,sessions,createdAt:Date.now()});write249('ft-plans',plans);window.FitTogetherCloud?.upload?.();overlay.remove();location.reload()}
  }
  const openPicker249=day=>{
    pickerDay=day;query='';
    let picker=overlay.querySelector('.plan-picker-v249');if(!picker){picker=document.createElement('div');picker.className='plan-picker-v249';overlay.appendChild(picker)}
    const draw=(items=[])=>{picker.innerHTML=`<div class="plan-picker-card-v249"><div class="plan-picker-head-v249"><strong>Übung hinzufügen</strong><button type="button">×</button></div><input class="plan-picker-search-v249" placeholder="Übung suchen" value="${esc249(query)}"><div class="plan-picker-results-v249">${items.slice(0,60).map((x,i)=>`<button type="button" data-pick="${i}"><span><strong>${esc249(pretty249(x.name))}</strong><small>${esc249(x.equipment||'')}</small></span><b>+</b></button>`).join('')||'<p>Keine Übungen gefunden.</p>'}</div></div>`;picker.querySelector('.plan-picker-head-v249 button').onclick=()=>picker.remove();const search=picker.querySelector('.plan-picker-search-v249');search.oninput=()=>{query=search.value.toLowerCase();const filtered=(db249||[]).filter(x=>!query||String(x.name||'').toLowerCase().includes(query));draw(filtered)};picker.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const filtered=(db249||[]).filter(x=>!query||String(x.name||'').toLowerCase().includes(query));const x=filtered[Number(b.dataset.pick)];if(!x)return;state.sessions[pickerDay]??=[];state.sessions[pickerDay].push({name:pretty249(x.name),rawName:x.name,query:x.name,sets:3,reps:10,equipment:x.equipment||'',image:x.thumbUrl||x.gifUrl||''});picker.remove();render()})}
    draw([]);loadDb249().then(items=>{if(!picker.isConnected)return;draw(items)})
  }
  document.body.appendChild(overlay);render()
}

const enhancePlans249=()=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Trainingspläne')
  if(!page)return
  let btn=page.querySelector('.custom-plan-create-v249')
  if(!btn){btn=document.createElement('button');btn.type='button';btn.className='custom-plan-create-v249';btn.textContent='+ Eigenen Plan erstellen';page.querySelector('.page-head')?.insertAdjacentElement('afterend',btn);btn.onclick=openBuilder249}
}
const version249=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(/V2\.0\.(47|48)/.test(t))el.textContent=t.replace(/V2\.0\.(47|48)/g,FT249)})
let q249=false
const enhance249=()=>{q249=false;enhancePlans249();version249()}
const schedule249=()=>{if(q249)return;q249=true;requestAnimationFrame(enhance249)}
if(typeof document!=='undefined'){
 const obs=new MutationObserver(m=>{if(document.querySelector('.plan-builder-v249'))return;if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule249()})
 const start=()=>{enhance249();obs.observe(document.body,{childList:true,subtree:true})}
 document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
