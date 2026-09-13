// FitTogether V2.0.149: collapsible in-app help guide under Settings.
const helpItems316=[
  {
    id:'home',title:'Startseite & heutiges Training',subtitle:'Wo du siehst, was heute ansteht',
    art:`<div class="ft-help-phone-v316 ft-help-home-v316"><div class="ft-help-mini-head-v316"><b>FITTOGETHER</b><span>•••</span></div><div class="ft-help-mini-welcome-v316"><small>Willkommen zurück</small><strong>Dein Überblick</strong></div><div class="ft-help-mini-ring-v316"><i></i><span>3 / 5<small>TRAININGS</small></span></div><div class="ft-help-mini-card-v316"><em>HEUTE</em><b>Dein nächstes Workout</b><small>Plan öffnen & starten</small></div><div class="ft-help-mini-play-v316">▶ Training starten</div></div>`,
    text:'Auf der Startseite findest du deinen Wochenfortschritt, das nächste geplante Workout und den direkten Start ins Training. Wenn für heute ein Training in deinem Wochenplan liegt, wird dieses bevorzugt angeboten.'
  },
  {
    id:'workouts',title:'Training starten',subtitle:'Plan, freies Training oder Schnellstart',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-mini-title-v316">DEINE WORKOUTS</div><div class="ft-help-mini-hero-v316"><span>▶</span><div><small>SCHNELLSTART</small><b>Freies Krafttraining</b></div></div><div class="ft-help-mini-row-v316"><span>▦</span><div><b>Trainingspläne</b><small>Wochenplan auswählen</small></div></div><div class="ft-help-mini-row-v316"><span>＋</span><div><b>Freies Training</b><small>Übungen selbst wählen</small></div></div></div>`,
    text:'Unter Workouts kannst du einen vorhandenen Trainingsplan öffnen, ein freies Training zusammenstellen oder direkt einen Schnellstart beginnen. Der gelbe Play-Button unten nutzt – wenn möglich – das für heute geplante Training.'
  },
  {
    id:'plans',title:'Trainingspläne erstellen & bearbeiten',subtitle:'Tage, Übungen, Sätze und Cardio festlegen',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-mini-title-v316">WOCHENPLAN</div><div class="ft-help-day-v316"><b>Montag</b><span>⌄</span></div><div class="ft-help-plan-line-v316"><span>Kurzhantel-Bankdrücken</span><small>3 × 10 · 8 kg</small></div><div class="ft-help-plan-line-v316"><span>Fahrradergometer</span><small>30 Min.</small></div><div class="ft-help-add-v316">＋ Übung</div><div class="ft-help-day-v316 muted"><b>Dienstag</b><span>›</span></div></div>`,
    text:'Im Planeditor sind die Wochentage kompakt eingeklappt. Öffne einen Tag, füge Übungen hinzu und lege Kraft-Sätze, Wiederholungen, Gewicht und RIR oder bei Cardio die Dauer fest. Änderungen werden im Plan gespeichert.'
  },
  {
    id:'exercises',title:'Übungen suchen & filtern',subtitle:'Kraft, Cardio, Yoga und Dehnen finden',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-search-v316">⌕ Übung suchen …</div><div class="ft-help-chips-v316"><span class="on">Alle</span><span>Kraft</span><span>Cardio</span></div><div class="ft-help-ex-v316"><i></i><div><b>Schulterdrücken</b><small>Kurzhantel · Schultern</small></div></div><div class="ft-help-ex-v316"><i></i><div><b>Fahrradergometer</b><small>Cardio · Zeit</small></div></div></div>`,
    text:'Die Übungsbibliothek lässt sich durchsuchen und nach Trainingsart filtern. Häufig genutzte oder favorisierte Übungen findest du schneller wieder. Bei Cardio werden Zeitwerte verwendet, bei Krafttraining Sätze, Wiederholungen und Gewicht.'
  },
  {
    id:'training',title:'Während des Trainings',subtitle:'Sätze, RIR, Timer und Cardio-Zeit',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-mini-title-v316">TRAINING LÄUFT</div><div class="ft-help-current-v316"><small>ÜBUNG 2 / 6</small><b>Kurzhantel-Bankdrücken</b></div><div class="ft-help-set-v316"><span>Satz 1</span><b>10 × 8 kg</b><i>✓</i></div><div class="ft-help-rir-v316"><small>RIR</small><span>1</span><span class="on">2</span><span>3</span><span>4+</span></div><div class="ft-help-timer-v316">◷ Pause 01:24</div></div>`,
    text:'Nach jedem Kraftsatz trägst du dein Ergebnis ein und bewertest den Satz über RIR. Daraus kann FitTogether spätere Empfehlungen ableiten. Der Pausentimer läuft unabhängig weiter. Bei Cardio ersetzt ein Zeit-Timer die Kraftwerte und speichert die tatsächliche Dauer.'
  },
  {
    id:'coach',title:'Smart Coach',subtitle:'Empfehlungen für die nächste Einheit',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-coach-v316"><span>✦</span><div><small>SMART COACH</small><b>Nächste Einheit</b><p>Bankdrücken: +1 Wiederholung<br>Seitheben: Gewicht halten</p></div></div><div class="ft-help-note-v316">Grundlage: Training, RIR und Wochenfeedback</div></div>`,
    text:'Der Smart Coach nutzt deine gespeicherten Trainingsergebnisse und RIR-Angaben, um konkrete Vorschläge für die nächste Einheit zu machen. Das Wochenfeedback hilft zusätzlich einzuschätzen, welche Muskelgruppen zu wenig, passend oder zu stark belastet wurden.'
  },
  {
    id:'stats',title:'Statistik & Fortschritt',subtitle:'Training, Gewicht und Übungen auswerten',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-mini-title-v316">FORTSCHRITT</div><div class="ft-help-chart-v316"><i style="height:35%"></i><i style="height:52%"></i><i style="height:45%"></i><i style="height:72%"></i><i style="height:86%"></i></div><div class="ft-help-statgrid-v316"><span><b>12</b><small>TRAININGS</small></span><span><b>+8%</b><small>LEISTUNG</small></span></div><div class="ft-help-weightline-v316">Gewichtstrend <b>↘</b></div></div>`,
    text:'In der Statistik siehst du deine Trainingsaktivität, Gewichtsentwicklung und den Fortschritt einzelner Kraftübungen. Die Bereiche sind bewusst eingeklappt, damit die Seite kompakt bleibt und du nur die Auswertung öffnest, die du gerade brauchst.'
  },
  {
    id:'profile',title:'Profil, Gewicht & Equipment',subtitle:'Persönliche Daten und vorhandene Geräte',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-profile-v316"><span>●</span><div><b>Dein Profil</b><small>Ziel & Körperdaten</small></div></div><div class="ft-help-mini-row-v316"><span>⚖</span><div><b>Gewicht</b><small>Verlauf & Zielgewicht</small></div></div><div class="ft-help-mini-row-v316"><span>◆</span><div><b>Equipment</b><small>Gewichte & Geräte festlegen</small></div></div></div>`,
    text:'Im Profil verwaltest du Ziel und Körperdaten. Unter Equipment legst du fest, welche Gewichte und Geräte dir zur Verfügung stehen. Diese Angaben können bei Smart-Plänen und Übungsvorschlägen berücksichtigt werden.'
  },
  {
    id:'reminder',title:'Trainingserinnerungen',subtitle:'Push-Mitteilung nur an Trainingstagen',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-bell-v316">●<span>🔔</span></div><div class="ft-help-reminder-v316"><small>TRAININGSERINNERUNG</small><b>An Trainingstagen erinnern</b><p>18:00 Uhr</p><i></i></div><div class="ft-help-note-v316">Push funktioniert auch bei geschlossener App</div></div>`,
    text:'Unter Einstellungen kannst du eine Uhrzeit für Trainingserinnerungen wählen. Eine Push-Mitteilung wird nur gesendet, wenn an diesem Wochentag tatsächlich ein Training in deinem Plan steht. Auf jedem Gerät muss Push einmal erlaubt und aktiviert werden.'
  },
  {
    id:'sync',title:'Konto & Cloud-Sync',subtitle:'Trainingsdaten auf deinen Geräten behalten',
    art:`<div class="ft-help-phone-v316"><div class="ft-help-cloud-v316">☁</div><div class="ft-help-sync-v316"><b>Synchronisiert</b><small>Profil · Pläne · Training</small></div><div class="ft-help-mini-row-v316"><span>↻</span><div><b>Cloud-Sync</b><small>Daten werden mit deinem Konto abgeglichen</small></div></div></div>`,
    text:'Wenn du angemeldet bist, synchronisiert FitTogether deine gespeicherten App-Daten über dein Konto. So bleiben Pläne und Trainingsdaten auch bei einem Gerätewechsel erhalten. Während einer laufenden Einheit arbeitet die App weiterhin lokal und synchronisiert anschließend.'
  }
]

const mountHelp316=()=>{
  const h1=[...document.querySelectorAll('.page-head h1,h1')].find(x=>x.textContent?.trim()==='Einstellungen')
  if(!h1)return
  const page=h1.closest('.page')||h1.parentElement?.parentElement
  if(!page||page.querySelector('.ft-help-v316'))return
  const list=page.querySelector('.settings-list')
  if(!list)return
  const wrap=document.createElement('section')
  wrap.className='ft-help-v316'
  wrap.innerHTML=`
    <button type="button" class="ft-help-main-v316" aria-expanded="false">
      <span class="ft-help-main-icon-v316">?</span>
      <span><small>HILFE & ANLEITUNG</small><strong>So funktioniert FitTogether</strong><em>Alle wichtigen Bereiche mit Bildern erklärt</em></span>
      <b class="ft-help-chevron-v316">›</b>
    </button>
    <div class="ft-help-body-v316" hidden>
      <p class="ft-help-intro-v316">Tippe auf einen Bereich, um die Erklärung und eine kleine Ansicht dazu zu öffnen.</p>
      <div class="ft-help-list-v316">
        ${helpItems316.map((item,i)=>`<article class="ft-help-item-v316" data-help="${item.id}">
          <button type="button" class="ft-help-item-head-v316" aria-expanded="false">
            <span class="ft-help-num-v316">${String(i+1).padStart(2,'0')}</span>
            <span><strong>${item.title}</strong><small>${item.subtitle}</small></span>
            <b>›</b>
          </button>
          <div class="ft-help-detail-v316" hidden>
            <div class="ft-help-art-v316">${item.art}</div>
            <p>${item.text}</p>
          </div>
        </article>`).join('')}
      </div>
      <div class="ft-help-foot-v316">Die Anleitung verändert keine Trainings- oder Profildaten.</div>
    </div>`
  const anchor=page.querySelector('.training-reminder-v315')||list
  anchor.insertAdjacentElement('afterend',wrap)
  const main=wrap.querySelector('.ft-help-main-v316')
  const body=wrap.querySelector('.ft-help-body-v316')
  main.onclick=()=>{
    const open=main.getAttribute('aria-expanded')==='true'
    main.setAttribute('aria-expanded',String(!open))
    wrap.classList.toggle('open',!open)
    body.hidden=open
  }
  wrap.querySelectorAll('.ft-help-item-head-v316').forEach(btn=>{
    btn.onclick=()=>{
      const item=btn.closest('.ft-help-item-v316')
      const detail=item.querySelector('.ft-help-detail-v316')
      const open=btn.getAttribute('aria-expanded')==='true'
      wrap.querySelectorAll('.ft-help-item-v316.open').forEach(other=>{
        if(other===item)return
        other.classList.remove('open')
        const ob=other.querySelector('.ft-help-item-head-v316'),od=other.querySelector('.ft-help-detail-v316')
        ob?.setAttribute('aria-expanded','false');if(od)od.hidden=true
      })
      btn.setAttribute('aria-expanded',String(!open))
      item.classList.toggle('open',!open)
      detail.hidden=open
      if(!open)setTimeout(()=>item.scrollIntoView?.({behavior:'smooth',block:'nearest'}),60)
    }
  })
}

if(typeof document!=='undefined'){
  const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length))requestAnimationFrame(mountHelp316)})
  const start=()=>{mountHelp316();obs.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')mountHelp316()})
}
