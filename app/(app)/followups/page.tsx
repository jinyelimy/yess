"use client";

// ── FOLLOWUPS page — 후속조치 ──
// _design_input/screens/other.jsx (FollowupsPage 부분) 1:1 port.

import * as React from "react";
import {
  Avatar,
  Btn,
  Card,
  PageHeader,
  PriorityDot,
  StatusBadge,
} from "@/components/yess/common";
import { ASSIGNEES, WORK_ITEMS } from "@/lib/yess/data";

export default function FollowupsPage() {
  const fus = WORK_ITEMS.filter((w) => w.type === "FOLLOW_UP");
  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader
        title="후속조치"
        subtitle="고객사 패치 후속 작업 · 지연/이슈 추적"
        actions={
          <Btn variant="primary" size="md" icon="plus">
            후속조치 등록
          </Btn>
        }
      />
      <Card padding={0}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-surface-2)" }}>
                {["ID", "제목", "연결 차수", "고객사", "담당자", "우선순위", "상태", "마감일"].map((h) => (
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
              {fus.map((w) => {
                const u =
                  ASSIGNEES.find((a) => a.name === w.assignee) || { initial: w.assignee?.[0], name: w.assignee };
                return (
                  <tr
                    key={w.id}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      <span style={{ color: "var(--text-tertiary)" }}>{w.id}</span>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", fontWeight: 500 }}>
                      {w.title}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      {w.round ? (
                        <span style={{ color: "var(--accent-700)", fontWeight: 600 }}>{w.round}</span>
                      ) : (
                        <span style={{ color: "var(--text-tertiary)" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                      {w.company || "—"}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Avatar user={u} size={20} />
                        {w.assignee}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <PriorityDot priority={w.priority} withLabel />
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <StatusBadge status={w.status} />
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      {w.due || "—"}
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
