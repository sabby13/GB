"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

const MODEL = "/assets/butterfly.glb";
useGLTF.preload(MODEL);

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type ButterflyProps = {
  target: THREE.Vector3;
  delay: number;
  duration: number;
  scale: number;
  spin: number;
  clipIndex: number;
  norm: number;
  center: THREE.Vector3;
  burstStart: number | null;
};

/**
 * A single skinned butterfly. The rigged glb is cloned with SkeletonUtils so
 * every instance keeps its own skeleton and can flap independently. It bursts
 * out from the centre of the loader ring and keeps drifting off-screen.
 */
function Butterfly({
  target,
  delay,
  duration,
  scale,
  spin,
  clipIndex,
  norm,
  center,
  burstStart,
}: ButterflyProps) {
  const gltf = useGLTF(MODEL) as unknown as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };

  const cloned = useMemo(() => {
    const c = SkeletonUtils.clone(gltf.scene) as THREE.Group;
    // Recentre the model so it rotates/scales around its own middle.
    c.position.set(-center.x, -center.y, -center.z);
    return c;
  }, [gltf.scene, center]);

  const mixer = useMemo(() => new THREE.AnimationMixer(cloned), [cloned]);
  const group = useRef<THREE.Group>(null!);
  const start = useMemo(
    () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.3
      ),
    []
  );

  useEffect(() => {
    const clips = gltf.animations;
    const clip = clips.length ? clips[clipIndex % clips.length] : null;
    if (clip) {
      const action = mixer.clipAction(clip);
      action.reset();
      action.play();
      action.timeScale = 1.4 + Math.random() * 1.6; // varied flap speed
    }
    return () => {
      mixer.stopAllAction();
    };
  }, [gltf.animations, mixer, clipIndex]);

  useFrame((_, dt) => {
    mixer.update(dt);
    const g = group.current;
    if (!g) return;

    if (burstStart == null) {
      g.scale.setScalar(0.0001);
      return;
    }

    const el = (performance.now() - burstStart) / 1000 - delay;
    if (el <= 0) {
      g.position.copy(start);
      g.scale.setScalar(0.0001);
      return;
    }

    const t = Math.min(el / duration, 1);
    const e = easeOutCubic(t);
    // once the flight completes, keep pushing outward so they exit smoothly
    const overshoot = 1 + Math.max(0, el - duration) * 1.1;

    g.position.set(
      THREE.MathUtils.lerp(start.x, target.x * overshoot, e),
      THREE.MathUtils.lerp(start.y, target.y * overshoot, e) +
        Math.sin(el * 2 + spin) * 0.08,
      THREE.MathUtils.lerp(start.z, target.z, e)
    );

    g.scale.setScalar(norm * scale * Math.min(1, t * 3)); // quick pop-in
    g.rotation.z = spin + Math.sin(el * 3) * 0.18;
    g.rotation.y = Math.atan2(target.x, Math.max(0.001, target.z)) + Math.sin(el * 1.4) * 0.25;
    g.rotation.x = -0.25 + Math.sin(el * 4 + spin) * 0.12;
  });

  return (
    <group ref={group}>
      <primitive object={cloned} />
    </group>
  );
}

function Swarm({ count, burstStart }: { count: number; burstStart: number | null }) {
  const gltf = useGLTF(MODEL) as unknown as { scene: THREE.Group };

  const { norm, center } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const n = 1 / Math.max(size.x, size.y, size.z || 1);
    return { norm: n, center: c };
  }, [gltf.scene]);

  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const ang = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 4.5;
        return {
          target: new THREE.Vector3(
            Math.cos(ang) * radius * 1.5,
            Math.sin(ang) * radius,
            (Math.random() - 0.5) * 2.5
          ),
          delay: Math.random() * 0.6,
          // longer flight so butterflies stay ~4s before leaving
          duration: 2.6 + Math.random() * 1.2,
          // ~2x larger than before
          scale: 1.1 + Math.random() * 1.6,
          spin: Math.random() * Math.PI * 2,
          clipIndex: i,
        };
      }),
    [count]
  );

  return (
    <group>
      {items.map((it, i) => (
        <Butterfly key={i} {...it} norm={norm} center={center} burstStart={burstStart} />
      ))}
    </group>
  );
}

/**
 * Full-bleed transparent canvas that hosts the butterfly swarm. `active`
 * triggers the burst; the parent unmounts this once the butterflies have gone.
 */
export default function ButterflyScene({
  active,
  count = 22,
}: {
  active: boolean;
  count?: number;
}) {
  const burstStart = useMemo(() => (active ? performance.now() : null), [active]);

  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} />
      <directionalLight position={[-4, -2, 2]} intensity={0.4} />
      <Suspense fallback={null}>
        <Swarm count={count} burstStart={burstStart} />
      </Suspense>
    </Canvas>
  );
}
