import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eohbjtxdhoigjpaysdax.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaGJqdHhkaG9pZ2pwYXlzZGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjM3NjIsImV4cCI6MjA2NjgzOTc2Mn0.xNRpUkaWj5zJEw3aYs3viQuvPSNB5IlwR_yDGQPjyyc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
