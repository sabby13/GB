# GlassButterfly — Landing Page

A premium, Apple × Linear inspired landing page for GlassButterfly, built as an
interactive experience: a butterfly-swarm hero, a scroll-driven sticky logo, a
living-wallpaper monitor showcase, floating feature pills, an animated
installation flow, and a word-by-word download reveal.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — section + element animation
- **GSAP (ScrollTrigger)** — scroll-scrubbed installation progress line
- **Lenis** — smooth momentum scrolling
- **three.js / @react-three/fiber / drei** — the rigged 3D `butterfly.glb` swarm

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Where things live

```
app/                 layout, global styles, the composed page
components/
  HeroExperience     loader → butterfly burst → logo reveal orchestration
  Loader             rotating dotted ring
  ButterflyScene     3D swarm (clones butterfly.glb, plays the flap clip)
  SiteLogo           center → sticky-top logo interpolation on scroll
  MonitorShowcase    premium monitor frame
  WallpaperCarousel  cross-fading wallpaper videos + glass arrows
  FeaturePills       floating capsule features
  FloatingButterfly  occasional butterfly fly-by (every 15–20s)
  FloatingCallouts   subtle glass word cards
  InstallationSection animated 4-step flow with scrubbing line
  DownloadSection    word-by-word quote + store-style download card
  Footer
lib/                 motion variants, gsap helper, wallpaper config
hooks/               prefers-reduced-motion
public/assets/       logo.png, butterfly.glb, wallpapers/
```

## Adding your wallpaper videos

1. Drop looping `.mp4` files into `public/assets/wallpapers/`
   (muted, loop-friendly, ~1920×1080, small file size).
2. Edit `lib/wallpapers.ts` — set each entry's `src` to
   `/assets/wallpapers/<file>.mp4`.

Until real files are added, the carousel shows animated gradient posters so the
flow works end-to-end.

## Wiring the download button

Set `DOWNLOAD_URL` in `components/DownloadSection.tsx` to your installer link
(e.g. a GitHub release asset).

## Tuning notes

- **Butterfly count / size**: `components/HeroExperience.tsx` (`count`) and the
  per-instance `scale` in `components/ButterflyScene.tsx`. The model is
  auto-normalized to ~1 unit, so scaling is predictable.
- **Timings**: hero phases in `HeroExperience.tsx`; easings in `lib/motion.ts`.
- All motion respects `prefers-reduced-motion`.

## Notes

- Fonts (Inter + Cormorant Garamond, a free stand-in for Canela / Editorial New)
  load via `<link>` in `app/layout.tsx`.
- The old `index.html` "coming soon" placeholder is no longer used by the app;
  it can be removed.
