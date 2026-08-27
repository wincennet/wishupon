"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";

/** Bead positions form a torus: the shape of a bracelet on the wrist.
 *  Generated rather than modelled — a real 3D scan of each piece is not
 *  feasible, and a stylised cluster is honest about being a representation. */
function useBeadLayout(count: number) {
  return useMemo(() => {
    const beads: {
      position: [number, number, number];
      scale: number;
      color: string;
      metal: boolean;
    }[] = [];

    // The brand's violets, plus the gold-tone wire the real pieces use.
    const glass = ["#c9a9e0", "#a87fc7", "#7d54a3", "#e0d0ee", "#5b3a7a"];
    const gold = "#d9b26a";

    const ringRadius = 1.5;
    // Tight tube: the real bracelets are a dense sleeve of beads hugging the
    // wire, not beads spaced along a string. Spread this out and it reads as
    // a necklace instead of the product.
    const tubeRadius = 0.17;
    const perStation = 7;

    for (let i = 0; i < count; i++) {
      const around = (i / count) * Math.PI * 2;

      for (let j = 0; j < perStation; j++) {
        const through = (j / perStation) * Math.PI * 2 + around * 2.3;
        // Slight jitter so the sleeve looks hand-strung, not machined.
        const jitter = 1 + (((i * 5 + j * 11) % 7) - 3) * 0.03;
        const r = ringRadius + tubeRadius * Math.cos(through) * jitter;

        beads.push({
          position: [
            r * Math.cos(around),
            tubeRadius * Math.sin(through) * jitter,
            r * Math.sin(around),
          ],
          scale: 0.1 + ((i * 7 + j * 3) % 5) * 0.011,
          color: glass[(i + j) % glass.length],
          metal: (i * perStation + j) % 9 === 0,
        });
      }
    }

    return { beads, gold };
  }, [count]);
}

function Cluster() {
  const group = useRef<Group>(null);
  const { beads, gold } = useBeadLayout(42);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Slow, damped drift. The piece turns the way it would hanging on a hook.
    group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group} rotation={[0.45, 0, 0.15]}>
      {/* The gold-tone wire the beads are strung on. torusGeometry is built in
          the XY plane, but the bead ring is laid out across XZ — without this
          rotation the wire hangs through the beads like a bag handle. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.028, 10, 64]} />
        <meshStandardMaterial color={gold} metalness={0.9} roughness={0.28} />
      </mesh>

      {beads.map((bead, i) => (
        <mesh key={i} position={bead.position} scale={bead.scale}>
          <icosahedronGeometry args={[1, 1]} />
          {bead.metal ? (
            <meshStandardMaterial color={gold} metalness={1} roughness={0.22} />
          ) : (
            /* Faceted glass read without an HDRI: low roughness for a hard
               specular glint, clearcoat for the wet surface, and a little
               emissive so the bead still glows on a dim phone screen.
               Deliberately no Environment map — that would pull an HDR file
               off a CDN on every page load. */
            <meshPhysicalMaterial
              color={bead.color}
              roughness={0.12}
              metalness={0.05}
              clearcoat={1}
              clearcoatRoughness={0.08}
              emissive={bead.color}
              emissiveIntensity={0.18}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}

export default function BeadCluster() {
  return (
    <Canvas
      /* Capped DPR and no antialias: this must not cost a shopper on mobile
         data an order. */
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0.4, 4.6], fov: 42 }}
    >
      {/* A three-point rig standing in for a studio HDRI: key glint from the
          upper right, violet fill from the left, warm bounce from below. */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} />
      <directionalLight position={[-4, 1, 2]} intensity={0.9} color="#c9a9e0" />
      <pointLight position={[0, -3, 2]} intensity={18} color="#d9b26a" distance={12} />
      <Cluster />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        // Damped, never snapped.
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
