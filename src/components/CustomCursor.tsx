"use client";

import { useEffect, useRef } from "react";

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
      document.documentElement.classList.add("custom-cursor-enabled");
      let x = -100, y = -100, rx = -100, ry = -100, frame = 0;
      let target: HTMLElement | null = null;
      const move = (event: PointerEvent) => {
        x = event.clientX; y = event.clientY;
        if (root.current) root.current.style.opacity = "1";
      };
      const hide = () => { if (root.current) root.current.style.opacity = "0"; };
      const tick = () => {
        // Hit-test on every frame so the cursor also changes when the track moves beneath it.
        const next = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cursor], a, button") ?? null;
        if (next !== target) {
          target = next;
          if (root.current) root.current.dataset.state = target?.dataset.cursor ?? (target ? "link" : "default");
        }
        let tx = x, ty = y;
        if (target && (!target.dataset.cursor || target.dataset.cursor === "link")) {
          const bounds = target.getBoundingClientRect();
          tx += (bounds.left + bounds.width / 2 - x) * 0.16;
          ty += (bounds.top + bounds.height / 2 - y) * 0.16;
        }
        rx += (tx - rx) * 0.17; ry += (ty - ry) * 0.17;
        if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        frame = requestAnimationFrame(tick);
      };
      window.addEventListener("pointermove", move);
      document.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);
      frame = requestAnimationFrame(tick);
      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
        document.documentElement.classList.remove("custom-cursor-enabled");
        hide();
      };
    };
    setup(); media.addEventListener("change", setup);
    return () => { cleanup(); media.removeEventListener("change", setup); };
  }, []);

  return <div ref={root} className="custom-cursor" data-state="default" aria-hidden="true">
    <div ref={dot} className="cursor-dot"><i /></div>
    <div ref={ring} className="cursor-ring"><div className="cursor-disc"><span className="cursor-view">VIEW ↗</span><span className="cursor-close">✕ CLOSE</span></div></div>
  </div>;
}
