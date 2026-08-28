"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CATEGORIES } from "@/lib/categories";

/** The bracelet and the beads behind the wall are the same object.
 *
 *  At scroll progress 0 the beads are a dense sleeve strung on a gold wire —
 *  a bracelet you can grab and turn. As the shop comes up they let go of the
 *  wire and drift out into four columns, one per colour family, sitting behind
 *  the wall those families sort. Nothing is faded out and swapped: it is one
 *  continuous set of beads moving between two arrangements, which is the whole
 *  argument that the shop is made of the thing in the hero.
 *
 *  Everything animates inside useFrame from refs, never React state, so
 *  scrolling and dragging never trigger a re-render. */

type Bead = {
  ring: THREE.Vector3;
  column: THREE.Vector3;
  colour: THREE.Color;
  scale: number;
  /** Staggers the release so the sleeve unravels rather than exploding. */
  delay: number;
  drift: number;
};

const RING_RADIUS = 1.5;
const TUBE_RADIUS = 0.17;

function useBeads(stations: number, perStation: number, columnCount: number): Bead[] {
  return useMemo(() => {
    const beads: Bead[] = [];
    const columnSpan = 8.4;

    for (let i = 0; i < stations; i++) {
      const around = (i / stations) * Math.PI * 2;

      for (let j = 0; j < perStation; j++) {
        const through = (j / perStation) * Math.PI * 2 + around * 2.3;
        const jitter = 1 + (((i * 5 + j * 11) % 7) - 3) * 0.03;
        const r = RING_RADIUS + TUBE_RADIUS * Math.cos(through) * jitter;

        const ring = new THREE.Vector3(
          r * Math.cos(around),
          TUBE_RADIUS * Math.sin(through) * jitter,
          r * Math.sin(around)
        );

        // Column membership is spread evenly around the ring, so the sleeve is
        // mixed and each column is not carved out of one arc of it.
        const columnIndex = (i * perStation + j) % columnCount;
        const range = CATEGORIES[columnIndex % CATEGORIES.length];

        const spreadX = (((i * 13 + j * 29) % 100) / 100 - 0.5) * 1.6;
        const spreadY = (((i * 7 + j * 17) % 100) / 100 - 0.5) * 9.5;
        // Well behind the wall: these are ambience the cards sit in front of,
        // not a layer competing with the product photography.
        const spreadZ = (((i * 23 + j * 3) % 100) / 100) * -6 - 4;

        const column = new THREE.Vector3(
          (columnIndex - (columnCount - 1) / 2) * (columnSpan / columnCount) + spreadX,
          spreadY,
          spreadZ
        );

        beads.push({
          ring,
          column,
          colour: new THREE.Color(range.beads[(i + j) % range.beads.length]),
          scale: 0.1 + ((i * 7 + j * 3) % 5) * 0.011,
          delay: (i / stations) * 0.35,
          drift: (((i * 31 + j * 19) % 100) / 100) * 0.6 + 0.2,
        });
      }
    }

    return beads;
  }, [stations, perStation, columnCount]);
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function Beads({
  progressRef,
  spinRef,
  stations,
  perStation,
  columns,
}: {
  progressRef: React.RefObject<number>;
  spinRef: React.RefObject<number>;
  stations: number;
  perStation: number;
  columns: number;
}) {
  const beads = useBeads(stations, perStation, columns);
  const { size } = useThree();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const spun = useRef(0);

  const coloured = useRef(false);
  useEffect(() => {
    coloured.current = false;
  }, [beads]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Instance colours are written on the first frame the mesh actually
    // exists. Doing this in an effect races the instancedMesh's own buffer
    // allocation and leaves every bead reading black.
    if (!coloured.current) {
      for (let i = 0; i < beads.length; i++) mesh.setColorAt(i, beads[i].colour);
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      coloured.current = true;
    }

    const p = progressRef.current ?? 0;
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      // Drag momentum bleeds off instead of stopping dead; idle drift takes
      // over as it settles, and both fade out as the sleeve comes apart.
      spun.current += (spinRef.current ?? 0);
      spinRef.current = (spinRef.current ?? 0) * 0.9;
      groupRef.current.rotation.y = spun.current + t * 0.15 * (1 - p);

      // While it is a bracelet it sits beside the headline on a wide screen
      // rather than on top of it; the columns need the full width, so it
      // slides back to centre as it opens.
      const wide = size.width >= 1024;
      const heroOffset = wide ? 1.35 : 0;
      groupRef.current.position.x = heroOffset * (1 - p);
      // On a narrow screen the copy sits above and the bracelet has its own
      // reserved box below it, so it drops out of the text rather than
      // sitting on top of it.
      groupRef.current.position.y = (wide ? -0.1 : -1.35) * (1 - p);
      // Sits comfortably inside its column as a bracelet, then opens to full
      // size once it is a field of loose beads behind the wall. Phones get a
      // smaller resting size so the sleeve is not clipped by the viewport.
      const rest = wide ? 0.78 : 0.62;
      groupRef.current.scale.setScalar(rest + p * (1 - rest));
    }

    // Solid while it is a piece of jewellery; once the beads are loose behind
    // the shop they drop back to ambience so the photography stays the thing
    // you look at.
    const beadMaterial = mesh.material as THREE.MeshPhysicalMaterial;
    beadMaterial.transparent = p > 0.02;
    beadMaterial.opacity = 1 - p * 0.72;
    beadMaterial.depthWrite = p < 0.5;

    // The wire only exists while the beads are strung on it.
    if (wireRef.current) {
      const wire = wireRef.current.material as THREE.MeshStandardMaterial;
      wire.opacity = Math.max(0, 1 - p * 2.4);
      wire.transparent = true;
      wireRef.current.visible = wire.opacity > 0.01;
    }

    for (let i = 0; i < beads.length; i++) {
      const bead = beads[i];
      const local = THREE.MathUtils.clamp(
        (p - bead.delay) / (1 - bead.delay || 1),
        0,
        1
      );
      const eased = easeInOut(local);

      scratch.lerpVectors(bead.ring, bead.column, eased);

      // Once loose, beads breathe rather than sit still.
      if (eased > 0) {
        scratch.y += Math.sin(t * bead.drift + i) * 0.06 * eased;
        scratch.x += Math.cos(t * bead.drift * 0.8 + i) * 0.04 * eased;
      }

      dummy.position.copy(scratch);
      dummy.rotation.set(t * 0.1 * bead.drift, t * 0.14 * bead.drift, 0);
      dummy.scale.setScalar(bead.scale * (1 - eased * 0.42));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} rotation={[0.45, 0, 0.15]}>
      {/* torusGeometry is built in the XY plane but the sleeve rings XZ —
          without this rotation the wire hangs through it like a bag handle. */}
      <mesh ref={wireRef} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, 0.028, 10, 64]} />
        <meshStandardMaterial color="#d9b26a" metalness={0.9} roughness={0.28} />
      </mesh>

      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, beads.length]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 1]} />
        {/* No `vertexColors` here: that flag makes the shader look for a
            per-vertex colour attribute the geometry does not have, and every
            bead renders black. Three wires up InstancedMesh's instanceColor
            on its own as soon as setColorAt has run.

            Lit entirely by the local rig — no Environment preset, which would
            pull an HDR off a CDN on every page load. */}
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.12}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </instancedMesh>
    </group>
  );
}

export default function BeadField({
  progressRef,
  quality = "high",
  columns = 4,
}: {
  progressRef: React.RefObject<number>;
  quality?: "high" | "low";
  /** How many columns the beads settle into — matched to the number of
   *  ranges the wall below actually renders, so the promise that the beads
   *  sort into those columns stays true as stock changes. */
  columns?: number;
}) {
  const stations = quality === "high" ? 42 : 30;
  const perStation = quality === "high" ? 7 : 6;

  // Drag velocity, handed to the scene as a ref so dragging never re-renders.
  const spinRef = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  return (
    <Canvas
      dpr={[1, quality === "high" ? 1.6 : 1.2]}
      gl={{ alpha: true, antialias: quality === "high" }}
      camera={{ position: [0, 0.25, 6.4], fov: 42 }}
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        spinRef.current += dx * 0.0006;
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      {/* A three-point rig standing in for a studio HDRI: key glint upper
          right, violet fill from the left, warm bounce from below. */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} />
      <directionalLight position={[-4, 1, 2]} intensity={0.9} color="#c9a9e0" />
      <pointLight position={[0, -3, 2]} intensity={18} color="#d9b26a" distance={12} />

      <Beads
        progressRef={progressRef}
        spinRef={spinRef}
        stations={stations}
        perStation={perStation}
        columns={columns}
      />
    </Canvas>
  );
}
