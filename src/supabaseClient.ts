import { createClient } from '@supabase/supabase-js';

// Get these from Supabase Project Settings > API
const supabaseUrl = 'https://vullpehvlfepawxuspow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1bGxwZWh2bGZlcGF3eHVzcG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDcyNDgsImV4cCI6MjA4MzQ4MzI0OH0.KvvQ5CFg4Zsjojzah7wk3naUQtOMsNggLbhcg9SRKoc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);