// FitTogether V2.0.350: Smart Trainer week + equipment uses "Meine Ausstattung" as source of truth.
export default function smartTrainer350(){
  return {
    name:'smart-trainer-v350',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx'))return null
      const start=code.indexOf('function CoachPage(')
      const end=code.indexOf('function ProfilePage(',start)
      if(start<0||end<0)throw new Error('V2.0.350 CoachPage target not found')
      const nextCoach=`function CoachPage({onBack,onSaved}){
  const week=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
  const[goal,setGoal]=useState('Muskelaufbau'),[minutes,setMinutes]=useState(60);
  const central=readStore('ft-available-equipment-v238',null)??readStore('ft-equipment-profile',null)?.equipment??{};
  const strengthDefs=[['bodyweight','Körpergewicht'],['dumbbell','Kurzhantel'],['barbell','Langhantel'],['band','Widerstandsband'],['machine','Kabel/Maschine']].filter(([k])=>central[k]===true);
  const cardioDefs=[['bike','Indoor-Bike'],['rower','Rudergerät'],['treadmill','Laufband']].filter(([k])=>central[k]===true);
  const defaults=()=>Object.fromEntries(week.map((day,i)=>[day,{type:i===0||i===2||i===4?'Kraft':'Frei',equipment:[]}]))
  const[days,setDays]=useState(()=>{const saved=readStore('ft-smart-week-v350',null)||defaults();const out={...defaults(),...saved};for(const day of week){const d=out[day]||{type:'Frei',equipment:[]};const allowed=(d.type==='Cardio'?cardioDefs:strengthDefs).map(x=>x[0]);out[day]={...d,equipment:(d.equipment||[]).filter(k=>allowed.includes(k))}}return out});
  useEffect(()=>writeStore('ft-smart-week-v350',days),[days]);
  const setType=(day,type)=>setDays(v=>({...v,[day]:{type,equipment:(type==='Cardio'?cardioDefs:strengthDefs).map(x=>x[0])}}));
  const toggleEq=(day,key)=>setDays(v=>{const cur=v[day],has=cur.equipment.includes(key);return{...v,[day]:{...cur,equipment:has?cur.equipment.filter(x=>x!==key):[...cur.equipment,key]}}});
  const strengthKey=name=>{const s=String(name||'').toLowerCase();if(/kurzhantel|dumbbell/.test(s))return'dumbbell';if(/langhantel|barbell|kreuzheben|kniebeuge/.test(s))return'barbell';if(/latziehen|trizepsdrücken|kabel|maschine|beinpresse|beinbeugen|beinstrecken/.test(s))return'machine';if(/band/.test(s))return'band';if(/liegestütz|klimmzug|körpergewicht/.test(s))return'bodyweight';return'bodyweight'};
  const active=week.filter(day=>days[day].type!=='Frei');
  const strengthDays=active.filter(day=>days[day].type==='Kraft');
  const splits=splitByDays(Math.max(2,Math.min(6,strengthDays.length||2)));
  const sessions=active.map(day=>{const cfg=days[day];if(cfg.type==='Cardio'){const exercises=cfg.equipment.map(k=>({name:k==='bike'?'Indoor-Bike':k==='rower'?'Rudergerät':'Laufband',query:k==='bike'?'stationary bike':k==='rower'?'rowing machine':'treadmill',sets:1,reps:minutes+' Min.',kind:'cardio',loadType:'cardio',equipment:k}));return{title:day+' · Cardio',day,type:'Cardio',duration:minutes,exercises}}const ix=strengthDays.indexOf(day),base=makeSession(splits[ix%splits.length]||'Ganzkörper A',goal,minutes),allowed=new Set(cfg.equipment);return{...base,title:day+' · '+base.title,day,type:'Kraft',exercises:base.exercises.filter(x=>x.warmup||allowed.has(strengthKey(x.name)))}});
  const invalid=active.some(day=>days[day].equipment.length===0);
  const save=()=>{if(!active.length||invalid)return;const plans=readStore('ft-plans',[]);writeStore('ft-plans',[...plans,{name:'Smart Plan · '+goal,days:active.length,minutes,goal,smart:true,sessions,createdAt:Date.now()}]);onSaved()};
  return <SimplePage title="Smarter Trainer" kicker="PLAN ERSTELLEN" text="Lege jeden Wochentag und die dafür erlaubte Ausstattung fest." onBack={onBack}><div className="coach-settings"><label><span>Dein Ziel</span><select value={goal} onChange={e=>setGoal(e.target.value)}><option>Muskelaufbau</option><option>Kraft</option><option>Allgemeine Fitness</option></select></label><label><span>Zeit pro Training</span><select value={minutes} onChange={e=>setMinutes(Number(e.target.value))}>{[30,45,60,75,90].map(m=><option key={m}>{m}</option>)}</select></label></div><div className="smart-week-v328"><div className="smart-week-head-v328"><small>DEINE WOCHE</small><strong>Trainingstage & Ausstattung</strong></div>{week.map(day=>{const cfg=days[day],defs=cfg.type==='Cardio'?cardioDefs:strengthDefs;return <div className={'smart-day-v328 '+cfg.type.toLowerCase()} key={day}><div className="smart-day-top-v328"><strong>{day}</strong><div>{['Kraft','Cardio','Frei'].map(t=><button type="button" key={t} className={cfg.type===t?'active':''} onClick={()=>setType(day,t)}>{t}</button>)}</div></div>{cfg.type!=='Frei'&&<div className="smart-eq-v328"><small>{cfg.type==='Cardio'?'Cardio-Geräte für diesen Tag':'Ausstattung für diesen Tag'}</small><div>{defs.map(([k,label])=><button type="button" key={k} className={cfg.equipment.includes(k)?'active':''} onClick={()=>toggleEq(day,k)}>{cfg.equipment.includes(k)?'✓ ':''}{label}</button>)}</div>{!defs.length&&<em>In „Meine Ausstattung“ ist dafür aktuell kein Gerät aktiviert.</em>}{defs.length>0&&!cfg.equipment.length&&<em>Bitte mindestens eine Ausstattung auswählen.</em>}</div>}</div>})}</div><div className="coach-suggestion"><Brain size={28}/><small>DEIN WOCHENPLAN</small><h2>{goal} · {active.length} Trainingstage · {minutes} Min.</h2><div className="coach-plan-preview">{sessions.map((s,i)=><div key={s.title}><b>TAG {i+1}</b><span>{s.title} · {s.exercises.length} Übungen</span></div>)}</div><button className="primary-action" disabled={!active.length||invalid} onClick={save}><Check size={18}/> {invalid?'Ausstattung pro Trainingstag wählen':'Plan speichern'}</button></div></SimplePage>}

`
      return {code:code.slice(0,start)+nextCoach+code.slice(end),map:null}
    }
  }
}
