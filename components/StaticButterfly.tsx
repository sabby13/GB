"use client";

import dynamic from "next/dynamic";

// The 3D canvas must never render on the server.
const Scene = dynamic(() => import("./StaticButterflyScene"), { ssr: false });

/** A fixed decorative butterfly for the features section corners. */
export default function StaticButterfly({ flip = false }: { flip?: boolean }) {
  return <Scene flip={flip} />;
}
