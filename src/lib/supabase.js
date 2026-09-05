import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnvStatus = {
  hasUrl: Boolean(supabaseUrl),
  hasKey: Boolean(supabasePublishableKey),
}

export const supabaseConfigured = supabaseEnvStatus.hasUrl && supabaseEnvStatus.hasKey
export const supabase = supabaseConfigured ? createClient(supabaseUrl, supabasePublishableKey) : null
