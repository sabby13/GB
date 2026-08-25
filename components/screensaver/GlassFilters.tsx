"use client";

/**
 * SVG displacement filters that give the glass its "liquid" ripple. Applied
 * inline via `filter: url(#glass-liquid)` on each card's distortion layer, so
 * the fragment resolves against the document. The animated turbulence makes the
 * refracted wallpaper flow slowly. (These defs weren't in the shared renderer,
 * so they're authored here to match the intended effect.)
 */
export function GlassFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="glass-liquid" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009 0.013"
            numOctaves={2}
            seed={7}
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="22s"
              values="0.009 0.013;0.013 0.009;0.009 0.013"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={20}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="glass-liquid-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.016"
            numOctaves={2}
            seed={4}
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="28s"
              values="0.012 0.016;0.016 0.012;0.012 0.016"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={9}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
