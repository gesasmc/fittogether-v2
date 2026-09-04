import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from './lib/supabase.js'

const LOGO='/fittogether-icon-192.png?v=230'

export default function AuthGate({ children }) {
  const [state, setState] = useState('loading')
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setState('unconfigured')
      return
    }

    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setState(data.session ? 'signedin' : 'signedout')
      if (data.session) window.FitTogetherCloud?.download?.().catch(() => {})
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setState(session ? 'signedin' : 'signedout')
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    if (!email.trim() || password.length < 6) {
      setMessage('Bitte E-Mail und mindestens 6 Zeichen beim Passwort eingeben.')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
        const sync = await window.FitTogetherCloud?.download?.()
        if (sync?.error) setMessage('Angemeldet. Cloud-Sync wird beim nächsten Versuch erneut geprüft.')
      } else {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password })
        if (error) throw error
        if (data.session) {
          await window.FitTogetherCloud?.upload?.()
          setState('signedin')
        } else {
          setMessage('Konto erstellt. Bitte bestätige die E-Mail und melde dich danach an.')
          setMode('login')
        }
      }
    } catch (error) {
      setMessage(error?.message || 'Anmeldung nicht möglich. Bitte erneut versuchen.')
    } finally {
      setBusy(false)
    }
  }

  if (state === 'signedin' || state === 'local') return children

  if (state === 'loading') {
    return <main className="ft-auth ft-auth-loading"><img src={LOGO} alt="FitTogether" /><span>FitTogether wird geladen …</span></main>
  }

  const configured = state !== 'unconfigured'

  return (
    <main className="ft-auth">
      <section className="ft-auth-card">
        <img className="ft-auth-logo" src={LOGO} alt="FitTogether" />
        <div className="ft-auth-copy">
          <small>FITTOGETHER V2</small>
          <h1>{configured ? (mode === 'login' ? 'Willkommen zurück' : 'Konto erstellen') : 'Cloud noch nicht verbunden'}</h1>
          <p>{configured ? 'Melde dich an, damit deine Trainingsdaten auf deinen Geräten erhalten bleiben.' : 'Die App funktioniert bereits lokal. Für Login und Synchronisierung fehlen nur noch die Vercel-Verbindungsdaten.'}</p>
        </div>

        {configured ? (
          <>
            <div className="ft-auth-tabs" role="tablist">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage('') }}>Anmelden</button>
              <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setMessage('') }}>Registrieren</button>
            </div>
            <form className="ft-auth-form" onSubmit={submit}>
              <label>E-Mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="name@beispiel.de" /></label>
              <label>Passwort<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Mindestens 6 Zeichen" /></label>
              {message && <p className="ft-auth-message">{message}</p>}
              <button className="ft-auth-primary" type="submit" disabled={busy}>{busy ? 'Bitte warten …' : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}</button>
            </form>
          </>
        ) : (
          <div className="ft-auth-notice"><span>Cloud-Sync</span><strong>Noch nicht konfiguriert</strong></div>
        )}

        <button className="ft-auth-local" type="button" onClick={() => setState('local')}>Nur lokal testen</button>
      </section>
    </main>
  )
}
