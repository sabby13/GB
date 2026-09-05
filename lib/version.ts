/**
 * Single source of truth for the app version.
 *
 * Change this on every release — the download UI, download analytics, and any
 * future release plumbing all read from here, so nothing else needs editing.
 */
export const APP_VERSION = "1.6.1";

/**
 * Where a download originated. Today only the website exists; the union is
 * future-proofed so new channels drop in without a schema change (the
 * `downloads.source` column is plain text).
 */
export type DownloadSource =
  | "website"
  | "github"
  | "installer"
  | "winget"
  | "microsoft_store";
