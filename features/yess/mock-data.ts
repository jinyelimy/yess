import type {
  Company,
  CompanyYearProfile,
  ImportRun,
  PatchArtifact,
  PatchItem,
  PatchRound,
  PatchTarget,
  PersonalEvent,
  User,
  WorkItem,
  WorkLog,
  YearContext,
} from "@/features/yess/types";

export const yearContexts: YearContext[] = [
  { id: "year-2026", taxYear: 2026, name: "2026 귀속 연말정산", phase: "ACTIVE" },
  { id: "year-2025", taxYear: 2025, name: "2025 귀속 연말정산", phase: "CLOSED" },
];

export const users: User[] = [
  {
    id: "usr-lead",
    name: "이리드",
    role: "TF_LEAD",
    roleCode: "yess.tf_lead",
    initials: "IR",
    team: "TF",
    accent: "var(--chart-1)",
    permissions: [
      "yess.patch.round.manage",
      "yess.patch.item.manage",
      "yess.patch.target.read.all",
      "yess.work.item.manage",
      "yess.admin.access",
    ],
  },
  {
    id: "usr-kim",
    name: "김지혜",
    role: "TF_MEMBER",
    roleCode: "yess.tf_member",
    initials: "KJ",
    team: "TF",
    accent: "var(--chart-2)",
    permissions: [
      "yess.patch.item.manage",
      "yess.patch.target.read.all",
      "yess.work.item.manage",
      "yess.work.log.write.own",
    ],
  },
  {
    id: "usr-cho",
    name: "조민수",
    role: "TF_MEMBER",
    roleCode: "yess.tf_member",
    initials: "CM",
    team: "TF",
    accent: "var(--chart-3)",
    permissions: [
      "yess.patch.item.manage",
      "yess.patch.target.read.all",
      "yess.work.item.manage",
      "yess.work.log.write.own",
    ],
  },
  {
    id: "usr-park",
    name: "박서윤",
    role: "MAINTAINER",
    roleCode: "yess.maintainer",
    initials: "PS",
    team: "유지보수",
    accent: "var(--chart-4)",
    permissions: [
      "yess.patch.target.read.own",
      "yess.patch.target.apply",
      "yess.schedule.write.own",
    ],
  },
  {
    id: "usr-han",
    name: "한예진",
    role: "MAINTAINER",
    roleCode: "yess.maintainer",
    initials: "HY",
    team: "유지보수",
    accent: "var(--chart-5)",
    permissions: [
      "yess.patch.target.read.own",
      "yess.patch.target.apply",
      "yess.schedule.write.own",
    ],
  },
];

export const companies: Company[] = [
  { id: "cmp-sample", name: "샘플상사", segment: "제조", city: "서울" },
  { id: "cmp-gana", name: "가나다주식회사", segment: "유통", city: "성남" },
  { id: "cmp-alpha", name: "알파메디컬", segment: "의료", city: "대전" },
  { id: "cmp-beta", name: "베타솔루션즈", segment: "IT", city: "부산" },
  { id: "cmp-mirae", name: "미래세무법인", segment: "서비스", city: "인천" },
  { id: "cmp-saebom", name: "새봄병원", segment: "의료", city: "광주" },
];

export const companyYearProfiles: CompanyYearProfile[] = [
  {
    id: "profile-sample",
    companyId: "cmp-sample",
    yearContextId: "year-2026",
    version: "4.6",
    charset: "MS949",
    contractType: "MAINTENANCE",
    accessMethod: "VDI",
    deployMethod: "REMOTE",
    usesYearEndSettlement: true,
    usesWithholdingTax: true,
    specialNotes: "원격 세션 종료 후 재로그인 필요",
    primaryMaintainerId: "usr-park",
  },
  {
    id: "profile-gana",
    companyId: "cmp-gana",
    yearContextId: "year-2026",
    version: "5.x",
    charset: "UTF-8",
    contractType: "MAINTENANCE",
    accessMethod: "VPN",
    deployMethod: "FTP",
    usesYearEndSettlement: true,
    usesWithholdingTax: false,
    specialNotes: "FTP 계정 주 1회 변경",
    primaryMaintainerId: "usr-han",
  },
  {
    id: "profile-alpha",
    companyId: "cmp-alpha",
    yearContextId: "year-2026",
    version: "5.x",
    charset: "UTF-8",
    contractType: "EXTERNAL",
    accessMethod: "REMOTE",
    deployMethod: "REMOTE",
    usesYearEndSettlement: true,
    usesWithholdingTax: true,
    specialNotes: "의료기관 보안 정책으로 야간 배포 선호",
    primaryMaintainerId: "usr-park",
  },
  {
    id: "profile-beta",
    companyId: "cmp-beta",
    yearContextId: "year-2026",
    version: "4.4",
    charset: "MS949",
    contractType: "MAINTENANCE",
    accessMethod: "MAIL",
    deployMethod: "MAIL",
    usesYearEndSettlement: true,
    usesWithholdingTax: false,
    specialNotes: "수기 체크리스트 병행 필요",
    primaryMaintainerId: "usr-han",
  },
  {
    id: "profile-mirae",
    companyId: "cmp-mirae",
    yearContextId: "year-2026",
    version: "5.2",
    charset: "UTF-8",
    contractType: "INTERNAL",
    accessMethod: "LOCAL",
    deployMethod: "REMOTE",
    usesYearEndSettlement: true,
    usesWithholdingTax: true,
    specialNotes: "TF 데모 고객사",
    primaryMaintainerId: "usr-park",
  },
  {
    id: "profile-saebom",
    companyId: "cmp-saebom",
    yearContextId: "year-2026",
    version: "5.0",
    charset: "UTF-8",
    contractType: "MAINTENANCE",
    accessMethod: "VPN",
    deployMethod: "REMOTE",
    usesYearEndSettlement: true,
    usesWithholdingTax: true,
    specialNotes: "이슈 발생 시 TF 직접 대응",
    primaryMaintainerId: "usr-han",
  },
];

export const patchRounds: PatchRound[] = [
  {
    id: "round-2026-D01",
    roundCode: "2026-D01",
    label: "연중 01",
    patchType: "YEAR_END",
    status: "RELEASED",
    releaseDate: "2026-05-10",
    dueDate: "2026-05-20",
    progress: 0.61,
  },
  {
    id: "round-2026-D02",
    roundCode: "2026-D02",
    label: "연중 02",
    patchType: "YEAR_END",
    status: "IN_PROGRESS",
    releaseDate: "2026-05-24",
    dueDate: "2026-06-03",
    progress: 0.28,
  },
  {
    id: "round-2026-G01",
    roundCode: "2026-G01",
    label: "가이드 01",
    patchType: "GUIDE",
    status: "DRAFT",
    releaseDate: "2026-05-28",
    dueDate: "2026-06-10",
    progress: 0.14,
  },
];

export const patchItems: PatchItem[] = [
  {
    id: "item-2026-D01-001",
    patchRoundId: "round-2026-D01",
    patchNo: "001",
    title: "퇴직소득 원천징수영수증 계산 보정",
    category: "SOURCE",
    versionScope: "BOTH",
    releaseDate: "2026-05-10",
    dueDate: "2026-05-20",
    contents:
      "- 퇴직소득 계산식 정정\n- 4.x/5.x 공통 로직 추출\n- 검증 시나리오 6종 반영",
    specialNotes: "※ 국세청 가이드 4.2 반영",
    memo: "커밋 예정: fix/yess-retirement-slip",
  },
  {
    id: "item-2026-D01-002",
    patchRoundId: "round-2026-D01",
    patchNo: "002",
    title: "임원 동일인 공제액관리 UI 정리",
    category: "CONFIG",
    versionScope: "V5",
    releaseDate: "2026-05-10",
    dueDate: "2026-05-19",
    contents:
      "- 관리 화면 필드 정렬\n- 잘못된 기본값 제거\n- 운영 가이드 문구 보강",
    specialNotes: "5.x 전용 안내 패치",
    memo: "관련 후속조치 2건 연결",
  },
  {
    id: "item-2026-D01-003",
    patchRoundId: "round-2026-D01",
    patchNo: "003",
    title: "의료기관 특례 원천세 SQL 보정",
    category: "DB",
    versionScope: "V4",
    releaseDate: "2026-05-10",
    dueDate: "2026-05-21",
    contents:
      "- 누락된 분기 SQL 추가\n- 롤백 스크립트 동봉\n- 고객사 3곳 대상",
    specialNotes: "야간 적용 권장",
    memo: "SQL 실행 전 백업 확인 필수",
  },
  {
    id: "item-2026-D02-001",
    patchRoundId: "round-2026-D02",
    patchNo: "001",
    title: "간이지급명세 로직 보강",
    category: "SOURCE",
    versionScope: "BOTH",
    releaseDate: "2026-05-24",
    dueDate: "2026-06-03",
    contents:
      "- 예외 케이스 샘플 추가\n- QA 시나리오 확장\n- 후속조치와 자동 연결",
    specialNotes: "연차자 복귀 후 리뷰 예정",
    memo: "검토 단계 생략 가능성 있음",
  },
];

export const patchArtifacts: PatchArtifact[] = [
  {
    id: "artifact-path-1",
    patchItemId: "item-2026-D01-001",
    artifactType: "FILE_PATH",
    versionScope: "BOTH",
    label: "소스 경로",
    content: "src/yess/year-end/retirement-slip/service.ts",
  },
  {
    id: "artifact-sql-1",
    patchItemId: "item-2026-D01-003",
    artifactType: "SQL",
    versionScope: "V4",
    label: "적용 SQL",
    content:
      "update ye_tax_rule set deduction_rate = 0.12 where rule_code = 'MEDICAL_BONUS';",
  },
  {
    id: "artifact-url-1",
    patchItemId: "item-2026-D01-002",
    artifactType: "URL",
    versionScope: "V5",
    label: "가이드 URL",
    content: "https://intranet.example.local/guide/yess/d01-002",
  },
];

export const patchTargets: PatchTarget[] = [
  {
    id: "target-sample",
    patchRoundId: "round-2026-D01",
    companyYearProfileId: "profile-sample",
    maintainerId: "usr-park",
    applyStatus: "APPLIED",
    scheduledDate: "2026-05-14",
    appliedAt: "2026-05-14T15:20:00+09:00",
    specialNote: "원격 세션 3회 재시도 후 적용",
    updatedBy: "이리드",
    updatedAt: "2026-05-14T15:24:00+09:00",
  },
  {
    id: "target-gana",
    patchRoundId: "round-2026-D01",
    companyYearProfileId: "profile-gana",
    maintainerId: "usr-han",
    applyStatus: "IN_PROGRESS",
    scheduledDate: "2026-05-16",
    issueSummary: "VPN 연결이 불안정해 파일 업로드 지연",
    specialNote: "5.x 전용 패치 항목 2건만 선적용",
    updatedBy: "한예진",
    updatedAt: "2026-05-15T10:11:00+09:00",
  },
  {
    id: "target-alpha",
    patchRoundId: "round-2026-D01",
    companyYearProfileId: "profile-alpha",
    maintainerId: "usr-park",
    applyStatus: "FAILED",
    scheduledDate: "2026-05-15",
    issueSummary: "야간 배포 후 의료기관 특례 SQL 검증 실패",
    specialNote: "후속조치 카드 생성 필요",
    updatedBy: "김지혜",
    updatedAt: "2026-05-15T22:15:00+09:00",
  },
  {
    id: "target-beta",
    patchRoundId: "round-2026-D01",
    companyYearProfileId: "profile-beta",
    maintainerId: "usr-han",
    applyStatus: "HOLD",
    scheduledDate: "2026-05-18",
    issueSummary: "메일 승인 대기",
    specialNote: "담당자 부재",
    updatedBy: "한예진",
    updatedAt: "2026-05-15T08:40:00+09:00",
  },
  {
    id: "target-mirae",
    patchRoundId: "round-2026-D01",
    companyYearProfileId: "profile-mirae",
    maintainerId: "usr-park",
    applyStatus: "SCHEDULED",
    scheduledDate: "2026-05-17",
    updatedBy: "이리드",
    updatedAt: "2026-05-15T09:05:00+09:00",
  },
  {
    id: "target-saebom",
    patchRoundId: "round-2026-D01",
    companyYearProfileId: "profile-saebom",
    maintainerId: "usr-han",
    applyStatus: "NOT_STARTED",
    scheduledDate: "2026-05-19",
    updatedBy: "조민수",
    updatedAt: "2026-05-15T13:10:00+09:00",
  },
];

export const workItems: WorkItem[] = [
  {
    id: "work-follow-1",
    yearContextId: "year-2026",
    type: "FOLLOW_UP",
    status: "BACKLOG",
    priority: "P0",
    title: "2025 귀속 반려건 재정리",
    assigneeId: "usr-lead",
    companyId: "cmp-gana",
    dueDate: "2026-05-20",
  },
  {
    id: "work-patch-1",
    yearContextId: "year-2026",
    type: "PATCH",
    status: "TODO",
    priority: "P1",
    title: "연중 02 001 간이지급명세 로직 보강",
    assigneeId: "usr-kim",
    companyId: "cmp-sample",
    patchRoundId: "round-2026-D02",
    patchItemId: "item-2026-D02-001",
    dueDate: "2026-05-18",
  },
  {
    id: "work-general-1",
    yearContextId: "year-2026",
    type: "GENERAL",
    status: "IN_PROGRESS",
    priority: "P2",
    title: "신규 가이드 문구 QA",
    assigneeId: "usr-cho",
    dueDate: "2026-05-17",
  },
  {
    id: "work-follow-2",
    yearContextId: "year-2026",
    type: "FOLLOW_UP",
    status: "BLOCKED",
    priority: "P1",
    title: "알파메디컬 의료기관 특례 재검증",
    assigneeId: "usr-kim",
    companyId: "cmp-alpha",
    dueDate: "2026-05-15",
    resultNote: "야간 테스트 환경 점검 대기",
  },
  {
    id: "work-patch-2",
    yearContextId: "year-2026",
    type: "PATCH",
    status: "REVIEW",
    priority: "P1",
    title: "연중 01 003 SQL 롤백 검증",
    assigneeId: "usr-cho",
    companyId: "cmp-alpha",
    patchRoundId: "round-2026-D01",
    patchItemId: "item-2026-D01-003",
    dueDate: "2026-05-16",
  },
  {
    id: "work-support-1",
    yearContextId: "year-2026",
    type: "CUSTOMER_SUPPORT",
    status: "DONE",
    priority: "P3",
    title: "샘플상사 반영 완료 확인 콜",
    assigneeId: "usr-lead",
    companyId: "cmp-sample",
    dueDate: "2026-05-14",
  },
];

export const workLogs: WorkLog[] = [
  {
    id: "log-1",
    workItemId: "work-patch-1",
    userId: "usr-kim",
    logType: "PATCH",
    workDate: "2026-05-15",
    content: "간이지급명세 예외 입력 3건을 재현했고 계산 로직 수정안을 정리했다.",
    nextAction: "TF 리드 리뷰 후 patch item 업데이트",
    spentMinutes: 120,
    patchRoundId: "round-2026-D02",
    patchItemId: "item-2026-D02-001",
    companyId: "cmp-sample",
  },
  {
    id: "log-2",
    workItemId: "work-follow-2",
    userId: "usr-kim",
    logType: "FOLLOW_UP",
    workDate: "2026-05-15",
    content: "알파메디컬 야간 배포 로그를 분석했고 SQL rollback 지점까지 확인했다.",
    issueNote: "의료기관 특례 분기 처리에서 null 케이스 재현",
    nextAction: "조민수와 SQL 검토",
    spentMinutes: 95,
    companyId: "cmp-alpha",
  },
  {
    id: "log-3",
    workItemId: "work-general-1",
    userId: "usr-cho",
    logType: "GENERAL",
    workDate: "2026-05-15",
    content: "국세청 가이드 비교표를 정리하고 화면 문구 후보를 추렸다.",
    spentMinutes: 60,
  },
];

export const personalEvents: PersonalEvent[] = [
  {
    id: "event-1",
    userId: "usr-kim",
    eventType: "HALF_PM",
    title: "오후 반차",
    startDate: "2026-05-15",
    endDate: "2026-05-15",
  },
  {
    id: "event-2",
    userId: "usr-park",
    eventType: "BUSINESS_TRIP",
    title: "샘플상사 현장 방문",
    startDate: "2026-05-16",
    endDate: "2026-05-16",
  },
  {
    id: "event-3",
    userId: "usr-cho",
    eventType: "MEETING",
    title: "Jarvis 공유 스키마 협의",
    startDate: "2026-05-19",
    endDate: "2026-05-19",
  },
];

export const importRuns: ImportRun[] = [
  {
    id: "import-1",
    source: "Google Sheets · 2026_patch_targets",
    status: "READY",
    totalRows: 148,
    validRows: 142,
    createdAt: "2026-05-13T09:15:00+09:00",
  },
  {
    id: "import-2",
    source: "Excel · follow_ups_2025.xlsx",
    status: "APPLIED",
    totalRows: 63,
    validRows: 63,
    createdAt: "2026-05-11T16:40:00+09:00",
  },
];

export const currentUser = users[0];
export const currentYear = yearContexts[0];

export const companyContacts = {
  "cmp-sample": [
    { name: "박현우", role: "인사팀장", phone: "010-1234-4567", email: "hr@sample.co.kr" },
    { name: "최민지", role: "전산담당", phone: "010-4321-8899", email: "it@sample.co.kr" },
  ],
  "cmp-gana": [
    { name: "이수아", role: "총무", phone: "010-2255-8890", email: "ops@gana.co.kr" },
  ],
  "cmp-alpha": [
    { name: "문도윤", role: "의무기록팀", phone: "010-6733-1212", email: "med@alpha.kr" },
    { name: "서가람", role: "보안담당", phone: "010-1118-8120", email: "sec@alpha.kr" },
  ],
  "cmp-beta": [
    { name: "양은호", role: "경영지원", phone: "010-9988-0910", email: "admin@beta.io" },
  ],
  "cmp-mirae": [
    { name: "윤지훈", role: "세무팀", phone: "010-3022-8989", email: "tax@mirae.kr" },
  ],
  "cmp-saebom": [
    { name: "홍가은", role: "인사총무", phone: "010-1144-2299", email: "hr@saebom.kr" },
  ],
} as const;

export function getUserById(userId: string) {
  return users.find((user) => user.id === userId);
}

export function getCompanyById(companyId: string) {
  return companies.find((company) => company.id === companyId);
}

export function getProfileById(profileId: string) {
  return companyYearProfiles.find((profile) => profile.id === profileId);
}

export function getRoundByCode(roundCode: string) {
  return patchRounds.find((round) => round.roundCode === roundCode);
}

export function getRoundById(roundId: string) {
  return patchRounds.find((round) => round.id === roundId);
}

export function getItemsForRound(roundId: string) {
  return patchItems.filter((item) => item.patchRoundId === roundId);
}

export function getArtifactsForItem(itemId: string) {
  return patchArtifacts.filter((artifact) => artifact.patchItemId === itemId);
}

export function getDashboardMetrics() {
  const targetCount = patchTargets.length;
  const counts = patchTargets.reduce<Record<string, number>>((acc, target) => {
    acc[target.applyStatus] = (acc[target.applyStatus] ?? 0) + 1;
    return acc;
  }, {});

  const issueCount = patchTargets.filter((target) => target.issueSummary).length;
  const overdueCount = patchTargets.filter(
    (target) =>
      target.applyStatus !== "APPLIED" &&
      target.applyStatus !== "NOT_REQUIRED" &&
      new Date(target.scheduledDate).getTime() < new Date("2026-05-15").getTime(),
  ).length;

  return [
    { label: "전체 패치 대상", value: targetCount, tone: "ink" },
    { label: "미진행", value: counts.NOT_STARTED ?? 0, tone: "neutral" },
    { label: "진행중", value: counts.IN_PROGRESS ?? 0, tone: "teal" },
    { label: "반영완료", value: counts.APPLIED ?? 0, tone: "green" },
    { label: "실패", value: counts.FAILED ?? 0, tone: "orange" },
    { label: "보류", value: counts.HOLD ?? 0, tone: "amber" },
    { label: "지연", value: overdueCount, tone: "red" },
    { label: "이슈 있음", value: issueCount, tone: "rose" },
  ];
}

export function getPatchTargetRows() {
  return patchTargets.map((target) => {
    const profile = getProfileById(target.companyYearProfileId);
    const company = profile ? getCompanyById(profile.companyId) : undefined;
    const maintainer = getUserById(target.maintainerId);
    const round = getRoundById(target.patchRoundId);
    const contactCount = company
      ? (companyContacts[company.id as keyof typeof companyContacts] ?? []).length
      : 0;

    return {
      id: target.id,
      roundCode: round?.roundCode ?? "-",
      companyName: company?.name ?? "미상",
      version: profile?.version ?? "-",
      charset: profile?.charset ?? "-",
      contractType: profile?.contractType ?? "-",
      maintainer: maintainer?.name ?? "-",
      accessMethod: profile?.accessMethod ?? "-",
      deployMethod: profile?.deployMethod ?? "-",
      usesYearEndSettlement: profile?.usesYearEndSettlement ? "O" : "X",
      usesWithholdingTax: profile?.usesWithholdingTax ? "O" : "X",
      contactCount,
      applyStatus: target.applyStatus,
      scheduledDate: target.scheduledDate,
      appliedAt: target.appliedAt,
      issueSummary: target.issueSummary,
      specialNote: target.specialNote,
      updatedBy: target.updatedBy,
      updatedAt: target.updatedAt,
    };
  });
}

export function getTodayTasks() {
  return workItems.filter((item) => item.status === "IN_PROGRESS" || item.status === "TODO");
}

export function getTodayAbsences() {
  return personalEvents.filter((event) => event.startDate === "2026-05-15");
}

export function getAssigneeProgress() {
  return users
    .filter((user) => user.role === "TF_LEAD" || user.role === "TF_MEMBER")
    .map((user) => {
      const owned = workItems.filter((item) => item.assigneeId === user.id);
      const done = owned.filter((item) => item.status === "DONE").length;

      return {
        id: user.id,
        name: user.name,
        total: owned.length || 1,
        done,
        rate: done / (owned.length || 1),
        team: user.team,
      };
    });
}

export function getIssueRows() {
  return getPatchTargetRows().filter(
    (row) =>
      row.applyStatus === "FAILED" ||
      row.applyStatus === "HOLD" ||
      Boolean(row.issueSummary),
  );
}

export function getScheduleBoard() {
  return [
    { day: "월", date: "05.12", items: [] },
    { day: "화", date: "05.13", items: [] },
    { day: "수", date: "05.14", items: [] },
    {
      day: "목",
      date: "05.15",
      items: [
        { title: "김지혜 오후 반차", tone: "amber" },
        { title: "TF 15분 스탠드업", tone: "ink" },
      ],
    },
    {
      day: "금",
      date: "05.16",
      items: [
        { title: "박서윤 샘플상사 방문", tone: "teal" },
        { title: "연중 01 배포 마감", tone: "rose" },
      ],
    },
    { day: "토", date: "05.17", items: [] },
    { day: "일", date: "05.18", items: [] },
  ];
}

export function getRoleSummaries() {
  return [
    {
      code: "yess.admin",
      name: "관리자",
      description: "시스템 관리, 코드 관리, 데이터 이관 승인",
      permissions: 16,
    },
    {
      code: "yess.tf_lead",
      name: "TF 리드",
      description: "패치 차수/항목 운영, 후속조치 관리, 모니터링 총괄",
      permissions: 15,
    },
    {
      code: "yess.tf_member",
      name: "TF 멤버",
      description: "패치 작업, 일일업무 기록, 후속조치 처리",
      permissions: 9,
    },
    {
      code: "yess.maintainer",
      name: "유지보수",
      description: "본인 담당 고객사 apply_status 셀프 종결",
      permissions: 3,
    },
    {
      code: "yess.viewer",
      name: "조회자",
      description: "대시보드, 리포트, 업무/후속조치 조회",
      permissions: 3,
    },
  ];
}

export function getCodeGroups() {
  return [
    { group: "ApplyStatus", values: ["NOT_STARTED", "SCHEDULED", "IN_PROGRESS", "APPLIED", "FAILED", "HOLD", "NOT_REQUIRED"] },
    { group: "PatchType", values: ["YEAR_END", "WITHHOLDING", "SEPARATE", "GUIDE"] },
    { group: "AccessMethod", values: ["VPN", "VDI", "REMOTE", "LOCAL", "MAIL", "OTHER"] },
    { group: "WorkItemStatus", values: ["BACKLOG", "TODO", "IN_PROGRESS", "BLOCKED", "REVIEW", "DONE"] },
  ];
}
