"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";
import gsap from "gsap";

type FlyContext = {
  /** Registers the navbar cart button so bursts know where to land. */
  registerCart: (el: HTMLElement | null) => void;
  /** Throws a handful of beads from `origin` to the cart. */
  fly: (origin: HTMLElement, colours: string[]) => void;
};

const Fly = createContext<FlyContext | null>(null);

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const cartRef = useRef<HTMLElement | null>(null);

  const registerCart = useCallback((el: HTMLElement | null) => {
    cartRef.current = el;
  }, []);

  const fly = useCallback((origin: HTMLElement, colours: string[]) => {
    const cart = cartRef.current;
    if (!cart) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pulse(cart);
      return;
    }

    // Read both rects at throw time, so a resize or scroll since mount cannot
    // send the beads to where the cart used to be.
    const from = origin.getBoundingClientRect();
    const to = cart.getBoundingClientRect();

    const start = { x: from.left + from.width / 2, y: from.top + from.height / 2 };
    const end = { x: to.left + to.width / 2, y: to.top + to.height / 2 };

    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:80;contain:strict";
    document.body.appendChild(layer);

    const count = 10;
    const beads: HTMLElement[] = [];

    for (let i = 0; i < count; i++) {
      const bead = document.createElement("span");
      const size = 7 + Math.random() * 6;
      const colour = colours[i % colours.length];
      bead.style.cssText = `
        position:absolute;left:0;top:0;width:${size}px;height:${size}px;
        border-radius:50%;
        background:radial-gradient(circle at 32% 30%, #fff 0%, ${colour} 46%, rgba(0,0,0,0.35) 100%);
        box-shadow:0 0 ${size}px ${colour}88, inset 0 -1px 2px rgba(0,0,0,0.3);
        will-change:transform,opacity;
      `;
      layer.appendChild(bead);
      beads.push(bead);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        layer.remove();
      },
    });

    beads.forEach((bead, i) => {
      // Burst outward first, with gravity, then converge on the cart. The
      // control point sits above the midpoint so the path arcs rather than
      // running straight, and each bead gets its own arc height.
      const spreadAngle = (i / count) * Math.PI * 2;
      const spread = 46 + Math.random() * 54;
      const burstX = start.x + Math.cos(spreadAngle) * spread;
      const burstY = start.y + Math.sin(spreadAngle) * spread * 0.6 + 18;

      const arcLift = 90 + Math.random() * 70;
      const midX = (burstX + end.x) / 2 + (Math.random() - 0.5) * 60;
      const midY = Math.min(burstY, end.y) - arcLift;

      gsap.set(bead, { x: start.x, y: start.y, scale: 0.3, opacity: 0 });

      tl.to(
        bead,
        {
          keyframes: [
            { x: burstX, y: burstY, scale: 1, opacity: 1, duration: 0.28, ease: "power2.out" },
            {
              // Bezier-ish arc via two eased segments through the control point.
              x: midX,
              y: midY,
              duration: 0.34,
              ease: "power1.inOut",
            },
            {
              x: end.x,
              y: end.y,
              scale: 0.35,
              opacity: 0.9,
              duration: 0.4,
              ease: "power2.in",
            },
          ],
        },
        i * 0.028
      );
    });

    // The impact fires when the last bead lands, not on a guessed delay.
    tl.add(() => pulse(cart), ">-0.05");
  }, []);

  return <Fly.Provider value={{ registerCart, fly }}>{children}</Fly.Provider>;
}

/** The cart catches the beads: a quick squash-and-settle plus a radial wave. */
function pulse(cart: HTMLElement) {
  gsap.fromTo(
    cart,
    { scale: 1 },
    {
      keyframes: [
        { scale: 1.2, duration: 0.14, ease: "power2.out" },
        { scale: 0.95, duration: 0.12, ease: "power2.inOut" },
        { scale: 1, duration: 0.22, ease: "elastic.out(1, 0.5)" },
      ],
    }
  );

  const rect = cart.getBoundingClientRect();
  const wave = document.createElement("span");
  wave.setAttribute("aria-hidden", "true");
  wave.style.cssText = `
    position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;
    width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;
    border:2px solid #c9a9e0;pointer-events:none;z-index:79;
  `;
  document.body.appendChild(wave);

  gsap.to(wave, {
    scale: 9,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => wave.remove(),
  });
}

export function useFlyToCart() {
  const ctx = useContext(Fly);
  if (!ctx) throw new Error("useFlyToCart must be used inside FlyToCartProvider");
  return ctx;
}
