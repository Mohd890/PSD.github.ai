import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://mftwuovfzlooimevxrmz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdHd1b3Zmemxvb2ltZXZ4cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwODA1NDQsImV4cCI6MjA1NTY1NjU0NH0.bBeE3_OtfZDkzyCGKfrl77oN9xY7FJjXJ4nEiyptdOg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
