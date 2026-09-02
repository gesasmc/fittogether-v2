import { BarChart3, Bell, Dumbbell, List, MoreHorizontal, Play, Zap } from 'lucide-react'

const days = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO']

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
        <div className="activity-ring">
          <div className="ring-inner"><strong>345</strong><span>MOVES</span></div>
          <span className="energy"><Zap size={14} fill="currentColor"/></span>
        </div>
        <div className="status">ACTIVE LIFESTYLE</div>
        <div className="days">{days.map(day => <span className={day === 'FR' ? 'active' : ''} key={day}>{day}</span>)}</div>
      </section>

      <section className="stats">
        <div><strong>400</strong><span>KCAL</span></div>
        <div className="selected"><strong>345</strong><span>MOVES</span></div>
        <div><strong>2</strong><span>KM</span></div>
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
