"use client";

import dynamic from "next/dynamic";

// The 3D canvas must never render on the server.
const Scene = dynamic(() => import("./StaticButterflyScene"), { ssr: false });

type Orient = { x?: number; y?: number; z?: number };

/** A fixed decorative butterfly. `orient` overrides the resting rotation
 *  (radians) and `scaleMul` scales it within its canvas. */
export default function StaticButterfly({
  flip = false,
  orient,
  scaleMul = 1,
}: {
  flip?: boolean;
  orient?: Orient;
  scaleMul?: number;
}) {
  return <Scene flip={flip} orient={orient} scaleMul={scaleMul} />;
}
