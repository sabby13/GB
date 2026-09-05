/**
 * GlassButterfly · privacy-respecting website analytics.
 *
 * What this collects:
 *   - an anonymous, random session_id (stored in localStorage, reused forever)
 *   - coarse, non-identifying signals derived from the browser (browser name,
 *     OS, device type, language, timezone, referrer, UTM tags)
 *   - an APPROXIMATE country/city from Vercel's edge headers (never the IP)
 *
 * What it never collects: IP addresses, names, accounts, or any personal data
 * beyond the email a user voluntarily types into the waitlist.
 *
 * Every function is safe to call anywhere: it no-ops during SSR and never
 * throws — analytics must never break the page.
 */
import { supabase, supabaseEnabled } from "./supabase";
import { APP_VERSION, type DownloadSource } from "./version";

const SESSION_KEY = "gb_session_id";
const VISITOR_LOGGED_KEY = "gb_visitor_logged";

/* -------------------------------------------------------------------------- */
/*  Session id                                                                */
/* -------------------------------------------------------------------------- */

function randomUUID(): string {
  // crypto.randomUUID is available in every browser we target; fall back just
  // in case (older embedded webviews).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns the anonymous session id, creating (and persisting) one on the very
 * first visit. `isNew` is true only the first time this browser is ever seen.
 */
export function getSession(): { id: string; isNew: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return { id: existing, isNew: false };
    const id = randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
    return { id, isNew: true };
  } catch {
    // localStorage blocked (private mode / cookies off) — degrade to a
    // per-page-load id so nothing crashes.
    return { id: randomUUID(), isNew: true };
  }
}

/* -------------------------------------------------------------------------- */
/*  Client detection (no libraries, no fingerprinting)                        */
/* -------------------------------------------------------------------------- */

type ClientInfo = {
  browser: string;
  operating_system: string;
  device_type: "mobile" | "tablet" | "desktop";
  language: string;
  timezone: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "Unknown";
}

function detectOS(ua: string): string {
  if (/Windows NT/.test(ua)) return "Windows";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (/iPad|Tablet|(Android(?!.*Mobile))/.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android.*Mobile/.test(ua)) return "mobile";
  return "desktop";
}

function detectClient(): ClientInfo {
  const ua = navigator.userAgent || "";
  const params = new URLSearchParams(window.location.search);
  return {
    browser: detectBrowser(ua),
    operating_system: detectOS(ua),
    device_type: detectDevice(ua),
    language: navigator.language || "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    referrer: document.referrer || null,
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
  };
}

/* -------------------------------------------------------------------------- */
/*  Approximate geo — from Vercel edge headers, not the IP                    */
/* -------------------------------------------------------------------------- */

type Geo = { country: string | null; city: string | null };
let geoCache: Geo | null = null;
let geoInFlight: Promise<Geo> | null = null;

async function getGeo(): Promise<Geo> {
  if (geoCache) return geoCache;
  if (geoInFlight) return geoInFlight;
  geoInFlight = (async () => {
    try {
      const res = await fetch("/api/geo", { cache: "no-store" });
      if (!res.ok) throw new Error("geo request failed");
      const data = (await res.json()) as Geo;
      geoCache = { country: data.country ?? null, city: data.city ?? null };
    } catch {
      geoCache = { country: null, city: null };
    }
    return geoCache;
  })();
  return geoInFlight;
}

/* -------------------------------------------------------------------------- */
/*  Events                                                                    */
/* -------------------------------------------------------------------------- */

function ready(): boolean {
  return typeof window !== "undefined" && supabaseEnabled;
}

/**
 * VISITOR — insert exactly one record the first time a new session is seen.
 * Call this once on app mount (see components/VisitorTracker.tsx).
 */
export async function trackVisitor(): Promise<void> {
  if (!ready()) return;
  const session = getSession();
  if (!session) return;

  // Only log once per session, ever. Guard with a localStorage flag so a
  // returning visitor (same session_id) is never re-inserted.
  try {
    if (window.localStorage.getItem(VISITOR_LOGGED_KEY)) return;
  } catch {
    if (!session.isNew) return;
  }

  try {
    const c = detectClient();
    const geo = await getGeo();
    const { error } = await supabase.from("visitors").insert({
      session_id: session.id,
      browser: c.browser,
      operating_system: c.operating_system,
      device_type: c.device_type,
      language: c.language,
      timezone: c.timezone,
      country: geo.country,
      city: geo.city,
      referrer: c.referrer,
      utm_source: c.utm_source,
      utm_medium: c.utm_medium,
      utm_campaign: c.utm_campaign,
    });
    if (!error) {
      try {
        window.localStorage.setItem(VISITOR_LOGGED_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* analytics must never break the page */
  }
}

/**
 * DOWNLOAD — call on every click of the Download button.
 *
 * Fire-and-forget: the caller should NOT await this (`void trackDownload(...)`),
 * so the download starts instantly and is never blocked by analytics. The
 * underlying request also uses `keepalive`, so it completes even if the click
 * navigates the page away.
 *
 * @param version  defaults to the centralized APP_VERSION.
 * @param source   where the download came from (defaults to "website"); other
 *                 channels — github, installer, winget, microsoft_store — can
 *                 be passed later without any schema change.
 */
export async function trackDownload(
  version: string = APP_VERSION,
  source: DownloadSource = "website"
): Promise<void> {
  if (!ready()) return;
  const session = getSession();
  try {
    const c = detectClient();
    const geo = await getGeo();
    await supabase.from("downloads").insert({
      session_id: session?.id ?? null,
      version,
      platform: c.operating_system,
      browser: c.browser,
      country: geo.country,
      source,
    });
  } catch {
    /* analytics must never interfere with the download */
  }
}

/**
 * WAITLIST — call after a successful email signup.
 *
 * Upsert semantics, INSERT-only: a brand-new email is stored; an email that
 * already exists resolves to the SAME success, and the caller/user never sees a
 * database duplicate error.
 *
 * Note on security: we deliberately do NOT implement this as a Postgres
 * `ON CONFLICT DO UPDATE`, because that would require granting UPDATE to the
 * anonymous role — breaking the "the browser can only INSERT" guarantee. So the
 * existing row is left untouched (first signup wins) and the duplicate is
 * swallowed. This keeps the schema and RLS exactly as designed.
 *
 * Always returns true unless the network/config itself failed — so the UI can
 * show one consistent confirmation.
 */
export async function trackWaitlist(email: string): Promise<boolean> {
  if (!ready()) return false;
  const clean = email.trim().toLowerCase();
  if (!clean) return false;
  const session = getSession();
  try {
    const c = detectClient();
    const geo = await getGeo();
    const { error } = await supabase.from("waitlist").insert({
      email: clean,
      session_id: session?.id ?? null,
      browser: c.browser,
      country: geo.country,
    });
    // 23505 = unique_violation → the email is already on the list. That's a
    // success from the user's point of view, so never surface it as an error.
    if (error && error.code !== "23505") return false;
    return true;
  } catch {
    return false;
  }
}
