import { supabase, supabaseConfigured } from './lib/supabase.js'

export const FITTOGETHER_VERSION = 'V2.0.31'

const fields = {
  profile: 'ft-profile', equipment: 'ft-equipment',
  dumbbell_weights: 'ft-dumbbell-weights', barbell_weights: 'ft-barbell-weights',
  plans: 'ft-plans', weight_history: 'ft-weight-history',
  completed_workouts: 'ft-completed-workouts', exercise_settings: 'ft-exercise-settings',
  exercise_history: 'ft-exercise-history'
}

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)) }
  catch { return fallback }
}
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

const snapshot = () => ({
  profile: read(fields.profile, {}), equipment: read(fields.equipment, []),
  dumbbell_weights: read(fields.dumbbell_weights, []), barbell_weights: read(fields.barbell_weights, []),
  plans: read(fields.plans, []), weight_history: read(fields.weight_history, []),
  completed_workouts: read(fields.completed_workouts, []), exercise_settings: read(fields.exercise_settings, {}),
  exercise_history: read(fields.exercise_history, [])
})

const isEmpty = value => value == null ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)

const mergeArray = (remote = [], local = []) => {
  const seen = new Set()
  return [...remote, ...local].filter(item => {
    let key
    try { key = JSON.stringify(item) } catch { key = String(item) }
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const mergeValue = (remote, local) => {
  if (isEmpty(local)) return remote
  if (isEmpty(remote)) return local
  if (Array.isArray(remote) && Array.isArray(local)) return mergeArray(remote, local)
  if (remote && local && typeof remote === 'object' && typeof local === 'object') return { ...remote, ...local }
  return local ?? remote
}

const notConfigured = () => ({ error: new Error('Cloud-Sync ist noch nicht konfiguriert') })

async function getSession() {
  if (!supabaseConfigured || !supabase) return null
  return (await supabase.auth.getSession()).data.session
}

async function upsertSnapshot(user) {
  return supabase.from('user_sync').upsert({ user_id: user.id, ...snapshot(), updated_at: new Date().toISOString() })
}

async function upload() {
  if (!supabaseConfigured || !supabase) return notConfigured()
  const session = await getSession()
  if (!session?.user) return { error: new Error('Nicht angemeldet') }
  return upsertSnapshot(session.user)
}

async function download() {
  if (!supabaseConfigured || !supabase) return notConfigured()
  const session = await getSession()
  if (!session?.user) return { error: new Error('Nicht angemeldet') }
  const result = await supabase.from('user_sync').select('*').eq('user_id', session.user.id).maybeSingle()
  if (result.error) return result
  if (!result.data) return upload()

  Object.entries(fields).forEach(([field, key]) => {
    const remote = result.data[field]
    if (remote === undefined || remote === null) return
    const fallback = Array.isArray(remote) ? [] : {}
    const local = read(key, fallback)
    write(key, mergeValue(remote, local))
  })

  const synced = await upsertSnapshot(session.user)
  return synced.error ? synced : { ...result, merged: true }
}

let syncTimer = null
let syncInFlight = false
const safeUpload = async () => {
  if (syncInFlight) return
  syncInFlight = true
  try { await upload() } finally { syncInFlight = false }
}

function startAutoSync() {
  if (!supabaseConfigured || !supabase || syncTimer) return
  syncTimer = window.setInterval(safeUpload, 30000)
  document.addEventListener('visibilitychange', onVisibility)
}
function stopAutoSync() {
  if (syncTimer) window.clearInterval(syncTimer)
  syncTimer = null
  document.removeEventListener('visibilitychange', onVisibility)
}
function onVisibility() {
  if (document.visibilityState === 'hidden') safeUpload()
}

async function logout() {
  if (!supabaseConfigured || !supabase) return notConfigured()
  await safeUpload()
  stopAutoSync()
  return supabase.auth.signOut()
}

if (supabaseConfigured && supabase) {
  supabase.auth.getSession().then(({ data }) => { if (data.session) startAutoSync() })
  supabase.auth.onAuthStateChange((_event, session) => session ? startAutoSync() : stopAutoSync())
}

window.FitTogetherCloud = {
  configured: supabaseConfigured,
  getSession,
  login: (email, password) => supabaseConfigured && supabase ? supabase.auth.signInWithPassword({ email, password }) : Promise.resolve(notConfigured()),
  register: (email, password) => supabaseConfigured && supabase ? supabase.auth.signUp({ email, password }) : Promise.resolve(notConfigured()),
  resetPassword: (email) => supabaseConfigured && supabase ? supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }) : Promise.resolve(notConfigured()),
  logout,
  upload,
  download,
  startAutoSync,
  stopAutoSync
}
