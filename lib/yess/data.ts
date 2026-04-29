// ── YESS Mock Data ──
// _design_input/data.js 의 정적 데이터를 TypeScript로 옮긴 모듈.
// v0 프로토타입에서는 백엔드 없이 이 데이터로 화면을 구동한다.

export type User = {
  id: string;
  name: string;
  initial: string;
  color: string;
  role?: string;
  illustration?: "irid";
};

export type Company = {
  id: number;
  name: string;
  ver: string;
  charset: string;
  access: string;
  deploy: string;
  ye: boolean;
  wh: boolean;
  maintainer: string;
  status: StatusKey;
  scheduled: string;
  applied: string;
  issue: string;
  /**
   * 서비스 종료가 시작되는 차수 코드 (예: "2026-D02").
   * 이 차수부터 generate-targets에서 제외됨. undefined면 정상 운영.
   */
  terminatedAtRound?: string;
};

export type WorkItem = {
  id: string;
  type: "FOLLOW_UP" | "BUGFIX" | "SERVICE_DESK";
  title: string;
  assignee: string;
  priority: PriorityKey;
  status: StatusKey;
  round?: string;
  company?: string;
  due?: string;
  ticket?: string;
};

export type Round = {
  code: string;
  name: string;
  type: "REGULAR" | "YEAR_END" | "INDIVIDUAL" | "EXTRA";
  status: "DRAFT" | "RELEASED" | "IN_PROGRESS" | "CLOSED";
  items: number;
  release: string;
  due: string;
};

export type PatchItem = {
  no: string;
  title: string;
  cat: string;
  group: "SOURCE" | "DB" | "RD";
  versions: string[];
  scope: "ALL" | "SELECTED";
  companies: string[];
  encodings: string[];
  assignee: string;
  guide: boolean;
  summary: string;
  files: { ver: string; type: "NEW" | "MODIFY" | "DELETE"; path: string; plus: number; minus: number }[];
  guideMeta: { author: string; updatedAt: string } | null;
};

export type Schedule = {
  id: string;
  date: string;
  user: User;
  label: string;
  range: string;
};

export type DailyTaskCategory =
  | "MEETING"
  | "BUGFIX"
  | "SERVICE_DESK"
  | "FOLLOW_UP"
  | "REVIEW"
  | "GENERAL";

export type DailyTask = {
  id: string;
  date: string;
  time: string;
  endTime: string;
  title: string;
  category: DailyTaskCategory;
  duration: number;
  members: string[];
  detail: Record<string, unknown> & {
    room?: string;
    agenda?: string[];
    company?: string;
    ticketId?: string;
    workItemId?: string;
    relatedRound?: string;
    symptom?: string;
    cause?: string;
    action?: string;
    channel?: string;
    inquiry?: string;
    response?: string;
    summary?: string;
    target?: string;
    comments?: number;
    note?: string;
  };
};

export type StatusKey =
  | "APPLIED"
  | "IN_PROGRESS"
  | "SCHEDULED"
  | "NOT_STARTED"
  | "FAILED"
  | "HOLD"
  | "NOT_REQUIRED"
  | "BACKLOG"
  | "TODO"
  | "REVIEW"
  | "BLOCKED"
  | "DONE";

export type PriorityKey = "P0" | "P1" | "P2" | "P3";

export type StatusMeta = {
  label: string;
  cls:
    | "done"
    | "progress"
    | "scheduled"
    | "pending"
    | "failed"
    | "hold"
    | "na"
    | "review";
};

export const TF_USERS: User[] = [
  { id: "U001", name: "이주성", initial: "이", role: "TF_LEAD",   color: "#5b76fe", illustration: "irid" },
  { id: "U002", name: "김지혜", initial: "김", role: "TF_MEMBER", color: "#d97706" },
  { id: "U003", name: "조민수", initial: "조", role: "TF_MEMBER", color: "#187574" },
  { id: "U004", name: "박선영", initial: "박", role: "TF_MEMBER", color: "#7a4fd0" },
];

export const MAINTAINERS: User[] = [
  { id: "M011", name: "김지혜", initial: "김", color: "#d97706" },
  { id: "M012", name: "조민수", initial: "조", color: "#187574" },
  { id: "M013", name: "박선영", initial: "박", color: "#7a4fd0" },
  { id: "M014", name: "정우성", initial: "정", color: "#c2348a" },
  { id: "M015", name: "한가영", initial: "한", color: "#5b76fe" },
  { id: "M016", name: "최도훈", initial: "최", color: "#1f5a2d" },
];

export const PATCH_ASSIGNEES: User[] = [
  { id: "P001", name: "이주성", initial: "이", color: "#5b76fe", illustration: "irid" },
  { id: "P002", name: "진예림", initial: "진", color: "#c2348a" },
  { id: "P003", name: "전수현", initial: "전", color: "#187574" },
  { id: "P004", name: "차진병", initial: "차", color: "#7a4fd0" },
];

export const ASSIGNEES: User[] = [
  ...TF_USERS,
  ...MAINTAINERS,
  ...PATCH_ASSIGNEES.filter((p) => p.name !== "이주성"),
];

export const COMPANIES: Company[] = [
  { id: 1,  name: "샘플상사(주)",     ver: "4.6", charset: "UTF-8",  access: "VPN",    deploy: "원격", ye: true,  wh: false, maintainer: "김지혜", status: "APPLIED",     scheduled: "2026-05-12", applied: "2026-05-14", issue: "" },
  { id: 2,  name: "가나다컴퍼니",     ver: "5.2", charset: "UTF-8",  access: "VDI",    deploy: "FTP",  ye: true,  wh: true,  maintainer: "조민수", status: "IN_PROGRESS", scheduled: "2026-05-15", applied: "",           issue: "VPN 연결 불안정, 재시도 예정" },
  { id: 3,  name: "알파정보시스템",   ver: "4.4", charset: "EUC-KR", access: "REMOTE", deploy: "메일", ye: true,  wh: false, maintainer: "박선영", status: "SCHEDULED",   scheduled: "2026-05-18", applied: "",           issue: "" },
  { id: 4,  name: "베타네트웍스(주)", ver: "5.2", charset: "UTF-8",  access: "VPN",    deploy: "원격", ye: true,  wh: true,  maintainer: "정우성", status: "APPLIED",     scheduled: "2026-05-10", applied: "2026-05-10", issue: "" },
  { id: 5,  name: "감마엔지니어링",   ver: "4.6", charset: "UTF-8",  access: "VDI",    deploy: "원격", ye: true,  wh: false, maintainer: "한가영", status: "FAILED",      scheduled: "2026-05-13", applied: "",           issue: "소스 적용 중 JVM 충돌" },
  { id: 6,  name: "델타소프트(주)",   ver: "5.2", charset: "UTF-8",  access: "VPN",    deploy: "FTP",  ye: true,  wh: true,  maintainer: "김지혜", status: "APPLIED",     scheduled: "2026-05-08", applied: "2026-05-09", issue: "" },
  { id: 7,  name: "엡실론코퍼레이션", ver: "4.4", charset: "EUC-KR", access: "MAIL",   deploy: "메일", ye: false, wh: true,  maintainer: "조민수", status: "NOT_REQUIRED", scheduled: "",           applied: "",           issue: "연말정산 미사용" },
  { id: 8,  name: "제타테크놀로지",   ver: "5.2", charset: "UTF-8",  access: "VDI",    deploy: "원격", ye: true,  wh: true,  maintainer: "박선영", status: "HOLD",        scheduled: "",           applied: "",           issue: "고객사 사내 일정 연기" },
  { id: 9,  name: "에타솔루션즈",     ver: "4.6", charset: "UTF-8",  access: "VPN",    deploy: "원격", ye: true,  wh: false, maintainer: "정우성", status: "IN_PROGRESS", scheduled: "2026-05-16", applied: "",           issue: "" },
  { id: 10, name: "세타어드밴스드",   ver: "5.2", charset: "UTF-8",  access: "VPN",    deploy: "FTP",  ye: true,  wh: true,  maintainer: "한가영", status: "NOT_STARTED", scheduled: "",           applied: "",           issue: "" },
  { id: 11, name: "이오타홀딩스",     ver: "4.6", charset: "UTF-8",  access: "REMOTE", deploy: "원격", ye: true,  wh: false, maintainer: "최도훈", status: "APPLIED",     scheduled: "2026-05-11", applied: "2026-05-12", issue: "" },
  { id: 12, name: "카파컨설팅",       ver: "5.2", charset: "UTF-8",  access: "VDI",    deploy: "원격", ye: true,  wh: true,  maintainer: "김지혜", status: "APPLIED",     scheduled: "2026-05-09", applied: "2026-05-09", issue: "" },
  { id: 13, name: "람다파트너스",     ver: "4.4", charset: "EUC-KR", access: "VPN",    deploy: "FTP",  ye: true,  wh: false, maintainer: "조민수", status: "NOT_STARTED", scheduled: "",           applied: "",           issue: "" },
  { id: 14, name: "뮤인더스트리",     ver: "5.2", charset: "UTF-8",  access: "VPN",    deploy: "원격", ye: true,  wh: true,  maintainer: "박선영", status: "SCHEDULED",   scheduled: "2026-05-19", applied: "",           issue: "" },
];

export const WORK_ITEMS: WorkItem[] = [
  { id: "W-210", type: "FOLLOW_UP",    title: "2025귀속 퇴직소득 영수증 서식 미반영 건 확인",        assignee: "진예림", priority: "P0", status: "TODO",        round: "2026-D01", company: "가나다컴퍼니",       due: "2026-05-16" },
  { id: "W-211", type: "BUGFIX",       title: "퇴직소득 원천징수영수증 비과세 합계 누락 재현",        assignee: "전수현", priority: "P0", status: "IN_PROGRESS", round: "2026-D01", company: "샘플상사(주)",       due: "2026-05-14" },
  { id: "W-212", type: "FOLLOW_UP",    title: "임원 동일인공제 로직 검증 케이스 작성",                assignee: "차진병", priority: "P1", status: "IN_PROGRESS", round: "2026-D01", company: "",                   due: "2026-05-14" },
  { id: "W-213", type: "FOLLOW_UP",    title: "간이지급명세서 양식 V3 검토회의 회의록 정리",          assignee: "이주성", priority: "P1", status: "REVIEW",      round: "2026-D01", company: "",                   due: "2026-05-15" },
  { id: "W-214", type: "BUGFIX",       title: "VPN 접속 시 인증 오류 재현 스크립트",                  assignee: "진예림", priority: "P1", status: "TODO",        round: "2026-D01", company: "감마엔지니어링",     due: "2026-05-18" },
  { id: "W-215", type: "BUGFIX",       title: "JVM 충돌 로그 분석 (감마엔지니어링)",                   assignee: "전수현", priority: "P0", status: "IN_PROGRESS", round: "2026-D01", company: "감마엔지니어링",     due: "2026-05-15" },
  { id: "W-216", type: "SERVICE_DESK", title: "베타네트웍스 원천세 신고분 문의 응대",                  assignee: "전수현", priority: "P2", status: "DONE",        round: "2026-D01", ticket: "86134", company: "베타네트웍스(주)",   due: "2026-05-12" },
  { id: "W-217", type: "SERVICE_DESK", title: "카파컨설팅 패치 적용 후 화면 오류 안내",                assignee: "이주성", priority: "P1", status: "DONE",        round: "2026-D01", ticket: "86129", company: "카파컨설팅",         due: "2026-05-10" },
  { id: "W-218", type: "SERVICE_DESK", title: "알파정보시스템 EUC-KR 인코딩 점검 요청",                assignee: "차진병", priority: "P2", status: "TODO",        round: "2026-D01", ticket: "86147", company: "알파정보시스템",     due: "2026-05-19" },
  { id: "W-219", type: "FOLLOW_UP",    title: "국세청 가이드 4월 개정분 영향도 분석",                  assignee: "이주성", priority: "P1", status: "DONE",        round: "2026-D01", company: "",                   due: "2026-05-10" },
  { id: "W-220", type: "FOLLOW_UP",    title: "샘플상사 작년 소득공제 항목 누락분 재반영 검토",        assignee: "진예림", priority: "P1", status: "TODO",        round: "2026-D01", company: "샘플상사(주)",       due: "2026-05-22" },
  { id: "W-221", type: "BUGFIX",       title: "에타솔루션즈 패치 후 RD 출력 깨짐",                      assignee: "차진병", priority: "P1", status: "BLOCKED",     round: "2026-D01", company: "에타솔루션즈",       due: "2026-05-20" },
  { id: "W-222", type: "SERVICE_DESK", title: "델타소프트 연말정산 사용 가이드 재발송",                assignee: "진예림", priority: "P3", status: "BACKLOG",     round: "2026-D01", ticket: "86158", company: "델타소프트(주)",     due: "2026-05-25" },
  { id: "W-223", type: "FOLLOW_UP",    title: "4.6 / 5.2 버전 회귀 테스트 스위트 업데이트",            assignee: "차진병", priority: "P2", status: "BACKLOG",     round: "2026-D01", company: "",                   due: "2026-05-30" },
  { id: "W-203", type: "SERVICE_DESK", title: "엡실론코퍼레이션 4월 정기점검 안내",                    assignee: "진예림", priority: "P3", status: "DONE",        round: "2026-D01", ticket: "86098", company: "엡실론코퍼레이션",   due: "2026-04-22" },
  { id: "W-204", type: "BUGFIX",       title: "4.4 EUC-KR 환경 한글 깨짐 핫픽스",                       assignee: "전수현", priority: "P1", status: "DONE",        round: "2026-D01", company: "람다파트너스",       due: "2026-04-18" },
  { id: "W-205", type: "FOLLOW_UP",    title: "3월 출시분 사용성 피드백 정리",                          assignee: "이주성", priority: "P2", status: "DONE",        round: "2026-D01", company: "",                   due: "2026-04-15" },
];

export const ROUNDS: Round[] = [
  { code: "2026-D01", name: "연중패치 01",     type: "REGULAR",    status: "RELEASED", items: 7, release: "2026-05-02", due: "2026-05-20" },
  { code: "2026-Y01", name: "연말정산패치 01", type: "YEAR_END",   status: "DRAFT",    items: 3, release: "",           due: "2026-06-15" },
  { code: "2026-I01", name: "개별패치 01",     type: "INDIVIDUAL", status: "DRAFT",    items: 2, release: "",           due: "2026-06-10" },
  { code: "2026-E01", name: "추가패치 01",     type: "EXTRA",      status: "CLOSED",   items: 4, release: "2026-04-10", due: "2026-04-20" },
];

export const PATCH_ITEMS: PatchItem[] = [
  { no: "001", title: "퇴직소득 원천징수영수증 수정",     cat: "JSP",       group: "SOURCE", versions: ["V4","V5"], scope: "SELECTED", companies: ["서흥"],                          encodings: [],                  assignee: "전수현", guide: false,
    summary: "서흥의 임원 퇴직소득 원천징수영수증에서 비과세 항목 합계가 누락되던 이슈 수정. 비과세 항목별 컬럼 신설 및 합계산식 보정.",
    files: [
      { ver: "V5", type: "MODIFY", path: "/src/main/webapp/withhold/RetireIncomeReceipt.jsp",     plus: 24, minus: 8 },
      { ver: "V5", type: "MODIFY", path: "/src/main/java/withhold/RetireIncomeService.java",     plus: 12, minus: 4 },
      { ver: "V4", type: "MODIFY", path: "/src/main/webapp/withhold/RetireIncomeReceipt_v4.jsp", plus: 18, minus: 6 },
    ],
    guideMeta: null,
  },
  { no: "002", title: "임원 동일인공제액관리 로직",       cat: "PROCEDURE", group: "DB",     versions: ["V5"],      scope: "ALL",      companies: [],                                encodings: [],                  assignee: "차진병", guide: false,
    summary: "동일인 여부 판정 시 가족관계증명서 갱신분 미반영 → 최신 매핑 테이블 참조하도록 프로시저 보정.",
    files: [
      { ver: "V5", type: "MODIFY", path: "/db/procedure/PRC_EXEC_DEDUCT_MGMT.sql", plus: 42, minus: 18 },
      { ver: "V5", type: "NEW",    path: "/db/migration/2026-D01-002_add_family_idx.sql", plus: 14, minus: 0 },
    ],
    guideMeta: null,
  },
  { no: "003", title: "간이지급명세서 제출양식 갱신",     cat: "RST.JSP",   group: "SOURCE", versions: ["V4","V5"], scope: "ALL",      companies: [],                                encodings: ["UTF-8","EUC-KR"],  assignee: "이주성", guide: true,
    summary: "국세청 25년 12월 고시안 반영. 외국인 식별번호 컬럼 길이 확장 및 비거주자 코드 신설.",
    files: [
      { ver: "V5", type: "MODIFY", path: "/src/main/webapp/withhold/SimplePayStatement_rst.jsp", plus: 56, minus: 22 },
      { ver: "V5", type: "MODIFY", path: "/src/main/resources/forms/simple_pay_v3.xml",         plus: 18, minus: 12 },
      { ver: "V4", type: "MODIFY", path: "/src/main/webapp/withhold/SimplePayStatement_rst_v4.jsp", plus: 48, minus: 20 },
    ],
    guideMeta: { author: "이주성", updatedAt: "2026-05-08" },
  },
  { no: "004", title: "중소기업 취업자 감면 재계산",       cat: "FUNCTION",  group: "DB",     versions: ["V4","V5"], scope: "ALL",      companies: [],                                encodings: [],                  assignee: "진예림", guide: false,
    summary: "소득세법 시행령 개정에 따라 청년 연령범위 34세→39세 확대. 감면율 재계산 함수 보정.",
    files: [
      { ver: "V5", type: "MODIFY", path: "/db/function/FN_SME_DEDUCT_RATE.sql", plus: 28, minus: 14 },
      { ver: "V4", type: "MODIFY", path: "/db/function/FN_SME_DEDUCT_RATE_V4.sql", plus: 22, minus: 12 },
    ],
    guideMeta: null,
  },
  { no: "005", title: "연금보험료 공제한도 상향 반영",     cat: "XML",       group: "SOURCE", versions: ["V4"],      scope: "ALL",      companies: [],                                encodings: ["EUC-KR"],          assignee: "전수현", guide: false,
    summary: "연금저축 공제한도 600만원→900만원 상향. 산식 XML 정의 갱신.",
    files: [
      { ver: "V4", type: "MODIFY", path: "/src/main/resources/calc/pension_deduct.xml", plus: 8, minus: 4 },
    ],
    guideMeta: null,
  },
  { no: "006", title: "기부금 명세서 V3 서식 반영",        cat: "RD",        group: "RD",     versions: ["V4","V5"], scope: "ALL",      companies: [],                                encodings: [],                  assignee: "차진병", guide: true,
    summary: "기부금 명세서 서식 V3 신규. 정치자금/우리사주 항목 분리, 이월공제 컬럼 추가.",
    files: [
      { ver: "V5", type: "NEW",    path: "/reports/donation_statement_v3.rdf", plus: 320, minus: 0 },
      { ver: "V5", type: "DELETE", path: "/reports/donation_statement_v2.rdf", plus: 0, minus: 248 },
      { ver: "V4", type: "NEW",    path: "/reports/donation_statement_v3_v4.rdf", plus: 296, minus: 0 },
    ],
    guideMeta: { author: "차진병", updatedAt: "2026-05-12" },
  },
  { no: "007", title: "외국인 근로자 단일세율 적용",       cat: "PACKAGE",   group: "DB",     versions: ["V5"],      scope: "SELECTED", companies: ["알파정보시스템","베타네트웍스","감마엔지니어링"], encodings: ["UTF-8"], assignee: "이주성", guide: false,
    summary: "외국인 근로자 단일세율(19%) 선택 적용 패키지 추가. 일반세율과 비교계산 로직 포함.",
    files: [
      { ver: "V5", type: "NEW", path: "/db/package/PKG_FOREIGN_FLAT_TAX.sql", plus: 184, minus: 0 },
      { ver: "V5", type: "NEW", path: "/db/package/PKG_FOREIGN_FLAT_TAX_BODY.sql", plus: 412, minus: 0 },
    ],
    guideMeta: null,
  },
];

export const SCHEDULES: Schedule[] = [
  { id: "S001", date: "2026-04-28", user: PATCH_ASSIGNEES[1], label: "오후반차", range: "13:00 ~" },
  { id: "S002", date: "2026-04-28", user: PATCH_ASSIGNEES[3], label: "출장",     range: "2026-05-13 ~ 05-15" },
];

export const DAILY_TASKS: DailyTask[] = [
  // 2026-04-28 (화)
  { id: "D001", date: "2026-04-28", time: "09:30", endTime: "10:00", title: "데일리 스탠드업 (TF 전체)",
    category: "MEETING", duration: 30, members: ["이주성", "진예림", "전수현", "차진병"],
    detail: { room: "회의실 B-3 (4층)", agenda: ["어제 진행 사항 공유", "오늘 우선순위 합의", "Blocker 점검"] } },
  { id: "D002", date: "2026-04-28", time: "10:00", endTime: "11:00", title: "2026-D01-003 간이지급명세서 양식 점검 회의",
    category: "MEETING", duration: 60, members: ["이주성", "차진병"],
    detail: { room: "회의실 A-1 (5층)", agenda: ["양식 V3 변경점 리뷰", "EUC-KR 환경 출력 케이스 확인", "검수 일정 합의"] } },
  { id: "D003", date: "2026-04-28", time: "11:00", endTime: "12:30", title: "JVM 충돌 로그 분석 (감마엔지니어링)",
    category: "BUGFIX", duration: 90, members: ["전수현"],
    detail: { company: "감마엔지니어링", ticketId: "#BUG-2415", workItemId: "W-215", relatedRound: "2026-D01",
      symptom: "소스 적용 직후 JVM이 비정상 종료. hs_err 로그에 SIGSEGV 발생.",
      cause: "JNI 라이브러리 버전 불일치로 추정. 4.6 환경에서 신규 구버전 dll 로딩 시 충돌.",
      action: "hs_err 풀스택 확보 후 사내 재현 환경 구성. JNI 의존성 매트릭스와 비교 진행 중." } },
  { id: "D004", date: "2026-04-28", time: "13:30", endTime: "14:30", title: "베타네트웍스(주) 원천세 신고분 문의 응대",
    category: "SERVICE_DESK", duration: 60, members: ["전수현"],
    detail: { company: "베타네트웍스(주)", ticketId: "#86134", workItemId: "W-216", channel: "원격",
      inquiry: "4월 원천세 신고분 일부 직원 비과세 합계가 영수증과 다르다는 문의.",
      response: "원격 접속 후 시뮬레이션 재계산. 비과세 항목 코드 매핑 누락 확인 → 핫픽스 패치 안내." } },
  { id: "D005", date: "2026-04-28", time: "14:30", endTime: "15:15", title: "임원 동일인공제 로직 검증 코드리뷰",
    category: "REVIEW", duration: 45, members: ["이주성", "차진병"],
    detail: { target: "PR #1284 — payroll/exec-deduction.ts", comments: 7,
      summary: "동일인공제 케이스 11종 검증 코드 리뷰. 경계값 누락 2건 코멘트." } },
  { id: "D006", date: "2026-04-28", time: "15:30", endTime: "16:30", title: "국세청 가이드 4월 개정분 후속조치 1차 검토",
    category: "FOLLOW_UP", duration: 60, members: ["이주성"],
    detail: { workItemId: "W-219", summary: "국세청 가이드 4월 개정분 영향도 분석 결과 검토. 후속 조치 항목으로 등록된 W-219 진행 상태 확인." } },
  { id: "D007", date: "2026-04-28", time: "17:00", endTime: "17:30", title: "오늘의 작업 로그 정리 / 내일 예정 일정 공지",
    category: "GENERAL", duration: 30, members: ["이주성"],
    detail: { note: "금일 진행 항목 로그화, 내일 회의/일정 슬랙 공지." } },

  // 2026-04-27 (월)
  { id: "D010", date: "2026-04-27", time: "09:30", endTime: "10:15", title: "주간 TF 킥오프 미팅",
    category: "MEETING", duration: 45, members: ["이주성", "진예림", "전수현", "차진병"],
    detail: { room: "회의실 B-3 (4층)", agenda: ["금주 차수 진행 계획", "리스크 공유", "담당 분배"] } },
  { id: "D011", date: "2026-04-27", time: "10:30", endTime: "11:30", title: "2026-D01 차수 항목 진행 상태 점검",
    category: "MEETING", duration: 60, members: ["이주성", "진예림"],
    detail: { room: "회의실 A-2 (5층)", agenda: ["항목별 진행률 점검", "지연 항목 원인 파악", "리스케줄 결정"] } },
  { id: "D012", date: "2026-04-27", time: "14:00", endTime: "16:00", title: "VPN 인증 오류 재현 환경 구성",
    category: "BUGFIX", duration: 120, members: ["진예림"],
    detail: { company: "감마엔지니어링", ticketId: "#BUG-2418", workItemId: "W-214", relatedRound: "2026-D01",
      symptom: "VPN 접속 직후 인증 토큰 검증 실패가 간헐적으로 발생.",
      cause: "미확인 — 토큰 만료 시점 race condition 의심.",
      action: "재현 가능한 사내 VPN 테스트 환경 구성. 인증 미들웨어 로그 레벨 상향." } },
  { id: "D013", date: "2026-04-27", time: "16:30", endTime: "17:00", title: "카파컨설팅 패치 적용 후 화면 오류 안내",
    category: "SERVICE_DESK", duration: 30, members: ["이주성"],
    detail: { company: "카파컨설팅", ticketId: "#86129", workItemId: "W-217", channel: "유선",
      inquiry: "5.2 패치 적용 후 급여대장 화면 일부 컬럼이 깨진다는 문의.",
      response: "브라우저 캐시 초기화 안내, 사내 정책상 기존 캐시가 유지되어 발생한 표시 이슈로 확인. 가이드 문서 송부." } },

  // 2026-04-29 (수)
  { id: "D020", date: "2026-04-29", time: "09:30", endTime: "10:00", title: "데일리 스탠드업",
    category: "MEETING", duration: 30, members: ["이주성", "진예림", "전수현", "차진병"],
    detail: { room: "회의실 B-3 (4층)", agenda: ["일일 진행 공유", "Blocker 점검"] } },
  { id: "D021", date: "2026-04-29", time: "11:00", endTime: "12:30", title: "에타솔루션즈 RD 출력 깨짐 원인 분석",
    category: "BUGFIX", duration: 90, members: ["차진병"],
    detail: { company: "에타솔루션즈", ticketId: "#BUG-2421", workItemId: "W-221", relatedRound: "2026-D01",
      symptom: "RD 리포트 출력 시 한글 일부가 깨져 출력됨. 4.6 환경에서만 재현.",
      cause: "미확인 — 폰트 임베딩 / 인코딩 이슈 의심.",
      action: "4.6 환경 재현, RD 폰트 매핑 테이블 점검. 추가 분석 필요." } },
  { id: "D022", date: "2026-04-29", time: "14:00", endTime: "14:45", title: "간이지급명세서 양식 V3 검토회의 회의록 정리",
    category: "FOLLOW_UP", duration: 45, members: ["이주성"],
    detail: { workItemId: "W-213", summary: "04-28 회의 결정사항을 후속조치 W-213 항목에 정리하여 공유." } },
  { id: "D023", date: "2026-04-29", time: "16:00", endTime: "17:00", title: "알파정보시스템 EUC-KR 인코딩 점검 응대",
    category: "SERVICE_DESK", duration: 60, members: ["차진병"],
    detail: { company: "알파정보시스템", ticketId: "#86147", workItemId: "W-218", channel: "원격",
      inquiry: "EUC-KR 환경에서 4월 패치 후 일부 화면 인코딩 불일치 메시지 발생.",
      response: "원격 접속하여 환경 변수 점검. WAS 기동 옵션 누락 확인 → 적용 가이드 송부." } },

  // 2026-04-30 (목)
  { id: "D030", date: "2026-04-30", time: "10:00", endTime: "11:00", title: "월말 패치 진행 점검 회의",
    category: "MEETING", duration: 60, members: ["이주성", "진예림", "전수현", "차진병"],
    detail: { room: "회의실 B-3 (4층)", agenda: ["월말 미적용 고객사 점검", "5월 1주차 계획", "리스크 공유"] } },
  { id: "D031", date: "2026-04-30", time: "13:30", endTime: "15:30", title: "4.6 / 5.2 회귀 테스트 스위트 업데이트",
    category: "FOLLOW_UP", duration: 120, members: ["차진병"],
    detail: { workItemId: "W-223", summary: "4.6 / 5.2 환경 회귀 테스트 케이스 신규 4건 추가, 노후 케이스 12건 정리." } },
  { id: "D032", date: "2026-04-30", time: "16:00", endTime: "17:00", title: "월간 작업 보고서 초안 정리",
    category: "GENERAL", duration: 60, members: ["이주성"],
    detail: { note: "4월 진행 항목, 적용 현황, 후속조치 상태를 보고서 초안으로 정리." } },

  // 2026-04-24 (금)
  { id: "D040", date: "2026-04-24", time: "10:00", endTime: "10:45", title: "주간 회고 미팅",
    category: "MEETING", duration: 45, members: ["이주성", "진예림", "전수현", "차진병"],
    detail: { room: "회의실 B-3 (4층)", agenda: ["금주 회고", "학습 포인트 공유", "다음주 액션 정리"] } },
  { id: "D041", date: "2026-04-24", time: "14:00", endTime: "14:30", title: "엡실론코퍼레이션 4월 정기점검 안내",
    category: "SERVICE_DESK", duration: 30, members: ["진예림"],
    detail: { company: "엡실론코퍼레이션", ticketId: "#86098", workItemId: "W-203", channel: "메일",
      inquiry: "4월 정기점검 일정 안내 요청.",
      response: "점검 일정 및 영향 범위 안내문 메일 송부." } },
  { id: "D042", date: "2026-04-24", time: "15:00", endTime: "16:30", title: "3월 출시분 사용성 피드백 정리",
    category: "FOLLOW_UP", duration: 90, members: ["이주성"],
    detail: { workItemId: "W-205", summary: "3월 출시 항목에 대한 고객사 피드백 12건 정리, 후속 개선 항목 추출." } },

  // 2026-04-22 (수)
  { id: "D050", date: "2026-04-22", time: "09:30", endTime: "10:00", title: "데일리 스탠드업",
    category: "MEETING", duration: 30, members: ["이주성", "진예림", "전수현", "차진병"],
    detail: { room: "회의실 B-3 (4층)", agenda: ["일일 진행 공유"] } },
  { id: "D051", date: "2026-04-22", time: "14:00", endTime: "16:30", title: "람다파트너스 4.4 EUC-KR 한글 깨짐 핫픽스",
    category: "BUGFIX", duration: 150, members: ["전수현"],
    detail: { company: "람다파트너스", ticketId: "#BUG-2403", workItemId: "W-204", relatedRound: "2026-D01",
      symptom: "4.4 EUC-KR 환경에서 일부 화면 한글 깨짐.",
      cause: "신규 라이브러리에서 UTF-8 가정으로 인코딩 처리 → EUC-KR 환경에서 디코드 실패.",
      action: "인코딩 분기 처리 추가, 핫픽스 패치 작성 후 검증 완료. 배포 진행." } },

  // 2026-04-15 (수)
  { id: "D060", date: "2026-04-15", time: "10:00", endTime: "11:00", title: "국세청 가이드 영향도 분석 회의",
    category: "MEETING", duration: 60, members: ["이주성", "진예림"],
    detail: { room: "회의실 A-1 (5층)", agenda: ["가이드 4월 개정안 리뷰", "영향 항목 분류", "담당 분배"] } },
  { id: "D061", date: "2026-04-15", time: "14:00", endTime: "15:30", title: "샘플상사 작년 소득공제 누락분 재반영 검토",
    category: "FOLLOW_UP", duration: 90, members: ["진예림"],
    detail: { workItemId: "W-220", summary: "샘플상사 직원 14명 작년 소득공제 누락 항목 식별, 재반영 시나리오 작성." } },
];

export const STATUS_META: Record<StatusKey, StatusMeta> = {
  APPLIED:      { label: "반영완료", cls: "done"      },
  IN_PROGRESS:  { label: "진행중",   cls: "progress"  },
  SCHEDULED:    { label: "예정",     cls: "scheduled" },
  NOT_STARTED:  { label: "미진행",   cls: "pending"   },
  FAILED:       { label: "실패",     cls: "failed"    },
  HOLD:         { label: "보류",     cls: "hold"      },
  NOT_REQUIRED: { label: "대상아님", cls: "na"        },
  BACKLOG:      { label: "BACKLOG",  cls: "pending"   },
  TODO:         { label: "TODO",     cls: "pending"   },
  REVIEW:       { label: "REVIEW",   cls: "review"    },
  BLOCKED:      { label: "BLOCKED",  cls: "failed"    },
  DONE:         { label: "DONE",     cls: "done"      },
};

export const PRIORITY_META: Record<PriorityKey, { label: string; color: string }> = {
  P0: { label: "P0", color: "var(--priority-p0)" },
  P1: { label: "P1", color: "var(--priority-p1)" },
  P2: { label: "P2", color: "var(--priority-p2)" },
  P3: { label: "P3", color: "var(--priority-p3)" },
};

export const TAG_META: Record<string, { label: string; cls: string }> = {
  PATCH:     { label: "PATCH",     cls: "patch"    },
  FOLLOW_UP: { label: "FOLLOW_UP", cls: "followup" },
  GENERAL:   { label: "GENERAL",   cls: "general"  },
  SUPPORT:   { label: "SUPPORT",   cls: "support"  },
  TEST:      { label: "TEST",      cls: "test"     },
};

export const CATEGORY_META: Record<DailyTaskCategory, { label: string; bg: string; fg: string }> = {
  MEETING:      { label: "회의",         bg: "var(--pastel-blue)",   fg: "var(--accent-700)" },
  FOLLOW_UP:    { label: "후속조치",     bg: "var(--pastel-yellow)", fg: "var(--pastel-yellow-d)" },
  BUGFIX:       { label: "버그개선",     bg: "#fbe1ea",              fg: "#b8377a"           },
  SERVICE_DESK: { label: "서비스데스크", bg: "#dbeafe",              fg: "#2563b8"           },
  REVIEW:       { label: "리뷰",         bg: "var(--pastel-violet)", fg: "var(--pastel-violet-d)" },
  GENERAL:      { label: "일반",         bg: "var(--bg-sunken)",     fg: "var(--text-secondary)" },
};
