// FitTogether V2.0.56: repair Smart Trainer plan length and keep 60-minute plans realistic.
const FT256='V2.0.56'
const MUSCLES256=['abductors','abs','adductors','biceps','calves','delts','forearms','glutes','hamstrings','lats','pectorals','quads','serratus-anterior','spine','traps','triceps','upper-back']
const API256='https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/api/en/muscles/'
const read256=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write256=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
let db256=null,loading256=null
const loadDb256=()=>db256?Promise.resolve(db256):(loading256||(loading256=Promise.all(MUSCLES256.map(m=>fetch(`${API256}${m}.json`).then(r=>r.ok?r.json():{exercises:[]}).then(g=>(g.exercises||[]).map(x=>({...x,muscle:m}))))).then(x=>{db256=x.flat();return db256}).catch(()=>[])))
const eq256=()=>{const s=read256('ft-available-equipment-v238',null);return s||{bodyweight:true,dumbbell:read256('ft-dumbbell-weights',[]).length>0,barbell:read256('ft-barbell-weights',[]).length>0,band:false,machine:false}}
const eqKey256=v=>{const s=String(v||'').toLowerCase();if(/dumbbell/.test(s))return'dumbbell';if(/barbell|ez bar/.test(s))return'barbell';if(/band/.test(s))return'band';if(/cable|machine|smith|leverage/.test(s))return'machine';if(/body|none|bodyweight|^$/.test(s))return'bodyweight';return'other'}
const targets256=title=>{const t=String(title||'').toLowerCase();if(t.includes('push'))return['pectorals','delts','triceps'];if(t.includes('pull'))return['lats','upper-back','biceps','traps'];if(t.includes('bein')||t.includes('unterkörper'))return['quads','glutes','hamstrings','calves'];if(t.includes('oberkörper'))return['pectorals','lats','upper-back','delts','biceps','triceps'];return['pectorals','lats','quads','delts','glutes','biceps','triceps','abs']}
const wanted256=min=>{const m=Number(min)||60;if(m>=75)return 7;if(m>=55)return 6;if(m>=40)return 5;if(m>=25)return 4;return 3}
const allowed256=(x,aware,e)=>{if(!aware)return true;const k=eqKey256(x?.equipment);if(k==='other')return false;return e[k]!==false}
const pick256=(items,title,count,aware,e,seed)=>{const targets=targets256(title),used=new Set(),out=[];const add=x=>{const k=String(x?.id||x?.name||'');if(!x||!k||used.has(k))return false;used.add(k);out.push(x);return true}
  for(let round=0;round<40&&out.length<count;round++)for(const m of targets){const pool=items.filter(x=>x.muscle===m&&allowed256(x,aware,e)&&!used.has(String(x.id||x.name)));if(!pool.length)continue;add(pool[Math.abs(seed+round*29+m.length*11)%pool.length]);if(out.length>=count)break}
  if(out.length<count){const fallback=items.filter(x=>targets.includes(x.muscle)&&allowed256(x,aware,e)&&!used.has(String(x.id||x.name)));for(let i=0;i<fallback.length&&out.length<count;i++)add(fallback[Math.abs(seed+i*37)%fallback.length])}
  if(out.length<count){const fallback=items.filter(x=>allowed256(x,aware,e)&&!used.has(String(x.id||x.name)));for(let i=0;i<fallback.length&&out.length<count;i++)add(fallback[Math.abs(seed+i*41)%fallback.length])}
  return out
}
const reps256=(goal,old)=>{const g=String(goal||'').toLowerCase();if(g.includes('kraft'))return'4–6';if(g.includes('fitness'))return'10–15';return old||'8–12'}
const repairSmartPlans256=async()=>{const plans=read256('ft-plans',[]);if(!plans.length)return;const items=await loadDb256();if(!items.length)return;const aware=read256('ft-smart-only-equipment-v253',true),equipment=eq256();let changed=false
  for(let pi=0;pi<plans.length;pi++){const p=plans[pi];if(!String(p?.name||'').startsWith('Smart Plan'))continue;const baseSeed=Number(p.createdAt||Date.now())+pi*977;p.sessions=(p.sessions||[]).map((s,si)=>{if(typeof s==='string')return s;const current=s.exercises||[],warm=current.filter(x=>x?.warmup),strength=current.filter(x=>!x?.warmup),minutes=Number(s.duration||p.minutes||p.duration||60),wanted=wanted256(minutes);if(strength.length>=wanted)return s;const picked=pick256(items,s.title,wanted,aware,equipment,baseSeed+si*101);if(!picked.length)return s;const oldReps=strength[0]?.reps||'8–12',sets=Number(strength[0]?.sets)||3;changed=true;const fresh=picked.map(x=>({name:x.name,query:x.name,sets,reps:reps256(p.goal,oldReps),equipment:x.equipment||'',image:x.thumbUrl||x.gifUrl||'',gifUrl:x.gifUrl||'',thumbUrl:x.thumbUrl||'',muscle:x.muscle||'',source:'ExerciseGymGifsDB'}));return {...s,duration:minutes,exercises:[...warm,...fresh]}});p.databaseSmart=true;p.databaseSize=items.length;plans[pi]=p}
  if(changed){write256('ft-plans',plans);window.FitTogetherCloud?.upload?.();window.dispatchEvent(new Event('storage'))}
}
const version256=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.55'))el.textContent=t.replaceAll('V2.0.55',FT256)})
const click256=e=>{const b=e.target.closest('button');if(b?.textContent?.includes('Plan speichern'))setTimeout(repairSmartPlans256,700)}
if(typeof document!=='undefined'){document.addEventListener('click',click256,true);const start=()=>{version256();setTimeout(repairSmartPlans256,450);new MutationObserver(()=>version256()).observe(document.body,{childList:true,subtree:true})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
