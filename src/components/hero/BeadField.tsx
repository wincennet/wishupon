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
  /** Own phase, so the field breathes unevenly rather than in unison. */
  phase: number;
};

const RING_RADIUS = 1.5;
const TUBE_RADIUS = 0.17;
/** Widest the bracelet reads on screen, used to size it against its column. */
const SLEEVE_WIDTH = RING_RADIUS * 2 + TUBE_RADIUS * 2;

/** The authored width of the settled field. It is a reference, not a final
 *  measurement: the frame loop stretches it to whatever the viewport is
 *  actually wide, so the beads reach both edges of the page on a monitor and
 *  do not all pile up off-screen on a phone. */
const COLUMN_SPAN = 8.4;

function useBeads(stations: number, perStation: number, columnCount: number): Bead[] {
  return useMemo(() => {
    const beads: Bead[] = [];
    const columnSpan = COLUMN_SPAN;

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
          phase: (((i * 17 + j * 41) % 100) / 100) * Math.PI * 2,
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
  anchorRef,
  spinRef,
  stations,
  perStation,
  columns,
  quality,
}: {
  progressRef: React.RefObject<number>;
  anchorRef?: React.RefObject<{ fx: number; fy: number; fw: number } | null>;
  spinRef: React.RefObject<number>;
  stations: number;
  perStation: number;
  columns: number;
  quality: "high" | "low";
}) {
  const beads = useBeads(stations, perStation, columns);
  const { size, camera } = useThree();
  const colTarget = useMemo(() => new THREE.Vector3(), []);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const spun = useRef(0);

  /** Live position and velocity for the loose-bead physics. Kept in flat
   *  arrays and mutated in place: allocating vectors per bead per frame would
   *  hand the garbage collector 300 objects sixty times a second. */
  const live = useRef<{ pos: Float32Array; vel: Float32Array; on: boolean } | null>(
    null
  );
  useEffect(() => {
    live.current = {
      pos: new Float32Array(beads.length * 3),
      vel: new Float32Array(beads.length * 3),
      on: false,
    };
  }, [beads]);

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

    // How much world space one screenful covers at a given depth. Every
    // placement below is expressed through this, so the field is sized by the
    // viewport it was handed rather than by constants tuned on one monitor.
    const cam = camera as THREE.PerspectiveCamera;
    const halfAngle = Math.tan((cam.fov * Math.PI) / 360);
    const aspect = size.width / Math.max(size.height, 1);
    const halfHAt = (depth: number) => halfAngle * (cam.position.z - depth);
    const halfWAt = (depth: number) => halfHAt(depth) * aspect;

    // Stretches the authored column layout across the actual frame, per bead
    // and by its own depth. One spread for the whole field looked right at the
    // front and pinched toward the middle at the back, because a bead six
    // units further away covers less of the screen for the same world offset —
    // which read as the field petering out before it reached the page edge.
    const spreadAt = (depth: number) =>
      THREE.MathUtils.clamp((halfWAt(depth) * 2) / COLUMN_SPAN, 0.72, 4.4);

    if (groupRef.current) {
      // Drag momentum bleeds off instead of stopping dead; idle drift takes
      // over as it settles, and both fade out as the sleeve comes apart.
      spun.current += (spinRef.current ?? 0);
      spinRef.current = (spinRef.current ?? 0) * 0.9;
      // Scaling the idle spin by (1 - p) alone left the field frozen once the
      // scroll finished. A floor keeps it turning gently forever.
      const idleSpin = 0.15 * (1 - p) + 0.03 * p;
      groupRef.current.rotation.y = spun.current + t * idleSpin;

      // While it is a bracelet it sits in the box the hero reserved for it —
      // beside the headline on a wide screen, below the copy on a phone —
      // and slides back to centre as it opens into the full-width field.
      // The anchor is read live, so a resize or a font swap moves it with the
      // layout instead of leaving it stranded.
      const anchor = anchorRef?.current ?? null;
      const halfW = halfWAt(0);
      const halfH = halfHAt(0);

      const heroX = anchor ? (anchor.fx * 2 - 1) * halfW : 0;
      const heroY = anchor ? cam.position.y + (1 - anchor.fy * 2) * halfH : 0;
      groupRef.current.position.x = heroX * (1 - p);
      groupRef.current.position.y = heroY * (1 - p);

      // Sized against the column rather than against the canvas: the canvas is
      // now the whole page, so a fixed fraction of it would print a bracelet
      // the width of a dinner plate on a monitor.
      const boxWorld = anchor ? anchor.fw * 2 * halfW : SLEEVE_WIDTH;
      const rest = THREE.MathUtils.clamp((boxWorld * 0.82) / SLEEVE_WIDTH, 0.42, 1);
      groupRef.current.scale.setScalar(rest + p * (1 - rest));
    }

    // Solid while it is a piece of jewellery; once the beads are loose behind
    // the shop they drop back to ambience so the photography stays the thing
    // you look at.
    const beadMaterial = mesh.material as THREE.MeshStandardMaterial;
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

    const phys = live.current;
    // Once the sleeve has fully opened the beads stop being animated along a
    // path and start being simulated: each one falls under gravity and bounces
    // off the edges of the frame, so the field keeps moving indefinitely
    // instead of settling into a still image.
    const loose = p > 0.995 && phys !== null;

    if (loose && !phys!.on) {
      // Hand over from the scripted layout to the simulation, seeding each
      // bead with its own direction so they scatter rather than fall in step.
      for (let i = 0; i < beads.length; i++) {
        const bead = beads[i];
        const a = bead.phase;
        phys!.pos[i * 3] = bead.column.x * spreadAt(bead.column.z);
        phys!.pos[i * 3 + 1] = bead.column.y;
        phys!.pos[i * 3 + 2] = bead.column.z;
        phys!.vel[i * 3] = Math.cos(a) * (0.5 + bead.drift * 0.7);
        phys!.vel[i * 3 + 1] = Math.sin(a * 1.7) * 0.9;
        phys!.vel[i * 3 + 2] = Math.sin(a) * 0.35;
      }
      phys!.on = true;
    } else if (!loose && phys) {
      phys.on = false;
    }

    // A tab left in the background hands back a huge delta on return, which
    // would fling every bead out of frame in one step.
    const dt = Math.min(delta, 1 / 30);

    // The walls the loose beads bounce off are the edges of the frame, worked
    // out from the viewport each frame. Fixed bounds meant the field stopped
    // short of both margins on a wide screen and left a bare strip down the
    // sides of the page.
    const Z_NEAR = -3.2;
    const Z_FAR = -11;
    const GRAVITY = -2.4;
    const RESTITUTION = 0.74;

    for (let i = 0; i < beads.length; i++) {
      const bead = beads[i];

      if (loose) {
        const ix = i * 3;
        phys!.vel[ix + 1] += GRAVITY * dt;

        // Each bead bounces off the frame at its own depth, so a bead far back
        // travels further before it turns around and still turns around level
        // with the edge of the screen. Shared bounds sent the back of the field
        // into a narrower box than the front, thinning the margins.
        const xWall = halfWAt(phys!.pos[ix + 2]) + 0.6;
        const yWall = halfHAt(phys!.pos[ix + 2]) + 0.4;

        phys!.pos[ix] += phys!.vel[ix] * dt;
        phys!.pos[ix + 1] += phys!.vel[ix + 1] * dt;
        phys!.pos[ix + 2] += phys!.vel[ix + 2] * dt;

        // Floor contact. A bead with energy left bounces; one that has spent
        // itself is dropped in again from the top somewhere new, so the field
        // keeps raining instead of silting up along the bottom edge.
        if (phys!.pos[ix + 1] < -yWall) {
          if (Math.abs(phys!.vel[ix + 1]) < 1.1) {
            const depth = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
            phys!.pos[ix] = (Math.random() - 0.5) * 2 * (halfWAt(depth) + 0.6);
            phys!.pos[ix + 1] = halfHAt(depth) + 0.4;
            phys!.pos[ix + 2] = depth;
            phys!.vel[ix] = (Math.random() - 0.5) * 0.9;
            phys!.vel[ix + 1] = -0.2 - Math.random() * 0.7;
            phys!.vel[ix + 2] = (Math.random() - 0.5) * 0.5;
          } else {
            phys!.pos[ix + 1] = -yWall;
            phys!.vel[ix + 1] = Math.abs(phys!.vel[ix + 1]) * RESTITUTION;
            // Each bounce throws it off at its own angle rather than straight up.
            phys!.vel[ix] += (Math.random() - 0.5) * 1.1;
            phys!.vel[ix + 2] += (Math.random() - 0.5) * 0.6;
          }
        }
        if (phys!.pos[ix + 1] > yWall + 1) {
          phys!.pos[ix + 1] = yWall;
          phys!.vel[ix + 1] = -Math.abs(phys!.vel[ix + 1]) * RESTITUTION;
        }
        if (phys!.pos[ix] < -xWall || phys!.pos[ix] > xWall) {
          phys!.pos[ix] = THREE.MathUtils.clamp(phys!.pos[ix], -xWall, xWall);
          phys!.vel[ix] *= -RESTITUTION;
        }
        if (phys!.pos[ix + 2] < Z_FAR || phys!.pos[ix + 2] > Z_NEAR) {
          phys!.pos[ix + 2] = THREE.MathUtils.clamp(phys!.pos[ix + 2], Z_FAR, Z_NEAR);
          phys!.vel[ix + 2] *= -RESTITUTION;
        }

        scratch.set(phys!.pos[ix], phys!.pos[ix + 1], phys!.pos[ix + 2]);
        dummy.position.copy(scratch);
        dummy.rotation.set(t * 0.4 * bead.drift, t * 0.5 * bead.drift, bead.phase);
        dummy.scale.setScalar(bead.scale * 0.72);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const local = THREE.MathUtils.clamp(
        (p - bead.delay) / (1 - bead.delay || 1),
        0,
        1
      );
      const eased = easeInOut(local);

      colTarget.set(
        bead.column.x * spreadAt(bead.column.z),
        bead.column.y,
        bead.column.z
      );
      scratch.lerpVectors(bead.ring, colTarget, eased);

      if (eased > 0) {
        const sp = bead.drift;
        scratch.y += Math.sin(t * sp * 0.85 + bead.phase) * 0.36 * eased;
        scratch.x += Math.cos(t * sp * 0.55 + bead.phase * 1.7) * 0.2 * eased;
        scratch.z += Math.sin(t * sp * 0.4 + bead.phase * 0.6) * 0.24 * eased;
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
        {/* Clearcoat is what makes these read as faceted crystal rather than
            plastic, and it is the most expensive part of the frame. Phones get
            the cheaper material — they already run fewer beads at a lower pixel
            ratio, and the glint is the first thing lost on a small screen
            anyway. Desktops keep the glass. */}
        {quality === "high" ? (
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.12}
            metalness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        ) : (
          <meshStandardMaterial color="#ffffff" roughness={0.16} metalness={0.12} />
        )}
      </instancedMesh>
    </group>
  );
}

export default function BeadField({
  progressRef,
  anchorRef,
  quality = "high",
  columns = 4,
}: {
  progressRef: React.RefObject<number>;
  /** Centre and width of the hero's reserved box, as fractions of the
   *  viewport. The canvas spans the whole page, so this is what keeps the
   *  bracelet in its column instead of dead centre. */
  anchorRef?: React.RefObject<{ fx: number; fy: number; fw: number } | null>;
  quality?: "high" | "low";
  /** How many columns the beads settle into — matched to the number of
   *  ranges the wall below actually renders, so the promise that the beads
   *  sort into those columns stays true as stock changes. */
  columns?: number;
}) {
  // The settled field now covers the whole page rather than a centre column,
  // so the same bead count spread thin and read as scattered crumbs. More
  // beads cost one draw call either way — they are a single instanced mesh —
  // and the denser sleeve is better as a bracelet too.
  const stations = quality === "high" ? 54 : 34;
  const perStation = quality === "high" ? 8 : 6;

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
        anchorRef={anchorRef}
        spinRef={spinRef}
        stations={stations}
        perStation={perStation}
        columns={columns}
        quality={quality}
      />
    </Canvas>
  );
}
