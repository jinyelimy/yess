# YESS — Year-End Support System

사내 연말정산 패치 관리 + TF 업무 운영을 통합하는 웹 애플리케이션.
한 문장으로: **"연말정산 패치 실행관리 시스템이면서 동시에 TF 업무 운영 보드"**.

## 현재 상태

**v0 프로토타입** (TF 4명 시범용, 1 FTE × 3개월).
디자인 익스포트 1:1 포팅 단계로, 백엔드·DB는 아직 연결 전이며 모든 화면은
[lib/yess/data.ts](lib/yess/data.ts)의 mock 데이터로 구동됩니다.

## 빠른 시작

```bash
npm install
npm run dev
# 기본 포트: http://localhost:3000
# (포트를 바꾸려면 `PORT=3211 npm run dev`)
```

루트(`/`) 접속 시 `/dashboard`로 자동 리다이렉트됩니다.

## 화면 구성

| 라우트 | 화면 | 설명 |
|---|---|---|
| `/dashboard` | 대시보드 | TF/유지보수 관점 토글, 차수별 진행률, 도넛 차트, 오늘 부재 |
| `/targets` | 고객사 패치 현황 | 엑셀형 그리드(스티키 컬럼) + 우측 Drawer 인라인 편집 |
| `/rounds` | 패치 차수 · 항목 | 차수 카드 리스트 + 항목 테이블 + 항목 Drawer (파일/가이드) |
| `/kanban` | Kanban 보드 | 6컬럼(BACKLOG → DONE) 드래그&드롭, BUGFIX/SERVICE_DESK 카드 → Daily 딥링크 |
| `/daily` | 일일업무 | 월 캘린더 + 담당자별 그룹 카드 + 활동 요약 |
| `/followups` | 후속조치 | 항목 테이블 (전년도 이슈 추적) |
| `/companies` | 고객사 마스터 | 환경정보·연락처·계약 정보 |
| `/reports` | 진행률 · 담당자 분석 | 차수별 상태 분포 + 담당자 워크로드 |

## 기술 스택

- **프론트엔드**: Next.js 15 (App Router) + React 19 + TypeScript 5
- **스타일**: 인라인 스타일 + CSS 변수 ([app/globals.css](app/globals.css), Miro-inspired light theme)
- **상태**: React useState만 (전역 상태 라이브러리 없음, v0 단계)
- **딥링크**: `sessionStorage` 키(`yess.pendingDailyOpen`, `yess.pendingFollowupOpen`)
- **데이터**: mock ([lib/yess/data.ts](lib/yess/data.ts)) — 추후 Route Handlers + Prisma + PostgreSQL로 연결
- **백엔드/DB**: 미연결 (v0)

## 디렉토리 구조

```
.
├── app/
│   ├── (app)/                # 사이드바·톱바가 있는 라우트 그룹
│   │   ├── dashboard/page.tsx
│   │   ├── targets/page.tsx
│   │   ├── rounds/page.tsx
│   │   ├── kanban/page.tsx
│   │   ├── daily/page.tsx
│   │   ├── followups/page.tsx
│   │   ├── companies/page.tsx
│   │   ├── reports/page.tsx
│   │   └── layout.tsx        # AppShell wrapper
│   ├── globals.css           # 디자인 토큰 + 폰트
│   ├── layout.tsx            # 루트 레이아웃 (html/body)
│   └── page.tsx              # / → /dashboard
├── components/yess/
│   ├── common.tsx            # Icon, Avatar, Badge, Btn, Card, Field*, Mascot, PageHeader 등
│   └── shell.tsx             # Sidebar (variant C) + Topbar + AppShell
├── lib/yess/
│   └── data.ts               # 타입 + mock 데이터 (TF, 고객사, 패치, 업무, 일정 등)
└── docs/
    ├── DESIGN.md             # v1 초안 (read-only, 히스토리)
    └── DESIGN-v2.md          # 최종 설계서 (ACTIVE)
```

## 디자인 시스템

- **테마**: Miro-inspired light — 흰 캔버스, Blue 450(`#5b76fe`) primary, 파스텔 액센트(coral/teal/yellow/violet)
- **타이포**: Inter (display) + Noto Sans KR (body) + JetBrains Mono (mono)
  → Roobert PRO 자리를 Inter로 대체 (라이선스 무료 대안)
- **토큰**: [app/globals.css](app/globals.css) — 색·여백·폰트·shadow가 모두 CSS 변수
- **상태/우선순위 팔레트**: `--status-{done|progress|scheduled|review|pending|hold|failed|na}-{bg|fg|dot}`
- **사이드바 variant**: C(일러스트 친근형) 채택 — 디자인 익스포트에 A/B/D 변형이 있으나 v0에선 C만 구현

## 도메인 핵심 용어

- **귀속연도(Tax Year)**: 소득 발생연도 (예: 2025 귀속 = 2025년 소득 → 2026년 1~2월 정산 작업)
- **패치 차수(Round)**: `{tax_year}-{type_prefix}{round_no}` (예: `2026-D01`)
- **패치 항목(PatchItem)**: 차수 내 세부 작업, `{round_code}-{patch_no}` (예: `2026-D01-003`)
- **반영 상태(apply_status)**: `NOT_STARTED → SCHEDULED → IN_PROGRESS → APPLIED`
- **후속조치(Follow-up)**: 전년도 이슈를 다음 사이클 전에 처리하는 작업 (`work_items.type = FOLLOW_UP`)
- **TF**: 연말정산 Task Force (사내 4명) / **MAINTAINER**: 고객사별 유지보수 담당 (약 20명)

전체 도메인은 [docs/DESIGN-v2.md](docs/DESIGN-v2.md) 0.3, 1.4 참조.

## 향후 작업 (v0 → v1)

- [ ] Prisma schema 작성 + Jarvis 공유 DB(`yess_*` prefix) 연결
- [ ] mock → Server Actions / Route Handlers 마이그레이션
- [ ] 인증 (Jarvis SSO + RBAC 연동)
- [ ] 2025~2026 귀속 데이터 1회성 이관 스크립트
- [ ] dnd-kit 기반 Kanban DnD (현재는 HTML5 native)
- [ ] 사내 Docker Compose 배포 (`yess-web` 컨테이너 + Jarvis와 PG 인스턴스 공유)
- [ ] MAINTAINER 화면 분리 (v1.5)

세부 로드맵은 [docs/DESIGN-v2.md](docs/DESIGN-v2.md) §10~§14 참조.

## 문서

- [docs/DESIGN-v2.md](docs/DESIGN-v2.md) — 최종 설계서 (ACTIVE)
- [docs/DESIGN.md](docs/DESIGN.md) — v1 초안 (read-only, 히스토리)
