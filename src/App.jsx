import { Dumbbell, House, ListChecks, Settings, Sparkles } from 'lucide-react'

const cards = [
  {
    icon: Dumbbell,
    eyebrow: 'TRAINING',
    title: 'Bereit für deine nächste Einheit?',
    text: 'Pläne, freies Training und Fortschritt bauen wir ab jetzt sauber neu auf.',
    action: 'Training starten',
  },
  {
    icon: Sparkles,
    eyebrow: 'SMART COACH',
    title: 'Dein Training soll sich an dich anpassen.',
    text: 'RIR, Belastung und Wochenfeedback werden später direkt in die Planung einfließen.',
    action: 'Kommt als Nächstes',
  },
]

function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-kicker">FITTOGETHER</p>
          <h1>V2</h1>
        </div>
        <button className="icon-button" aria-label="Einstellungen">
          <Settings size={21} />
        </button>
      </header>

      <section className="hero">
        <p className="section-label">HEUTE</p>
        <h2>Dein Training.<br />Gemeinsam besser.</h2>
        <p>
          FitTogether startet hier komplett neu – schnell, klar und ohne Altlasten.
        </p>
      </section>

      <section className="card-stack" aria-label="Übersicht">
        {cards.map(({ icon: Icon, eyebrow, title, text, action }) => (
          <article className="feature-card" key={eyebrow}>
            <div className="card-icon"><Icon size={23} /></div>
            <p className="card-eyebrow">{eyebrow}</p>
            <h3>{title}</h3>
            <p className="card-copy">{text}</p>
            <button className="primary-button">{action}</button>
          </article>
        ))}
      </section>

      <nav className="bottom-nav" aria-label="Hauptnavigation">
        <button className="nav-item active"><House size={22} /><span>Start</span></button>
        <button className="nav-item"><Dumbbell size={22} /><span>Training</span></button>
        <button className="nav-item"><ListChecks size={22} /><span>Pläne</span></button>
        <button className="nav-item"><Settings size={22} /><span>Mehr</span></button>
      </nav>
    </main>
  )
}

export default App
