"use client";

import { useLayoutEffect, useRef } from "react";
import PomelPortfolio from "./PomelPortfolio";
import { gsap } from "gsap";
import type { Project } from "@/lib/projects";
import CustomCursor from "./CustomCursor";

export default function ProjectViewer({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(dialog.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.3, onComplete: onClose });
  };

  useLayoutEffect(() => {
    const node = dialog.current!;
    const scrollY = window.scrollY;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    node.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    const tween = gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.45, ease: "power3.out" });
    return () => {
      tween.kill(); gsap.killTweensOf(node); node.close();
      document.body.style.overflow = previous;
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, []);

  return <dialog ref={dialog} className="project-viewer image-only-viewer" aria-label={`프로젝트 ${project.id} — ${project.title}`} onCancel={event => { event.preventDefault(); requestClose(); }}>
    <CustomCursor />
    <button data-cursor="close" onClick={requestClose} className="image-viewer-close" aria-label="상세 이미지 닫기">✕</button>
    {project.id === "01" ? <PomelPortfolio /> : <div className="viewer-content viewer-heading"><span className="eyebrow">PROJECT {project.id}</span><h1>{project.title}</h1><p>{project.summary}</p><p>프로젝트 이미지를 준비 중입니다.</p></div>}
  </dialog>;
}
