"use client";

// ── YESS App Shell — Sidebar + Topbar ──
// 디자인 익스포트의 SidebarA/B/C/D 4개 variant 중 기본값 C(친근형)를 채택.
// Hash 기반 네비게이션 → Next.js App Router 링크로 교체.

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Badge, Icon, IconBtn } from "./common";

type NavItem = { id: string; label: string; icon: string; href: string };
type NavGroup = { label: string | null; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [
      { id: "dashboard", label: "대시보드", icon: "dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "패치 관리",
    items: [
      { id: "targets", label: "고객사 패치 현황", icon: "patch",  href: "/targets" },
      { id: "rounds",  label: "패치 차수 · 항목", icon: "rounds", href: "/rounds"  },
    ],
  },
  {
    label: "TF 업무",
    items: [
      { id: "kanban",    label: "Kanban 보드", icon: "kanban",   href: "/kanban"    },
      { id: "daily",     label: "일일업무",    icon: "daily",    href: "/daily"     },
      { id: "followups", label: "후속조치",    icon: "followup", href: "/followups" },
    ],
  },
  {
    label: "기타",
    items: [
      { id: "companies", label: "고객사", icon: "company", href: "/companies" },
      { id: "reports",   label: "리포트", icon: "report",  href: "/reports"   },
    ],
  },
];

/* ───────── Brand Wordmark — "YESS!" stencil monogram ───────── */
export const BrandWordmark: React.FC<{ size?: number }> = ({ size = 18 }) => {
  const w = (n: number) => (size * n) / 18;
  return (
    <span
      aria-label="YESS!"
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.05em",
        lineHeight: 1,
        color: "var(--text-primary)",
        display: "inline-flex",
        alignItems: "center",
        fontFeatureSettings: '"ss01", "ss04"',
      }}
    >
      <svg
        width={size * 0.95}
        height={size * 1.05}
        viewBox="0 0 19 21"
        style={{ display: "block", marginRight: -w(0.5) }}
        aria-hidden="true"
      >
        <path d="M2 2 L9.5 11 L9.5 19" stroke="var(--accent-500)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M17 2 L9.5 11"        stroke="var(--accent-700)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span>ESS</span>
      <span aria-hidden="true" style={{ color: "var(--accent-500)", marginLeft: w(0.6), display: "inline-flex", alignItems: "center" }}>!</span>
    </span>
  );
};

/* ───────── Sidebar (variant C — 일러스트 친근형) ───────── */
function Sidebar({ activePath }: { activePath: string }) {
  const groupDots = ["#a8b8ff", "#ffd97a", "#f8cbdd", "#cfc1f2"];
  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "var(--bg-canvas)",
        borderRight: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Hero card */}
      <div
        style={{
          margin: "14px 12px 10px",
          padding: "16px 14px 14px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #efeaff 0%, #faf3ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: -14,
            top: -14,
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "rgba(160, 140, 230, 0.25)",
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: 26,
            top: 22,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "rgba(255, 230, 163, 0.85)",
          }}
        />
        <BrandWordmark size={22} />
        <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          안녕하세요,<br />
          <b style={{ color: "var(--text-primary)", fontSize: 12.5 }}>이주성</b>님 👋
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "4px 12px 16px" }}>
        {NAV_GROUPS.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 14 }}>
            {g.label && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 4px 8px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: groupDots[gi % 4] }} />
                {g.label}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {g.items.map((it) => {
                const active = activePath === it.href || activePath.startsWith(it.href + "/");
                return (
                  <Link
                    key={it.id}
                    href={it.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      padding: "9px 12px",
                      borderRadius: 12,
                      border: "1px solid transparent",
                      background: active ? "#fff" : "transparent",
                      boxShadow: active
                        ? "0 4px 14px rgba(124, 92, 220, 0.10), 0 0 0 1px rgba(124, 92, 220, 0.10)"
                        : "none",
                      color: active ? "var(--accent-700)" : "var(--text-primary)",
                      fontSize: 13.5,
                      fontWeight: active ? 600 : 500,
                      textDecoration: "none",
                      transition: "all 0.16s ease",
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        display: "grid",
                        placeItems: "center",
                        background: active ? "var(--accent-50)" : "var(--bg-surface-2)",
                        color: active ? "var(--accent-600)" : "var(--text-secondary)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={it.icon} size={15} strokeWidth={1.7} />
                    </span>
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer mini */}
      <div style={{ padding: "10px 12px 16px" }}>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "var(--bg-surface-2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #ffe6a3 0%, #ffd97a 100%)",
              display: "grid",
              placeItems: "center",
              fontSize: 18,
            }}
          >
            ☀️
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>오늘 D-3</div>
            <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", lineHeight: 1.3, marginTop: 1 }}>2026-D01 마감</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ───────── Topbar ───────── */
function Topbar() {
  return (
    <div
      style={{
        height: "var(--topbar-h)",
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "var(--bg-canvas)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ flex: 1 }} />

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          height: 36,
          width: 280,
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-surface-2)",
          borderRadius: "var(--r-md)",
        }}
      >
        <Icon name="search" size={14} color="var(--text-tertiary)" />
        <input
          placeholder="고객사 / 차수 / 업무 검색…"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: 13,
            color: "var(--text-primary)",
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: 10.5,
            color: "var(--text-tertiary)",
            padding: "2px 6px",
            borderRadius: 4,
            background: "var(--bg-canvas)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Year pill */}
      <Badge
        variant="outline"
        style={{
          padding: "4px 10px",
          height: 28,
          fontSize: 12,
          fontWeight: 600,
          borderRadius: "var(--r-pill)",
          background: "var(--accent-50)",
          color: "var(--accent-700)",
          border: "1px solid var(--accent-200)",
        }}
      >
        <span style={{ fontWeight: 700 }}>2026</span>&nbsp;귀속
      </Badge>

      <IconBtn icon="bell" title="알림" />
      <IconBtn icon="settings" title="설정" />

      <Avatar user={{ illustration: "irid", color: "var(--accent-500)", name: "이주성" }} size={32} />
    </div>
  );
}

/* ───────── App Shell ───────── */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-canvas)" }}>
      <Sidebar activePath={pathname} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main key={pathname} className="page-slot" style={{ flex: 1, padding: "24px 28px 64px", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
