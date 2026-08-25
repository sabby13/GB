"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

const MODEL = "/assets/butterfly.glb";
useGLTF.preload(MODEL);

/**
 * A single decorative butterfly, centred in its canvas, posed dorsally
 * (wings toward the viewer) with a slow idle flap.
 */
type Orient = { x?: number; y?: number; z?: number };

function Butterfly({
  flip,
  orient,
  scaleMul = 1,
}: {
  flip: boolean;
  orient?: Orient;
  scaleMul?: number;
}) {
  const gltf = useGLTF(MODEL) as unknown as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };

  const { cloned, norm } = useMemo(() => {
    const c = SkeletonUtils.clone(gltf.scene) as THREE.Group;
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    c.position.set(-center.x, -center.y, -center.z);
    return { cloned: c, norm: 1 / Math.max(size.x, size.y, size.z || 1) };
  }, [gltf.scene]);

  const mixer = useMemo(() => new THREE.AnimationMixer(cloned), [cloned]);
  const ref = useRef<THREE.Group>(null!);
  const t0 = useRef(0);

  useEffect(() => {
    t0.current = performance.now() / 1000;
    const clip = gltf.animations[0];
    if (clip) {
      const a = mixer.clipAction(clip);
      a.play();
      a.timeScale = 0.8; // slow, gentle flap
    }
    return () => {
      mixer.stopAllAction();
    };
  }, [gltf.animations, mixer]);

  const baseX = orient?.x ?? -1.45;
  const baseY = orient?.y ?? (flip ? 0.35 : -0.35);
  const baseZ = orient?.z ?? (flip ? 0.28 : -0.28);

  useFrame((_, dt) => {
    mixer.update(dt);
    const g = ref.current;
    if (!g) return;
    const el = performance.now() / 1000 - t0.current;
    g.rotation.x = baseX + Math.sin(el * 1.1) * 0.06; // dorsal (wings to viewer)
    g.rotation.z = baseZ + Math.sin(el * 0.8) * 0.06;
    g.rotation.y = baseY;
  });

  return (
    <group ref={ref} scale={norm * 2.1 * scaleMul}>
      <primitive object={cloned} />
    </group>
  );
}

export default function StaticButterflyScene({
  flip = false,
  orient,
  scaleMul = 1,
}: {
  flip?: boolean;
  orient?: Orient;
  scaleMul?: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <directionalLight position={[-3, -2, 2]} intensity={0.35} />
      <Suspense fallback={null}>
        <Butterfly flip={flip} orient={orient} scaleMul={scaleMul} />
      </Suspense>
    </Canvas>
  );
}
