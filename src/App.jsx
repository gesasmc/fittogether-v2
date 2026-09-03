import { useState } from 'react'
import { BarChart3, Bell, Check, ChevronRight, Dumbbell, History, List, MoreHorizontal, Play, Search, Settings2, Timer, X } from 'lucide-react'

const days = [
  { label: 'MO', done: true },
  { label: 'DI', done: false },
  { label: 'MI', done: true },
  { label: 'DO', done: false },
  { label: 'FR', done: true },
  { label: 'SA', done: false },
  { label: 'SO', done: false },
]

const pages = {
  home: { title: 'Home' },
  workouts: { title: 'Training' },
  stats: { title: 'Fortschritt' },
  alerts: { title: 'Hinweise' },
  more: { title: 'Mehr' },
}

function Home({ onStart, onOpenWorkouts }) {
  return (
    <>
      <section className="welcome">
        <p>Guten Morgen,</p>
        <h1>Marco!</h1>
      </section>

      <section className="activity">
        <div className="activity-ring weekly-ring">
          <div className="ring-inner">
            <strong><span>3</span><em>/ 5</em></strong>
            <small>TRAININGS</small>
          </div>
          <span className="ring-check"><Check size={15} strokeWidth={3}/></span>
        </div>
        <div className="status">WOCHENZIEL · 60%</div>
        <p className="week-label">TRAININGS DIESE WOCHE</p>
        <div className="days">
          {days.map(day => (
            <div className={day.done ? 'day done' : 'day'} key={day.label}>
              <span>{day.label}</span>
              <i>{day.done ? <Check size={11} strokeWidth={3}/> : ''}</i>
            </div>
          ))}
        </div>
      </section>

      <section className="stats">
        <div><strong>2:45</strong><span>TRAININGSZEIT</span></div>
        <div className="selected"><strong>42</strong><span>SÄTZE</span></div>
        <div><strong>6.8 t</strong><span>VOLUMEN</span></div>
      </section>

      <button className="today" onClick={onOpenWorkouts}>
        <div>
          <small>HEUTIGES TRAINING</small>
          <h2>Push – Brust & Schultern</h2>
          <p>ca. 60 Min. · 6 Übungen</p>
        </div>
        <div className="workout-thumb"><Dumbbell size={27}/></div>
      </button>

      <button className="start-strip" onClick={onStart}>
        <span><Play size={18} fill="currentColor"/> Training starten</span>
        <ChevronRight size={18}/>
      </button>
    </>
  )
}

function Workouts({ onStart }) {
  return (
    <section className="page">
      <div className="page-head">
        <small>TRAINING</small>
        <h1>Deine Workouts</h1>
        <p>Heute direkt starten oder später eigene Pläne anlegen.</p>
      </div>
      <button className="hero-workout" onClick={onStart}>
        <div><small>HEUTE</small><h2>Push – Brust & Schultern</h2><p>6 Übungen · ca. 60 Min.</p></div>
        <span><Play size={20} fill="currentColor"/></span>
      </button>
      <div className="section-title"><span>Weitere Bereiche</span></div>
      <div className="menu-list">
        <button><Dumbbell size={20}/><span><strong>Freies Training</strong><small>Übungen selbst zusammenstellen</small></span><ChevronRight size={18}/></button>
        <button><List size={20}/><span><strong>Trainingspläne</strong><small>Deine Wochenpläne verwalten</small></span><ChevronRight size={18}/></button>
        <button><Search size={20}/><span><strong>Übungen</strong><small>Übungsbibliothek kommt in V2.0.3</small></span><ChevronRight size={18}/></button>
      </div>
    </section>
  )
}

function StatsPage() {
  return (
    <section className="page">
      <div className="page-head"><small>FORTSCHRITT</small><h1>Diese Woche</h1><p>Nur Werte, die FitTogether selbst erfassen kann.</p></div>
      <div className="big-metric"><strong>3</strong><span>von 5 Trainings</span><i>60%</i></div>
      <div className="metric-grid"><div><strong>2:45 h</strong><span>Trainingszeit</span></div><div><strong>42</strong><span>Sätze</span></div><div><strong>6.8 t</strong><span>Volumen</span></div><div><strong>3</strong><span>Trainingstage</span></div></div>
      <div className="section-title"><span>Verlauf</span></div>
      <div className="empty-card"><History size={24}/><strong>Trainingsverlauf</strong><p>Hier erscheinen später deine abgeschlossenen Einheiten.</p></div>
    </section>
  )
}

function AlertsPage() {
  return (
    <section className="page">
      <div className="page-head"><small>HINWEISE</small><h1>Alles im Blick</h1><p>Erinnerungen und App-Hinweise an einem Ort.</p></div>
      <div className="notice-card"><span className="notice-dot"/><div><strong>Trainingsziel</strong><p>Noch 2 Trainings bis zu deinem Wochenziel.</p></div></div>
      <div className="notice-card"><span className="notice-dot muted"/><div><strong>HealthKit</strong><p>Wird später als optionale Erweiterung eingebaut.</p></div></div>
    </section>
  )
}

function MorePage() {
  return (
    <section className="page">
      <div className="page-head"><small>MEHR</small><h1>FitTogether</h1><p>Dein Profil und die wichtigsten Einstellungen.</p></div>
      <div className="profile-card"><div className="avatar">M</div><div><strong>Marco</strong><span>FitTogether Profil</span></div></div>
      <div className="menu-list">
        <button><Settings2 size={20}/><span><strong>Einstellungen</strong><small>App, Training und Darstellung</small></span><ChevronRight size={18}/></button>
        <button><Timer size={20}/><span><strong>Timer</strong><small>Standardwerte vorbereiten</small></span><ChevronRight size={18}/></button>
      </div>
      <div className="version">FitTogether V2.0.2</div>
    </section>
  )
}

function StartTraining({ onClose }) {
  return (
    <div className="training-overlay">
      <button className="close-training" onClick={onClose} aria-label="Schließen"><X size={22}/></button>
      <div className="training-mark"><Dumbbell size={34}/></div>
      <small>HEUTIGES TRAINING</small>
      <h1>Push – Brust<br/> & Schultern</h1>
      <p>6 Übungen · ca. 60 Minuten</p>
      <button className="begin-button"><Play size={20} fill="currentColor"/> Training beginnen</button>
      <span className="training-note">Die eigentliche Satzansicht bauen wir als nächsten Trainingsschritt.</span>
    </div>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [trainingOpen, setTrainingOpen] = useState(false)

  const go = next => setPage(next)

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="Home"><span>Fit</span><strong>Together</strong><b>V2.0.2</b></button>
        <button className="plain-icon" aria-label="Benachrichtigungen" onClick={() => go('alerts')}><Bell size={21}/><i>2</i></button>
      </header>

      {page === 'home' && <Home onStart={() => setTrainingOpen(true)} onOpenWorkouts={() => go('workouts')}/>} 
      {page === 'workouts' && <Workouts onStart={() => setTrainingOpen(true)}/>} 
      {page === 'stats' && <StatsPage/>}
      {page === 'alerts' && <AlertsPage/>}
      {page === 'more' && <MorePage/>}

      <nav className="bottom-nav" aria-label="Hauptnavigation">
        <button className={page === 'stats' ? 'active' : ''} onClick={() => go('stats')} aria-label="Fortschritt"><BarChart3 size={21}/></button>
        <button className={page === 'workouts' ? 'active' : ''} onClick={() => go('workouts')} aria-label="Training"><List size={22}/></button>
        <button className="play" aria-label="Training starten" onClick={() => setTrainingOpen(true)}><Play size={23} fill="currentColor"/></button>
        <button className={page === 'alerts' ? 'active' : ''} onClick={() => go('alerts')} aria-label="Hinweise"><Bell size={21}/></button>
        <button className={page === 'more' ? 'active' : ''} onClick={() => go('more')} aria-label="Mehr"><MoreHorizontal size={23}/></button>
      </nav>

      {trainingOpen && <StartTraining onClose={() => setTrainingOpen(false)}/>} 
    </main>
  )
}

export default App
