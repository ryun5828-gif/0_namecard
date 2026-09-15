export const projects = [
  { id: "01", title: "Ondam", category: "OVERVIEW", year: "2026", summary: "‘따뜻함’을 하나의 시각 언어로.\n색과 공간, 캐릭터를 통해\n온담만의 편안한 분위기를 구축했습니다.", tone: "bg-neutral-200", label: "BRAND VISUAL" },
  { id: "02", title: "오늘까지", category: "OVERVIEW", year: "2026", summary: "‘관리해야 하는 일을, 돌보고 싶은 경험으로.’\n유통기한 관리와 캐릭터 성장을 연결해\n사용자가 꾸준히 식재료를 챙길 수 있도록 했습니다.", tone: "bg-neutral-300", label: "APP EXPERIENCE" },
  { id: "03", title: "POMEL", category: "OVERVIEW", year: "2025", summary: "추천부터 구독까지, 하나의 맞춤 경험으로.\nAI 챗봇을 통해 반려동물에게 필요한 제품을 찾고\n자연스럽게 구독까지 이어지도록 사용자 흐름을 설계했습니다.", tone: "bg-neutral-200", label: "WEB EXPERIENCE" },
  { id: "04", title: "CHIAVE", category: "OVERVIEW", year: "2025", summary: "CHIAVE는 ‘아름다움을 여는 열쇠’를 콘셉트로,\n메탈과 체인 오브제로 시크한 무드를 표현했습니다.\n브랜딩부터 웹까지 하나의 이미지로 연결했습니다.", tone: "bg-neutral-300", label: "AI EXPERIMENT" },
  { id: "05", title: "이지바이오 리디자인", category: "OVERVIEW", year: "2025", summary: "이지바이오의 전문성과 신뢰감을 높이기 위해,\n정보 구조와 UI를 직관적으로 개선했습니다.\n기업과 사업 정보를 쉽게 이해할 수 있도록 구성했습니다.", tone: "bg-neutral-200", label: "EDITORIAL VISUAL" },
  { id: "06", title: "NEXT CHAPTER", category: "OVERVIEW", year: "2026", summary: "끝이 아닌, 다음 시작을 위한 실험.\n나만의 관점으로 새로운 가능성을 그립니다.", tone: "bg-neutral-300", label: "PROJECT VISUAL" },
] as const;

export type Project = (typeof projects)[number];
