"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import type { Project } from "@/lib/projects";
import CustomCursor from "./CustomCursor";

type DetailSheetConfig = {
  id: string;
  width: number;
  totalHeight: number;
  parts: number;
  alt: string;
};

const detailSheets: Partial<Record<string, DetailSheetConfig>> = {
  "01": { id: "01", width: 3840, totalHeight: 15118, parts: 7, alt: "온담 베이커리 카페 브랜딩 프로젝트 전체 상세 페이지" },
  "02": { id: "02", width: 3840, totalHeight: 31878, parts: 15, alt: "오늘까지 유통기한 관리 애플리케이션 프로젝트 전체 상세 페이지" },
  "03": { id: "03", width: 3095, totalHeight: 32768, parts: 16, alt: "포멜 펫푸드 브랜드 프로젝트 전체 상세 페이지" },
  "04": { id: "04", width: 3840, totalHeight: 16120, parts: 8, alt: "키아베 코스메틱 브랜드 프로젝트 전체 상세 페이지" },
  "05": { id: "05", width: 3840, totalHeight: 19440, parts: 9, alt: "이지바이오 농업 기술 웹사이트 프로젝트 전체 상세 페이지" },
};

function ProjectDetailSheet({ config }: { config: DetailSheetConfig }) {
  const sliceHeight = 2160;

  return <div className="project-sheet-stack">
    {Array.from({ length: config.parts }, (_, index) => {
      const height = Math.min(sliceHeight, config.totalHeight - index * sliceHeight);
      const part = String(index + 1).padStart(2, "0");
      return <Image
        key={part}
        src={`/images/project-details/${config.id}/part-${part}.webp`}
        alt={index === 0 ? config.alt : ""}
        width={config.width}
        height={height}
        sizes="100vw"
        unoptimized
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        className="project-sheet project-sheet-figma"
      />;
    })}
  </div>;
}

export default function ProjectViewer({ project, onClose, returnScrollY }: { project: Project; onClose: () => void; returnScrollY: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const detailSheet = detailSheets[project.id];
  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(dialog.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.3, onComplete: onClose });
  };

  useLayoutEffect(() => {
    const node = dialog.current!;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    node.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    const tween = gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.45, ease: "power3.out" });
    return () => {
      tween.kill(); gsap.killTweensOf(node); node.close();
      document.body.style.overflow = previous;
      window.scrollTo({ top: returnScrollY, behavior: "instant" });
    };
  }, []);

  return <dialog ref={dialog} className="project-viewer image-only-viewer" aria-label={`프로젝트 ${project.id} — ${project.title}`} onCancel={event => { event.preventDefault(); requestClose(); }}>
    <CustomCursor />
    <button data-cursor="close" onClick={requestClose} className="image-viewer-close" aria-label="상세 이미지 닫기">✕</button>
    {detailSheet ? <ProjectDetailSheet config={detailSheet} /> : <div className="viewer-content viewer-heading"><span className="eyebrow">PROJECT {project.id}</span><h1>{project.title}</h1><p>{project.summary}</p><p>프로젝트 이미지를 준비 중입니다.</p></div>}
  </dialog>;
}







