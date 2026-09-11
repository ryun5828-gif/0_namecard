import Image from "next/image";

// Exported from Figma Frame 460 (722:4570). Text and shapes remain vector paths.
const sections = [
  {
    "src": "/images/pomel/section-01.svg",
    "width": 1920,
    "height": 1080,
    "alt": "Pomel 포트폴리오 1 / 13"
  },
  {
    "src": "/images/pomel/section-02.svg",
    "width": 1920,
    "height": 1080,
    "alt": "Pomel 포트폴리오 2 / 13"
  },
  {
    "src": "/images/pomel/section-03.svg",
    "width": 1920,
    "height": 1080,
    "alt": "Pomel 포트폴리오 3 / 13"
  },
  {
    "src": "/images/pomel/section-04.svg",
    "width": 1920,
    "height": 1080,
    "alt": "Pomel 포트폴리오 4 / 13"
  },
  {
    "src": "/images/pomel/section-05.svg",
    "width": 1920,
    "height": 2092,
    "alt": "Pomel 포트폴리오 5 / 13"
  },
  {
    "src": "/images/pomel/section-06.svg",
    "width": 1920,
    "height": 1080,
    "alt": "Pomel 포트폴리오 6 / 13"
  },
  {
    "src": "/images/pomel/section-07.svg",
    "width": 1920,
    "height": 1080,
    "alt": "Pomel 포트폴리오 7 / 13"
  },
  {
    "src": "/images/pomel/section-08.svg",
    "width": 1920,
    "height": 1080,
    "alt": "Pomel 포트폴리오 8 / 13"
  },
  {
    "src": "/images/pomel/section-09.svg",
    "width": 1920,
    "height": 1893,
    "alt": "Pomel 포트폴리오 9 / 13"
  },
  {
    "src": "/images/pomel/section-10.svg",
    "width": 1920,
    "height": 1546,
    "alt": "Pomel 포트폴리오 10 / 13"
  },
  {
    "src": "/images/pomel/section-11.svg",
    "width": 1920,
    "height": 4099,
    "alt": "Pomel 포트폴리오 11 / 13"
  },
  {
    "src": "/images/pomel/section-12.svg",
    "width": 1920,
    "height": 1499,
    "alt": "Pomel 포트폴리오 12 / 13"
  },
  {
    "src": "/images/pomel/section-13.svg",
    "width": 1920,
    "height": 1643,
    "alt": "Pomel 포트폴리오 13 / 13"
  }
];

export default function PomelPortfolio() {
  return <div className="pomel-portfolio" aria-label="Pomel 브랜드 포트폴리오 원본 디자인">
    {sections.map((section, index) => <Image key={section.src} {...section} className="project-sheet" sizes="100vw" loading={index === 0 ? "eager" : "lazy"} unoptimized />)}
  </div>;
}

