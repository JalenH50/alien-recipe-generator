import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL= 'https://whqsvvxwxqdwlaskfdtd.supabase.co' 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXN2dnh3eHFkd2xhc2tmZHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NjA0NTAsImV4cCI6MjA0OTMzNjQ1MH0.D2aEI25GBZgQVdvOq8GT54z_vEFjg9cPWcscG13xfy0'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase;
