/**
 * Where the app is distributed. GlassButterfly ships through GitHub Releases,
 * and this "latest" asset URL always resolves to the newest published build —
 * so a new release needs no website change.
 *
 * Kept as a single shared constant (never hardcoded in a component) so the
 * download link lives in exactly one place.
 */
export const DOWNLOAD_URL =
  "https://github.com/sabby13/GlassButterfly/releases/latest/download/GlassButterfly.zip";
