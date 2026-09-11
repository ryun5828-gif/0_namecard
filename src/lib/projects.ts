export const projects = [
  { id: "01", title: "FORM & FIELD", category: "BRAND IDENTITY", year: "2026", summary: "작은 시작에서 발견한 브랜드의 가능성.\n하나의 태도를 일관된 시각 언어로 만듭니다.", tone: "bg-neutral-200", label: "BRAND VISUAL" },
  { id: "02", title: "BETWEEN US", category: "UI / UX DESIGN", year: "2026", summary: "사람과 사람 사이의 연결을 생각합니다.\n일상의 대화를 더 자연스러운 경험으로.", tone: "bg-neutral-300", label: "APP EXPERIENCE" },
  { id: "03", title: "OFF THE GRID", category: "WEB EXPERIENCE", year: "2025", summary: "익숙한 화면 밖에서 찾은 새로운 흐름.\n움직임과 인터랙션으로 이야기를 전합니다.", tone: "bg-neutral-200", label: "WEB EXPERIENCE" },
  { id: "04", title: "A NEW INPUT", category: "AI EXPLORATION", year: "2025", summary: "새로운 도구로 확장하는 상상의 범위.\n질문하고 실험하며 다음 장면을 찾습니다.", tone: "bg-neutral-300", label: "AI EXPERIMENT" },
  { id: "05", title: "EVERYDAY TYPE", category: "EDITORIAL DESIGN", year: "2025", summary: "매일 마주하는 것들의 다른 표정.\n타이포그래피와 여백으로 기록한 일상.", tone: "bg-neutral-200", label: "EDITORIAL VISUAL" },
  { id: "06", title: "NEXT CHAPTER", category: "PERSONAL PROJECT", year: "2026", summary: "끝이 아닌, 다음 시작을 위한 실험.\n나만의 관점으로 새로운 가능성을 그립니다.", tone: "bg-neutral-300", label: "PROJECT VISUAL" },
] as const;

export type Project = (typeof projects)[number];
