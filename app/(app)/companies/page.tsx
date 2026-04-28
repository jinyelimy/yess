"use client";

// ── COMPANIES page — 고객사 마스터 ──
// _design_input/screens/other.jsx (CompaniesPage 부분) 1:1 port.

import * as React from "react";
import { Avatar, Badge, Btn, Card, PageHeader } from "@/components/yess/common";
import { ASSIGNEES, COMPANIES } from "@/lib/yess/data";

export default function CompaniesPage() {
  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader
        title="고객사 마스터"
        subtitle="환경정보 · 연락처 · 계약 정보 관리"
        actions={
          <Btn variant="primary" size="md" icon="plus">
            고객사 추가
          </Btn>
        }
      />
      <Card padding={0}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-surface-2)" }}>
                {["ID", "회사명", "버전", "charset", "접속", "반영", "연말정산", "원천세", "유지보수 담당"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPANIES.map((c) => {
                const u =
                  ASSIGNEES.find((a) => a.name === c.maintainer) ||
                  { initial: c.maintainer?.[0], name: c.maintainer };
                return (
                  <tr
                    key={c.id}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      <span style={{ color: "var(--text-tertiary)" }}>CO-{String(c.id).padStart(4, "0")}</span>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", fontWeight: 600 }}>
                      {c.name}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      {c.ver}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      <span style={{ color: "var(--text-tertiary)" }}>{c.charset}</span>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <Badge variant="soft">{c.access}</Badge>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <Badge variant="soft">{c.deploy}</Badge>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      {c.ye ? (
                        <span style={{ color: "var(--success-fg)", fontWeight: 600 }}>✓ 사용</span>
                      ) : (
                        <span style={{ color: "var(--text-tertiary)" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      {c.wh ? (
                        <span style={{ color: "var(--success-fg)", fontWeight: 600 }}>✓ 사용</span>
                      ) : (
                        <span style={{ color: "var(--text-tertiary)" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Avatar user={u} size={20} />
                        {c.maintainer}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
