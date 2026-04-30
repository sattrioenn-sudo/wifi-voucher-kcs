// Ganti dengan detail dari Project Settings > API di dashboard Supabase kamu
const SUPABASE_URL = 'https://ihqyxkbnfapxumvmrkwx.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocXl4a2JuZmFweHVtdm1ya3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzYzMTAsImV4cCI6MjA4NzY1MjMxMH0.fNAimf5ebCRxcBuN6LZIctEUIohwdrfummhy1tCKANk';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
