export interface NavigationItem {
  title: string;
  href: string;
  note?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "대시보드", href: "/" },
      { title: "패치 현황", href: "/patches/targets" },
      { title: "칸반 보드", href: "/tasks/board" },
    ],
  },
  {
    title: "Patch",
    items: [
      { title: "패치 차수", href: "/patches/rounds" },
      { title: "패치 항목", href: "/patches/rounds/2026-D01" },
    ],
  },
  {
    title: "Task",
    items: [
      { title: "업무 리스트", href: "/tasks/list" },
      { title: "일일업무", href: "/tasks/daily" },
      { title: "후속조치", href: "/tasks/follow-ups" },
      { title: "개인일정", href: "/tasks/schedules" },
    ],
  },
  {
    title: "Customers",
    items: [
      { title: "고객사 목록", href: "/companies" },
      { title: "연도별 환경정보", href: "/companies/year-profiles" },
      { title: "연락처 / 접속정보", href: "/companies/cmp-sample/contacts" },
    ],
  },
  {
    title: "Reports",
    items: [
      { title: "차수별 진행률", href: "/reports/patch-progress" },
      { title: "담당자별 현황", href: "/reports/assignee" },
      { title: "지연 / 이슈", href: "/reports/issues" },
    ],
  },
  {
    title: "Admin",
    items: [
      { title: "사용자", href: "/admin/users" },
      { title: "권한", href: "/admin/roles" },
      { title: "코드", href: "/admin/codes" },
      { title: "이관", href: "/admin/imports" },
    ],
  },
];

