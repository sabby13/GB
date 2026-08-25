"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

const MODEL = "/assets/butterfly.glb";

function Flyer({ onDone }: { onDone: () => void }) {
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
  const group = useRef<THREE.Group>(null!);
  const start = useRef(performance.now());
  // random vertical band and direction each flight
  const params = useMemo(
    () => ({
      baseY: (Math.random() - 0.5) * 3,
      dir: Math.random() > 0.5 ? 1 : -1,
      duration: 8 + Math.random() * 3,
      scale: 1.5 + Math.random() * 0.9,
    }),
    []
  );

  useEffect(() => {
    const clip = gltf.animations[0];
    if (clip) {
      const a = mixer.clipAction(clip);
      a.play();
      a.timeScale = 1.8;
    }
    return () => {
      mixer.stopAllAction();
    };
  }, [gltf.animations, mixer]);

  useFrame((_, dt) => {
    mixer.update(dt);
    const g = group.current;
    if (!g) return;
    const el = (performance.now() - start.current) / 1000;
    const t = el / params.duration;
    if (t >= 1) {
      onDone();
      return;
    }
    const fromX = -10 * params.dir;
    const toX = 10 * params.dir;
    g.position.x = THREE.MathUtils.lerp(fromX, toX, t);
    g.position.y = params.baseY + Math.sin(el * 1.6) * 0.9;
    g.position.z = 0;
    g.scale.setScalar(norm * params.scale);
    // Dorsal view: pitch the butterfly ~-90° so its spread wings face the
    // viewer, with a gentle bob/bank/heading so it still reads as flying.
    g.rotation.x = -1.45 + Math.sin(el * 5) * 0.12;
    g.rotation.y = (params.dir > 0 ? -0.1 : 0.1) + Math.sin(el * 1.3) * 0.06;
    g.rotation.z = Math.sin(el * 2) * 0.12;
  });

  return (
    <group ref={group}>
      <primitive object={cloned} />
    </group>
  );
}

export default function FloatingButterflyScene({ onDone }: { onDone: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <Suspense fallback={null}>
        <Flyer onDone={onDone} />
      </Suspense>
    </Canvas>
  );
}
