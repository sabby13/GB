"use client";

import { useEffect } from "react";
import { trackVisitor } from "@/lib/analytics";

/**
 * Renders nothing. Mounted once in the root layout, it records a single
 * anonymous visitor row the first time a new browser session is seen.
 * It never changes the UI.
 */
export default function VisitorTracker() {
  useEffect(() => {
    trackVisitor();
  }, []);
  return null;
}
