"use client";

import { useEffect, useRef } from "react";
import { ButterflyController } from "@/lib/butterfly/ButterflyController";
import { butterflyConfig } from "@/lib/butterfly/config";

const MODEL = "/assets/butterfly.glb";

/**
 * Transparent WebGL canvas layered over the wallpaper, hosting the flying
 * butterflies. The imperative controller owns its own rAF loop, so this mounts
 * once and never re-renders per frame — swapping wallpapers never touches it.
 */
export function ButterflyLayer({ count = 1 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!butterflyConfig.enabled) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let controller: ButterflyController | null = null;
    try {
      controller = new ButterflyController(canvas, butterflyConfig);
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
  }, [count]);

  if (!butterflyConfig.enabled) return null;
  return <canvas ref={canvasRef} className="gb-butterfly-layer" aria-hidden="true" />;
}
