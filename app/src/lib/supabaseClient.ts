import { createClient } from '@supabase/supabase-js'

// Hardcoded credentials (safe for public use - anon key is meant to be public)
const supabaseUrl = 'https://fchirxfiizvhygpxwfww.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjaGlyeGZpaXp2aHlncHh3Znd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NDU0MDAsImV4cCI6MjA4NzEyMTQwMH0.y37A_mYmUWtge36R1wXA2d85fhlpNjv8rDqH96vuxNM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
