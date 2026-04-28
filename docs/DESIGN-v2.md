# YESS — 최종 설계서 (DESIGN-v2)

> **문서 버전**: v2.1 (Jarvis DB 공유 반영)
> **작성일**: 2026-04-23
> **상태**: APPROVED (구현 착수 직전)
> **대체 대상**: `docs/DESIGN.md` (v1 초안)
> **작성 근거**: `/gstack-office-hours` 세션 → `/superpowers:brainstorm` 자가검토 → GPT Pro 확장 버전 교차 검증 → Jarvis DB 공유 요건 반영 → 최종 종합 판단

---

## 0. 문서 메타

### 0.1 관계 문서

| 파일 | 역할 | 상태 |
|---|---|---|
| `docs/DESIGN.md` | v1 초안 + 자가검토 이력 | 히스토리 (read-only) |
| `docs/DESIGN-v2.md` | **최종 설계서 (본 문서)** | ACTIVE |
| `docs/DATA_MODEL.md` | Prisma schema 상세 (부록 §16.1 발췌본 → 분리 예정) | 미작성 |
| `docs/API.md` | API 계약서 (본 문서 §8 발췌본 → 분리 예정) | 미작성 |
| `docs/MIGRATION.md` | 2025~2026 데이터 이관 매핑 상세 | 미작성 |

### 0.2 핵심 결정 요약

| 항목 | 최종 결정 | 근거 섹션 |
|---|---|---|
| 아키텍처 방향 | 패치 관리 + TF 업무를 **단일 도메인**으로 통합 | §2, §4 |
| 회사 모델 | Jarvis `company`(영속, 공유) + `yess_company_year_profiles`(연도별) 분리 | §5.2(S2),(4) |
| 패치 모델 | `yess_patch_rounds` + `yess_patch_items` + `yess_patch_artifacts` 3계층 | §5.2(7),(8),(9) |
| 고객사 반영 상태 | `yess_patch_targets` 전용 실행 테이블, `apply_status`만 사용 (MAINTAINER 셀프-종결). TF 건별 검토는 도입하지 않음 | §5.2(10) |
| 업무 카드 | `yess_work_items` 단일 모델, `type` enum으로 후속조치 포함 | §5.2(12) |
| 일일업무 | `yess_work_logs`, 명시적 nullable FK (polymorphic 거부) | §5.2(13) |
| 삭제 정책 | **선택적 soft delete** (옵션 A) — 파급 큰 5개 테이블(company_year_profiles, patch_rounds, patch_items, patch_targets, work_items)만 `deleted_at`. 그 외 hard delete | §5.2 공통 규칙 |
| 인력/기간 | 1 FTE × 3개월 → TF 4명 시범용 프로토타입 | §3, §12 |
| 칸반 | 프로토타입은 상태 드롭다운, dnd-kit DnD는 v1 | §7.2.4 |
| 권한 | Jarvis RBAC(role/permission) 재사용, YESS permission key 추가 | §9 |
| 기술 스택 | **Next.js 15 단일** (App Router + Route Handlers + Server Actions) + Prisma + PostgreSQL 16 | §10.1 |
| DB 공유 | Jarvis와 **단일 PostgreSQL 인스턴스 공유**, YESS 전용 테이블은 `yess_*` prefix | §0.4, §10.2 |
| 배포 | 사내망 Docker Compose. `jarvis-web`/`yess-web` 별도 컨테이너, DB 컨테이너는 공유 | §10.2 |
| 공유 테이블 | user, role, permission, user_role, role_permission, user_session, audit_log, company, attachment, raw_source, menu_item, code_group, code_item | §0.4 |
| 이관 범위 | 2025~2026 귀속만, 이전은 Google Sheets 잔존 | §11 |
| Build vs Buy | 사내 보안정책 기준 **자체 구축 확정** | §14 |

### 0.3 용어 정의

| 용어 | 정의 |
|---|---|
| **귀속연도 (Tax Year)** | 소득이 발생한 해. 예: **2025 귀속 = 2025년 소득에 대한 연말정산, 실제 정산 작업은 2026년 1~2월**. YESS에서는 `yess_year_contexts.tax_year`로 식별하며 모든 트랜잭션 엔티티의 최상위 네임스페이스. |
| **패치 차수 (Patch Round)** | 같은 `patch_type` 안에서 차례로 배포되는 패치 묶음 단위. `round_code`는 `{tax_year}-{type_prefix}{round_no:02d}` 포맷 (예: `2026-D01` = 2026 귀속 연중 1차). §5.2.7a 참조 |
| **패치 항목 (Patch Item)** | 차수 내의 세부 작업. `patch_no`(001, 002, 003…)로 식별. 전역 식별자는 `{round_code}-{patch_no}` (예: `2026-D01-003`). §5.2.7b 참조 |
| **패치 아티팩트 (Patch Artifact)** | 파일경로·SQL·URL 등 패치 항목에 부속된 실제 산출물 |
| **반영 상태 (apply_status)** | 유지보수 담당자가 고객사에 실제 반영한 진행 상태. `APPLIED`가 최종 종결 상태 |
| **TF** | 연말정산 Task Force 팀 (사내 4명) |
| **MAINTAINER** | 고객사별 유지보수 담당자 (약 20명) |
| **후속조치 (Follow-up)** | 전년도(2025 귀속연도) 연말정산 사이클에서 발생한 오류·개선 사항을 다음 사이클 전에 처리하는 작업. `yess_work_items.type = FOLLOW_UP` |
| **Jarvis** | 사내 Knowledge/RBAC 플랫폼. YESS와 동일 PostgreSQL을 공유하며 사용자/권한/감사/회사 마스터를 제공 |
| **공유 테이블 (Shared)** | Jarvis가 소유·관리하는 테이블. YESS는 **읽기 위주**로 참조, 스키마 변경은 Jarvis 팀과 협의 필수 |
| **YESS 전용 테이블** | `yess_*` prefix. migration·스키마 관리 모두 YESS 팀 책임 |

### 0.4 Jarvis 연동 원칙

YESS는 별도 Next.js 앱으로 배포되지만, **Jarvis와 단일 PostgreSQL을 공유**한다. 테이블 소유권은 다음 원칙으로 나뉜다.

#### 0.4.1 소유권 매트릭스

| 카테고리 | 테이블 | 소유 | YESS 권한 | migration 책임 |
|---|---|---|---|---|
| Auth | `user`, `role`, `permission`, `user_role`, `role_permission`, `user_session` | Jarvis | R (+ user_role에 YESS role만 W) | Jarvis |
| 감사 | `audit_log` | Jarvis | W(insert) / R | Jarvis |
| 회사 마스터 | `company` | Jarvis | R, CRUD(협의) | Jarvis (쓰기 범위는 협의) |
| 파일 | `attachment`, `raw_source` | Jarvis | W(insert) / R / 본인 소유 D | Jarvis |
| 공통 | `menu_item`, `code_group`, `code_item` | Jarvis | R (YESS 메뉴는 별도 등록) | Jarvis |
| YESS 전용 | `yess_*` (본 문서 §5.2) | YESS | CRUD | YESS |

#### 0.4.2 FK 규칙

- YESS 전용 테이블에서 공유 테이블을 참조하는 FK는 **허용**한다. 예: `yess_company_year_profiles.company_id → company.id`.
- 공유 테이블에서 YESS 전용 테이블을 참조하는 FK는 **금지**한다. Jarvis에 YESS 의존이 역류하지 않도록 한다.
- `ON DELETE` 정책: 공유 테이블 → YESS FK는 기본 `RESTRICT`. `company.active = false` soft-deactivate 선호.

#### 0.4.3 Prisma 관리 전략

- YESS 레포의 `schema.prisma`에 공유 테이블을 **외부 참조 모델**로 선언한다 (`@@map` + `@@ignore` 미사용: Prisma 5는 read-only 표기가 없으므로, 관례로 주석에 "SHARED (Jarvis owns)"를 명시).
- YESS는 공유 테이블에 대해 `prisma migrate` 절대 실행하지 않는다. 운영 룰: `prisma migrate deploy` 전에 `--schema-filter` 또는 사전 diff 확인 스크립트 필수.
- 실무 패턴:
  1. Jarvis가 공유 테이블 DDL을 확정 후 알림.
  2. YESS는 `prisma db pull`로 동기화 → diff 리뷰 → 커밋.
  3. YESS 자체 migration은 `yess_*` 테이블만 변경하도록 제한.

#### 0.4.4 권한 연동

- Jarvis `permission.code`에 YESS 전용 키를 추가 (예: `yess.patch.target.update`).
- YESS는 앱 부팅 시 필수 permission 목록을 Jarvis에 upsert하는 seed 스크립트를 가진다 (idempotent).
- 역할(`role`)의 배정은 Jarvis 관리 UI에서 수행. YESS는 `user_role`을 읽기만 한다.

#### 0.4.5 협의 항목 (Open)

다음은 Jarvis 담당자와의 협의 후 확정한다. 협의 결과에 따라 §5, §9가 추가 수정될 수 있다.

| # | 항목 | 기본 가정 | 협의 포인트 |
|---|---|---|---|
| J1 | `company` 쓰기 범위 | YESS에서 신규 고객사 생성 가능 | Jarvis가 회사 마스터 관리 주체이면 YESS는 R only |
| J2 | `attachment` 정책 | YESS가 insert, 본인 업로드만 delete | 저장소 경로·용량 정책 |
| J3 | `audit_log` 스키마 호환성 | YESS 이벤트를 동일 테이블에 기록 | `target_type`/`source_app` 네임스페이스 규약 |
| J4 | `menu_item` | YESS 메뉴를 Jarvis 메뉴 트리에 삽입 or 별도 | SSO 메뉴 통합 여부 |
| J5 | `code_group`/`code_item` | YESS enum 일부를 공통코드로 이동 | ApplyStatus, PatchType, AccessMethod 등 대상 여부 |
| J6 | 사용자 프로비저닝 | Jarvis에 이미 존재하는 user 재사용 | MAINTAINER 20명 계정 생성 주체 |

---

## 1. 개요 & 문제 정의

### 1.1 프로덕트 정의

**YESS (Year-End Support System)** 는 사내 연말정산 패치 관리와 TF 업무 운영을 통합하는 사내 전용 웹 애플리케이션이다.

한 문장으로: **"연말정산 패치 실행관리 시스템이면서 동시에 TF 업무 운영 보드"**.

### 1.2 현재 상태 (as-is)

- Google Sheets + 공유 드라이브로 운영 중
- 4종의 시트가 실질적으로 하나의 업무를 쪼개어 표현 중:
  1. **고객사별 패치 현황표** (연말정산 패치 반영 여부)
  2. **개인 일정 + 일일업무 기록** (TF 5명의 자유 텍스트 로그)
  3. **차수별 패치 리스트** (연중 01/02 등, 소스경로·SQL 포함)
  4. **후속조치 리스트** (우선순위·담당자·처리내역)

### 1.3 핵심 고통

| # | 고통 | 원인 |
|---|---|---|
| 1 | 데이터 파편화 | 같은 패치 작업이 4개 시트에 중복 기재 |
| 2 | 자유 텍스트 남용 | 담당자·버전·접속방법이 비구조화 문자열 |
| 3 | 진척도 불가시성 | "지금 누가 뭐 하는지" 한눈에 안 보임 |
| 4 | 연도 경계 붕괴 | 26/27년 데이터가 섞일 위험 |
| 5 | 암묵지 편재 | 고객사별 접속방법·특이사항이 TF 머릿속에만 존재 |

### 1.4 YESS가 해결하는 핵심 흐름

YESS의 업무 흐름은 **"전년도 후속조치 → TF 개발 → 차수 배포 → 고객사 반영"** 의 한 사이클이다.

```
① 전년도(예: 2025 귀속) 이슈를 현 사이클 초반에
    후속조치로 등록 (yess_work_items.type = FOLLOW_UP)
      + 신규 요건(국세청 가이드 등)도 work_items로 등록

  ② TF가 업무 배정 받아 처리
      - assignee_id 지정, status: TODO → IN_PROGRESS
      - Kanban에서 진행 관리
      - 매일 일일업무 로그 (yess_work_logs) 기록

    ③ TF 작업 완료 → 차수별 패치 항목으로 정식 등록
        - yess_patch_rounds 생성 (예: 2026-D01)
        - 해당 차수 아래 yess_patch_items (001, 002, …) 생성
        - 아티팩트(소스경로/SQL) 첨부
        - 관련 work_item ↔ patch_item 연결

      ④ 고객사별 반영 대상(yess_patch_targets) 자동 생성
          - 대상 조건(버전/사용여부 등)으로 필터링

        ⑤ 유지보수 담당자가 반영
            - apply_status: SCHEDULED → IN_PROGRESS → APPLIED (셀프-종결)

          ⑥ 반영 후 이슈 발견 시
              - 다음 차수 또는 다음 연도 FOLLOW_UP으로 등록
              - → ① 단계로 순환
```

> **주 1**: 패치 항목은 "그냥 생기는" 것이 아니라 **TF 작업의 결과물**이다. 따라서 `yess_work_items`가 먼저 존재하고, 그 산출물이 `yess_patch_items`로 정식화된다.
> **주 2**: TF 건별 검토 단계는 도입하지 않는다. TF 인력 대비 고객사 수가 많아 건별 승인/반려가 운영상 부담이 크다. TF는 대시보드·지연 필터로 전체 현황을 샘플링하고, 이슈가 보이는 건만 후속조치 카드로 끌어올리는 방식으로 관여한다.

이 **단일 흐름**이 하나의 시스템에서 끊김 없이 이어져야 YESS가 Google Sheets를 대체한다.

### 1.5 대상 사용자

| 역할 | 인원 | 주 사용 화면 |
|---|---|---|
| TF_LEAD | 1 | 대시보드, Kanban, 패치 차수 관리, 지연/이슈 모니터링 |
| TF_MEMBER | 3 | Kanban, 일일업무, 패치 항목 관리, 후속조치 생성 |
| MAINTAINER | ~20 | 내 담당 고객사 패치 현황 (본인 담당만) |
| ADMIN | 1~2 | 사용자/권한/코드 관리 |
| VIEWER | 소수 | 대시보드, 리포트 (조회만) |

---

## 2. 최종 설계 원칙

1. **귀속연도(year_context)는 최상위 컨텍스트다.** 모든 트랜잭션 데이터는 반드시 `year_context_id`에 귀속된다.
2. **고객사 마스터는 Jarvis `company`를 재사용한다.** YESS는 연도별 속성만 `yess_company_year_profiles`로 분리 관리한다.
3. **패치는 차수(round)와 항목(item)으로 분리한다.** 파일/SQL/URL 등은 `yess_patch_artifacts`로 정규화한다.
4. **고객사별 패치 반영 상태는 별도 실행 테이블로 관리한다.** `yess_patch_targets`는 `yess_patch_rounds × yess_company_year_profiles`의 M:N 교차 테이블이자 진행 상태 스토어.
5. **TF 업무·후속조치·일반업무는 모두 `yess_work_items`로 통합한다.** `type` enum으로 구분. **패치 항목(`yess_patch_items`)은 TF 작업(work_items)의 정식화 산출물이며, work_item → patch_item 연결로 추적한다.**
6. **일일업무 로그는 `yess_work_items`와 연결하되, 자유 입력도 허용한다.** `work_item_id`는 nullable FK.
6-1. **업무 흐름의 출발은 "전년도 후속조치 + 신규 요건"이다.** 패치 항목을 먼저 등록하는 것이 아니라, work_items 백로그에서 작업이 진행된 뒤 차수·항목으로 공표한다 (§6 참조).
7. **유지보수 담당자가 `apply_status = APPLIED`로 셀프-종결한다.** TF의 건별 검토(review) 단계는 두지 않는다. 대신 TF는 대시보드·지연 필터로 샘플링하고 이슈 건만 후속조치 카드로 에스컬레이션한다.
8. **엑셀형 그리드 UX를 유지해서 전환 비용을 낮춘다.** TanStack Table + 인라인 수정.
9. **변경 이력은 Jarvis `audit_log`에 기록한다.** YESS는 `target_type`/`source_app`에 YESS 네임스페이스를 달아 insert. 최소한 상태 변경·담당자 변경·후속조치 생성은 반드시.
10. **인증·권한은 Jarvis RBAC(`user`/`role`/`permission`)을 그대로 재사용한다.** YESS는 전용 permission key만 추가.
11. **공유 테이블(Jarvis 소유)은 스키마 변경을 일방으로 하지 않는다.** 모든 변경은 Jarvis 팀과 협의 후 Jarvis 쪽 migration으로 적용.
12. **3개월 프로토타입은 실시간 협업·알림·파일 첨부를 포함하지 않는다.** (§3 참조)

---

## 3. 범위 (Scope)

### 3.1 릴리스 단계

| 릴리스 | 기간 | 대상 | 주요 범위 |
|---|---|---|---|
| **Prototype (3개월)** | 2026-04 ~ 2026-07 | TF 4명 + 일부 MAINTAINER | 기능 1 + 기능 2 최소판 |
| **v1 (운영 전환)** | 2026-08 ~ 2026-10 | TF + MAINTAINER 전원 | 권한 세분화, 감사 로그 확장, 이관 완료 |
| **v1.5** | ~2026-12 | 전체 | 파일 첨부, 완료 알림, 연도 롤오버 마법사 |
| **v2** | 2027 시즌 전 | 전체 | 실시간 협업(WS), Slack/Teams 알림, 대시보드 커스터마이징 |

### 3.2 프로토타입(3개월) IN SCOPE

| 구분 | 범위 |
|---|---|
| 인증 | Jarvis `user`/`user_session` 재사용. 로그인 플로우는 Jarvis와 동일 (초기엔 Jarvis 로그인 후 쿠키 공유 또는 SSO 브릿지) |
| 귀속연도 | 2026 기본 생성, 2025는 이관 대상 |
| 고객사 | Jarvis `company` 재사용 + `yess_company_year_profiles`/`yess_company_contacts`/`yess_company_maintainers` CRUD |
| 패치 | 차수/항목/아티팩트 관리, 소스경로/SQL 저장 |
| 패치 현황 | 고객사별 상태 그리드 (기능 1 핵심) |
| 유지보수자 기능 | 내 담당 고객사 상태 입력 최소판 |
| 이슈 대응 | TF가 대시보드/지연 필터로 모니터링, 이슈 건은 후속조치 카드로 생성 |
| 업무 카드 | `yess_work_items` CRUD |
| Kanban | 상태별 컬럼 (드래그 없이 드롭다운으로 상태 변경) |
| 후속조치 | `yess_work_items.type=FOLLOW_UP` 리스트 |
| 일일업무 | `yess_work_logs` 입력 + 업무 카드 연결 |
| 개인일정 | `yess_personal_events` CRUD (연차/반차/출장/회의) — TF 내부 공유용, Jarvis 근태와 분리 |
| 이관 | 2025~2026 시트 Import 스크립트 |
| 감사 | Jarvis `audit_log`에 YESS 이벤트 기록 (상태 변경·담당자 변경·후속조치 생성) |

### 3.3 프로토타입 OUT OF SCOPE

| 제외 | 재개 시점 | 사유 |
|---|---|---|
| 실시간 협업 (WebSocket) | v2 | 24명 규모, 동시 편집 확률 낮음 |
| Slack/Teams 알림 | v2 | 초기 사용 패턴 확인 후 결정 |
| 이메일(SMTP) 알림 | v1.5 | 사내 SMTP 결정 대기 |
| 파일 첨부 | v1.5 | NAS/S3 저장소 선정 필요 |
| 대시보드 커스터마이징 | v2 | 고정 지표로 충분 |
| 모바일 앱 | 영구 제외 | 반응형 웹만 제공 |
| 외부 API 공개 | 영구 제외 | 사내 전용 |
| 다국어 | 영구 제외 | 한국어 전용 |
| 사내 SSO/LDAP 완전 연동 | v1 | 운영 전환 시 |
| 조회 감사 로그 | v1 | 변경 감사만 우선 |
| 패치 항목별 고객사 체크 (`patch_target_items`) | v1.5 | 차수 단위 체크로 MVP 검증 |
| Drag-and-Drop Kanban | v1 | 상태 드롭다운으로 대체 |
| 전문 검색(FTS) | v2 | LIKE 검색으로 MVP 충분 |
| 엑셀 Export (패치 현황·일일업무) | v1.5 | YESS 내 조회·필터로 프로토타입 검증 충분. 필요 시 사용 패턴 확인 후 추가 |

---

## 4. 도메인 구조 & 컨텍스트 맵

### 4.1 도메인 트리

범례: `[S]` = Shared (Jarvis 소유, YESS 참조), `[Y]` = YESS 전용(`yess_*` prefix)

```
YESS
├─ Identity (사용자/권한)  ─────── [S] Jarvis
│  ├─ user, user_session
│  ├─ role, permission, user_role, role_permission
│  └─ (YESS는 yess.* permission key만 추가)
│
├─ Year (귀속연도 컨텍스트)  ──── [Y]
│  └─ yess_year_contexts
│
├─ Customer (고객사)
│  ├─ company                      [S] Jarvis
│  ├─ yess_company_year_profiles   [Y] (연도별 속성)
│  ├─ yess_company_contacts        [Y] (개인정보 민감, YESS 도메인 전용)
│  └─ yess_company_maintainers     [Y] (ACL 기반)
│
├─ Patch (패치)  ─────────────── [Y]
│  ├─ yess_patch_rounds
│  ├─ yess_patch_items
│  ├─ yess_patch_artifacts
│  └─ yess_patch_targets
│     └─ yess_patch_target_items   (v1.5+)
│
├─ Work (업무)
│  ├─ yess_work_items              [Y] (Kanban 카드, 후속조치 포함)
│  ├─ yess_work_logs               [Y] (일일업무)
│  └─ yess_personal_events         [Y] (연차/반차/출장/회의 — TF 내부 공유용)
│
├─ File (파일, v1.5+)  ────────── [S] Jarvis
│  ├─ attachment
│  └─ raw_source
│
├─ Common  ──────────────────── [S] Jarvis
│  ├─ menu_item (YESS 메뉴 등록)
│  └─ code_group, code_item
│
├─ Reporting
│  └─ (뷰/집계 쿼리, 테이블 없음)
│
└─ Audit
   └─ audit_log                    [S] Jarvis (YESS는 insert-only)
```

### 4.2 컨텍스트 간 의존성

```
Year          → (모든 YESS 트랜잭션 엔티티)
company [S]   → yess_company_year_profiles
yess_company_year_profiles → yess_patch_targets
yess_company_year_profiles → yess_company_maintainers → user [S]
Patch         → Work(yess_work_items.patch_*, yess_work_logs.patch_*)
yess_work_items → yess_work_logs
user [S]      → 모든 YESS 엔티티 (assignee_id, reporter_id, created_by 등)
audit_log [S] ← 모든 YESS 변경 이벤트 (insert)
```

**핵심 제약**:
- 모든 YESS 트랜잭션 엔티티(`yess_patch_*`, `yess_work_*`, `yess_personal_events`, `yess_company_year_profiles`)는 `year_context_id`를 반드시 가진다.
- YESS 전용 테이블에서 공유 테이블을 참조하는 FK는 **허용**. 반대 방향은 **금지** (§0.4.2).

### 4.3 모듈 경계 (Next.js 기준)

YESS는 Next.js 단일 앱으로 구성되며, 각 도메인은 App Router의 **route group** + **Route Handler** + **Server Action** 세트로 나뉜다. Jarvis와 별도 배포되지만 DB와 인증 기반은 공유한다.

| 모듈 (features/) | 주 테이블 | Route Handler | 비고 |
|---|---|---|---|
| `auth` | `user` [S], `user_session` [S] | `/api/auth/*` | Jarvis와 세션 공유 |
| `year-contexts` | `yess_year_contexts` | `/api/year-contexts/*` | |
| `companies` | `company` [S], `yess_company_contacts` | `/api/companies/*`, `/api/company-contacts/*` | Jarvis `company` 쓰기 범위는 협의 (§0.4.5 J1) |
| `company-year-profiles` | `yess_company_year_profiles`, `yess_company_maintainers` | `/api/company-year-profiles/*` | |
| `patches` | `yess_patch_rounds`, `yess_patch_items`, `yess_patch_artifacts` | `/api/patch-rounds/*`, `/api/patch-items/*`, `/api/patch-artifacts/*` | |
| `patch-targets` | `yess_patch_targets` | `/api/patch-targets/*` | 기능 1 핵심 |
| `work-items` | `yess_work_items` | `/api/work-items/*` | |
| `work-logs` | `yess_work_logs` | `/api/work-logs/*` | |
| `schedules` | `yess_personal_events` | `/api/schedules/*` | TF 내부 개인 일정 (연차/반차/출장/회의). Jarvis 근태와 분리 |
| `imports` | (스크립트) | `/api/imports/*` | 관리자 전용 |
| `reports` | (집계 쿼리) | `/api/reports/*` | |
| `audit` | `audit_log` [S] | - (middleware) | Next middleware + Prisma client extension으로 insert |

**공통 미들웨어**:
- `middleware.ts` — 세션 검증, `x-current-user` 주입
- Prisma `$extends` — audit_log 자동 insert, `yess_*` 테이블 수정 시 before/after 스냅샷

---

## 5. 데이터 모델

### 5.1 ERD (텍스트)

범례: `[S]` = Shared (Jarvis 소유), `[Y]` = YESS 전용

```
[Y] yess_year_contexts ◄────────┐
                                 │
[S] company ◄──┐                 │
               │                 │
               ▼                 ▼
          ┌──────────────────────────────┐
          │ [Y] yess_company_year_       │
          │     profiles                  │
          └────┬─────────────────────────┘
               │
               ├──► [Y] yess_company_maintainers ──► [S] user
               ├──► [Y] yess_patch_targets
               │         │
               │         └── [Y] yess_patch_target_items (v1.5)
               │
[Y] yess_patch_rounds                (◄ yess_year_contexts)
      │
      └─► [Y] yess_patch_items
             ├─► [Y] yess_patch_artifacts
             └─► [Y] yess_patch_targets (via FK)

[Y] yess_company_contacts ──► [S] company

[Y] yess_work_items  (FK nullable: company[S], patch_round, patch_item, patch_target, assignee→user[S])
      │
      └─► [Y] yess_work_logs (FK nullable: work_item, patch_*, user[S])

[Y] yess_personal_events (연차/반차/출장/회의 — TF 내부 공유용, Jarvis 근태와 분리)

[S] audit_log            (YESS가 insert, target_type=yess.*)
[S] attachment, raw_source (v1.5+ 파일 첨부 시 재사용)
[S] menu_item, code_group, code_item (공통 코드/메뉴)
```

### 5.2 테이블 상세

아래 모든 YESS 전용 테이블은 공통적으로 다음을 가진다.

- 테이블명은 `yess_` prefix
- `id`: `bigserial` PK
- `created_at`, `updated_at`: `timestamptz DEFAULT now()`
- 삭제 정책: **선택적 soft delete** — 파급 범위가 큰 핵심 엔티티는 `deleted_at timestamptz NULL`을 가진다. 해당 대상은 **(4) yess_company_year_profiles, (7) yess_patch_rounds, (8) yess_patch_items, (10) yess_patch_targets, (12) yess_work_items**. 이 외 테이블(`work_logs`, `personal_events`, `company_contacts`, `company_maintainers`, `patch_artifacts`, `year_contexts`)은 hard delete를 유지해 단순성을 보존한다.
  - soft delete 적용 테이블의 모든 조회 쿼리는 `WHERE deleted_at IS NULL`을 기본 필터로 한다 (Prisma에서는 공통 헬퍼/확장으로 주입).
  - `UNIQUE` 제약은 `WHERE deleted_at IS NULL` 부분 인덱스(partial unique index)로 선언해 삭제된 행과 신규 행의 키 충돌을 방지한다.
  - 삭제/복구 이벤트는 Jarvis `audit_log`에 반드시 기록 (`target_type=yess.<entity>`, `action=SOFT_DELETE | RESTORE`).
- 인덱스는 FK 전수 + 아래 명시된 복합 인덱스
- 공유 테이블(Jarvis 소유) 참조 시 FK는 `ON DELETE RESTRICT` 기본

#### (S1) 공유 테이블: user / role / permission / user_role / role_permission / user_session

**소유**: Jarvis · **YESS 권한**: 읽기 (+ user_role에 YESS role만 쓰기)

- YESS는 **자체 `users`·`sessions` 테이블을 두지 않는다.** Jarvis의 `user`, `user_session`을 그대로 사용.
- 역할은 `role.code`로 식별한다. YESS에서 사용할 코드 예:
  - `yess.admin` / `yess.tf_lead` / `yess.tf_member` / `yess.maintainer` / `yess.viewer`
- YESS 전용 permission은 `permission.code = yess.*` 네임스페이스로 추가 (예: `yess.patch.target.update`, `yess.patch.review`).
- 구 v2.0 문서의 `UserRole` enum은 폐기 — DB role/permission 기반 RBAC로 대체.
- 운영 전환 시점에 Jarvis가 SSO와 연동되면 YESS는 자동 적용됨 (추가 개발 없음).

#### (S2) 공유 테이블: company

**소유**: Jarvis · **YESS 권한**: 읽기, (쓰기는 협의 대상 — §0.4.5 J1)

- YESS는 자체 `companies` 테이블을 두지 않는다.
- `yess_company_year_profiles.company_id` → `company.id` FK (RESTRICT).
- 기본 가정: YESS에서 신규 고객사 생성이 필요할 때 Jarvis API로 위임. Jarvis 측에 YESS 사용 가능한 생성 엔드포인트가 없으면 관리자 화면에서 Jarvis 고객사 목록을 선택만 가능.
- 구 v2.0 §5.2(3) `companies` 스키마는 폐기.

#### (S3) 공유 테이블: audit_log

**소유**: Jarvis · **YESS 권한**: insert 전용 + 자체 레코드 조회

- YESS는 자체 `audit_logs` 테이블을 두지 않는다.
- insert 시 필드 규약:
  - `source_app = 'yess'` (또는 Jarvis 스키마에 해당 컬럼이 없으면 `target_type` prefix로 `yess.` 네임스페이스)
  - `target_type`: `yess.patch_target`, `yess.work_item`, `yess.company_year_profile` 등
  - `target_id`: 대상 YESS 엔티티 id (BigInt)
  - `before_value` / `after_value`: JSONB
- 수집 방식: Prisma `$extends` client extension에서 `yess_*` 테이블 update/delete 훅 → audit_log insert.

#### (S4) *(제거됨)*

v2.3까지 있던 `leave_request`/`holiday` 공유는 **v2.4에서 폐기**. YESS는 Jarvis 근태 시스템과 연동하지 않는다.
- TF 개인 연차/반차는 `yess_personal_events` (§5.2(14))에서 직접 관리 (TF 내부에서만 공유).
- 공휴일 표시는 프론트엔드 상수 또는 JS `Intl`로 처리 (DB 테이블 불필요).

#### (S5) 공유 테이블: attachment / raw_source (v1.5+)

파일 첨부 기능 도입 시(v1.5) Jarvis `attachment`·`raw_source` 그대로 재사용. 프로토타입 범위 밖.

#### (S6) 공유 테이블: menu_item / code_group / code_item

- YESS 메뉴는 `menu_item`에 `app = 'yess'` 레코드로 등록 (Jarvis 메뉴 UI와 통합할지는 §0.4.5 J4).
- 공통코드로 이동할 YESS enum은 협의 후 결정 (§0.4.5 J5).

---

#### (1) yess_year_contexts

귀속연도 최상위 네임스페이스.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| tax_year | int | UNIQUE NOT NULL | 2026, 2027 |
| name | varchar(60) | NOT NULL | "2026 귀속 연말정산" |
| phase | enum | NOT NULL DEFAULT 'PREPARE' | PREPARE / ACTIVE / CLOSED |
| start_date | date | | |
| end_date | date | | |
| created_at | timestamptz | NOT NULL | |

- UNIQUE(tax_year)
- 하나의 tax_year당 하나의 레코드만 허용.

#### (4) yess_company_year_profiles

연도별 환경정보. **첨부 1번 시트의 대부분 컬럼이 여기에 저장**.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| year_context_id | bigint | FK NOT NULL → `yess_year_contexts.id` | |
| company_id | bigint | FK NOT NULL → `company.id` [S] | Jarvis 소유 테이블 참조 |
| product_version | varchar(20) | | "4.4", "4.6", "5.x" |
| character_set | varchar(20) | | "UTF-8", "EUC-KR" |
| security_version | varchar(40) | | 보안 체크 버전 |
| java_version | varchar(20) | | |
| contract_type | enum | | MAINTENANCE / EXTERNAL / INTERNAL / OTHER |
| access_method | enum | | VPN / VDI / REMOTE / LOCAL / MAIL / OTHER |
| deploy_method | enum | | REMOTE / FTP / MAIL / DELIVER / OTHER |
| uses_year_end_settlement | boolean | NOT NULL DEFAULT true | |
| uses_withholding_tax | boolean | NOT NULL DEFAULT false | |
| special_notes | text | | |
| raw_import_data | jsonb | | 원본 시트 백업용 |
| created_at | timestamptz | NOT NULL | |
| updated_at | timestamptz | NOT NULL | |
| deleted_at | timestamptz | NULL | soft delete 마커 |

- UNIQUE(year_context_id, company_id) WHERE deleted_at IS NULL — partial unique index
- 인덱스: (year_context_id) WHERE deleted_at IS NULL, (company_id) WHERE deleted_at IS NULL

#### (5) yess_company_contacts

YESS 도메인 전용 고객사 연락처 (연말정산·원천세 담당자 위주). Jarvis에 전사적 연락처 테이블이 있다면 v1.5에 통합 검토.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| company_id | bigint | FK NOT NULL → `company.id` [S] | |
| name | varchar(60) | NOT NULL | |
| department | varchar(60) | | |
| phone | varchar(40) | | |
| email | varchar(120) | | |
| contact_type | enum | | IT / YEAR_END / WITHHOLDING / OTHER |
| primary_yn | boolean | NOT NULL DEFAULT false | 대표 연락처 |
| memo | text | | |

- company 레벨에 붙이는 이유: 연도별로 연락처가 크게 바뀌지 않음. 필요 시 `year_context_id` 추가 고려(v1.5).
- 개인정보 접근 로그는 v1 이후 도입.
- Jarvis 팀에 전사 연락처 테이블이 있으면 `yess_company_contacts` 폐기하고 재사용 검토 (§0.4.5 협의).

#### (6) yess_company_maintainers

유지보수 담당자 배정 + MAINTAINER ACL 근거.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| company_year_profile_id | bigint | FK NOT NULL → `yess_company_year_profiles.id` | |
| user_id | bigint | FK NOT NULL → `user.id` [S] | role=yess.maintainer 또는 yess.tf_* |
| primary_yn | boolean | NOT NULL DEFAULT false | |

- UNIQUE(company_year_profile_id, user_id)
- 인덱스: (user_id) — ACL 조회 고속화용

#### (7) yess_patch_rounds

차수.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| year_context_id | bigint | FK NOT NULL → `yess_year_contexts.id` | |
| round_no | int | NOT NULL | 차수 번호 (patch_type 내 순번). 1, 2, 3, ... |
| round_code | varchar(20) | NOT NULL | "2026-D01" (§5.2.7a 포맷 참조) |
| round_name | varchar(60) | NOT NULL | "연중 01" |
| patch_type | enum | NOT NULL | YEAR_END / WITHHOLDING / SEPARATE / GUIDE |
| release_date | date | | |
| due_date | date | | |
| status | enum | NOT NULL DEFAULT 'DRAFT' | DRAFT / RELEASED / IN_PROGRESS / CLOSED |
| description | text | | |
| created_by | bigint | FK → `user.id` [S] | |
| created_at | timestamptz | NOT NULL | |
| deleted_at | timestamptz | NULL | soft delete 마커 |

- UNIQUE(year_context_id, round_code) WHERE deleted_at IS NULL
- UNIQUE(year_context_id, patch_type, round_no) WHERE deleted_at IS NULL — 같은 연도·타입 내 차수 번호 중복 금지
- 인덱스: (year_context_id, round_no) WHERE deleted_at IS NULL

##### 5.2.7a `round_code` 생성 규칙

포맷: **`{tax_year}-{type_prefix}{round_no:02d}`**

| patch_type | type_prefix | round_code 예 | round_name 예 |
|---|:---:|---|---|
| YEAR_END (연중패치) | **D** | `2026-D01`, `2026-D02` | "연중 01" |
| WITHHOLDING (원천세) | **W** | `2026-W01` | "원천세 01" |
| SEPARATE (별도패치) | **S** | `2026-S01` | "별도 01" |
| GUIDE (가이드) | **G** | `2026-G01` | "가이드 01" |

- `round_no`는 **patch_type 내부에서 1부터 증가**한다. 즉 "2026-D01" 다음 연중패치는 "2026-D02", 다음 원천세 패치는 별개 시퀀스로 "2026-W01".
- `round_code`는 사용자가 `patch_type` + `round_no` 입력 시 시스템이 자동 생성한다 (Server Action 레이어에서 합성).
- `patch_type` 변경은 금지 (변경 시 round_code 재계산 부작용 방지).
- `type_prefix` 매핑 테이블은 공통코드(`code_group = 'yess.patch_type'`)로 외부화 고려 (§0.4.5 J5).

##### 5.2.7b 패치 항목의 전역 식별자

특정 패치 항목을 외부(이메일·문서·커밋 메시지·대화)에서 지칭할 때는 다음 포맷을 사용한다.

**`{round_code}-{patch_no}`** → 예: `2026-D01-003`

- `2026-D01-003` = 2026 귀속 · 연중 1차 · 세부 작업 003번
- 이 값은 DB의 별도 컬럼이 아니라 **조회용 파생 값** (Prisma computed field 또는 view).
- URL에서도 동일 포맷 사용: `/patches/rounds/2026-D01/items/003`
- 검색창에 `2026-D01-003` 입력 시 바로 해당 항목 Drawer 오픈 (UX 편의).

#### (8) yess_patch_items

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| patch_round_id | bigint | FK NOT NULL → `yess_patch_rounds.id` | |
| patch_no | varchar(10) | NOT NULL | "001", "002" (문자열로 둠 — 001 leading zero 보존) |
| title | varchar(200) | NOT NULL | |
| category | enum | NOT NULL | SOURCE / DB / RD / CONFIG / GUIDE |
| version_scope | enum | NOT NULL DEFAULT 'BOTH' | V4 / V5 / BOTH |
| special_notes | text | | "※ 가이드 패치" 등 |
| contents | text | | 상세 설명 |
| memo | text | | |
| guide_patch_yn | boolean | NOT NULL DEFAULT false | |
| followup_required_yn | boolean | NOT NULL DEFAULT false | 후속조치 자동 생성 후보 |
| raw_import_data | jsonb | | |
| created_at | timestamptz | NOT NULL | |
| deleted_at | timestamptz | NULL | soft delete 마커 |

- UNIQUE(patch_round_id, patch_no) WHERE deleted_at IS NULL
- 인덱스: (patch_round_id) WHERE deleted_at IS NULL

#### (9) yess_patch_artifacts

파일 경로·SQL·URL 등 실제 산출물.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| patch_item_id | bigint | FK NOT NULL → `yess_patch_items.id` | |
| artifact_type | enum | NOT NULL | FILE_PATH / SQL / URL / NOTE |
| version_scope | enum | NOT NULL DEFAULT 'BOTH' | V4 / V5 / BOTH |
| content | text | NOT NULL | 경로/쿼리/URL/메모 본문 |
| memo | text | | |

- 인덱스: (patch_item_id)

#### (10) yess_patch_targets

**기능 1 핵심 테이블**. 고객사별 패치 반영 현황. **MAINTAINER가 `apply_status`로 셀프-종결한다.** TF 건별 검토는 없다.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| year_context_id | bigint | FK NOT NULL → `yess_year_contexts.id` | (denormalized for 필터링) |
| company_year_profile_id | bigint | FK NOT NULL → `yess_company_year_profiles.id` | |
| patch_round_id | bigint | FK NOT NULL → `yess_patch_rounds.id` | |
| maintainer_id | bigint | FK → `user.id` [S] | 배정 담당자 (생성 시 yess_company_maintainers.primary에서 자동) |
| apply_status | enum | NOT NULL DEFAULT 'NOT_STARTED' | (§5.3 참조) |
| scheduled_date | date | | |
| applied_at | timestamptz | | |
| applied_by | bigint | FK → `user.id` [S] | |
| issue_summary | text | | MAINTAINER가 남기는 이슈 메모 (TF가 후속조치 생성 시 참조) |
| special_note | text | | |
| created_at | timestamptz | NOT NULL | |
| updated_at | timestamptz | NOT NULL | |
| deleted_at | timestamptz | NULL | soft delete 마커 |

- UNIQUE(patch_round_id, company_year_profile_id) WHERE deleted_at IS NULL
- 인덱스: (maintainer_id, apply_status) WHERE deleted_at IS NULL, (year_context_id, patch_round_id) WHERE deleted_at IS NULL, (apply_status) WHERE deleted_at IS NULL

#### (11) yess_patch_target_items *(v1.5+, 프로토타입 생략)*

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| patch_target_id | bigint | FK NOT NULL → `yess_patch_targets.id` | |
| patch_item_id | bigint | FK NOT NULL → `yess_patch_items.id` | |
| item_status | enum | NOT NULL DEFAULT 'NOT_STARTED' | NOT_STARTED / DONE / SKIPPED / FAILED |
| note | text | | |

#### (12) yess_work_items

TF 업무 카드. Kanban 카드이자 후속조치 원천.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| year_context_id | bigint | FK NOT NULL → `yess_year_contexts.id` | |
| type | enum | NOT NULL | PATCH / FOLLOW_UP / CUSTOMER_SUPPORT / TEST / MEETING / GENERAL |
| title | varchar(200) | NOT NULL | |
| description | text | | |
| status | enum | NOT NULL DEFAULT 'BACKLOG' | BACKLOG / TODO / IN_PROGRESS / BLOCKED / REVIEW / DONE |
| priority | enum | NOT NULL DEFAULT 'P2' | P0 / P1 / P2 / P3 |
| assignee_id | bigint | FK → `user.id` [S] | |
| reporter_id | bigint | FK NOT NULL → `user.id` [S] | |
| company_id | bigint | FK → `company.id` [S] | nullable |
| patch_round_id | bigint | FK → `yess_patch_rounds.id` | nullable |
| patch_item_id | bigint | FK → `yess_patch_items.id` | nullable |
| patch_target_id | bigint | FK → `yess_patch_targets.id` | nullable |
| start_date | date | | |
| due_date | date | | |
| completed_at | timestamptz | | |
| patch_required_yn | boolean | NOT NULL DEFAULT false | 후속조치가 패치로 이어지는 경우 |
| result_note | text | | |
| sort_order | int | NOT NULL DEFAULT 0 | Kanban 정렬 |
| created_at | timestamptz | NOT NULL | |
| updated_at | timestamptz | NOT NULL | |
| deleted_at | timestamptz | NULL | soft delete 마커 |

- 인덱스(모두 `WHERE deleted_at IS NULL` partial index): (year_context_id, status), (assignee_id, status), (type, status), (patch_round_id), (patch_target_id)
- 모든 `*_id`는 nullable (다형 연결 대신 명시 FK).

#### (13) yess_work_logs

일일업무 로그.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| work_date | date | NOT NULL | |
| user_id | bigint | FK NOT NULL → `user.id` [S] | |
| work_item_id | bigint | FK → `yess_work_items.id` | nullable |
| patch_round_id | bigint | FK → `yess_patch_rounds.id` | nullable (업무 카드 없이 직접 차수 연결) |
| patch_item_id | bigint | FK → `yess_patch_items.id` | nullable |
| patch_target_id | bigint | FK → `yess_patch_targets.id` | nullable |
| log_type | enum | NOT NULL | PATCH / FOLLOW_UP / GENERAL / MEETING / SUPPORT |
| content | text | NOT NULL | |
| issue_note | text | | |
| next_action | text | | |
| spent_minutes | int | | |
| created_at | timestamptz | NOT NULL | |
| updated_at | timestamptz | NOT NULL | |

- **절대 polymorphic(link_type + link_id)로 설계하지 않는다.** 명시 FK.
- 인덱스: (work_date, user_id), (work_item_id), (user_id, work_date DESC)

#### (14) yess_personal_events

TF 내부 개인 일정. **연차/반차/출장/회의/기타**를 모두 포괄한다. Jarvis 근태 시스템과는 독립적으로 운영되며, YESS 안에서만 공유된다 (전사 근태 연동 불필요).

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | bigserial | PK | |
| user_id | bigint | FK NOT NULL → `user.id` [S] | |
| event_type | enum | NOT NULL | ANNUAL / HALF_AM / HALF_PM / BUSINESS_TRIP / MEETING / OTHER |
| start_date | date | NOT NULL | |
| end_date | date | NOT NULL | |
| memo | varchar(200) | | |

- 인덱스: (user_id, start_date), (start_date, end_date)
- **주의**: 전사 근태(Jarvis `leave_request`)와 중복 입력될 수 있음. YESS는 TF 간 "오늘 누가 자리에 없는지" 확인용으로만 사용 → 회사 공식 연차 신청은 Jarvis에서 별도 진행.

#### (15) audit_log [S]

**YESS는 자체 테이블을 두지 않는다.** Jarvis `audit_log`를 사용한다 (§5.2 (S3) 참조).

### 5.3 주요 Enum 정의

```typescript
// yess_year_contexts.phase
enum YearPhase { PREPARE, ACTIVE, CLOSED }

// 역할은 DB 기반 role.code로 관리 (Jarvis RBAC 재사용). 참고용 상수:
// 'yess.admin' / 'yess.tf_lead' / 'yess.tf_member' / 'yess.maintainer' / 'yess.viewer'

// yess_company_year_profiles.contract_type
enum ContractType { MAINTENANCE, EXTERNAL, INTERNAL, OTHER }

// yess_company_year_profiles.access_method
enum AccessMethod { VPN, VDI, REMOTE, LOCAL, MAIL, OTHER }

// yess_company_year_profiles.deploy_method
enum DeployMethod { REMOTE, FTP, MAIL, DELIVER, OTHER }

// yess_patch_rounds.patch_type
enum PatchType { YEAR_END, WITHHOLDING, SEPARATE, GUIDE }

// yess_patch_rounds.status
enum PatchRoundStatus { DRAFT, RELEASED, IN_PROGRESS, CLOSED }

// yess_patch_items.category
enum PatchCategory { SOURCE, DB, RD, CONFIG, GUIDE }

// yess_patch_items.version_scope, yess_patch_artifacts.version_scope
enum VersionScope { V4, V5, BOTH }

// yess_patch_artifacts.artifact_type
enum ArtifactType { FILE_PATH, SQL, URL, NOTE }

// yess_patch_targets.apply_status
enum ApplyStatus {
  NOT_STARTED,      // 미진행
  SCHEDULED,        // 예정
  IN_PROGRESS,      // 진행중
  APPLIED,          // 반영완료 (유지보수자 기준)
  FAILED,           // 실패
  HOLD,             // 보류
  NOT_REQUIRED,     // 대상아님
}

// yess_work_items.type
enum WorkItemType {
  PATCH,
  FOLLOW_UP,
  CUSTOMER_SUPPORT,
  TEST,
  MEETING,
  GENERAL,
}

// yess_work_items.status
enum WorkItemStatus {
  BACKLOG,          // 대기
  TODO,             // 예정
  IN_PROGRESS,      // 진행중
  BLOCKED,          // 보류
  REVIEW,           // 검토
  DONE,             // 완료
}

// yess_work_items.priority
enum Priority { P0, P1, P2, P3 }

// yess_work_logs.log_type
enum LogType { PATCH, FOLLOW_UP, GENERAL, MEETING, SUPPORT }

// yess_personal_events.event_type
enum PersonalEventType { ANNUAL, HALF_AM, HALF_PM, BUSINESS_TRIP, MEETING, OTHER }

// audit_log.action (Jarvis 스키마 준수. YESS는 insert 시 아래 값 중 선택)
// CREATE / UPDATE / DELETE / STATUS_CHANGE / REVIEW
```

### 5.4 상태 전이 다이어그램

#### 5.4.1 yess_patch_targets.apply_status (유지보수자 주도, 셀프-종결)

```
NOT_STARTED ──┬──► SCHEDULED ──► IN_PROGRESS ──┬──► APPLIED (최종)
              │                                 ├──► FAILED ──► IN_PROGRESS (재시도)
              │                                 └──► HOLD ──► IN_PROGRESS
              └──► NOT_REQUIRED  (대상아님으로 판단)
```

- `APPLIED`는 **최종 종결 상태**. TF의 별도 승인은 없다.
- `APPLIED` 진입 시 `applied_at = now()`, `applied_by = actor` 자동 기록.
- 이후 이슈 발견 시 TF/MAINTAINER는 `apply_status`를 `FAILED`/`HOLD`로 되돌릴 수 있고, 추적은 `audit_log`에서 가능.
- 후속 대응이 필요하면 `yess_work_items.type=FOLLOW_UP` 카드를 생성해 처리한다.

#### 5.4.2 yess_work_items.status

```
BACKLOG ──► TODO ──► IN_PROGRESS ──┬──► REVIEW ──► DONE
                                    ├──► BLOCKED ──► IN_PROGRESS
                                    └──► DONE (검토 생략 가능)
```

- `DONE` 진입 시 `completed_at = now()` 자동 세팅.
- `BLOCKED`는 이유를 `result_note`에 기록 권장.

### 5.5 자동화 트리거 & 불변식

| 트리거 | 조건 | 동작 |
|---|---|---|
| T1 | `yess_patch_targets.apply_status = APPLIED` | `applied_at = now()`, `applied_by = actor` |
| T2 | `yess_work_items.status = DONE` | `completed_at = now()` |
| T3 | `yess_patch_rounds` 생성 → `generate-targets` 호출 | 조건에 맞는 `yess_company_year_profiles` 순회해 `yess_patch_targets` 일괄 생성 |
| T4 | 모든 상태 변경 | Jarvis `audit_log`에 before/after 기록 (Prisma `$extends` client extension) |

**불변식**:
- `yess_work_logs.work_item_id`가 NULL이면 `log_type`이 반드시 지정되어야 한다.
- `yess_company_year_profiles`는 `(year_context_id, company_id)` 조합이 유일.
- `yess_patch_targets.apply_status = APPLIED`인 레코드를 `NOT_STARTED`로 되돌리려면 audit 근거(actor, reason)가 남는다 (API 정책).

---

## 6. 핵심 업무 흐름

전체 사이클은 ①→⑥의 순서로 진행된다. 각 단계는 아래 서브섹션에서 상세 기술.

### 6.1 ① 전년도 후속조치 등록 (사이클 시작)

현 사이클(예: 2026 귀속)이 시작되면 TF는 이전 연도에 쌓인 이슈·보완 사항을 모두 `yess_work_items.type = FOLLOW_UP`으로 올린다. 신규 요건(국세청 가이드 변경 등)도 동일 테이블에 `type = PATCH` 또는 `GENERAL`로 추가한다.

```
[TF_LEAD] 이전 연도 후속조치 백로그 정리
  │  - 2025 귀속에서 종결되지 못한 work_items 중 이월 대상 선별
  │  - 신규 요건 (세법 개정, 가이드 업데이트 등) 추가
  ▼
[TF_LEAD] work_items 일괄 등록 (연도: 2026)
  │  POST /work-items
  │  { year_context_id, type: FOLLOW_UP, title, priority, patch_required_yn, ... }
  ▼
[결과] Kanban "대기(BACKLOG)" 컬럼에 이슈 리스트 생성
```

### 6.2 ② TF 작업 배정 + 일일업무 로그

```
[TF_LEAD] 업무 카드별로 담당자 배정
  │  PATCH /work-items/:id { assignee_id, status: TODO, due_date }
  ▼
[TF_MEMBER] Kanban에서 내 카드 확인 → 진행
  │  PATCH /work-items/:id/status { status: IN_PROGRESS }
  ▼
[TF_MEMBER] 매일 /tasks/daily에서 일일업무 로그 기록
  │  POST /work-logs
  │  { work_date, work_item_id, log_type, content, issue_note, next_action, spent_minutes }
  ▼
[결과]
  │  - work_item 상세의 "일일 로그" 탭에 자동 누적
  │  - TF 리드가 대시보드·Kanban으로 진행상황 파악
```

### 6.3 ③ 차수별 패치 항목 정식화

TF의 개발·검증 작업이 어느 정도 마무리되면 관련 work_items를 묶어 공식 배포 단위인 **패치 차수 + 패치 항목**으로 정식화한다.

```
[TF_LEAD] 패치 차수 생성
  │  POST /patch-rounds
  │  { year_context_id, patch_type: YEAR_END, round_no: 1 }
  │  → round_code "2026-D01" 자동 생성
  ▼
[TF_LEAD] 해당 차수에 패치 항목 등록 (여러 건)
  │  POST /patch-rounds/:id/items
  │  { patch_no: "001", title: "퇴직소득 원천징수영수증 수정", category, version_scope, ... }
  │  POST /patch-rounds/:id/items
  │  { patch_no: "002", title: "임원동일인공제액관리", ... }
  ▼
[TF_LEAD] 아티팩트 첨부 (파일경로·SQL·URL)
  │  POST /patch-items/:id/artifacts × N
  ▼
[TF_LEAD] work_item ↔ patch_item 연결
  │  PATCH /work-items/:id { patch_item_id: Y, patch_round_id: Z }
  │  → 작업 이력과 정식 패치가 쌍방향으로 추적됨
  ▼
[TF_LEAD] 차수 상태 변경: DRAFT → RELEASED
  │  PATCH /patch-rounds/:id { status: RELEASED, release_date }
```

### 6.4 ④ 고객사별 반영 대상 자동 생성

```
[TF_LEAD] 대상 조건 지정 후 generate-targets 호출
  │  POST /patch-rounds/:id/generate-targets
  │  body: { filters: { uses_year_end_settlement: true, version_scope: ["V4","V5"] } }
  ▼
[시스템] 조건에 맞는 yess_company_year_profiles 전체 조회
  │  각 프로필의 primary maintainer를 maintainer_id로 설정
  │  yess_patch_targets 일괄 생성 (apply_status=NOT_STARTED)
  ▼
[결과] 각 MAINTAINER의 "내 담당 목록"에 새 차수가 자동 노출
```

### 6.5 ⑤ 유지보수 담당자 반영

```
[MAINTAINER] 로그인 → /patches/targets?mine=true
  ▼
[MAINTAINER] 내 담당 고객사 패치 목록 조회 (본인 primary만 기본)
  ▼
[MAINTAINER] 고객사별로 상태 업데이트
  │  PATCH /patch-targets/:id/status
  │  { apply_status: "APPLIED", applied_at, reflect_note, special_note }
  ▼
[시스템 T1] applied_at / applied_by 자동 기록, audit_log insert
  ▼
[결과] 해당 patch_target은 종결 상태(APPLIED)로 진입. TF 별도 승인 불필요.
```

### 6.6 ⑥ 반영 후 이슈 모니터링 → 다음 사이클로 순환

```
[TF_LEAD/TF_MEMBER] 대시보드 또는 /patches/targets 접속
  │  - 필터: "지연" (due_date < today & apply_status ≠ APPLIED)
  │  - 필터: "이슈 있음" (issue_summary 존재)
  │  - 필터: "FAILED / HOLD"
  ▼
[TF] 문제 건 발견 시 상세 Drawer 확인
  │  - 환경정보, 연락처, 최근 work_logs
  ▼
[TF] 후속조치 카드 생성
  │  POST /work-items
  │  { type: FOLLOW_UP, year_context_id: (현재 또는 내년), patch_target_id: X, ... }
  ▼
[분기]
  ├─ 현재 사이클 내 해결 가능: § 6.2 ②로 복귀하여 처리
  │
  └─ 내년 귀속으로 이월: year_context_id = 내년, backlog 보관
     → 내년 사이클 § 6.1 ①의 입력으로 사용
```

> **참고**: v2.1까지 있던 `/patches/review` 검토대기·승인·반려 플로우는 v2.2에서 제거됨. TF 건별 검토 대신 위 샘플링 모니터링으로 대체한다.

---

## 7. 화면 설계

### 7.1 IA & 메뉴 트리

```
YESS
├─ 대시보드 (/)
├─ 패치 관리 (/patches)
│  ├─ 고객사 패치 현황 (/patches/targets)        ← 첨부1 대체
│  ├─ 패치 차수 관리 (/patches/rounds)           ← 첨부3 대체 (리스트)
│  └─ 패치 항목 관리 (/patches/rounds/:id)       ← 첨부3 대체 (상세)
├─ TF 업무 관리 (/tasks)
│  ├─ Kanban 보드 (/tasks/board)                 ← 첨부2/4 대체 (보드)
│  ├─ 업무 리스트 (/tasks/list)
│  ├─ 일일업무 (/tasks/daily)                    ← 첨부2 대체
│  ├─ 후속조치 (/tasks/follow-ups)               ← 첨부4 대체
│  └─ 개인일정 (/tasks/schedules)
├─ 고객사 관리 (/companies)
│  ├─ 고객사 목록 (/companies)
│  ├─ 연도별 환경정보 (/companies/year-profiles)
│  └─ 연락처/접속정보 (/companies/:id/contacts)
├─ 리포트 (/reports)
│  ├─ 차수별 진행률 (/reports/patch-progress)
│  ├─ 담당자별 현황 (/reports/assignee)
│  └─ 지연/이슈 현황 (/reports/issues)
└─ 관리자 (/admin) [ADMIN/TF_LEAD only]
   ├─ 사용자 관리 (/admin/users)
   ├─ 권한 관리 (/admin/roles)
   ├─ 코드 관리 (/admin/codes)
   └─ 데이터 이관 (/admin/imports)
```

### 7.2 주요 화면 상세

#### 7.2.1 대시보드 (`/`)

**목적**: 오늘 무엇에 주목할지 한눈에.

**구성**:
- 상단 카드 (8개):
  - 전체 패치 대상 수 / 미진행(NOT_STARTED) / 진행중(IN_PROGRESS) / 반영완료(APPLIED)
  - 실패(FAILED) / 보류(HOLD) / 지연(due_date 초과 & 미완료) / 이슈(issue_summary 존재)
- 그래프 (4개):
  - 차수별 완료율 (stacked bar)
  - 담당자별 진행률 (horizontal bar)
  - TF 업무 상태별 건수 (donut)
  - 후속조치 상태별 건수 (donut)
- 오늘의 내 업무 리스트
- 부재자(오늘 연차/반차) 배너

**권한별 기본 필터**:
- TF_LEAD/TF_MEMBER: 전체
- MAINTAINER: 본인 담당 고객사만
- VIEWER: 전체(조회)

#### 7.2.2 고객사 패치 현황 (`/patches/targets`)

**목적**: 첨부1 구글 시트의 완전 대체.

**UX 요구사항**:

| 기능 | 설명 |
|---|---|
| 엑셀형 그리드 | TanStack Table, 셀 인라인 수정 |
| 고정 컬럼 | 회사명 / 담당자 / apply_status 좌측 고정 |
| 인라인 수정 | apply_status, scheduled_date, special_note 등 |
| 필터 | 차수, 담당자, apply_status, 버전, 접속방법, 지연 여부, 이슈 여부 |
| 내 담당 토글 | MAINTAINER는 기본 ON, TF는 OFF |
| 상세 Drawer | 행 클릭 시 우측 40% 폭 패널 |
| 변경 이력 | Drawer 내 탭에서 `audit_log` 조회 (target_type='yess.patch_target') |
| 일괄 변경 | 다중 선택 → 상태/예정일/담당자 일괄 |

**컬럼 (기본 16열)**:

```
회사명 | 버전 | charset | 계약형태 | 담당자(primary) | 접속방법 | 반영방법
| 연말정산 | 원천세 | 연락처(n명) | apply_status
| 예정일 | 반영일 | 특이사항/이슈 | 최근수정자 | 최근수정일
```

#### 7.2.3 패치 차수 / 항목 관리 (`/patches/rounds`, `/patches/rounds/:id`)

**목적**: 첨부3 대체.

**리스트 화면**:
- 좌측 트리: 2026 귀속 → 연중 01/02/... → 각 항목 preview
- 우측 메인: 선택된 차수의 항목 테이블

**항목 상세 Drawer (또는 전체 화면)**:
- 탭 구성:
  1. **기본 정보** — patch_no, title, category, version_scope, release/due
  2. **상세 내용** — contents (리치 텍스트 아님, 순수 markdown)
  3. **특이사항** — special_notes (예: "※ 가이드 패치")
  4. **4.x 적용 정보** — patch_artifacts where version_scope in (V4, BOTH)
  5. **5.x 적용 정보** — patch_artifacts where version_scope in (V5, BOTH)
  6. **소스 경로** — artifact_type=FILE_PATH 목록 (코드 블록 스타일)
  7. **SQL** — artifact_type=SQL (SQL 하이라이팅)
  8. **비고/커밋** — memo
  9. **관련 후속조치** — work_items where patch_item_id = 현재
  10. **관련 일일업무 로그** — work_logs where patch_item_id = 현재

#### 7.2.4 Kanban 보드 (`/tasks/board`)

**목적**: 첨부2/4의 TF 업무 시각화.

**구성**:
- 컬럼 6개: 대기 / 예정 / 진행중 / 보류 / 검토 / 완료 (work_items.status enum 1:1)
- 카드 정보: 제목 / 타입 뱃지 / 담당자 아바타 / 우선순위 점 / 차수 태그 / 고객사 / 마감일 / 최근 로그 스니펫
- 필터: 내 업무 / 담당자 / 업무유형 / 차수 / 고객사 / 상태 / 우선순위 / 지연 여부
- **프로토타입**: 드래그 대신 카드 상단 상태 드롭다운으로 컬럼 이동
- **v1**: dnd-kit 도입, 낙관적 업데이트 + 실패 시 롤백

#### 7.2.5 일일업무 (`/tasks/daily`)

**목적**: 첨부2 대체, TF 멤버가 매일 사용하는 핵심 화면.

**레이아웃** (상단부터):
1. 날짜 선택 (default: today)
2. 개인 일정 배너 (오늘 연차자 표시)
3. "내 업무 카드" 리스트 (오늘 기준 due_date 임박 or in_progress)
4. "오늘 작성한 work_logs" 리스트 (수정/삭제)
5. 일일업무 입력 폼:
   - log_type (select: 차수패치/후속조치/일반업무/회의/지원)
   - work_item_id (검색 select, "+ 새로 만들기" 옵션)
   - patch_round_id, patch_item_id, patch_target_id (연쇄 select, 선택)
   - company_id (선택)
   - content (textarea)
   - issue_note, next_action (선택)
   - spent_minutes
   - "저장 + work_item 상태 변경" 체크박스

#### 7.2.6 후속조치 (`/tasks/follow-ups`)

**목적**: 첨부4 대체. 실제로는 `work_items.type = FOLLOW_UP` 필터 뷰.

**컬럼**:
```
우선순위 | 제목(내용) | 비고 | 처리결과 | status | patch_required_yn
       | 담당자 | 시작일 | 완료일 | 관련 차수 | 관련 패치항목
```

후속조치 → 패치 연결 UX: 카드 상세에서 "패치 필요 여부 = 예" 토글 → 차수/항목 선택 모달 → 자동 연결.

#### 7.2.7 개인일정 (`/tasks/schedules`)

- 월간 달력 뷰 (기본)
- 내 일정 / 전체 일정 토글
- 연차/반차/출장 색상 구분

### 7.3 권한별 화면 노출

| 화면 | ADMIN | TF_LEAD | TF_MEMBER | MAINTAINER | VIEWER |
|---|:---:|:---:|:---:|:---:|:---:|
| 대시보드 | ✅ 전체 | ✅ 전체 | ✅ 전체 | ✅ 본인 | ✅ 조회 |
| 패치 현황 | ✅ | ✅ | ✅ | ✅ **본인 담당만** | ✅ 조회 |
| 패치 차수 관리 | ✅ | ✅ CRUD | ✅ 읽기 | ❌ | ❌ |
| 패치 항목 관리 | ✅ | ✅ CRUD | ✅ CRUD | ❌ | ❌ |
| Kanban | ✅ | ✅ | ✅ | ❌ | ✅ 조회 |
| 업무 리스트 | ✅ | ✅ | ✅ | ❌ | ✅ 조회 |
| 일일업무 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 후속조치 | ✅ | ✅ | ✅ | ❌ | ✅ 조회 |
| 개인일정 | ✅ 전체 | ✅ 전체 | ✅ 전체 | ✅ 본인 | ✅ 조회 |
| 고객사 관리 | ✅ | ✅ | ✅ | ✅ 본인 담당 | ✅ 조회 |
| 리포트 | ✅ | ✅ | ✅ | ❌ | ✅ |
| 관리자 | ✅ | ✅ 일부 | ❌ | ❌ | ❌ |

---

## 8. API 설계

### 8.1 공통 규약

#### 8.1.1 Base URL & 헤더
- Base URL: `/api` (Next.js Route Handlers, App Router 기준)
- Auth: Jarvis와 공유되는 세션 쿠키 우선. 필요 시 `Authorization: Bearer <JWT>` fallback
- Content-Type: `application/json; charset=utf-8`
- 요청 사용자 컨텍스트는 `middleware.ts`에서 세션 검증 후 Route Handler에 주입

#### 8.1.2 표준 응답 포맷

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "pageSize": 50, "total": 120 }
}
```

에러:
```json
{
  "success": false,
  "error": {
    "code": "PATCH_TARGET_NOT_FOUND",
    "message": "해당 패치 대상을 찾을 수 없습니다.",
    "details": { "id": 12345 }
  }
}
```

#### 8.1.3 페이지네이션
- 쿼리: `?page=1&pageSize=50&sort=updated_at:desc`
- 기본 pageSize: 50, 최대: 200

#### 8.1.4 필터
- 배열 필터: `?status[]=IN_PROGRESS&status[]=REVIEW`
- 기간: `?from=2026-01-01&to=2026-12-31`
- 전문 검색(LIKE): `?q=퇴직소득`

#### 8.1.5 에러 코드 (일부)

| HTTP | code | 설명 |
|---|---|---|
| 400 | VALIDATION_ERROR | 요청 스키마 오류 |
| 401 | UNAUTHORIZED | 토큰 없음/만료 |
| 403 | FORBIDDEN | 권한 없음 (MAINTAINER가 타사 조회 등) |
| 404 | *_NOT_FOUND | 엔티티 없음 |
| 409 | CONFLICT | 낙관적 락 실패, UNIQUE 충돌 |
| 422 | ILLEGAL_STATE_TRANSITION | 상태 전이 규칙 위반 |
| 500 | INTERNAL_ERROR | 서버 오류 |

### 8.2 엔드포인트 목록

#### 8.2.1 인증 / 사용자

> **주의**: 사용자/역할 관리 화면과 API는 **Jarvis가 주도**한다. YESS는 조회·role 할당 보조만.

| Method | Path | 설명 |
|---|---|---|
| GET | `/auth/me` | 세션에서 현재 사용자 + yess.* permission 목록 |
| POST | `/auth/login` | (선택) YESS 독립 로그인 fallback — Jarvis SSO 미적용 시 |
| POST | `/auth/logout` | 세션 종료 |
| GET | `/users` | 사용자 목록 (Jarvis `user` 조회, 필터: q, role code) |
| GET | `/users/:id` | 상세 |
| POST | `/users/:id/yess-roles` | YESS role(`yess.*`) 할당 (user_role 쓰기, 권한 있는 사용자만) |
| DELETE | `/users/:id/yess-roles/:code` | YESS role 해제 |

#### 8.2.2 귀속연도

| Method | Path | 설명 |
|---|---|---|
| GET | `/year-contexts` | 목록 |
| POST | `/year-contexts` | 생성 (ADMIN/TF_LEAD) |
| PATCH | `/year-contexts/:id` | 수정 |

#### 8.2.3 고객사

| Method | Path | 설명 |
|---|---|---|
| GET | `/companies` | 목록 (q, active) |
| POST | `/companies` | 생성 |
| GET | `/companies/:id` | 상세 |
| PATCH | `/companies/:id` | 수정 |
| GET | `/companies/:id/contacts` | 연락처 목록 |
| POST | `/companies/:id/contacts` | 연락처 생성 |
| PATCH | `/company-contacts/:id` | 수정 |
| DELETE | `/company-contacts/:id` | 삭제 |

#### 8.2.4 연도별 고객사 프로필

| Method | Path | 설명 |
|---|---|---|
| GET | `/company-year-profiles?yearContextId=` | 연도별 목록 |
| POST | `/company-year-profiles` | 생성 |
| PATCH | `/company-year-profiles/:id` | 수정 |
| GET | `/company-year-profiles/:id/maintainers` | 담당자 목록 |
| POST | `/company-year-profiles/:id/maintainers` | 담당자 배정 |
| DELETE | `/company-maintainers/:id` | 배정 해제 |

#### 8.2.5 패치 차수/항목/아티팩트

| Method | Path | 설명 |
|---|---|---|
| GET | `/patch-rounds?yearContextId=` | 차수 목록 |
| POST | `/patch-rounds` | 생성 |
| GET | `/patch-rounds/:id` | 상세 |
| PATCH | `/patch-rounds/:id` | 수정 |
| GET | `/patch-rounds/:id/items` | 항목 목록 |
| POST | `/patch-rounds/:id/items` | 항목 생성 |
| PATCH | `/patch-items/:id` | 수정 |
| DELETE | `/patch-items/:id` | 삭제 |
| GET | `/patch-items/:id/artifacts` | 아티팩트 목록 |
| POST | `/patch-items/:id/artifacts` | 생성 |
| PATCH | `/patch-artifacts/:id` | 수정 |
| DELETE | `/patch-artifacts/:id` | 삭제 |

#### 8.2.6 고객사별 패치 현황

| Method | Path | 설명 |
|---|---|---|
| GET | `/patch-targets` | 목록 (yearContextId, roundId, mine, applyStatus, overdue, hasIssue) |
| POST | `/patch-rounds/:id/generate-targets` | 조건 기반 대상 일괄 생성 |
| GET | `/patch-targets/:id` | 상세 |
| PATCH | `/patch-targets/:id/status` | apply_status 변경 (유지보수자가 셀프-종결) |
| GET | `/patch-targets/:id/history` | 변경 이력 (audit_log 뷰) |
| PATCH | `/patch-targets/bulk` | 일괄 변경 |

> **v2.2 변경**: `PATCH /patch-targets/:id/review` 엔드포인트는 제거. TF 검토 단계 폐지에 따라 MAINTAINER가 `apply_status = APPLIED`로 셀프-종결하며, 이슈는 `/work-items` (type=FOLLOW_UP) 생성으로 처리한다.

**예시: PATCH `/patch-targets/:id/status`**

Request:
```json
{
  "apply_status": "APPLIED",
  "applied_at": "2026-05-14T15:20:00+09:00",
  "scheduled_date": "2026-05-14",
  "special_note": "VPN 연결 불안정으로 3회 재시도"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 10234,
    "apply_status": "APPLIED",
    "applied_at": "2026-05-14T15:20:00+09:00",
    "applied_by": 7
  }
}
```

#### 8.2.7 업무 / 일일업무

| Method | Path | 설명 |
|---|---|---|
| GET | `/work-items?yearContextId=` | 목록 (type, status, assigneeId, mine) |
| POST | `/work-items` | 생성 |
| GET | `/work-items/:id` | 상세 |
| PATCH | `/work-items/:id` | 수정 |
| PATCH | `/work-items/:id/status` | 상태 변경 (Kanban 드롭다운) |
| DELETE | `/work-items/:id` | 삭제 |
| GET | `/work-items/:id/logs` | 관련 일일업무 |
| GET | `/work-logs?date=&userId=` | 일일업무 목록 |
| POST | `/work-logs` | 생성 |
| PATCH | `/work-logs/:id` | 수정 |
| DELETE | `/work-logs/:id` | 삭제 |

#### 8.2.8 개인일정

| Method | Path | 설명 |
|---|---|---|
| GET | `/schedules?userId=&from=&to=` | 조회 |
| POST | `/schedules` | 생성 |
| PATCH | `/schedules/:id` | 수정 |
| DELETE | `/schedules/:id` | 삭제 |

#### 8.2.9 리포트 / 이관

| Method | Path | 설명 |
|---|---|---|
| GET | `/reports/dashboard?yearContextId=` | 대시보드 카드 데이터 |
| GET | `/reports/patch-progress?yearContextId=&roundId=` | 차수별 진행률 |
| GET | `/reports/assignee?yearContextId=` | 담당자별 현황 |
| GET | `/reports/daily-work?date=` | 일일 리포트 |
| POST | `/imports/sheets` | Google Sheets Import 시작 |
| POST | `/imports/excel` | Excel 업로드 Import |
| GET | `/imports/:id` | Import 상태 조회 |
| POST | `/imports/:id/apply` | 검증 완료 후 실제 반영 |

---

## 9. 권한 / 보안 / 감사

### 9.1 RBAC 모델 (Jarvis 재사용)

- 역할·권한은 Jarvis `role`/`permission`/`user_role`/`role_permission` 테이블 그대로 사용.
- YESS 전용 **역할 코드** 5개:
  - `yess.admin`, `yess.tf_lead`, `yess.tf_member`, `yess.maintainer`, `yess.viewer`
- YESS 전용 **permission 코드** (네임스페이스 `yess.*`):

| permission.code | 설명 |
|---|---|
| `yess.year.manage` | 귀속연도 생성/수정 |
| `yess.company.profile.manage` | 연도별 고객사 프로필 CRUD |
| `yess.company.profile.read` | 프로필 조회 |
| `yess.company.contact.manage` | YESS 연락처 CRUD |
| `yess.maintainer.assign` | 담당자 배정 |
| `yess.patch.round.manage` | 차수 CRUD |
| `yess.patch.item.manage` | 항목 CRUD |
| `yess.patch.target.read.all` | 모든 패치 대상 조회 |
| `yess.patch.target.read.own` | 본인 담당만 조회 (MAINTAINER 기본) |
| `yess.patch.target.apply` | apply_status 변경 (MAINTAINER 본인 담당, TF 전체) |
| `yess.work.item.manage` | 업무 카드 CRUD |
| `yess.work.log.write.own` | 본인 work_logs CRU |
| `yess.work.log.read.all` | 전체 조회 |
| `yess.schedule.write.own` | 본인 출장/회의 일정 CRUD |
| `yess.report.read` | 리포트 조회 |
| `yess.admin.access` | 관리자 화면 접근 |

- 역할별 기본 permission 배정은 seed 스크립트(idempotent)에서 관리 (§16.2).

### 9.2 역할 × 리소스 매트릭스 (운영 기준)

| 리소스 | yess.admin | yess.tf_lead | yess.tf_member | yess.maintainer | yess.viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| user [S] | R(+yess-role 할당) | R | R | R(self) | R(self) |
| yess_year_contexts | CRUD | CRUD | R | R | R |
| company [S] | R(+위임 C) | R(+위임 C) | R | R(담당) | R |
| yess_company_year_profiles | CRUD | CRUD | CRUD | RU(담당) | R |
| yess_company_contacts | CRUD | CRUD | R | R(담당) | - |
| yess_company_maintainers | CRUD | CRUD | RU | R(self) | - |
| yess_patch_rounds | CRUD | CRUD | R | R | R |
| yess_patch_items | CRUD | CRUD | CRUD | R | R |
| yess_patch_artifacts | CRUD | CRUD | CRUD | R | R |
| yess_patch_targets | R | RU(전체) | RU(전체) | RU(담당) | R |
| yess_work_items | CRUD | CRUD | CRUD | - | R |
| yess_work_logs | CRUD | CRUD | CRU(self) | - | R |
| yess_personal_events | CRUD | CRUD | CRUD(self) | CRUD(self) | R |
| audit_log [S] | R | R | R | R(self action) | - |

### 9.3 MAINTAINER ACL 규칙

- MAINTAINER는 `yess_company_maintainers`에서 자신과 연결된 `company_year_profile_id` 집합만 조회/수정 가능.
- Next.js Route Handler 공통 guard에서 Prisma `where` 조건 주입:
  ```ts
  // YESS patch target list for yess.maintainer
  where: {
    companyYearProfile: {
      maintainers: { some: { userId: currentUser.id } }
    }
  }
  ```
- 본인 담당이 아닌 `yess_patch_targets` 조회/수정은 403.
- `yess.patch.target.apply`는 MAINTAINER에게 부여되지만, Prisma where 조건으로 본인 담당 건만 수정 가능.

### 9.4 audit_log 수집 대상 (프로토타입 최소판)

Jarvis `audit_log` 테이블에 insert. `target_type`은 `yess.` prefix로 네임스페이스 구분.

| 이벤트 | target_type | action | 우선순위 |
|---|---|---|---|
| 패치 대상 상태 변경 (apply_status) | `yess.patch_target` | STATUS_CHANGE | 필수 |
| APPLIED 이후 상태 롤백 | `yess.patch_target` | STATUS_CHANGE | 필수 (actor/원인 추적) |
| 후속조치 생성 (FOLLOW_UP) | `yess.work_item` | CREATE | 필수 |
| 업무 상태 변경 | `yess.work_item` | STATUS_CHANGE | 필수 |
| 담당자 변경 (patch_targets, work_items) | `yess.patch_target` / `yess.work_item` | UPDATE | 필수 |
| 고객사 프로필 주요정보 변경 | `yess.company_year_profile` | UPDATE | 필수 |
| 패치 항목 생성/삭제 | `yess.patch_item` | CREATE/DELETE | 권장 |
| YESS role 할당/해제 | `yess.user_role` | CREATE/DELETE | 필수 |
| 조회 로그 | - | - | **v1 이후** |

**수집 방식**: Next.js middleware + Prisma `$extends` client extension 조합. `yess_*` 테이블 update/delete 시 before/after 스냅샷을 JSON으로 직렬화하여 `audit_log`에 insert.

### 9.5 프로토타입 vs 운영 보안

| 항목 | 프로토타입 | 운영 (v1+) |
|---|---|---|
| 로그인 | Jarvis 세션 재사용 (쿠키 공유 또는 SSO 브릿지). fallback 없으면 YESS 독립 JWT | 사내 SSO (OIDC/SAML) — Jarvis와 동일 적용 |
| 세션 | Jarvis `user_session` 표준 | 동일 + Refresh |
| 전송 암호화 | HTTPS (사내 인증서) | HTTPS + HSTS |
| 고객사 연락처 | 평문 저장, 권한별 노출 | 마스킹 + 조회 감사 로그 |
| 고객사 접속정보 | 비밀번호 저장 금지 (원칙) | 동일 + 별도 Vault 연동 |
| DB 백업 | 일 1회 dump → NAS (Jarvis와 동일 DB라 공동 운영) | 일 1회 + PITR |
| 감사 로그 | Jarvis `audit_log`에 YESS 이벤트 기록 (변경만) | 동일 + 주요 조회 |
| 파일 | 저장 없음 | Jarvis `attachment`/`raw_source` 재사용 |

---

## 10. 기술 스택 & 아키텍처

### 10.1 스택 결정

| 영역 | 선택 | 근거 |
|---|---|---|
| Frontend | Next.js 15 + React 19 + TypeScript 5.x | App Router, 사내 도구 밀도 |
| UI | shadcn/ui + Tailwind CSS 4 | 커스터마이즈 용이, 저렴 |
| Data Grid | TanStack Table v8 | 엑셀형 UX 최적 |
| Kanban DnD | dnd-kit (v1부터) | react-beautiful-dnd deprecated |
| Form | React Hook Form + Zod | TS 친화, Server Action과 궁합 좋음 |
| Fetch | TanStack Query (+ Server Actions) | 낙관적 업데이트 |
| Backend | **Next.js Route Handlers + Server Actions** (NestJS 미사용) | Jarvis 스택과 정렬, 단일 앱 운영비 절감 |
| ORM | Prisma 5 | PostgreSQL 성숙, schema 소유권 분리 관리 용이 |
| DB | PostgreSQL 16 (**Jarvis와 단일 인스턴스 공유**) | §0.4 |
| Migration | Prisma Migrate — **yess_* 테이블에만 적용** | 공유 테이블은 Jarvis 담당 |
| 인증 | Jarvis 세션 재사용 (쿠키 공유). fallback iron-session/NextAuth 가능 | v1에서 SSO 일원화 |
| 로그 | pino(파일) + `audit_log` (Jarvis 테이블) | |
| Excel | exceljs | Import 전용 (Export는 v1.5) |
| 테스트 | Vitest (unit), Playwright (E2E) | |
| 배포 | Docker Compose (사내망) — `jarvis-web`/`yess-web` 별도, DB는 기존 인스턴스 공유 | |
| CI | 사내 GitLab CI (또는 GitHub Actions 미러) | Jarvis와 독립 파이프라인 |

**NestJS를 쓰지 않는 이유 (v2.1 변경)**: Jarvis가 Next.js 단일 스택이므로, 별도 NestJS API 서버를 두면 (1) 배포 컨테이너 증가, (2) 팀 스킬셋 분산, (3) Jarvis와의 세션·Prisma client 공유 복잡도 증가. Next.js 15의 Route Handlers + Server Actions로 동등한 기능을 구현 가능하며 guard 패턴은 `middleware.ts` + Prisma `$extends`로 대체.

### 10.2 배포 토폴로지

```
           [사내망]
              │
         ┌────▼──────────┐
         │ nginx (공용)   │  SSL termination
         └─┬───────────┬─┘
           │           │
    ┌──────▼──────┐  ┌─▼──────────┐
    │ jarvis-web  │  │ yess-web    │
    │ (Next.js)   │  │ (Next.js)   │
    │ :3000       │  │ :3010       │
    └──────┬──────┘  └──────┬──────┘
           │                │
           └────────┬───────┘
                    │
               ┌────▼─────────────┐
               │ postgres (공용)   │
               │ :5432            │
               │  - jarvis 소유 테이블
               │  - yess_* 테이블
               └────────┬─────────┘
                        │
                   ┌────▼─────┐
                   │ backup   │  (Jarvis 팀이 운영, YESS 자동 커버)
                   └──────────┘
```

**YESS 측 docker-compose 변경 서비스**:
- `yess-web` (Next.js standalone build)
- nginx는 Jarvis 쪽 리버스 프록시에 `yess.*` 또는 별도 경로 추가
- PostgreSQL 컨테이너는 **신규 생성 금지**. Jarvis DB에 접속 계정만 추가

**환경 변수**:
- `DATABASE_URL` (Jarvis DB와 동일 인스턴스, 별도 계정/schema)
- `JARVIS_SESSION_COOKIE_NAME`, `JARVIS_SESSION_SECRET` (세션 공유 시)
- `TZ=Asia/Seoul`
- `NEXT_PUBLIC_APP_NAME=yess`

**DB 계정 전략 (권장)**:
- Jarvis: 기존 계정 (전체 DDL 권한)
- YESS: 신규 계정 `yess_app`
  - `yess_*` 테이블에 DDL + DML 권한
  - 공유 테이블(user, company, audit_log 등)에 **SELECT + 제한적 INSERT** 권한만
  - `audit_log` INSERT, `user_role` INSERT/DELETE (yess.* role 한정) 등 협의 후 확정

### 10.3 폴더 구조 (YESS 단일 Next.js 앱)

```
yess/
├─ app/
│  ├─ (auth)/login/
│  ├─ (app)/
│  │  ├─ dashboard/
│  │  ├─ patches/
│  │  │  ├─ rounds/
│  │  │  ├─ targets/
│  │  │  └─ review/
│  │  ├─ tasks/
│  │  │  ├─ board/
│  │  │  ├─ daily/
│  │  │  ├─ follow-ups/
│  │  │  ├─ list/
│  │  │  └─ schedules/
│  │  ├─ companies/
│  │  ├─ reports/
│  │  └─ admin/
│  └─ api/                          # Route Handlers
│     ├─ auth/
│     ├─ year-contexts/
│     ├─ companies/
│     ├─ company-year-profiles/
│     ├─ patch-rounds/
│     ├─ patch-items/
│     ├─ patch-artifacts/
│     ├─ patch-targets/
│     ├─ work-items/
│     ├─ work-logs/
│     ├─ schedules/
│     ├─ imports/
│     └─ reports/
│
├─ components/
│  ├─ ui/                           # shadcn
│  ├─ data-grid/
│  ├─ kanban/
│  └─ forms/
│
├─ features/                        # 도메인별 서비스 레이어
│  ├─ patches/
│  │  ├─ schemas.ts                 # zod
│  │  ├─ queries.ts                 # Prisma 호출
│  │  ├─ services.ts                # 비즈 로직
│  │  └─ actions.ts                 # Server Actions
│  ├─ tasks/
│  ├─ companies/
│  ├─ reports/
│  ├─ audit/                        # Prisma $extends client
│  └─ auth/                         # 세션 브릿지
│
├─ lib/
│  ├─ prisma.ts                     # singleton client
│  ├─ session.ts
│  └─ acl.ts                        # permission 체크 헬퍼
│
├─ middleware.ts                    # 세션 검증 + x-current-user 주입
│
├─ prisma/
│  ├─ schema.prisma                 # yess_* (own) + shared (ref-only 주석)
│  ├─ migrations/                   # yess_* 테이블만
│  └─ seed.ts                       # YESS role/permission seed
│
├─ infra/
│  ├─ docker-compose.override.yml   # yess-web 서비스만
│  └─ nginx/
│     └─ yess.conf
│
└─ docs/
   ├─ DESIGN-v2.md                  # 본 문서
   ├─ DESIGN.md                     # 히스토리
   ├─ v0-prototype.md               # 히스토리
   ├─ DATA_MODEL.md                 # (작성 예정)
   ├─ API.md                        # (작성 예정)
   └─ MIGRATION.md                  # (작성 예정)
```

**참고**: Jarvis 레포는 별도이며 YESS 레포에 포함하지 않는다. Prisma schema의 공유 테이블 정의는 Jarvis schema와 동기화 필요 (§0.4.3).

---

## 11. 데이터 이관 전략

### 11.1 범위

| 대상 | 범위 | 방식 |
|---|---|---|
| 2026 귀속 | 전체 (진행 중) | 필수 이관 |
| 2025 귀속 | 패치 리스트·후속조치·일일업무 일부 | 선별 이관 |
| 2024 이하 | 대상 아님 | Google Sheets 잔존 |

### 11.2 이관 절차

```
1. 원본 시트별 컬럼 매핑 문서 작성 (docs/MIGRATION.md)
   - 고객사 시트 → Jarvis `company` 조회·매칭 + `yess_company_year_profiles` + `yess_company_contacts`
   - 차수 시트 → `yess_patch_rounds` + `yess_patch_items` + `yess_patch_artifacts`
   - 현황 시트 → `yess_patch_targets`
   - 후속조치 시트 → `yess_work_items` (type=FOLLOW_UP)
   - 일일업무 시트 → `yess_work_logs`
2. Import 스크립트 작성 (app/api/imports Route Handler + 별도 CLI)
   - Google Sheets API 또는 xlsx 업로드
   - Zod 검증 → DB 임시 테이블(`yess_import_*`) → TF 검토 → apply
3. raw_import_data 보존
   - 매핑 실패 필드는 JSON으로 원본 보관
4. TF 2명 샘플 검증 (5개 회사, 3개 차수, 10일치 로그)
5. 운영 배포 직전 최종 재이관
```

### 11.3 컬럼 매핑 예시 (일부)

| 원본 시트 컬럼 | 대상 테이블.컬럼 | 변환 규칙 |
|---|---|---|
| "버전" ("4.4", "5.x") | company_year_profiles.product_version | 그대로 |
| "접속방법" ("VDI", "원격") | company_year_profiles.access_method | 한글→enum 매핑 |
| "연말정산 사용유무" ("O", "X", 빈칸) | uses_year_end_settlement | O=true, X=false, 빈칸=true |
| "담당자" ("김지혜, 조민수") | company_maintainers (여러 레코드) | 쉼표 분리, 이름 매칭 실패는 raw 보관 |
| "연락처" 자유 텍스트 | company_contacts (여러 레코드) | 이름/전화/이메일 정규식 추출 실패는 notes |

### 11.4 raw_import_data JSON 스키마

```json
{
  "source": "sheets:2026_patches",
  "imported_at": "2026-06-20T10:00:00+09:00",
  "row_index": 42,
  "raw": {
    "original_column_name_1": "...",
    "original_column_name_2": "..."
  },
  "mapping_errors": ["version 포맷 불일치: '4.4 (핫픽스)'"]
}
```

---

## 12. 12주 구현 로드맵

**전제**: 1 FTE × 12주. 수직 슬라이스 우선 (기능 1과 기능 2 병행 검증).

| 주 | 마일스톤 | 산출물 | 검증 방법 |
|---|---|---|---|
| W1 | 프로젝트 셋업 + Jarvis 연동 | Next.js 앱, Jarvis DB 접속 계정, `prisma db pull`로 공유 테이블 동기화, 세션 브릿지, 임시 seed | 로그인 성공, `/api/auth/me`에 Jarvis user 반환 |
| W2 | 고객사 도메인 | `yess_company_year_profiles`, `yess_company_contacts`, `yess_company_maintainers` CRUD (+ company 조회) | 2026 고객사 목록 표시 |
| W3 | 패치 차수/항목 | `yess_patch_rounds/items/artifacts`, 상세 Drawer | 연중 01 + 항목 3개 등록 |
| W4 | 고객사별 패치 대상 | `yess_patch_targets` + generate-targets + 현황 그리드 | 첨부1 시트 화면 대체 |
| W5 | 유지보수자 상태 입력 | `/patches/targets?mine=true`, apply_status 변경 + ACL guard | MAINTAINER가 직접 입력, APPLIED 셀프-종결 |
| W6 | 이슈 모니터링 + audit_log | 대시보드 카드(지연/FAILED/HOLD/이슈), `audit_log` 기록·조회 뷰 | TF가 이슈 건 필터링 가능, 상태 변경 이력 추적 가능 |
| W7 | 업무 카드 / 후속조치 | `yess_work_items` CRUD, FOLLOW_UP 타입 리스트, patch_target → 후속조치 생성 링크 | 첨부4 대체, TF가 이슈 건에서 후속조치 바로 생성 |
| W8 | 일일업무 로그 | `yess_work_logs` CRUD, `/tasks/daily` | 첨부2 대체 |
| W9 | Kanban 보드 + 개인일정 | `/tasks/board`, 상태 드롭다운. `yess_personal_events` CRUD (연차/반차/출장/회의) | TF 리드가 오늘 현황 + 부재자 확인 |
| W10 | 통합 UX | 패치↔업무↔로그 교차 조회, Drawer 정돈 | 한 카드에서 모든 관련 정보 접근 |
| W11 | 데이터 이관 | 2025/2026 시트 Import 스크립트, raw_import_data 보존, TF 샘플 검증 | 실 데이터 일부 이관 성공 |
| W12 | QA / 시범 운영 | 버그 수정, 필드 보완 | TF 4명 동시 사용, Go/No-Go 판단 |

### 12.1 수직 슬라이스 우선 원칙

각 주의 끝에는 "DB ↔ API ↔ UI"가 통으로 동작하는 얇은 기능이 배포되어야 한다. 예: W3 끝에는 차수 1개 + 항목 3개를 실제 UI에서 등록하고 목록에서 볼 수 있어야 한다.

### 12.2 주간 완료 체크리스트 (공통)

- [ ] DB 마이그레이션 통과 (yess_* 한정)
- [ ] 공유 테이블 schema diff 검증 (`prisma db pull` + git diff)
- [ ] Route Handler 테스트 (Vitest) 주요 3개 이상 추가
- [ ] UI 스크린샷 1장 docs/progress/에 추가
- [ ] `audit_log` 샘플 1건 이상 기록 확인 (source='yess')
- [ ] 금요일 TF 대면 리뷰 (15분)

---

## 13. MVP 성공 기준

### 13.1 정량 지표

| # | 지표 | 목표 | 측정 방법 |
|---|---|---|---|
| 1 | TF의 Google Sheets 일일업무 사용 중단 | 100% (4명 모두) | 시범 운영 2주 후 Sheets 수정 로그 |
| 2 | 패치 정보 검색 시간 | 50% 단축 (10~15분 → 5분 이하) | 시범 운영 전후 TF 측정 (5회 평균) |
| 3 | 유지보수자 패치 반영 기록 시간 | 40% 단축 | 동일 방식 (5명 × 3회) |
| 4 | 고객사별 패치 상태 그리드 응답 | p95 < 1.5s (200행 기준) | API 응답 로그 |
| 5 | 버그 리포트 | 시범 2주 Critical 0건, Major ≤ 3건 | 이슈 트래커 |

### 13.2 정성 기준

- TF 리드가 "오늘 누가 뭐 하는지 한눈에 보인다"고 말한다.
- 신규 유지보수 담당자가 **회사별 접속 방법을 YESS만 보고 스스로 파악** 가능하다.
- 2027 귀속 시즌 시작 시 2026 데이터를 참조 가능하다.

### 13.3 Go / No-Go 기준

12주차 말, 다음 조건을 모두 만족하면 v1 운영 전환:
- [ ] 정량 1, 2, 4 달성
- [ ] Critical 버그 0건
- [ ] TF 4명 중 3명 이상 "Sheets로 돌아가고 싶지 않다" 응답
- [ ] 이관 스크립트로 2026 데이터 ≥ 80% 자동 이관

---

## 14. 리스크 & 완화

| # | 리스크 | 영향 | 확률 | 완화 |
|---|---|---|---|---|
| R1 | 1 FTE × 12주 공수 부족 | 범위 미달 | 중 | OUT OF SCOPE 엄수, W10까지 수직 슬라이스 고수 |
| R2 | Build vs Buy 재검토 요구 | 프로젝트 중단 | 저 | 사내 보안정책상 외부 SaaS 불가 가정 확정, §14 §16 |
| R3 | 이관 데이터 품질 낮음 | 신뢰도 저하 | 고 | raw_import_data 보존, TF 2명 샘플 검증 의무 |
| R4 | 유지보수자 사용 저항 | 기능 1 실패 | 중 | 엑셀 병행 운영 3개월, 1:1 온보딩 |
| R5 | 고객사 연락처 유출 | 법적/보안 | 저 | 권한별 노출 최소화, 운영에서 마스킹 도입 |
| R6 | 인증 방식 미결정 | 배포 지연 | 저 | Jarvis 세션 공유 1차, 불가 시 NextAuth fallback |
| R7 | 상태 전이 규칙 버그 | 데이터 오염 | 중 | 자동 트리거(T1~T4) 통합 테스트 필수 |
| R8 | Kanban DnD 공수 폭증 | 일정 초과 | 중 | 프로토타입은 드롭다운만. dnd-kit는 v1 |
| R9 | Jarvis 공유 테이블 스키마 변경 | 빌드/런타임 장애 | 중 | Jarvis 팀 release notes 구독, PR 단계에서 `prisma db pull` diff 리뷰 자동화 |
| R10 | YESS migration이 공유 테이블을 건드림 | 프로덕션 사고 | 저 | DB 계정 권한 분리 (yess_app은 공유 테이블에 DDL 불가), CI에서 `prisma migrate diff` 검사 |
| R11 | 세션 공유 방식 합의 지연 | W1 착수 지연 | 중 | NextAuth fallback으로 시작 후 SSO 완성 시 교체 |
| R12 | MAINTAINER 계정 프로비저닝 주체 혼선 | 기능 1 지연 | 저 | Jarvis 담당자와 J6 항목 먼저 합의 |
| R13 | TF 건별 검토 폐지로 품질 누락 가능 | 반영 오류 늦게 발견 | 중 | 대시보드 지연/FAILED/HOLD/이슈 필터 상시 노출, 주간 샘플링 프로세스 정의, 후속조치 워크플로 연동 |

---

## 15. Open Questions (운영 전환 전 해결)

| # | 질문 | 기한 | 담당 |
|---|---|---|---|
| Q1 | 사내 SSO 방식 (OIDC/SAML/LDAP?) | v1 착수 전 | 인프라팀 확인 (Jarvis와 동시 적용) |
| Q2 | 사내 Docker 호스트 스펙, 백업 정책 | W1 | 인프라팀 (Jarvis 공통) |
| Q3 | SMTP 서버 (v1.5) | v1.5 착수 전 | 인프라팀 |
| Q4 | 파일 저장소 (NAS? S3 호환?) | v1.5 착수 전 | 인프라팀 |
| Q5 | `yess_company_contacts`에 year_context_id 추가할지 | v1 | TF + 유지보수 피드백 |
| Q6 | MAINTAINER가 타 회사 조회 가능한 예외 케이스 | v1 | TF_LEAD 판단 |
| Q7 | 조회 감사 로그 범위 (고객사 연락처?) | v1 | 보안팀 |
| Q8 | 연도 롤오버 UX (v1.5 연도 복제) | v1.5 | TF_LEAD |
| **J1~J6** | **Jarvis 공유 범위·정책 협의** (§0.4.5) | **W1 전** | **Jarvis 담당자 + YESS 담당자** |

---

## 16. 부록

### 16.1 Prisma schema 스켈레톤

> 전체 스키마는 W1 착수 시 확정. 아래는 핵심 엔티티 예시.

```prisma
// schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

// ==========================================================
// Enums (YESS 전용)
// ==========================================================
enum YearPhase { PREPARE ACTIVE CLOSED }
enum ApplyStatus { NOT_STARTED SCHEDULED IN_PROGRESS APPLIED FAILED HOLD NOT_REQUIRED }
enum WorkItemType { PATCH FOLLOW_UP CUSTOMER_SUPPORT TEST MEETING GENERAL }
enum WorkItemStatus { BACKLOG TODO IN_PROGRESS BLOCKED REVIEW DONE }
enum Priority { P0 P1 P2 P3 }
enum PersonalEventType { BUSINESS_TRIP MEETING OTHER }
// ... (나머지 enum 생략)

// ==========================================================
// [SHARED] Jarvis 소유 테이블 — 참조 전용
// YESS schema.prisma에는 정의하되, migrations 폴더에는 절대 포함 금지
// `prisma db pull`로 동기화 → diff 리뷰 → 커밋
// ==========================================================

/// SHARED (Jarvis owns). Do NOT include in YESS migrations.
model User {
  id       BigInt   @id @default(autoincrement())
  email    String   @unique
  name     String
  // ... (Jarvis 스키마에 맞춰 자동 생성)

  // YESS 도메인 관계 (읽기 전용 패턴)
  yessAssignedWorkItems WorkItem[] @relation("WorkItemAssignee")
  yessReportedWorkItems WorkItem[] @relation("WorkItemReporter")
  yessWorkLogs          WorkLog[]
  yessPersonalEvents    PersonalEvent[]
  yessMaintainers       CompanyMaintainer[]

  @@map("user")
}

/// SHARED (Jarvis owns).
model Company {
  id           BigInt @id @default(autoincrement())
  name         String
  // ...
  yessProfiles CompanyYearProfile[]
  yessContacts CompanyContact[]
  yessWorkItems WorkItem[]

  @@map("company")
}

/// SHARED (Jarvis owns). insert 전용.
model AuditLog {
  id          BigInt   @id @default(autoincrement())
  actorId     BigInt?  @map("actor_id")
  action      String
  targetType  String   @map("target_type")  // 'yess.patch_target' 등
  targetId    BigInt   @map("target_id")
  beforeValue Json?    @map("before_value")
  afterValue  Json?    @map("after_value")
  sourceApp   String?  @map("source_app")   // 'yess' (Jarvis 스키마에 해당 컬럼 있으면)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@map("audit_log")
}

// (role, permission, user_role, role_permission, user_session,
//  attachment, raw_source, menu_item, code_group, code_item 도 동일 패턴으로 ref-only 선언)

// ==========================================================
// [YESS 전용] yess_* 테이블 — migrations에 포함
// ==========================================================

model YearContext {
  id         BigInt     @id @default(autoincrement())
  taxYear    Int        @unique @map("tax_year")
  name       String     @db.VarChar(60)
  phase      YearPhase  @default(PREPARE)
  startDate  DateTime?  @map("start_date") @db.Date
  endDate    DateTime?  @map("end_date") @db.Date
  createdAt  DateTime   @default(now()) @map("created_at") @db.Timestamptz
  profiles   CompanyYearProfile[]
  rounds     PatchRound[]
  targets    PatchTarget[]
  workItems  WorkItem[]

  @@map("yess_year_contexts")
}

model CompanyYearProfile {
  id                     BigInt   @id @default(autoincrement())
  yearContextId          BigInt   @map("year_context_id")
  companyId              BigInt   @map("company_id")
  productVersion         String?  @map("product_version") @db.VarChar(20)
  characterSet           String?  @map("character_set") @db.VarChar(20)
  securityVersion        String?  @map("security_version") @db.VarChar(40)
  javaVersion            String?  @map("java_version") @db.VarChar(20)
  contractType           String?  @map("contract_type")
  accessMethod           String?  @map("access_method")
  deployMethod           String?  @map("deploy_method")
  usesYearEndSettlement  Boolean  @default(true) @map("uses_year_end_settlement")
  usesWithholdingTax     Boolean  @default(false) @map("uses_withholding_tax")
  specialNotes           String?  @map("special_notes")
  rawImportData          Json?    @map("raw_import_data")
  createdAt              DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt              DateTime @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt              DateTime? @map("deleted_at") @db.Timestamptz

  yearContext  YearContext @relation(fields: [yearContextId], references: [id])
  company      Company     @relation(fields: [companyId], references: [id])
  maintainers  CompanyMaintainer[]
  targets      PatchTarget[]

  // NOTE: UNIQUE/INDEX는 partial index (WHERE deleted_at IS NULL)로 raw SQL migration에서 별도 선언.
  // Prisma는 partial unique를 지원하지 않으므로 @@unique/@@index는 생성하지 않고
  // migration 파일에서 CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL 로 명시.
  @@map("yess_company_year_profiles")
}

model CompanyMaintainer {
  id                   BigInt  @id @default(autoincrement())
  companyYearProfileId BigInt  @map("company_year_profile_id")
  userId               BigInt  @map("user_id")
  primaryYn            Boolean @default(false) @map("primary_yn")

  profile CompanyYearProfile @relation(fields: [companyYearProfileId], references: [id])
  user    User               @relation(fields: [userId], references: [id])

  @@unique([companyYearProfileId, userId])
  @@index([userId])
  @@map("yess_company_maintainers")
}

model PatchTarget {
  id                     BigInt       @id @default(autoincrement())
  yearContextId          BigInt       @map("year_context_id")
  companyYearProfileId   BigInt       @map("company_year_profile_id")
  patchRoundId           BigInt       @map("patch_round_id")
  maintainerId           BigInt?      @map("maintainer_id")
  applyStatus            ApplyStatus  @default(NOT_STARTED) @map("apply_status")
  scheduledDate          DateTime?    @map("scheduled_date") @db.Date
  appliedAt              DateTime?    @map("applied_at") @db.Timestamptz
  appliedBy              BigInt?      @map("applied_by")
  issueSummary           String?      @map("issue_summary")
  specialNote            String?      @map("special_note")
  createdAt              DateTime     @default(now()) @map("created_at") @db.Timestamptz
  updatedAt              DateTime     @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt              DateTime?    @map("deleted_at") @db.Timestamptz

  // UNIQUE/INDEX는 partial (WHERE deleted_at IS NULL) — migration raw SQL로 선언
  @@map("yess_patch_targets")
}

// WorkItem, WorkLog, PatchRound, PatchItem, PatchArtifact, CompanyContact, PersonalEvent
// 도 동일 패턴으로 기술. 모두 @@map("yess_*") 명시.
// soft delete 대상(PatchRound, PatchItem, WorkItem)은 `deletedAt DateTime? @map("deleted_at")` 컬럼 추가 +
// UNIQUE/INDEX는 partial index (WHERE deleted_at IS NULL)로 migration raw SQL에서 선언.
```

**migrations 제외 패턴 (권장)**: Prisma 5 자체에는 `@@ignore`가 있지만 쓰기 관계를 막지 못함. 실무에서는:
1. 공유 테이블 model에 `/// SHARED (Jarvis owns)` 주석을 일관 적용
2. CI에서 `prisma migrate diff` 결과에 `user|role|permission|company|audit_log|...` 변경 포함 시 빌드 실패
3. 또는 별도 `schema.shared.prisma` 파일로 분리하고 YESS 전용 schema는 `schema.prisma`에만 두어 migration이 yess_* 테이블만 건드리도록 구성 (Prisma 다중 스키마 지원 필요)

### 16.2 seed 데이터 예시

```ts
// prisma/seed.ts  — YESS seed는 "YESS 전용 테이블" + "Jarvis RBAC에 YESS permission/role upsert"로 구성
async function main() {
  // 1) YESS permission upsert (Jarvis 소유 테이블, 쓰기 허용 협의 필요)
  const permissions = [
    'yess.year.manage', 'yess.company.profile.manage', 'yess.company.profile.read',
    'yess.company.contact.manage', 'yess.maintainer.assign',
    'yess.patch.round.manage', 'yess.patch.item.manage',
    'yess.patch.target.read.all', 'yess.patch.target.read.own',
    'yess.patch.target.apply',
    'yess.work.item.manage', 'yess.work.log.write.own', 'yess.work.log.read.all',
    'yess.schedule.write.own', 'yess.report.read', 'yess.admin.access',
  ];
  for (const code of permissions) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code, description: `YESS permission: ${code}` }
    });
  }

  // 2) YESS role upsert
  const roles = ['yess.admin', 'yess.tf_lead', 'yess.tf_member', 'yess.maintainer', 'yess.viewer'];
  for (const code of roles) {
    await prisma.role.upsert({ where: { code }, update: {}, create: { code } });
  }

  // 3) role × permission 기본 매핑 (idempotent upsert)
  const grants: Record<string, string[]> = {
    'yess.admin': permissions,
    'yess.tf_lead': permissions.filter(p => p !== 'yess.admin.access' ? true : false),
    'yess.tf_member': [
      'yess.company.profile.read', 'yess.patch.item.manage',
      'yess.patch.target.read.all', 'yess.patch.target.apply',
      'yess.work.item.manage', 'yess.work.log.write.own', 'yess.work.log.read.all',
      'yess.schedule.write.own', 'yess.report.read',
    ],
    'yess.maintainer': ['yess.patch.target.read.own', 'yess.patch.target.apply', 'yess.schedule.write.own'],
    'yess.viewer': ['yess.patch.target.read.all', 'yess.work.item.manage' /* 조회만 */, 'yess.report.read'],
  };
  // ... rolePermission upsert 루프 생략

  // 4) YESS 전용: YearContext
  const year = await prisma.yearContext.upsert({
    where: { taxYear: 2026 },
    update: {},
    create: { taxYear: 2026, name: '2026 귀속 연말정산', phase: 'ACTIVE' }
  });

  // 5) 샘플 회사 프로필 (company는 Jarvis에서 사전 생성되어 있다고 가정)
  const company = await prisma.company.findFirstOrThrow({ where: { name: '샘플상사(주)' } });
  await prisma.companyYearProfile.upsert({
    where: { yearContextId_companyId: { yearContextId: year.id, companyId: company.id } },
    update: {},
    create: {
      yearContextId: year.id,
      companyId: company.id,
      productVersion: '4.6',
      accessMethod: 'VDI',
      deployMethod: 'REMOTE',
      usesYearEndSettlement: true,
    }
  });
}
```

### 16.3 화면 와이어프레임 (ASCII)

#### 16.3.1 고객사 패치 현황

```
┌────────────────────────────────────────────────────────────────────┐
│ [YESS]  대시보드  패치▼  업무▼  고객사  리포트  관리자    [이리드▼] │
├────────────────────────────────────────────────────────────────────┤
│ 패치 > 고객사 패치 현황                                             │
│                                                                    │
│ [차수: 연중 01 ▼] [담당자: 전체 ▼] [상태: 전체 ▼] [☐ 내 담당만]     │
│ [필터 추가…]                                    [일괄변경] [+새로고침]│
│                                                                    │
│ ┌──────────┬────┬──────┬─────────┬──────┬───────────┬───────────┐ │
│ │ 회사명   │버전│ 담당자│ 접속방법│ 반영 │ apply     │ 이슈      │ │
│ ├──────────┼────┼──────┼─────────┼──────┼───────────┼───────────┤ │
│ │ 샘플상사 │4.6 │ 김지혜│ VDI     │ 원격 │ [APPLIED▼]│ -         │ │
│ │ 가나다㈜ │5.x │ 조민수│ VPN     │ FTP  │ [IN_PROG.▼]│ VPN불안정 │ │
│ │ ...                                                           │ │
│ └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

#### 16.3.2 Kanban 보드

```
┌─────────┬─────────┬──────────┬─────────┬────────┬────────┐
│ 대기    │ 예정    │ 진행중   │ 보류    │ 검토   │ 완료   │
├─────────┼─────────┼──────────┼─────────┼────────┼────────┤
│ [PATCH] │ [FOL..]│ [PATCH]  │ [GEN.]  │[PATCH] │[FOL..] │
│ 연중02  │ 반려건 │ 001 퇴직 │ 교육    │ 003 간 │ 확인   │
│ 001 ..  │ 재반영 │ 소득영.. │ 자료 ..│이지급명│ 완료 ..│
│ @이리드 │ @김지혜│ @조민수  │ @박..   │ @이리드│ @조민수│
│ P1 · 5/20│ P0 ·...│P1 · 5/14 │ P2 ·..  │P1 ·5/15│P2 ·5/12│
│ 샘플상사 │ 가나다 │ 샘플상사 │ -       │ 알파㈜ │ 베타㈜ │
├─────────┼─────────┼──────────┼─────────┼────────┼────────┤
│ ...     │ ...     │ ...      │ ...     │ ...    │ ...    │
└─────────┴─────────┴──────────┴─────────┴────────┴────────┘
```

---

## 17. 변경 이력

| 버전 | 날짜 | 내용 | 작성 |
|---|---|---|---|
| v1.0 | 2026-04-23 | 초기 작성 (`/gstack-office-hours`) | 세션 |
| v1.1 | 2026-04-23 | 자가검토 추가 (`/superpowers:brainstorm`) | 세션 |
| v0-prototype | 2026-04-23 | 3개월 프로토타입 범위 분리 | 세션 |
| v2.0 | 2026-04-23 | 최종 종합 설계서 (NestJS + 독립 DB 전제) | 세션 |
| v2.1 | 2026-04-23 | Jarvis DB 공유 반영: NestJS 제거 → Next.js 단일 스택, `yess_*` prefix, Jarvis RBAC 재사용, 공유 테이블 소유권 원칙 (§0.4) 추가 | 세션 |
| v2.2 | 2026-04-23 | TF 건별 검토 단계 폐지: `review_status` 및 관련 컬럼/enum/API/화면/permission/로드맵 W6 제거. MAINTAINER가 `apply_status = APPLIED`로 셀프-종결. 이슈는 후속조치(FOLLOW_UP) 카드로 처리. W6를 "이슈 모니터링 + audit_log"로 재배치. 리스크 R13(품질 누락 가능성) 추가. 용어 "연정 01" → "연중 01" 전역 치환 | 세션 |
| v2.3 | 2026-04-23 | 패치 식별자 체계 도입: `round_code` 포맷 `{year}-{type_prefix}{round_no:02d}` (예: `2026-D01`). 패치 항목 전역 식별자 `{round_code}-{patch_no}` (예: `2026-D01-003`). type_prefix 매핑 D/W/S/G 추가. UNIQUE(year, patch_type, round_no) 제약 추가 (§5.2.7a, §5.2.7b) | 세션 |
| v2.4 | 2026-04-23 | Jarvis 근태 공유 폐기: `leave_request`/`holiday` 공유 제거. `yess_personal_events`의 `event_type`에 ANNUAL/HALF_AM/HALF_PM 추가하여 TF 개인 일정을 YESS 내부에서 자체 관리. §0.4.1 소유권 매트릭스·§4.1 도메인 트리·§5.2(S4)·§5.2(14)·§5.3 enum·§9.2 권한 매트릭스·§10.2 DB 계정 설명·§12 W9 로드맵 전반 반영. J2 협의 항목 폐기 후 J 번호 재정렬(J2~J7 → J2~J6) | 세션 |
| v2.5 | 2026-04-23 | 업무 흐름 재배치: 기존 "패치 항목 등록 → 고객사 반영 → 이슈 시 후속조치" 역순을 실제 실무 순서로 수정 — ① 전년도 후속조치 등록(사이클 시작) → ② TF 작업 + 일일로그 → ③ 차수·항목 정식화 → ④ 대상 생성 → ⑤ 유지보수자 반영 → ⑥ 반영 후 이슈 → ①로 순환. §1.4 핵심 흐름·§2 원칙 5/6-1·§6 전체 재작성 | 세션 |
| v2.6 | 2026-04-23 | 프로토타입 스코프 압축: (1) 개인일정 v1+로 이관 (v2.7에서 되돌림). (2) 엑셀 Export 완전 제거 (v1.5로 연기) — §3.3 OUT OF SCOPE 확정, §7.1 /reports/export 메뉴 제거, §7.2.2 엑셀 버튼·엑셀 Export 요구사항 제거, §8.2.9 API 엔드포인트 제거, §10.1 exceljs 용도를 Import 전용으로 축소, §12 W11 로드맵에서 Export 제거, §16.3 와이어프레임 엑셀 버튼 제거 | 세션 |
| **v2.7** | **2026-04-23** | **개인일정 프로토타입 재포함**: v2.6의 개인일정 v1+ 이관을 되돌림. §3.2 IN SCOPE 재추가, §3.3 OUT OF SCOPE 제거, §7.1 IA·§7.2.1 부재자 배너·§7.2.5 일일업무 배너·§7.2.7 개인일정 화면·§7.3 권한 매트릭스·§8.2.8 API·§12 W9 로드맵에서 "(v1+)" 마커 제거. 엑셀 Export 제거는 유지 | **세션** |

---

**End of DESIGN-v2.md**
