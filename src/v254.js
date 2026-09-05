// FitTogether V2.0.54: Smart Trainer builds saved plans from the full exercise database.
const FT254='V2.0.54'
const MUSCLES254=['abductors','abs','adductors','biceps','calves','delts','forearms','glutes','hamstrings','lats','pectorals','quads','serratus-anterior','spine','traps','triceps','upper-back']
const API254='https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/api/en/muscles/'
const read254=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write254=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
let db254=null,loading254=null
const loadDb254=()=>db254?Promise.resolve(db254):(loading254||(loading254=Promise.all(MUSCLES254.map(m=>fetch(`${API254}${m}.json`).then(r=>r.ok?r.json():{exercises:[]}).then(g=>(g.exercises||[]).map(x=>({...x,muscle:m}))))).then(x=>{db254=x.flat();return db254}).catch(()=>[])))
const eq254=()=>{const s=read254('ft-available-equipment-v238',null);return s||{bodyweight:true,dumbbell:read254('ft-dumbbell-weights',[]).length>0,barbell:read254('ft-barbell-weights',[]).length>0,band:false,machine:false}}
const eqKey254=v=>{const s=String(v||'').toLowerCase();if(/dumbbell/.test(s))return'dumbbell';if(/barbell|ez bar/.test(s))return'barbell';if(/band/.test(s))return'band';if(/cable|machine|smith|leverage/.test(s))return'machine';if(/body|none|bodyweight|^$/.test(s))return'bodyweight';return'other'}
const targets254=title=>{const t=String(title||'').toLowerCase();if(t.includes('push'))return['pectorals','delts','triceps'];if(t.includes('pull'))return['lats','upper-back','biceps','traps'];if(t.includes('bein')||t.includes('unterkörper'))return['quads','glutes','hamstrings','calves'];if(t.includes('oberkörper'))return['pectorals','lats','upper-back','delts','biceps','triceps'];return['pectorals','lats','quads','delts','glutes','biceps','triceps','abs']}
const allowed254=(x,aware,e)=>{if(!aware)return true;const k=eqKey254(x?.equipment);if(k==='other')return false;return e[k]!==false}
const pick254=(items,title,count,aware,e,seed)=>{const targets=targets254(title),used=new Set(),out=[];let round=0
  while(out.length<count&&round<30){for(const m of targets){const pool=items.filter(x=>x.muscle===m&&allowed254(x,aware,e)&&!used.has(String(x.id||x.name)));if(!pool.length)continue;const idx=Math.abs((seed+round*17+m.length*13))%pool.length,x=pool[idx];used.add(String(x.id||x.name));out.push(x);if(out.length>=count)break}round++}
  return out
}
const reps254=(goal,old)=>{const g=String(goal||'').toLowerCase();if(g.includes('kraft'))return'4–6';if(g.includes('fitness'))return'10–15';return old||'8–12'}
const rebuildLatest254=async()=>{
  const plans=read254('ft-plans',[]);if(!plans.length)return
  const i=plans.length-1,p=plans[i];if(!String(p?.name||'').startsWith('Smart Plan'))return
  const items=await loadDb254();if(!items.length)return
  const aware=read254('ft-smart-only-equipment-v253',true),equipment=eq254(),seed=Number(p.createdAt||Date.now())
  p.databaseSmart=true;p.databaseSize=items.length
  p.sessions=(p.sessions||[]).map((s,si)=>{if(typeof s==='string')return s;const current=s.exercises||[],warm=current.filter(x=>x?.warmup),strength=current.filter(x=>!x?.warmup),wanted=Math.max(3,strength.length||5),picked=pick254(items,s.title,wanted,aware,equipment,seed+si*101);if(!picked.length)return s;const oldReps=strength[0]?.reps||'8–12',sets=Number(strength[0]?.sets)||3;const fresh=picked.map(x=>({name:x.name,query:x.name,sets,reps:reps254(p.goal,oldReps),equipment:x.equipment||'',image:x.thumbUrl||x.gifUrl||'',gifUrl:x.gifUrl||'',thumbUrl:x.thumbUrl||'',muscle:x.muscle||'',source:'ExerciseGymGifsDB'}));return {...s,exercises:[...warm,...fresh]}})
  plans[i]=p;write254('ft-plans',plans);window.FitTogetherCloud?.upload?.()
}
const enhance254=()=>{const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Smarter Trainer');if(page){let note=page.querySelector('.coach-db-note-v254');const box=page.querySelector('.coach-suggestion');if(box&&!note){note=document.createElement('div');note.className='coach-db-note-v254';note.textContent='Der Smart Trainer wählt die Übungen aus der kompletten Übungsdatenbank.';box.insertAdjacentElement('afterbegin',note)}}document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.53'))el.textContent=t.replaceAll('V2.0.53',FT254)})}
const click254=e=>{const b=e.target.closest('button');if(!b||!b.textContent?.includes('Plan speichern'))return;setTimeout(()=>rebuildLatest254(),250)}
let q254=false;const schedule254=()=>{if(q254)return;q254=true;requestAnimationFrame(()=>{q254=false;enhance254()})}
if(typeof document!=='undefined'){document.addEventListener('click',click254,true);const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule254()});const start=()=>{enhance254();obs.observe(document.body,{childList:true,subtree:true})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
