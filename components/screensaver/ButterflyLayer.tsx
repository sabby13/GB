"use client";

import { useEffect, useRef } from "react";
import { ButterflyController } from "@/lib/butterfly/ButterflyController";
import { butterflyConfig, type ButterflyConfig } from "@/lib/butterfly/config";

const MODEL = "/assets/butterfly.glb";

/**
 * Transparent WebGL canvas hosting flying butterflies, sized to its own box.
 * The imperative controller owns its rAF loop, so this mounts once and never
 * re-renders per frame. Pass a `config` (memoised) to reuse it in other places
 * — e.g. a hover config for the feature-pill corners.
 */
export function ButterflyLayer({
  count = 1,
  config = butterflyConfig,
}: {
  count?: number;
  config?: ButterflyConfig;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!config.enabled) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let controller: ButterflyController | null = null;
    try {
      controller = new ButterflyController(canvas, config);
      controller.setCount(count);
      controller.load(MODEL).catch((err) => {
        console.warn("Butterfly failed to load:", err);
      });
    } catch (err) {
      console.warn("Butterfly init failed:", err);
      controller?.dispose();
      controller = null;
    }

    return () => {
      controller?.dispose();
    };
  }, [count, config]);

  if (!config.enabled) return null;
  return <canvas ref={canvasRef} className="gb-butterfly-layer" aria-hidden="true" />;
}
