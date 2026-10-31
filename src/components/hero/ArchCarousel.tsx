"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FILM_PANELS } from "@/lib/hero-shots";
import { categoryOf } from "@/lib/categories";

/** A row of tall photo cards bent into an arch, like the inside of a
 *  cylinder: upright in the middle, taller and leaning at the edges. It drifts
 *  right to left on its own, can be dragged or flung, then carries on.
 *
 *  All geometry is in "units" (a 1440-wide design frame, or 640 wide on a
 *  phone) and multiplied by one scale factor, so the arch keeps its shape at
 *  every width. */

const PITCH = 196; // even spacing of card centres before the arch pushes them out
const COUNT = 10;
const LOOP = PITCH * COUNT;
const AUTO_SPEED = -50; // units per second, right to left
const CORNER = 15;

type Pt = [number, number];

/** A four-point shape with softly rounded corners, as an SVG path. */
function roundedQuad(pts: Pt[], radius: number): string {
  let d = "";
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const prev = pts[(i + pts.length - 1) % pts.length];
    const next = pts[(i + 1) % pts.length];
    const toward = (q: Pt): { v: Pt; len: number } => {
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const len = Math.hypot(dx, dy) || 1;
      return { v: [dx / len, dy / len], len };
    };
    const a = toward(prev);
    const b = toward(next);
    const r = Math.min(radius, a.len / 2, b.len / 2);
    const start: Pt = [p[0] + a.v[0] * r, p[1] + a.v[1] * r];
    const end: Pt = [p[0] + b.v[0] * r, p[1] + b.v[1] * r];
    d += `${i === 0 ? "M" : "L"}${start[0].toFixed(1)} ${start[1].toFixed(1)}`;
    d += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${end[0].toFixed(1)} ${end[1].toFixed(1)}`;
  }
  return d + "Z";
}

export function ArchCarousel() {
  const bandRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Ten cards from the photographs we have, repeating so the loop never ends.
  const cards = Array.from(
    { length: COUNT },
    (_, i) => FILM_PANELS[i % FILM_PANELS.length]
  );

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = band.clientWidth;
    let phone = width <= 820;
    let unitsW = phone ? 640 : 1440;
    let s = width / unitsW;
    let bandH = phone ? 250 : 470 * s;

    const state = {
      offset: 0,
      vel: 0,
      dragging: false,
      lastX: 0,
      lastT: 0,
      visible: true,
    };

    function measure() {
      width = band!.clientWidth;
      phone = width <= 820;
      unitsW = phone ? 640 : 1440;
      s = width / unitsW;
      bandH = phone ? 250 : 470 * s;
      band!.style.height = `${bandH}px`;
    }

    function layout() {
      const half = unitsW / 2;
      const span = half - 14; // the distance the arch is normalised against
      const cy0 = bandH / s / 2;

      for (let i = 0; i < COUNT; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const t = ((((i * PITCH + state.offset + LOOP / 2) % LOOP) + LOOP) % LOOP) - LOOP / 2;
        const x = half + t * (1 + 0.083 * Math.pow(t / span, 2));
        const d = Math.min(Math.abs(x - half) / span, 1.4);
        const w = 170 + 48 * d * d;
        const cy = cy0 - 12 * d * d;

        const edge = (ex: number) => {
          const q = Math.min(Math.abs(ex - half) / span, 1.4);
          return 280 + 92 * Math.pow(q, 2.6);
        };
        const hl = edge(x - w / 2);
        const hr = edge(x + w / 2);

        const pts: Pt[] = [
          [x - w / 2, cy - hl / 2],
          [x + w / 2, cy - hr / 2],
          [x + w / 2, cy + hr / 2],
          [x - w / 2, cy + hl / 2],
        ];
        const minX = x - w / 2;
        const minY = Math.min(pts[0][1], pts[1][1]);
        const maxY = Math.max(pts[2][1], pts[3][1]);

        const local = pts.map((p): Pt => [(p[0] - minX) * s, (p[1] - minY) * s]);

        el.style.left = `${minX * s}px`;
        el.style.top = `${minY * s}px`;
        el.style.width = `${w * s}px`;
        el.style.height = `${(maxY - minY) * s}px`;
        el.style.clipPath = `path('${roundedQuad(local, CORNER * s)}')`;
      }
    }

    let raf = 0;
    let prev = performance.now();
    function frame(now: number) {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      if (state.visible) {
        if (!state.dragging) {
          state.offset += ((reduce ? 0 : AUTO_SPEED) + state.vel) * dt;
          // Coasting fades out quickly: about 95% of it is gone each second.
          state.vel *= Math.pow(0.05, dt);
        }
        layout();
      }
      raf = requestAnimationFrame(frame);
    }

    measure();
    layout();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      measure();
      layout();
    });
    ro.observe(band);

    const io = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        prev = performance.now();
      },
      { threshold: 0 }
    );
    io.observe(band);

    function down(e: PointerEvent) {
      state.dragging = true;
      state.lastX = e.clientX;
      state.lastT = performance.now();
      state.vel = 0;
      band!.setPointerCapture(e.pointerId);
      band!.style.cursor = "grabbing";
    }
    function move(e: PointerEvent) {
      if (!state.dragging) return;
      const now = performance.now();
      const dx = (e.clientX - state.lastX) / s;
      const dt = Math.max((now - state.lastT) / 1000, 0.001);
      state.offset += dx; // the row follows the pointer 1:1
      state.vel = state.vel * 0.7 + (dx / dt) * 0.3;
      state.lastX = e.clientX;
      state.lastT = now;
    }
    function up(e: PointerEvent) {
      if (!state.dragging) return;
      state.dragging = false;
      band!.style.cursor = "grab";
      if (band!.hasPointerCapture(e.pointerId)) band!.releasePointerCapture(e.pointerId);
    }

    band.addEventListener("pointerdown", down);
    band.addEventListener("pointermove", move);
    band.addEventListener("pointerup", up);
    band.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      band.removeEventListener("pointerdown", down);
      band.removeEventListener("pointermove", move);
      band.removeEventListener("pointerup", up);
      band.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div
      ref={bandRef}
      role="group"
      aria-label="Pieces from the shop. Drag to look through them."
      className="relative mx-auto w-full max-w-[1440px] cursor-grab select-none overflow-hidden"
      style={{ touchAction: "pan-y", height: 250 }}
    >
      {cards.map((panel, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="absolute bg-neutral-soft will-change-[clip-path]"
        >
          <Image
            src={panel.src}
            alt={i < FILM_PANELS.length ? panel.alt : ""}
            aria-hidden={i >= FILM_PANELS.length}
            fill
            draggable={false}
            sizes="(max-width: 820px) 40vw, 320px"
            className="pointer-events-none object-cover"
            style={{ objectPosition: panel.focus }}
            priority={i < 4}
          />
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/45 px-2.5 py-1 text-[0.62rem] font-medium text-white backdrop-blur-md">
            {categoryOf(panel.category).label}
          </span>
        </div>
      ))}
    </div>
  );
}
