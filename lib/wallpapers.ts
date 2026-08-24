/**
 * Wallpaper carousel configuration.
 *
 * HOW TO ADD YOUR VIDEOS
 * ----------------------
 * 1. Drop your looping wallpaper files into:  public/assets/wallpapers/
 * 2. Recommended: .mp4 (H.264) + optional .webm, muted, loop-friendly,
 *    roughly 1920x1080, a few seconds long, small file size.
 * 3. Add / edit entries below. `src` is relative to /public.
 *
 * Until you add real files, the carousel falls back to an animated
 * gradient poster so the whole flow works end-to-end.
 */

export type Wallpaper = {
  id: string;
  title: string;
  /** Path under /public, e.g. "/assets/wallpapers/aurora.mp4". Leave "" for gradient fallback. */
  src: string;
  /** Optional secondary source for broader codec support. */
  webm?: string;
  /** CSS gradient used as poster / fallback background. */
  gradient: string;
};

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "aurora",
    title: "Aurora",
    src: "/assets/wallpapers/aurora.mp4",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  {
    id: "monarch",
    title: "Monarch",
    src: "/assets/wallpapers/monarch.mp4",
    gradient: "linear-gradient(135deg, #3a1c1c 0%, #7a3b16 55%, #e08a2b 100%)",
  },
  {
    id: "glass",
    title: "Glass",
    src: "/assets/wallpapers/glass.mp4",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  },
  {
    id: "bloom",
    title: "Bloom",
    src: "/assets/wallpapers/bloom.mp4",
    gradient: "linear-gradient(135deg, #232526 0%, #414345 100%)",
  },
];
