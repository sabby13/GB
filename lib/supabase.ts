/**
 * Supabase browser client (public / publishable key only).
 *
 * This client is safe to ship to the browser: it uses the PUBLISHABLE key and
 * the database is protected by Row Level Security that allows INSERT only.
 * Never import the service_role key here.
 *
 * We turn off auth session handling entirely — this project has no accounts,
 * no login, and stores nothing in the user's browser on Supabase's behalf.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  // A clear message during local dev / build if env vars are missing.
  // (In production these are set in the Vercel dashboard.)
  console.warn(
    "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or " +
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — analytics will be disabled."
  );
}

/**
 * A fetch that sets `keepalive`, so an analytics write survives the page being
 * navigated away (e.g. a download link that redirects). Payloads here are tiny,
 * well under the 64 KB keepalive limit.
 */
const keepaliveFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, keepalive: true });

export const supabase = createClient(url ?? "", publishableKey ?? "", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: { fetch: keepaliveFetch },
});

/** True only when both env vars are present, so callers can no-op cleanly. */
export const supabaseEnabled = Boolean(url && publishableKey);
