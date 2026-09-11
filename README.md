# Horizontal Stream — Portfolio 2026

Next.js App Router + TypeScript + GSAP ScrollTrigger + Tailwind CSS 4.
참고 이미지 `포폴 사이트 흐름.png`의 순서를 따른 무채색 플레이스홀더 사이트입니다.

## 실행

Node.js 20.9 이상에서:

```sh
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다. pnpm 사용 시 `pnpm install`, `pnpm dev`도 가능합니다.

```sh
npm run typecheck
npm run build
npm start
```

## 구조 / 교체할 내용

- `src/components/HorizontalStream.tsx`: 100 / 250 / 100 / 250 / 100vw의 단일 800vw 트랙. ScrollTrigger가 세로 스크롤 거리를 X 이동으로 변환하며 `pin: true`, `scrub: 1.2` 사용. 하단 메뉴, 장면별 인물 및 공, About 순차 등장, Works 고정 패널, 이메일 복사.
- `src/components/CustomCursor.tsx`: 6px 점, 36px 보간 링, 링크 자석 효과, 작품 및 닫기 버블. 터치 장치 비활성화.
- `src/components/ProjectViewer.tsx`: native dialog 기반 전체 화면 세로 뷰어. Escape/닫기 버튼, 포커스 제한 및 복원, 배경 스크롤 잠금.
- `src/lib/projects.ts`: 여섯 프로젝트의 임시 제목, 카테고리, 설명. 이 파일에서 실제 콘텐츠로 교체.
- `src/app/globals.css`: 레이아웃, 반응형 스타일, 커서 및 인터랙션.
- 이메일 `hello@example.com`은 임시 주소입니다. `HorizontalStream.tsx`의 `EMAIL` 상수를 교체하세요. 외부 링크는 실제 URL을 받기 전까지 비활성 플레이스홀더입니다.
- 프로필 및 프로젝트 시각물은 라벨이 있는 회색 박스이며 실제 사진을 사용하지 않습니다. `placeholder`, `card-visual`, `about-photo` 영역을 나중에 `next/image`로 교체할 수 있습니다.

## 조작

마우스 휠, 트랙패드(가로/세로), 모바일 세로 스와이프, 좌우 방향키, 하단 메뉴로 탐색합니다. 작품 카드는 포커스/호버 시 설명이 바뀌고 클릭 시 상세 뷰어를 엽니다. 상세 뷰어 안에서는 일반 세로 스크롤을 사용합니다.

모바일에서도 같은 가로 트랙을 유지합니다. `prefers-reduced-motion` 사용자는 scrub 지연, 순차 등장 및 부가 회전이 줄어듭니다. 본문 배경의 세로 스크롤 공간은 가로 트랙의 진행도를 구동하기 위한 것입니다.

구현 참고: [Next.js App Router](https://nextjs.org/docs/app/getting-started/installation), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
