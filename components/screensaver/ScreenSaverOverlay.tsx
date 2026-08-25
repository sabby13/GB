"use client";

import { GlassFilters } from "./GlassFilters";
import { GlassClock } from "./GlassClock";
import { GlassDate } from "./GlassDate";
import { ButterflyLayer } from "./ButterflyLayer";

/**
 * The persistent screensaver overlay for the monitor: clock + date glass cards
 * and the flying butterfly, all mounted ONCE. Only the wallpaper behind it
 * swaps, so changing wallpapers is seamless — the clock keeps ticking and the
 * butterfly keeps flying without a hitch.
 */
export default function ScreenSaverOverlay({
  butterflyCount = 1,
}: {
  butterflyCount?: number;
}) {
  return (
    <>
      <GlassFilters />
      <div className="gb-clockstack">
        <GlassClock use24Hour showSeconds={false} />
        <GlassDate />
      </div>
      <ButterflyLayer count={butterflyCount} />
    </>
  );
}
