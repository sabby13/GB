"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
] as const;

const formatDate = (d: Date): string =>
  `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

/** Date display in its own GlassCard; refreshes at midnight rather than polling. */
export function GlassDate() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let timeoutId: number;
    const scheduleNextMidnight = (): void => {
      const current = new Date();
      const next = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1,
        0, 0, 1, 0
      );
      timeoutId = window.setTimeout(() => {
        setNow(new Date());
        scheduleNextMidnight();
      }, next.getTime() - current.getTime());
    };
    scheduleNextMidnight();
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <GlassCard className="date-card" softDistort>
      <time className="date" suppressHydrationWarning>
        {formatDate(now)}
      </time>
    </GlassCard>
  );
}
