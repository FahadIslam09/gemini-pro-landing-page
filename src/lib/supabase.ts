import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ljedvghtylsyscwimbse.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqZWR2Z2h0eWxzeXNjd2ltYnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjAwMjAsImV4cCI6MjEwMjE5NjAyMH0.4L5CIDOtFkrZl2_87VurXdCQLLfYfpaPGuZvRbjJ_8w";

// Main Supabase client for all database operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default supabase;
