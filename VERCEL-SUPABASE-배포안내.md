# Vercel + Supabase 배포 안내

## Vercel 배포

1. 이 ZIP의 압축을 풉니다.
2. 폴더를 GitHub 저장소에 올린 뒤 Vercel에서 해당 저장소를 Import합니다.
3. Framework Preset은 `Next.js`를 선택합니다.
4. Build Command는 `npm run build`, Install Command는 `npm install`을 사용합니다.
5. Deploy를 실행합니다.

## Supabase 환경변수

현재 포트폴리오는 Supabase API를 호출하지 않으므로 환경변수 없이도 동작합니다.
추후 Supabase 기능을 연결할 때 Vercel의 Project Settings > Environment Variables에 아래 값을 등록합니다.

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase 공개 publishable 키

`.env.example`에는 실제 키를 넣지 마세요. 서비스 역할 키(`service_role`)는 브라우저에 공개되는 `NEXT_PUBLIC_` 변수로 등록하면 안 됩니다.
