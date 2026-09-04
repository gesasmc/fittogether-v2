import { supabase } from './lib/supabase.js'

export const FITTOGETHER_VERSION = 'V2.0.27'

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

const snapshot = () => ({
  profile: read(fields.profile, {}), equipment: read(fields.equipment, []),
  dumbbell_weights: read(fields.dumbbell_weights, []), barbell_weights: read(fields.barbell_weights, []),
  plans: read(fields.plans, []), weight_history: read(fields.weight_history, []),
  completed_workouts: read(fields.completed_workouts, []), exercise_settings: read(fields.exercise_settings, {}),
  exercise_history: read(fields.exercise_history, [])
})

async function getSession() { return (await supabase.auth.getSession()).data.session }
async function upload() {
  const session = await getSession()
  if (!session?.user) return { error: new Error('Nicht angemeldet') }
  return supabase.from('user_sync').upsert({ user_id: session.user.id, ...snapshot(), updated_at: new Date().toISOString() })
}
async function download() {
  const session = await getSession()
  if (!session?.user) return { error: new Error('Nicht angemeldet') }
  const result = await supabase.from('user_sync').select('*').eq('user_id', session.user.id).maybeSingle()
  if (result.error) return result
  if (!result.data) return upload()
  Object.entries(fields).forEach(([field, key]) => {
    if (result.data[field] !== undefined && result.data[field] !== null) localStorage.setItem(key, JSON.stringify(result.data[field]))
  })
  return result
}

window.FitTogetherCloud = {
  getSession,
  login: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  register: (email, password) => supabase.auth.signUp({ email, password }),
  logout: () => supabase.auth.signOut(),
  upload,
  download
}
