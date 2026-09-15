"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomCursor from "./CustomCursor";
import ProjectViewer from "./ProjectViewer";
import FigmaOdysseyPanoramaLayers from "./StaticFigmaSchoolScene";
import { projects, type Project } from "@/lib/projects";

const zones = ["ORIGIN", "ODYSSEY", "ABOUT", "WORKS", "CONTACT"];
const clamp = (n: number, low = 0, high = 1) => Math.min(high, Math.max(low, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
// Replace this placeholder with your real address before publishing.
const EMAIL = "hello@example.com";

export default function HorizontalStream() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const viewerReturnY = useRef(0);
  const trigger = useRef<ScrollTrigger | null>(null);
  const jumpTween = useRef<gsap.core.Tween | null>(null);
  const zoneOffsets = useRef<number[]>([]);
  const maxTrackDistance = useRef(1);
  const [activeZone, setActiveZone] = useState(0);
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);
  const [openedProject, setOpenedProject] = useState<Project | null>(null);
  const [emailStatus, setEmailStatus] = useState("");

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = viewport.current!;
    const rail = track.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastZone = -1;
    const schoolScenes = Array.from(root.querySelectorAll<HTMLElement>(".odyssey-scene"));
    let schoolStarts: number[] = [];
    let schoolWidths: number[] = [];
    const actor = root.querySelector<HTMLElement>(".journey-actor")!;
    const ballSlot = root.querySelector<HTMLElement>(".actor-ball")!;
    const zero = root.querySelector<HTMLElement>(".origin-zero")!;
    let ballSize = 46;
    let ballOffset = 118;
    let actorStartX = 0;
    let groundY = 0;
    let zeroHeight = 0;
    let zeroCenterY = 0;
    let zeroCenterX = 0;
    let zeroStartX = 0;
    let storyStart = 0;
    const measureSchools = () => {
      const railLeft = rail.getBoundingClientRect().left;
      schoolStarts = schoolScenes.map(scene => scene.getBoundingClientRect().left - railLeft);
      schoolWidths = schoolScenes.map(scene => scene.offsetWidth);
      zoneOffsets.current = zones.map(zone => root.querySelector<HTMLElement>(`#${zone.toLowerCase()}`)!.offsetLeft);
      maxTrackDistance.current = Math.max(1, rail.scrollWidth - root.clientWidth);
      storyStart = root.querySelector<HTMLElement>(".origin-story")!.offsetLeft;
      ballSize = ballSlot.offsetWidth;
      ballOffset = ballSlot.offsetLeft + ballSize / 2;
      actorStartX = actor.offsetLeft;
      groundY = actor.offsetTop + actor.offsetHeight - ballSize / 2;
      zeroHeight = zero.offsetHeight;
      const zeroAnchor = zero.parentElement!;
      const originStage = zeroAnchor.parentElement!;
      const stageBounds = originStage.getBoundingClientRect();
      zeroCenterX = stageBounds.left - railLeft + zeroAnchor.offsetLeft + zero.offsetLeft + zero.offsetWidth / 2;
      zeroStartX = zeroCenterX - storyStart;
      zeroCenterY = stageBounds.top - root.getBoundingClientRect().top + zeroAnchor.offsetTop + zero.offsetTop + zeroHeight / 2;
    };
    measureSchools();
    const context = gsap.context(() => {
      const render = (progress: number) => {
        const w = root.clientWidth;
        const distance = progress * (rail.scrollWidth - w);
        const current = zoneOffsets.current.reduce((acc, start, index) => distance >= start - w * 0.35 ? index : acc, 0);
        if (current !== lastZone) { lastZone = current; setActiveZone(current); }
        gsap.set(progressBar.current, { scaleX: progress });
        gsap.set(".works-pin", { x: clamp(distance - zoneOffsets.current[3], 0, 1.5 * w) });
        const journeyStart = schoolStarts[0];
        const journeyEnd = zoneOffsets.current[2];
        // Slow to a stop inside the high-school scene, before About reaches the actor.
        const stopAt = journeyEnd - w * 0.75;
        const slowFrom = stopAt - w * 0.2;
        const slowing = clamp((distance - slowFrom) / (stopAt - slowFrom));
        const travelDistance = distance < slowFrom ? distance
          : slowFrom + (stopAt - slowFrom) * (slowing - slowing * slowing / 2);
        const journey = clamp((travelDistance - journeyStart) / (journeyEnd - journeyStart));
        const actorX = journey * w * 0.53;
        const actorPosition = distance + actorStartX + actorX;
        const exit = 1 - smooth((distance - stopAt) / (w * 0.2));
        const entranceStart = journeyStart - w * 0.18;
        const entrance = smooth((distance - entranceStart) / (w * 0.09));
        const middleBlend = smooth((actorPosition - (schoolStarts[1] - w * 0.045)) / (w * 0.09));
        const highBlend = smooth((actorPosition - (schoolStarts[2] - w * 0.045)) / (w * 0.09));
        const highLocal = clamp((actorPosition - schoolStarts[2]) / Math.max(1, schoolWidths[2]));
        const highSecondBlend = smooth((highLocal - 0.2) / 0.12);
        const universityBlend = smooth((highLocal - 0.38) / 0.12);
        gsap.set(actor, { x: actorX, autoAlpha: entrance * exit });
        gsap.set(".actor-elementary", { autoAlpha: 1 - middleBlend, x: -12 * middleBlend, y: reduced ? 0 : 10 * (1 - entrance), scale: 1 - middleBlend * 0.025 });
        gsap.set(".actor-middle", { autoAlpha: middleBlend * (1 - highBlend), x: 12 * (1 - middleBlend) - 12 * highBlend, scale: 0.975 + middleBlend * 0.025 - highBlend * 0.025 });
        gsap.set(".actor-high", { autoAlpha: highBlend * (1 - highSecondBlend), x: 12 * (1 - highBlend) - 10 * highSecondBlend, scale: 0.975 + highBlend * 0.025 - highSecondBlend * 0.02 });
        gsap.set(".actor-high-second", { autoAlpha: highSecondBlend * (1 - universityBlend), x: 10 * (1 - highSecondBlend) - 10 * universityBlend, scale: 0.98 + highSecondBlend * 0.02 - universityBlend * 0.02 });
        gsap.set(".actor-university", { autoAlpha: universityBlend, x: 10 * (1 - universityBlend), scale: 0.98 + universityBlend * 0.02 });

        // One ball stays in viewport coordinates throughout the hand-off.
        // The number follows the same center while shrinking into the football.
        const approach = clamp((distance - storyStart) / Math.max(1, journeyStart - storyStart));
        const morph = smooth((approach - 0.12) / 0.58);
        const travel = smooth(approach / 0.9);
        const drop = smooth((approach - 0.12) / 0.62);
        const bounce = reduced ? 0 : Math.sin(clamp((approach - 0.72) / 0.28) * Math.PI) * Math.min(32, root.clientHeight * 0.04);
        const targetBallX = actorStartX + ballOffset;
        const ballX = distance < journeyStart ? zeroStartX + (targetBallX - zeroStartX) * travel : actorStartX + actorX + ballOffset;
        const ballY = zeroCenterY + (groundY - zeroCenterY) * drop - bounce;
        const reveal = smooth((approach - 0.18) / 0.45);
        const size = zeroHeight * 0.72 + (ballSize - zeroHeight * 0.72) * morph;
        const rotation = reduced ? 0 : ((distance - storyStart + ballX - zeroStartX) / (Math.PI * ballSize)) * 360;
        gsap.set(zero, {
          x: distance <= storyStart ? 0 : distance + ballX - zeroCenterX, y: ballY - zeroCenterY,
          scale: 1 + (ballSize / zeroHeight - 1) * morph,
          rotation: reduced ? 0 : travel * 240, autoAlpha: 1 - reveal,
        });
        gsap.set(".origin-ball", {
          x: ballX - ballSize / 2, y: ballY - ballSize / 2,
          width: ballSize, height: ballSize, scale: size / ballSize,
          rotation, autoAlpha: reveal * (1 - middleBlend) * exit,
        });
        root.querySelectorAll<HTMLElement>(".odyssey-scene").forEach((scene, index) => {
          const local = (distance - schoolStarts[index]) / w;
          const collageBack = scene.querySelector(".collage-back");
          if (collageBack) gsap.set(collageBack, { x: reduced ? 0 : local * w * 0.055 });
          const collageFront = scene.querySelector(".collage-front");
          if (collageFront) gsap.set(collageFront, { x: reduced ? 0 : -local * w * 0.08 });
        });
      };
      const animation = gsap.to(rail, {
        x: () => -(rail.scrollWidth - root.clientWidth), ease: "none",
        onUpdate() { render(this.progress()); },
        scrollTrigger: {
          trigger: root, start: "top top", end: () => `+=${rail.scrollWidth - root.clientWidth}`,
          pin: true, scrub: reduced ? true : 1.2, invalidateOnRefresh: true,
          onRefresh: self => { measureSchools(); render(self.animation?.progress() ?? self.progress); },
        },
      });
      trigger.current = animation.scrollTrigger!;
      render(animation.progress());
    }, root);
    const cancelJump = () => jumpTween.current?.kill();
    const wheel = (event: WheelEvent) => {
      cancelJump();
      if (document.querySelector("dialog[open]") || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      window.scrollBy(0, event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerWidth : 1));
    };
    const keyboard = (event: KeyboardEvent) => {
      if (document.querySelector("dialog[open]") || event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.target as HTMLElement).closest("button, a, input, textarea, select")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault(); cancelJump();
        window.scrollBy({ top: window.innerWidth * (event.key === "ArrowRight" ? 0.35 : -0.35), behavior: reduced ? "instant" : "smooth" });
      }
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("touchstart", cancelJump, { passive: true });
    window.addEventListener("keydown", keyboard);
    return () => {
      jumpTween.current?.kill(); context.revert(); trigger.current = null;
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchstart", cancelJump);
      window.removeEventListener("keydown", keyboard);
    };
  }, []);

  const goTo = (index: number) => {
    const st = trigger.current;
    if (!st) return;
    jumpTween.current?.kill();
    const position = { y: window.scrollY };
    jumpTween.current = gsap.to(position, {
      y: st.start + clamp(zoneOffsets.current[index] / maxTrackDistance.current) * (st.end - st.start), duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1.1, ease: "power2.inOut",
      onUpdate: () => window.scrollTo({ top: position.y, behavior: "instant" }),
    });
  };

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setEmailStatus(`이메일을 복사했습니다: ${EMAIL} (임시 주소)`); }
    catch { setEmailStatus(`복사할 이메일: ${EMAIL} (임시 주소)`); }
  };

  const focusProject = (project: Project, button: HTMLButtonElement) => {
    setActiveProject(project);
    if (viewport.current) viewport.current.scrollLeft = 0;
    const bounds = button.getBoundingClientRect();
    const st = trigger.current;
    if (st && (bounds.left < window.innerWidth * 0.28 || bounds.right > window.innerWidth + 2)) {
      jumpTween.current?.kill();
      const targetDistance = zoneOffsets.current[3] + window.innerWidth * Math.min(1.5, (Number(project.id) - 1) * 0.359);
      window.scrollTo({ top: st.start + clamp(targetDistance / maxTrackDistance.current) * (st.end - st.start), behavior: "instant" });
    }
  };

  return <>
    {!openedProject && <CustomCursor />}
    <div className="site-shell" inert={openedProject ? true : undefined}>
      <header className="site-header"><div className="header-center"><span>PORTFOLIO</span><span>2026</span></div></header>
      <main ref={viewport} className="stream-viewport" aria-label="가로로 이어지는 포트폴리오. 휠 또는 하단 메뉴로 이동하세요.">
        <div ref={track} className="stream-track">
          <section id="origin" className="zone origin" aria-labelledby="origin-heading">
            <div className="origin-stage origin-figma-stage" data-figma-node="809:4082">
              <Image src="/images/origin-figma-paper.png" alt="" fill sizes="100vw" className="origin-figma-paper" priority />
              <div className="origin-writing-layer origin-writing-prefix"><Image src="/images/origin-figma-prefix.png" alt="저는" fill sizes="18vw" /></div>
              <div className="origin-writing-layer origin-writing-zero"><Image src="/images/origin-figma-zero.png" alt="0점" fill sizes="28vw" /></div>
              <div className="origin-writing-layer origin-writing-suffix"><Image src="/images/origin-figma-suffix.png" alt="이었습니다." fill sizes="21vw" /></div>
            </div>
            <h1 id="origin-heading" className="visually-hidden">한륜희 디자인 포트폴리오</h1>
          </section>

          <section className="zone origin-story" aria-label="0점에서 시작한 디자이너의 이야기">
            <div className="origin-stage">
              <Image src="/images/origin-story.png" alt="점수로 설명되지 않았던 어린 시절과 0에서 새로운 것을 만드는 디자이너 한륜희의 이야기" fill sizes="100vw" className="origin-page-image" priority />
            <div className="origin-zero-anchor" aria-hidden="true"><Image src="/images/origin-zero.png" alt="" width={207} height={234} className="origin-zero" /></div>
            </div>
          </section>

          <section id="odyssey" className="zone odyssey" aria-label="01 Odyssey — 초등, 중학, 고등">
            <div className="odyssey-panorama-stage" aria-hidden="true">
              <FigmaOdysseyPanoramaLayers />
              <div className="elementary-scene-art">
                <div className="elementary-stage">
                  <Image src="/images/elementary-background.png" alt="" fill sizes="100vw" className="elementary-background" priority />
                  <div className="elementary-cloud elementary-cloud-1"><Image src="/images/elementary-cloud-1.png" alt="" fill sizes="18vw" /></div>
                  <div className="elementary-cloud elementary-cloud-2"><Image src="/images/elementary-cloud-2.png" alt="" fill sizes="20vw" /></div>
                  <div className="elementary-sun"><Image src="/images/elementary-sun.png" alt="" fill sizes="23vw" /></div>
                  <Image src="/images/elementary-mountain.png" alt="" fill sizes="100vw" className="elementary-mountain" priority />
                  <div className="elementary-school"><Image src="/images/elementary-school.png" alt="" fill sizes="67vw" /></div>
                  <div className="elementary-cherry-tree">
                    <Image src="/images/elementary-cherry-tree.png" alt="" fill sizes="18vw" className="elementary-cherry-trunk" />
                    <Image src="/images/elementary-cherry-tree.png" alt="" fill sizes="18vw" className="elementary-cherry-crown" />
                  </div>
                  <div className="elementary-bars"><Image src="/images/elementary-bars.png" alt="" fill sizes="30vw" /></div>
                  <div className="elementary-flower-2 wind-sway wind-sway-strong"><Image src="/images/elementary-flower-2.png" alt="" fill sizes="7vw" /></div>
                  <div className="elementary-field"><Image src="/images/elementary-field.png" alt="" fill sizes="50vw" /></div>
                  <div className="elementary-flower-1 wind-sway wind-sway-strong wind-sway-medium"><Image src="/images/elementary-flower-1.png" alt="" fill sizes="7vw" /></div>
                  <div className="elementary-grass-1 wind-sway wind-sway-strong wind-sway-quick"><Image src="/images/elementary-grass-1.png" alt="" fill sizes="10vw" /></div>
                  <div className="elementary-tree wind-sway wind-sway-slow"><Image src="/images/elementary-tree.png" alt="" fill sizes="37vw" /></div>
                </div>

              </div>
            </div>
            {[{ title: "초등학교 시절", style: "elementary" }, { title: "중학교 시절", style: "middle" }, { title: "고등학생 시절", style: "high" }].map(scene => <div key={scene.title} className={`odyssey-scene scene-${scene.style}`} aria-label={scene.title} />)}
          </section>

          <section id="about" className="zone about-image-zone" aria-label="디자이너 한륜희 소개">
            <Image src="/images/profile-han-ryun-hee.svg" alt="디자이너 한륜희 프로필. 아이디어를 기획하고 브랜드 아이덴티티, UI/UX와 웹 디자인으로 구현합니다." width={1920} height={1080} sizes="100vw" className="profile-sheet" />
          </section>

          <section id="works" className="zone works" aria-labelledby="works-heading">
            <aside className="works-pin"><span className="eyebrow">03 / SELECTED WORKS</span><h2 id="works-heading" className="works-title-image"><Image src="/images/works-title-handwritten.png" alt="Thoughts, made real." width={1279} height={654} sizes="22vw" /></h2><div key={activeProject.id} className="project-description"><span className="project-count">{activeProject.id}<span> / 06</span></span><h3>{activeProject.title}</h3><span className="eyebrow">{activeProject.category}</span><p>{activeProject.summary}</p></div><p className="works-hint"><span>↗</span> HOVER TO DISCOVER<br />CLICK TO EXPLORE</p></aside>
            <div className="works-rail">{projects.map(project => <button key={project.id} className={`work-card ${activeProject.id === project.id ? "is-active" : ""}`} data-cursor="work" onDragStart={event => event.preventDefault()} onContextMenu={event => event.preventDefault()} onPointerEnter={() => setActiveProject(project)} onFocus={event => focusProject(project, event.currentTarget)} onClick={event => { jumpTween.current?.kill(); viewerReturnY.current = window.scrollY; opener.current = event.currentTarget; setOpenedProject(project); }} aria-label={`${project.title} 프로젝트 상세 보기`}>
              <div className={`card-visual rounded-xl ${project.tone}`}>{project.id === "01" ? <Image src="/images/project-01.png" alt="FORM & FIELD 프로젝트 대표 이미지" fill sizes="(max-width: 800px) 50vw, 38vw" className="work-image" /> : project.id === "02" ? <Image src="/images/project-02.png" alt="BETWEEN US 프로젝트 대표 이미지" fill sizes="(max-width: 800px) 50vw, 38vw" className="work-image" /> : project.id === "03" ? <Image src="/images/project-03.png" alt="OFF THE GRID 프로젝트 대표 이미지" fill sizes="(max-width: 800px) 50vw, 38vw" className="work-image" /> : project.id === "04" ? <Image src="/images/project-04.png" alt="A NEW INPUT 프로젝트 대표 이미지" fill sizes="(max-width: 800px) 50vw, 38vw" className="work-image" /> : project.id === "05" ? <Image src="/images/project-05-card.png" alt="EVERYDAY TYPE 프로젝트 대표 이미지" fill sizes="(max-width: 800px) 50vw, 38vw" className="work-image" /> : <><span className="card-ghost-number">{project.id}</span><span className="card-visual-label">{project.title}<small>이미지 준비 중</small></span></>}<div className="floating-object" aria-hidden="true">↗</div></div>
            </button>)}</div>
          </section>

          <section id="contact" className="zone contact" aria-labelledby="contact-heading"><div className="section-marker"><span>04 / CONTACT</span><span>THE NEXT CHAPTER IS OURS.</span></div><div className="contact-main"><span className="eyebrow">HAVE SOMETHING IN MIND?</span><h2 id="contact-heading">LET’S MAKE<br />SOMETHING<br /><span>REAL</span><span className="contact-arrow">↗</span></h2><div className="contact-actions"><button className="email-button" onClick={copyEmail}>SEND AN EMAIL <span>↗</span></button><span className="contact-note">좋은 대화에서 시작될 다음 이야기.</span></div><p className="email-status" role="status">{emailStatus}</p></div><div className="contact-footer"><span>© 2026 HAN RYUN HEE</span><div><span className="external-placeholder" aria-label="Instagram 링크 준비 중">INSTAGRAM ↗ <small>SOON</small></span><span className="external-placeholder" aria-label="Behance 링크 준비 중">BEHANCE ↗ <small>SOON</small></span></div><button onClick={() => goTo(0)}>BACK TO ORIGIN ↑</button></div></section>
        </div>
        <div className="origin-ball" aria-hidden="true"><Image src="/images/elementary-football.png" alt="" fill sizes="8vw" /></div>
        <div className="journey-actor" aria-hidden="true"><div className="actor-state actor-elementary"><div className="journey-child"><Image src="/images/elementary-girl.png" alt="" fill sizes="23vw" /></div><div className="actor-ball" /></div><div className="actor-state actor-middle"><div className="journey-person journey-middle"><Image src="/images/middle-student.png" alt="" fill sizes="22vw" /></div></div><div className="actor-state actor-high"><div className="journey-person journey-high"><Image src="/images/figma-odyssey/imgImage357.png" alt="" fill sizes="20vw" /></div></div><div className="actor-state actor-high-second"><div className="journey-person journey-high-second"><Image src="/images/high-student-2.png" alt="" fill sizes="20vw" /></div></div><div className="actor-state actor-university"><div className="journey-person journey-university"><Image src="/images/university-student.png" alt="" fill sizes="20vw" /></div></div></div>
      </main>
      <nav className={`bottom-nav${activeZone === 2 ? " bottom-nav-profile" : ""}`} aria-label="구역 탐색"><div className="progress-track"><div ref={progressBar} className="progress-fill" /></div><div className="nav-links">{zones.map((zone, index) => <a key={zone} href={`#${zone.toLowerCase()}`} aria-current={activeZone === index ? "location" : undefined} onClick={event => { event.preventDefault(); goTo(index); }}><span className="nav-index">0{index}.</span> {zone}<span className="nav-active-dot" /></a>)}</div></nav>
    </div>
    {openedProject && <ProjectViewer project={openedProject} returnScrollY={viewerReturnY.current} onClose={() => { setOpenedProject(null); requestAnimationFrame(() => opener.current?.focus({ preventScroll: true })); }} />}
  </>;
}









