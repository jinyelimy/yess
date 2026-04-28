"use client";

// ── REPORTS page — 진행률 · 담당자 분석 ──
// _design_input/screens/other.jsx (ReportsPage 부분) 1:1 port.

import * as React from "react";
import { Avatar, Card, PageHeader, SectionHeader } from "@/components/yess/common";
import { ASSIGNEES, ROUNDS } from "@/lib/yess/data";

export default function ReportsPage() {
  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader title="진행률 · 담당자 분석" subtitle="차수별 / 담당자별 진행 현황을 한 화면에서" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <Card padding={16}>
          <div className="t-overline">진행 중 차수</div>
          <div className="tnum" style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 4 }}>
            3
          </div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>2026 귀속</div>
        </Card>
        <Card padding={16}>
          <div className="t-overline">총 패치 대상</div>
          <div className="tnum" style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 4 }}>
            142
          </div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>고객사 14개사</div>
        </Card>
        <Card padding={16}>
          <div className="t-overline">평균 완료율</div>
          <div
            className="tnum"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              marginTop: 4,
              color: "var(--accent-700)",
            }}
          >
            61%
          </div>
          <div style={{ fontSize: 11, color: "var(--success-fg)", marginTop: 2 }}>+ 8%p WoW</div>
        </Card>
        <Card padding={16}>
          <div className="t-overline">평균 소요</div>
          <div className="tnum" style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 4 }}>
            4.2일
          </div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>대상별 평균</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Card padding={20}>
          <SectionHeader overline="차수별 상태 분포" title="Round Distribution" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ROUNDS.map((r) => {
              const segs = [
                { cls: "done",     pct: 35 + (r.code.charCodeAt(6) % 30) },
                { cls: "progress", pct: 20 },
                { cls: "pending",  pct: 25 },
                { cls: "failed",   pct: 8  },
              ];
              return (
                <div key={r.code}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12.5 }}>
                    <span>
                      <span className="mono" style={{ color: "var(--accent-700)", fontWeight: 700, marginRight: 8 }}>
                        {r.code}
                      </span>
                      {r.name}
                    </span>
                    <span className="mono tnum" style={{ color: "var(--text-tertiary)" }}>
                      {r.items}건
                    </span>
                  </div>
                  <div style={{ display: "flex", height: 12, borderRadius: 999, overflow: "hidden", background: "var(--bg-sunken)" }}>
                    {segs.map((s, i) => (
                      <div key={i} style={{ width: `${s.pct}%`, background: `var(--status-${s.cls}-dot)` }}></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding={20}>
          <SectionHeader overline="담당자별 분석" title="Top Maintainers" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "김지혜", done: 18, total: 24 },
              { name: "조민수", done: 15, total: 24 },
              { name: "박선영", done: 11, total: 24 },
              { name: "정우성", done: 8,  total: 24 },
              { name: "한가영", done: 6,  total: 24 },
              { name: "최도훈", done: 5,  total: 24 },
            ].map((p) => {
              const u = ASSIGNEES.find((a) => a.name === p.name) || { name: p.name, initial: p.name[0] };
              const pct = Math.round((p.done / p.total) * 100);
              return (
                <div key={p.name} style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px", gap: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar user={u} size={22} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <div style={{ height: 8, background: "var(--bg-sunken)", borderRadius: 999 }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "var(--accent-500)",
                        borderRadius: 999,
                      }}
                    ></div>
                  </div>
                  <span className="mono tnum" style={{ fontSize: 11.5, fontWeight: 600, textAlign: "right" }}>
                    {p.done}/{p.total}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
