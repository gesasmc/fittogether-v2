import { BarChart3, Bell, Check, Dumbbell, List, MoreHorizontal, Play } from 'lucide-react'

const days = [
  { label: 'MO', done: true },
  { label: 'DI', done: false },
  { label: 'MI', done: true },
  { label: 'DO', done: false },
  { label: 'FR', done: true },
  { label: 'SA', done: false },
  { label: 'SO', done: false },
]

function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span>Fit</span><strong>Together</strong><b>V2</b></div>
        <button className="plain-icon" aria-label="Benachrichtigungen"><Bell size={21}/><i>2</i></button>
      </header>

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

      <section className="today">
        <div>
          <small>HEUTIGES TRAINING</small>
          <h2>Push – Brust & Schultern</h2>
          <p>ca. 60 Min. · 6 Übungen</p>
        </div>
        <div className="workout-thumb"><Dumbbell size={27}/></div>
      </section>

      <nav className="bottom-nav" aria-label="Hauptnavigation">
        <button><BarChart3 size={21}/></button>
        <button><List size={22}/></button>
        <button className="play" aria-label="Training starten"><Play size={23} fill="currentColor"/></button>
        <button><Bell size={21}/></button>
        <button><MoreHorizontal size={23}/></button>
      </nav>
    </main>
  )
}

export default App
