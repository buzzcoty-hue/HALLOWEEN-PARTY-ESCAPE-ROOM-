import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Optional runtime override stored in localStorage if entered in preview
const localUrl = typeof window !== 'undefined' ? localStorage.getItem('aura_supabase_url') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('aura_supabase_anon_key') : null;

const effectiveUrl = localUrl || envUrl || '';
const effectiveKey = localKey || envAnonKey || '';

export const isConfigured = Boolean(
  effectiveUrl &&
  effectiveUrl.startsWith('http') &&
  !effectiveUrl.includes('PASTE_YOUR_SUPABASE_URL_HERE') &&
  effectiveKey &&
  !effectiveKey.includes('PASTE_YOUR_PUBLISHABLE_KEY_HERE')
);

// Fallback URL to prevent createClient from throwing an uncaught "Invalid URL" TypeError
const safeUrl = isConfigured ? effectiveUrl : 'https://placeholder-project.supabase.co';
const safeKey = isConfigured ? effectiveKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export function saveRuntimeCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aura_supabase_url', url.trim());
    localStorage.setItem('aura_supabase_anon_key', key.trim());
    window.location.reload();
  }
}

export function clearRuntimeCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('aura_supabase_url');
    localStorage.removeItem('aura_supabase_anon_key');
    window.location.reload();
  }
}
