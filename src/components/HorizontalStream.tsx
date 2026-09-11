"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomCursor from "./CustomCursor";
import ProjectViewer from "./ProjectViewer";
import { projects, type Project } from "@/lib/projects";

const zones = ["ORIGIN", "ODYSSEY", "ABOUT", "WORKS", "CONTACT"];
const positions = [0, 1, 3.5, 4.5, 7];
const clamp = (n: number, low = 0, high = 1) => Math.min(high, Math.max(low, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
// Replace this placeholder with your real address before publishing.
const EMAIL = "hello@example.com";

export default function HorizontalStream() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const jumpTween = useRef<gsap.core.Tween | null>(null);
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
    const schoolHeadings = Array.from(root.querySelectorAll<HTMLElement>(".odyssey-scene .era-caption"));
    let schoolStarts: number[] = [];
    const actor = root.querySelector<HTMLElement>(".journey-actor")!;
    const ballSlot = root.querySelector<HTMLElement>(".actor-ball")!;
    const zero = root.querySelector<HTMLElement>(".origin-zero")!;
    let ballSize = 46;
    let ballOffset = 118;
    let groundY = 0;
    let zeroHeight = 0;
    let zeroCenterY = 0;
    let friendOffset = 0;
    const measureSchools = () => {
      const railLeft = rail.getBoundingClientRect().left;
      schoolStarts = schoolHeadings.map(heading => heading.getBoundingClientRect().left - railLeft);
      ballSize = ballSlot.offsetWidth;
      ballOffset = ballSlot.offsetLeft + ballSize / 2;
      groundY = actor.offsetTop + actor.offsetHeight - ballSize / 2;
      zeroHeight = zero.offsetHeight;
      zeroCenterY = zero.parentElement!.offsetTop + zero.offsetTop + zeroHeight / 2;
      friendOffset = root.querySelector<HTMLElement>(".actor-friends .person-box")!.offsetLeft;
    };
    measureSchools();
    const context = gsap.context(() => {
      const render = (progress: number) => {
        const w = root.clientWidth;
        const distance = progress * (rail.scrollWidth - w);
        const unit = distance / w;
        const current = positions.reduce((acc, start, index) => unit >= start - 0.35 ? index : acc, 0);
        if (current !== lastZone) { lastZone = current; setActiveZone(current); }
        gsap.set(progressBar.current, { scaleX: progress });
        gsap.set(".works-pin", { x: clamp(distance - 4.5 * w, 0, 1.5 * w) });
        const journeyStart = schoolStarts[0];
        const journeyEnd = positions[2] * w;
        // Slow to a stop inside the high-school scene, before About reaches the actor.
        const stopAt = journeyEnd - w * 0.75;
        const slowFrom = stopAt - w * 0.2;
        const slowing = clamp((distance - slowFrom) / (stopAt - slowFrom));
        const travelDistance = distance < slowFrom ? distance
          : slowFrom + (stopAt - slowFrom) * (slowing - slowing * slowing / 2);
        const journey = clamp((travelDistance - journeyStart) / (journeyEnd - journeyStart));
        const actorX = journey * w * 0.53;
        const actorPosition = distance + actorX;
        const exit = 1 - smooth((distance - stopAt) / (w * 0.2));
        const entrance = smooth((distance - journeyStart) / (w * 0.14));
        const friendIn = smooth((actorPosition - schoolStarts[1]) / (w * 0.16));
        const aloneIn = smooth((actorPosition - schoolStarts[2]) / (w * 0.16));
        gsap.set(actor, { x: actorX, autoAlpha: entrance * exit });
        gsap.set(".actor-running", { autoAlpha: 1 - friendIn, y: reduced ? 0 : 10 * (1 - entrance) });
        gsap.set(".actor-friends", { x: -friendOffset, autoAlpha: friendIn * (1 - aloneIn), y: reduced ? 0 : 8 * (1 - friendIn) });
        gsap.set(".actor-alone", { autoAlpha: aloneIn, y: reduced ? 0 : 8 * (1 - aloneIn) });

        // One ball stays in viewport coordinates throughout the hand-off.
        // The number follows the same center while shrinking into the football.
        const approach = clamp(distance / journeyStart);
        const morph = smooth(approach / 0.36);
        const travel = smooth((approach - 0.3) / 0.7);
        const drop = smooth((approach - 0.3) / 0.42);
        const bounce = reduced ? 0 : Math.sin(clamp((approach - 0.72) / 0.28) * Math.PI) * Math.min(32, root.clientHeight * 0.04);
        const ballX = distance < journeyStart ? w / 2 + (ballOffset - w / 2) * travel : actorX + ballOffset;
        const ballY = zeroCenterY + (groundY - zeroCenterY) * drop - bounce;
        const reveal = smooth((approach - 0.13) / 0.2);
        const size = zeroHeight * 0.72 + (ballSize - zeroHeight * 0.72) * morph;
        const rotation = reduced ? 0 : ((distance + ballX - w / 2) / (Math.PI * ballSize)) * 360;
        gsap.set(zero, {
          x: distance + ballX - w / 2, y: ballY - zeroCenterY,
          scale: 1 + (ballSize / zeroHeight - 1) * morph,
          rotation: reduced ? 0 : morph * 90, autoAlpha: 1 - reveal,
        });
        gsap.set(".origin-ball", {
          x: ballX - ballSize / 2, y: ballY - ballSize / 2,
          width: ballSize, height: ballSize, scale: size / ballSize,
          rotation, autoAlpha: reveal * (1 - friendIn) * exit,
        });
        root.querySelectorAll<HTMLElement>(".odyssey-scene").forEach((scene, index) => {
          const local = unit - (1 + index * 2.5 / 3);
          gsap.set(scene.querySelector(".collage-back"), { x: reduced ? 0 : local * w * 0.055 });
          gsap.set(scene.querySelector(".collage-front"), { x: reduced ? 0 : -local * w * 0.08 });
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
      y: st.start + (positions[index] / 7) * (st.end - st.start), duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1.1, ease: "power2.inOut",
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
      const unit = 4.5 + Math.min(1.5, (Number(project.id) - 1) * 0.359);
      window.scrollTo({ top: st.start + unit / 7 * (st.end - st.start), behavior: "instant" });
    }
  };

  return <>
    {!openedProject && <CustomCursor />}
    <div className="site-shell" inert={openedProject ? true : undefined}>
      <header className="site-header"><div className="header-center"><span>PORTFOLIO</span><span>2026</span></div></header>
      <main ref={viewport} className="stream-viewport" aria-label="가로로 이어지는 포트폴리오. 휠 또는 하단 메뉴로 이동하세요.">
        <div ref={track} className="stream-track">
          <section id="origin" className="zone origin" aria-labelledby="origin-heading">
            <p className="era-caption">처음, 모든 것이 시작되던 순간</p>
            <div className="origin-center"><h1 id="origin-heading" className="origin-zero" aria-label="0 — 시작">0</h1></div>
          </section>

          <section id="odyssey" className="zone odyssey" aria-label="01 Odyssey — 초등, 중학, 고등">
            {[{ title: "초등학교 시절", style: "elementary" }, { title: "중학교 시절", style: "middle" }, { title: "고등학교 시절", style: "high" }].map(scene => <div key={scene.title} className={`odyssey-scene scene-${scene.style}`}>
              <h2 className="era-caption">{scene.title}</h2>
              {scene.style === "elementary" ? <div className="elementary-scene-art" aria-hidden="true">
                <div className="elementary-stage">
                  <Image src="/images/elementary-background.png" alt="" fill sizes="100vw" className="elementary-background" priority />
                  <div className="elementary-sun"><Image src="/images/elementary-sun.png" alt="" fill sizes="23vw" /></div>
                  <Image src="/images/elementary-mountain.png" alt="" fill sizes="100vw" className="elementary-mountain" priority />
                </div>
              </div> : <div className="scene-collage" aria-hidden="true">
                <div className="collage-back"><div className="collage-landscape" /><div className="collage-orbit" /></div>
                <div className="collage-photo" />
                <div className="collage-front"><div className="collage-cutout" /><div className="collage-object" /></div>
              </div>}
            </div>)}
          </section>

          <section id="about" className="zone about-image-zone" aria-label="디자이너 한륜희 소개">
            <Image src="/images/profile-han-ryun-hee-eaff3a29e0d0.png" alt="디자이너 한륜희 프로필. 아이디어를 기획하고 브랜드 아이덴티티, UI/UX와 웹 디자인으로 구현합니다." width={1920} height={1080} sizes="100vw" className="profile-sheet" />
          </section>

          <section id="works" className="zone works" aria-labelledby="works-heading">
            <aside className="works-pin"><span className="eyebrow">03 / SELECTED WORKS</span><h2 id="works-heading">Thoughts,<br />made real<span className="small-period">.</span></h2><div key={activeProject.id} className="project-description"><span className="project-count">{activeProject.id}<span> / 06</span></span><h3>{activeProject.title}</h3><span className="eyebrow">{activeProject.category}</span><p>{activeProject.summary}</p></div><p className="works-hint"><span>↗</span> HOVER TO DISCOVER<br />CLICK TO EXPLORE</p></aside>
            <div className="works-rail">{projects.map(project => <button key={project.id} className={`work-card ${activeProject.id === project.id ? "is-active" : ""}`} data-cursor="work" onPointerEnter={() => setActiveProject(project)} onFocus={event => focusProject(project, event.currentTarget)} onClick={event => { jumpTween.current?.kill(); opener.current = event.currentTarget; setOpenedProject(project); }} aria-label={`${project.title} 프로젝트 상세 보기`}>
              <div className={`card-visual rounded-xl ${project.tone}`}>{project.id === "01" ? <Image src="/images/project-05.png" alt="Pomel 펫푸드 브랜드 포트폴리오" fill sizes="(max-width: 800px) 50vw, 38vw" className="work-image" /> : <><span className="card-ghost-number">{project.id}</span><span className="card-visual-label">{project.title}<small>이미지 준비 중</small></span></>}<div className="floating-object" aria-hidden="true">↗</div></div>
            </button>)}</div>
          </section>

          <section id="contact" className="zone contact" aria-labelledby="contact-heading"><div className="section-marker"><span>04 / CONTACT</span><span>THE NEXT CHAPTER IS OURS.</span></div><div className="contact-main"><span className="eyebrow">HAVE SOMETHING IN MIND?</span><h2 id="contact-heading">LET’S MAKE<br />SOMETHING<br /><span>REAL</span><span className="contact-arrow">↗</span></h2><div className="contact-actions"><button className="email-button" onClick={copyEmail}>SEND AN EMAIL <span>↗</span></button><span className="contact-note">좋은 대화에서 시작될 다음 이야기.</span></div><p className="email-status" role="status">{emailStatus}</p></div><div className="contact-footer"><span>© 2026 HAN RYUN HEE</span><div><span className="external-placeholder" aria-label="Instagram 링크 준비 중">INSTAGRAM ↗ <small>SOON</small></span><span className="external-placeholder" aria-label="Behance 링크 준비 중">BEHANCE ↗ <small>SOON</small></span></div><button onClick={() => goTo(0)}>BACK TO ORIGIN ↑</button></div></section>
        </div>
        <div className="origin-ball" aria-hidden="true"><svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="48" fill="#f7f7f2" stroke="#464940" strokeWidth="2" /><g fill="none" stroke="#65675f" strokeWidth="1.5"><path d="M50 29 50 5M30 44 9 35M38 67 25 88M62 67 76 88M70 44 91 35" /><path d="M50 5 78 15 91 35 92 65 76 88 50 97 25 88 8 65 9 35 22 15Z" /></g><g fill="#464940"><path d="M50 29 70 44 62 67 38 67 30 44Z" /><path d="M38 3 62 3 58 13 42 13ZM84 20 97 43 85 44 78 30ZM97 64 82 87 76 75 84 63ZM37 96 13 81 24 74 38 84ZM3 43 14 20 23 30 15 44Z" /></g></svg></div>
        <div className="journey-actor" aria-hidden="true"><div className="actor-state actor-running"><div className="person-box bg-neutral-400" /><div className="actor-ball bg-neutral-300" /></div><div className="actor-state actor-friends"><div className="friend-box bg-neutral-400" /><div className="person-box bg-neutral-300" /><div className="friend-box bg-neutral-400" /></div><div className="actor-state actor-alone"><div className="person-box bg-neutral-300" /></div></div>
      </main>
      <nav className={`bottom-nav${activeZone === 2 ? " bottom-nav-profile" : ""}`} aria-label="구역 탐색"><div className="progress-track"><div ref={progressBar} className="progress-fill" /></div><div className="nav-links">{zones.map((zone, index) => <a key={zone} href={`#${zone.toLowerCase()}`} aria-current={activeZone === index ? "location" : undefined} onClick={event => { event.preventDefault(); goTo(index); }}><span className="nav-index">0{index}.</span> {zone}<span className="nav-active-dot" /></a>)}</div></nav>
    </div>
    {openedProject && <ProjectViewer project={openedProject} onClose={() => { setOpenedProject(null); requestAnimationFrame(() => opener.current?.focus({ preventScroll: true })); }} />}
  </>;
}
