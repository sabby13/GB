"use client";

import { Fragment, useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";

const pad = (v: number): string => String(v).padStart(2, "0");

function timeSegments(now: Date, use24Hour: boolean, showSeconds: boolean): string[] {
  let hours = now.getHours();
  if (!use24Hour) {
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }
  const segments = [pad(hours), pad(now.getMinutes())];
  if (showSeconds) segments.push(pad(now.getSeconds()));
  return segments;
}

/**
 * Live clock rendered into a GlassCard. Ticks once a second. (The Electron
 * build read 12/24h + seconds from settings; here they are props.)
 */
export function GlassClock({
  use24Hour = true,
  showSeconds = false,
}: {
  use24Hour?: boolean;
  showSeconds?: boolean;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const segments = timeSegments(now, use24Hour, showSeconds);

  return (
    <GlassCard className="clock-card">
      <time className="clock" suppressHydrationWarning>
        {segments.map((segment, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <span className="clock__separator" aria-hidden="true">
                :
              </span>
            )}
            <span className="clock__segment">{segment}</span>
          </Fragment>
        ))}
      </time>
    </GlassCard>
  );
}
