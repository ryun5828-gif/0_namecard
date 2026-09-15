"use client";

import { useEffect, useRef } from "react";

let lastPointerX = -100;
let lastPointerY = -100;
let pointerWasSeen = false;
let cursorOwners = 0;

const acquireCursor = () => {
  cursorOwners += 1;
  document.documentElement.classList.add("custom-cursor-enabled");
};

const releaseCursor = () => {
  cursorOwners = Math.max(0, cursorOwners - 1);
  if (cursorOwners === 0) document.documentElement.classList.remove("custom-cursor-enabled");
};

export default function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (hover: hover)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (!media.matches || !root.current || !dot.current || !ring.current) return;

      acquireCursor();
      let active = true;
      let x = lastPointerX;
      let y = lastPointerY;
      let rx = lastPointerX;
      let ry = lastPointerY;
      let frame = 0;
      let target: HTMLElement | null = null;

      if (pointerWasSeen && root.current) root.current.style.opacity = "1";

      const move = (event: PointerEvent) => {
        x = event.clientX;
        y = event.clientY;
        lastPointerX = x;
        lastPointerY = y;
        pointerWasSeen = true;
        if (root.current) root.current.style.opacity = "1";
      };
      const hide = () => { if (root.current) root.current.style.opacity = "0"; };
      const show = () => { if (pointerWasSeen && root.current) root.current.style.opacity = "1"; };
      const tick = () => {
        const next = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cursor], a, button") ?? null;
        if (next !== target) {
          target = next;
          if (root.current) root.current.dataset.state = target?.dataset.cursor ?? (target ? "link" : "default");
        }
        let tx = x;
        let ty = y;
        if (target && (!target.dataset.cursor || target.dataset.cursor === "link")) {
          const bounds = target.getBoundingClientRect();
          tx += (bounds.left + bounds.width / 2 - x) * 0.16;
          ty += (bounds.top + bounds.height / 2 - y) * 0.16;
        }
        rx += (tx - rx) * 0.17;
        ry += (ty - ry) * 0.17;
        if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        frame = requestAnimationFrame(tick);
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerdown", move, true);
      document.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);
      window.addEventListener("focus", show);
      frame = requestAnimationFrame(tick);

      cleanup = () => {
        if (!active) return;
        active = false;
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerdown", move, true);
        document.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
        window.removeEventListener("focus", show);
        releaseCursor();
        hide();
      };
    };

    setup();
    media.addEventListener("change", setup);
    return () => {
      cleanup();
      media.removeEventListener("change", setup);
    };
  }, []);

  return <div ref={root} className="custom-cursor" data-state="default" aria-hidden="true">
    <div ref={dot} className="cursor-dot"><i /></div>
    <div ref={ring} className="cursor-ring"><div className="cursor-disc"><span className="cursor-view">VIEW ↗</span><span className="cursor-close">✕ CLOSE</span></div></div>
  </div>;
}