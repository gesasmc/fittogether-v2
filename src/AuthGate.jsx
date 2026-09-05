import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured, supabaseEnvStatus } from './lib/supabase.js'

const LOGO='/fittogether-icon-512.png?v=233'
const VERSION='V2.0.45'

const translateAuthError = (error) => {
  const text = String(error?.message || '').toLowerCase()
  if (text.includes('invalid login credentials')) return 'E-Mail oder Passwort ist nicht korrekt.'
  if (text.includes('email not confirmed')) return 'Bitte bestätige zuerst deine E-Mail-Adresse.'
  if (text.includes('user already registered')) return 'Für diese E-Mail existiert bereits ein Konto.'
  if (text.includes('password')) return 'Das Passwort muss mindestens 6 Zeichen lang sein.'
  if (text.includes('rate limit')) return 'Zu viele Versuche. Bitte kurz warten und erneut probieren.'
  return error?.message || 'Das hat gerade nicht funktioniert. Bitte erneut versuchen.'
}

export default function AuthGate({ children }) {
  const [state, setState] = useState('loading')
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [syncState, setSyncState] = useState('')

  useEffect(() => {
    if (!syncState || /wird|daten werden/i.test(syncState)) return
    const id = window.setTimeout(() => setSyncState(''), 2200)
    return () => window.clearTimeout(id)
  }, [syncState])

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setState('unconfigured')
      return
    }

    let mounted = true
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      if (data.session) {
        setState('signedin')
        setSyncState('Daten werden synchronisiert …')
        const result = await window.FitTogetherCloud?.download?.()
        if (mounted) setSyncState(result?.error ? 'Cloud-Sync wird später erneut versucht.' : 'Synchronisiert')
      } else {
        setState('signedout')
      }
    }
    bootstrap()

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
    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setMessage('Bitte gib deine E-Mail-Adresse ein.')
      return
    }
    if (mode !== 'reset' && password.length < 6) {
      setMessage('Das Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }

    setBusy(true)
    setMessage('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
        if (error) throw error
        setSyncState('Daten werden synchronisiert …')
        const result = await window.FitTogetherCloud?.download?.()
        setSyncState(result?.error ? 'Angemeldet – Sync wird später erneut versucht.' : 'Synchronisiert')
      } else if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password })
        if (error) throw error
        if (data.session) {
          await window.FitTogetherCloud?.upload?.()
          setState('signedin')
          setSyncState('Synchronisiert')
        } else {
          setMessage('Konto erstellt. Bitte bestätige den Link in deiner E-Mail und melde dich danach an.')
          setMode('login')
          setPassword('')
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: window.location.origin })
        if (error) throw error
        setMessage('E-Mail zum Zurücksetzen wurde versendet. Bitte prüfe auch deinen Spam-Ordner.')
      }
    } catch (error) {
      setMessage(translateAuthError(error))
    } finally {
      setBusy(false)
    }
  }

  if (state === 'signedin') {
    return <>{syncState && <div className="ft-sync-toast">{syncState}</div>}{children}</>
  }
  if (state === 'local') return children

  if (state === 'loading') {
    return <main className="ft-auth ft-auth-loading"><img src={LOGO} alt="FitTogether" /><span>FitTogether wird geladen …</span></main>
  }

  const configured = state !== 'unconfigured'
  const title = !configured ? 'Cloud noch nicht verbunden' : mode === 'login' ? 'Willkommen zurück' : mode === 'register' ? 'Konto erstellen' : 'Passwort zurücksetzen'
  const subtitle = !configured
    ? 'Die App funktioniert lokal. Für Login und Synchronisierung fehlen noch Verbindungsdaten im aktuellen Build.'
    : mode === 'reset'
      ? 'Wir senden dir einen Link, mit dem du dein Passwort neu setzen kannst.'
      : 'Melde dich an, damit deine Trainingsdaten automatisch auf deinen Geräten erhalten bleiben.'

  return (
    <main className="ft-auth">
      <section className="ft-auth-card">
        <img className="ft-auth-logo" src={LOGO} alt="FitTogether" />
        <div className="ft-auth-copy">
          <small>FITTOGETHER {VERSION}</small>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {configured ? (
          <>
            {mode !== 'reset' && (
              <div className="ft-auth-tabs" role="tablist">
                <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage('') }}>Anmelden</button>
                <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setMessage('') }}>Registrieren</button>
              </div>
            )}
            <form className="ft-auth-form" onSubmit={submit}>
              <label>E-Mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="name@beispiel.de" /></label>
              {mode !== 'reset' && <label>Passwort<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Mindestens 6 Zeichen" /></label>}
              {message && <p className="ft-auth-message">{message}</p>}
              <button className="ft-auth-primary" type="submit" disabled={busy}>{busy ? 'Bitte warten …' : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Konto erstellen' : 'Reset-Link senden'}</button>
            </form>
            {mode === 'login' && <button className="ft-auth-secondary" type="button" onClick={() => { setMode('reset'); setMessage('') }}>Passwort vergessen?</button>}
            {mode === 'reset' && <button className="ft-auth-secondary" type="button" onClick={() => { setMode('login'); setMessage('') }}>Zurück zur Anmeldung</button>}
          </>
        ) : (
          <>
            <div className="ft-auth-notice"><span>Cloud-Sync</span><strong>Noch nicht konfiguriert</strong></div>
            <p className="ft-auth-message">Diagnose: URL {supabaseEnvStatus.hasUrl ? '✓' : '✗'} · Key {supabaseEnvStatus.hasKey ? '✓' : '✗'}</p>
          </>
        )}

        <button className="ft-auth-local" type="button" onClick={() => setState('local')}>Nur lokal testen</button>
      </section>
    </main>
  )
}
