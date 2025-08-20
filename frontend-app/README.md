# 버스알리미 프론트엔드

실시간 버스 정보를 제공하는 웹 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 15.5.0
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm
- **API Communication**: Axios
- **Routing**: App Router
- **Build Tool**: TurboPack

## 주요 기능

- 🚌 실시간 버스 정보 조회
- ⭐ 즐겨찾기 기능
- 🕒 최근 검색 기록
- 🔔 알림 서비스
- 📱 반응형 디자인

## 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상
- 백엔드 서버 (포트 8080에서 실행)

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   `.env.local` 파일을 생성하고 다음 내용을 추가하세요:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_APP_NAME=버스알리미
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NODE_ENV=development
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                 # App Router 페이지
│   ├── layout.js       # 루트 레이아웃
│   ├── page.js         # 홈페이지
│   └── globals.css     # 전역 스타일
├── components/         # 재사용 가능한 컴포넌트
│   └── Layout.js       # 기본 레이아웃 컴포넌트
└── services/          # API 서비스
    └── api.js         # Axios API 클라이언트
```

## API 엔드포인트

백엔드 API와의 통신을 위한 주요 엔드포인트:

- **인증**: `/api/auth/*`
- **버스 정보**: `/api/bus/*`
- **즐겨찾기**: `/api/favorites/*`
- **최근 검색**: `/api/recents/*`
- **알림**: `/api/notifications/*`
- **신고**: `/api/bus-reports/*`

## 개발 명령어

- `npm run dev` - 개발 서버 실행 (TurboPack 사용)
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행

## 배포

이 프로젝트는 Vercel, Netlify 등 다양한 플랫폼에 배포할 수 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
