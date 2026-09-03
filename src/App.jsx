import { useState } from 'react'
import { ArrowLeft, BarChart3, Bell, Check, ChevronRight, Dumbbell, History, List, MoreHorizontal, Play, Plus, Search, Settings2, Timer, X } from 'lucide-react'

const days = [
  { label: 'MO', done: true },
  { label: 'DI', done: false },
  { label: 'MI', done: true },
  { label: 'DO', done: false },
  { label: 'FR', done: true },
  { label: 'SA', done: false },
  { label: 'SO', done: false },
]

const demoExercises = ['Kurzhantel Bankdrücken', 'Schulterdrücken', 'Seitheben', 'Trizepsdrücken']

function BackHeader({ title, onBack }) {
  return <div className="sub-head"><button onClick={onBack} aria-label="Zurück"><ArrowLeft size={20}/></button><strong>{title}</strong></div>
}

function Home({ onStart, onOpenWorkouts }) {
  return <>
    <section className="welcome"><p>Guten Morgen,</p><h1>Marco!</h1></section>
    <section className="activity">
      <div className="activity-ring"><div className="ring-inner"><strong><span>3</span><em>/ 5</em></strong><small>TRAININGS</small></div><span className="ring-check"><Check size={15} strokeWidth={3}/></span></div>
      <div className="status">WOCHENZIEL · 60%</div><p className="week-label">TRAININGS DIESE WOCHE</p>
      <div className="days">{days.map(day => <div className={day.done ? 'day done' : 'day'} key={day.label}><span>{day.label}</span><i>{day.done ? <Check size={11} strokeWidth={3}/> : ''}</i></div>)}</div>
    </section>
    <section className="stats"><div><strong>2:45</strong><span>TRAININGSZEIT</span></div><div className="selected"><strong>42</strong><span>SÄTZE</span></div><div><strong>6.8 t</strong><span>VOLUMEN</span></div></section>
    <button className="today" onClick={onOpenWorkouts}><div><small>HEUTIGES TRAINING</small><h2>Push – Brust & Schultern</h2><p>ca. 60 Min. · 6 Übungen</p></div><div className="workout-thumb"><Dumbbell size={27}/></div></button>
    <button className="start-strip" onClick={onStart}><span><Play size={18} fill="currentColor"/> Training starten</span><ChevronRight size={18}/></button>
  </>
}

function Workouts({ onStart, onOpen }) {
  return <section className="page"><div className="page-head"><small>TRAINING</small><h1>Deine Workouts</h1><p>Heute direkt starten oder eigene Bereiche öffnen.</p></div>
    <button className="hero-workout" onClick={onStart}><div><small>HEUTE</small><h2>Push – Brust & Schultern</h2><p>6 Übungen · ca. 60 Min.</p></div><span><Play size={20} fill="currentColor"/></span></button>
    <div className="section-title"><span>Weitere Bereiche</span></div><div className="menu-list">
      <button onClick={() => onOpen('free')}><Dumbbell size={20}/><span><strong>Freies Training</strong><small>Übungen selbst zusammenstellen</small></span><ChevronRight size={18}/></button>
      <button onClick={() => onOpen('plans')}><List size={20}/><span><strong>Trainingspläne</strong><small>Deine Wochenpläne verwalten</small></span><ChevronRight size={18}/></button>
      <button onClick={() => onOpen('exercises')}><Search size={20}/><span><strong>Übungen</strong><small>Vorbereitung für die echte Übungsquelle</small></span><ChevronRight size={18}/></button>
    </div></section>
}

function SimplePage({ title, kicker, text, onBack, children }) {
  return <section className="page detail-page"><BackHeader title={title} onBack={onBack}/><div className="page-head"><small>{kicker}</small><h1>{title}</h1><p>{text}</p></div>{children}</section>
}

function FreeTraining({ onBack, onStart }) {
  return <SimplePage title="Freies Training" kicker="FREI TRAINIEREN" text="Stell dir spontan eine Einheit zusammen." onBack={onBack}>
    <div className="exercise-picks">{demoExercises.slice(0,3).map((x,i)=><button key={x}><span><b>{i+1}</b><strong>{x}</strong></span><Plus size={18}/></button>)}</div>
    <button className="primary-action" onClick={onStart}><Play size={18} fill="currentColor"/> Freies Training starten</button>
  </SimplePage>
}

function Plans({ onBack, onStart }) {
  return <SimplePage title="Trainingspläne" kicker="DEINE PLÄNE" text="Eine erste Planansicht als funktionierendes Grundgerüst." onBack={onBack}>
    <button className="plan-card" onClick={onStart}><small>AKTUELLER PLAN</small><strong>Push · Pull · Legs</strong><span>5 Trainingstage pro Woche</span><ChevronRight size={20}/></button>
    <button className="secondary-action"><Plus size={18}/> Neuen Plan anlegen</button>
  </SimplePage>
}

function Exercises({ onBack }) {
  const [query,setQuery] = useState('')
  const shown = demoExercises.filter(x => x.toLowerCase().includes(query.toLowerCase()))
  return <SimplePage title="Übungen" kicker="BIBLIOTHEK" text="Noch mit Demo-Daten. Die echte Quelle kommt danach." onBack={onBack}>
    <label className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Übung suchen"/></label>
    <div className="exercise-list">{shown.map((x,i)=><button key={x}><div className="exercise-icon"><Dumbbell size={18}/></div><span><strong>{x}</strong><small>{i%2===0?'Brust · Trizeps':'Schulter · Arme'}</small></span><ChevronRight size={18}/></button>)}</div>
  </SimplePage>
}

function SettingsPage({ onBack }) {
  const [sound,setSound]=useState(true); const [vibration,setVibration]=useState(true)
  return <SimplePage title="Einstellungen" kicker="APP" text="Die wichtigsten App-Optionen lassen sich schon bedienen." onBack={onBack}>
    <div className="settings-list"><button onClick={()=>setSound(!sound)}><span><strong>Töne</strong><small>Timer und Hinweise</small></span><i className={sound?'toggle on':'toggle'}/></button><button onClick={()=>setVibration(!vibration)}><span><strong>Vibration</strong><small>Haptisches Feedback</small></span><i className={vibration?'toggle on':'toggle'}/></button></div>
  </SimplePage>
}

function TimerPage({ onBack }) {
  const [seconds,setSeconds]=useState(90)
  return <SimplePage title="Timer" kicker="STANDARD" text="Wähle eine Standard-Pausenzeit." onBack={onBack}>
    <div className="timer-value"><strong>{seconds}</strong><span>SEKUNDEN</span></div><div className="timer-options">{[60,90,120,180].map(v=><button className={seconds===v?'active':''} onClick={()=>setSeconds(v)} key={v}>{v}s</button>)}</div>
  </SimplePage>
}

function StatsPage() { return <section className="page"><div className="page-head"><small>FORTSCHRITT</small><h1>Diese Woche</h1><p>Nur Werte, die FitTogether selbst erfassen kann.</p></div><div className="big-metric"><strong>3</strong><span>von 5 Trainings</span><i>60%</i></div><div className="metric-grid"><div><strong>2:45 h</strong><span>Trainingszeit</span></div><div><strong>42</strong><span>Sätze</span></div><div><strong>6.8 t</strong><span>Volumen</span></div><div><strong>3</strong><span>Trainingstage</span></div></div><div className="section-title"><span>Verlauf</span></div><div className="empty-card"><History size={24}/><strong>Trainingsverlauf</strong><p>Hier erscheinen später deine abgeschlossenen Einheiten.</p></div></section> }
function AlertsPage() { return <section className="page"><div className="page-head"><small>HINWEISE</small><h1>Alles im Blick</h1><p>Erinnerungen und App-Hinweise an einem Ort.</p></div><div className="notice-card"><span className="notice-dot"/><div><strong>Trainingsziel</strong><p>Noch 2 Trainings bis zu deinem Wochenziel.</p></div></div><div className="notice-card"><span className="notice-dot muted"/><div><strong>HealthKit</strong><p>Wird später als optionale Erweiterung eingebaut.</p></div></div></section> }
function MorePage({ onOpen }) { return <section className="page"><div className="page-head"><small>MEHR</small><h1>FitTogether</h1><p>Dein Profil und die wichtigsten Einstellungen.</p></div><div className="profile-card"><div className="avatar">M</div><div><strong>Marco</strong><span>FitTogether Profil</span></div></div><div className="menu-list"><button onClick={()=>onOpen('settings')}><Settings2 size={20}/><span><strong>Einstellungen</strong><small>App, Training und Darstellung</small></span><ChevronRight size={18}/></button><button onClick={()=>onOpen('timer')}><Timer size={20}/><span><strong>Timer</strong><small>Standardwerte vorbereiten</small></span><ChevronRight size={18}/></button></div><div className="version">FitTogether V2.0.3</div></section> }

function StartTraining({ onClose, onBegin }) { return <div className="training-overlay"><button className="close-training" onClick={onClose} aria-label="Schließen"><X size={22}/></button><div className="training-mark"><Dumbbell size={34}/></div><small>HEUTIGES TRAINING</small><h1>Push – Brust<br/> & Schultern</h1><p>6 Übungen · ca. 60 Minuten</p><button className="begin-button" onClick={onBegin}><Play size={20} fill="currentColor"/> Training beginnen</button><span className="training-note">V2.0.3: Der Start führt jetzt in eine echte Trainingsansicht.</span></div> }

function ActiveTraining({ onExit }) {
  const [set,setSet]=useState(1)
  return <div className="active-training"><BackHeader title="Training läuft" onBack={onExit}/><div className="training-progress"><span>ÜBUNG 1 VON 6</span><i><b style={{width:'17%'}}/></i></div><div className="exercise-stage"><div className="exercise-visual"><Dumbbell size={42}/></div><small>BRUST</small><h1>Kurzhantel Bankdrücken</h1><p>3 Sätze · 8–12 Wiederholungen</p></div><div className="set-card"><span>AKTUELLER SATZ</span><strong>{set} / 3</strong><div><button>10 kg</button><button>10 Wdh.</button></div></div><button className="primary-action" onClick={()=>setSet(s=>s<3?s+1:1)}><Check size={19}/> Satz {set} abschließen</button></div>
}

function App() {
  const [page,setPage]=useState('home'); const [trainingOpen,setTrainingOpen]=useState(false); const [activeTraining,setActiveTraining]=useState(false)
  const go=next=>{setPage(next);window.scrollTo(0,0)}
  const backToWorkouts=()=>go('workouts')
  if(activeTraining) return <main className="app-shell"><ActiveTraining onExit={()=>setActiveTraining(false)}/></main>
  return <main className="app-shell"><header className="topbar"><button className="brand" onClick={()=>go('home')} aria-label="Home"><span>Fit</span><strong>Together</strong><b>V2.0.3</b></button><button className="plain-icon" aria-label="Benachrichtigungen" onClick={()=>go('alerts')}><Bell size={21}/><i>2</i></button></header>
    {page==='home'&&<Home onStart={()=>setTrainingOpen(true)} onOpenWorkouts={()=>go('workouts')}/>} {page==='workouts'&&<Workouts onStart={()=>setTrainingOpen(true)} onOpen={go}/>} {page==='free'&&<FreeTraining onBack={backToWorkouts} onStart={()=>setTrainingOpen(true)}/>} {page==='plans'&&<Plans onBack={backToWorkouts} onStart={()=>setTrainingOpen(true)}/>} {page==='exercises'&&<Exercises onBack={backToWorkouts}/>} {page==='stats'&&<StatsPage/>} {page==='alerts'&&<AlertsPage/>} {page==='more'&&<MorePage onOpen={go}/>} {page==='settings'&&<SettingsPage onBack={()=>go('more')}/>} {page==='timer'&&<TimerPage onBack={()=>go('more')}/>} 
    <nav className="bottom-nav" aria-label="Hauptnavigation"><button className={page==='stats'?'active':''} onClick={()=>go('stats')} aria-label="Fortschritt"><BarChart3 size={21}/></button><button className={['workouts','free','plans','exercises'].includes(page)?'active':''} onClick={()=>go('workouts')} aria-label="Training"><List size={22}/></button><button className="play" aria-label="Training starten" onClick={()=>setTrainingOpen(true)}><Play size={23} fill="currentColor"/></button><button className={page==='alerts'?'active':''} onClick={()=>go('alerts')} aria-label="Hinweise"><Bell size={21}/></button><button className={['more','settings','timer'].includes(page)?'active':''} onClick={()=>go('more')} aria-label="Mehr"><MoreHorizontal size={23}/></button></nav>
    {trainingOpen&&<StartTraining onClose={()=>setTrainingOpen(false)} onBegin={()=>{setTrainingOpen(false);setActiveTraining(true)}}/>}
  </main>
}
export default App
