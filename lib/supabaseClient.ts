import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://folwpkqozytitqgnezze.supabase.co'
const supabaseKey = 'sb_publishable_6jYb4smdlMXIx8rNv3lIdA_QOzHA7vg'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)