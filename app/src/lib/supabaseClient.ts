import { createClient } from '@supabase/supabase-js'

// Hardcoded credentials (safe for public use - anon key is meant to be public)
const supabaseUrl = 'https://fchirxfiizvhygpxwfww.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjaGlyeGZpaXp2aHlncHh3Znd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NTAwODcsImV4cCI6MjA1NzEyNjA4N30.CJtvYm3pijOq_cHpD6ChQw_dmViHltE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
