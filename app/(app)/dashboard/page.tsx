"use client";

// ── DASHBOARD page (Miro light theme) ──
// _design_input/screens/dashboard.jsx 1:1 port.

import * as React from "react";
import Link from "next/link";
import {
  Avatar,
  Badge,
  Btn,
  Card,
  Mascot,
  PriorityDot,
  SectionHeader,
  StatusBadge,
} from "@/components/yess/common";
import {
  ASSIGNEES,
  SCHEDULES,
  type StatusKey,
  type PriorityKey,
} from "@/lib/yess/data";

const MiniAvatar: React.FC<{ name: string; size?: number }> = ({ name, size = 18 }) => {
  const u =
    ASSIGNEES.find((x) => x.name === name) ||
    { initial: name?.[0], color: "var(--text-secondary)", name };
  return <Avatar user={u} size={size} />;
};

const MascotHello: React.FC<{ onGo?: () => void }> = ({ onGo }) => {
  const stats = [
    { label: "오늘 마감",         k: "3건" },
    { label: "진행중 업무",       k: "2건" },
    { label: "신규 후속조치",     k: "1건" },
    { label: "2026-D01 진행률",   k: "60%" },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr auto",
        gap: 18,
        alignItems: "center",
        padding: "20px 24px",
        borderRadius: "var(--r-3xl)",
        background: "linear-gradient(120deg, var(--accent-50) 0%, var(--pastel-yellow) 110%)",
        boxShadow: "var(--shadow-ring)",
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--pastel-coral) 0%, transparent 70%)",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      ></div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Mascot size={120} />
      </div>
      <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          안녕하세요, 이주성님
          <span style={{ display: "inline-block", transformOrigin: "70% 70%", animation: "wave 2.6s ease-in-out infinite" }}>
            👋
          </span>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13, color: "var(--text-secondary)" }}>
          {stats.map((s, i) => (
            <span key={i}>
              {s.label}{" "}
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent-700)" }}>{s.k}</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Btn variant="primary" iconRight="chevR" onClick={onGo}>
          오늘 업무 보기
        </Btn>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; sub?: string; accent?: boolean; danger?: boolean }> = ({
  label,
  value,
  sub,
  accent,
  danger,
}) => (
  <div
    style={{
      background: danger ? "#fde6e6" : accent ? "var(--accent-50)" : "var(--bg-surface)",
      borderRadius: "var(--r-lg)",
      boxShadow: "var(--shadow-ring)",
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minWidth: 0,
    }}
  >
    <div className="t-overline" style={{ color: "var(--text-tertiary)" }}>{label}</div>
    <div
      className="tnum"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1.05,
        color: accent ? "var(--accent-700)" : "var(--text-primary)",
      }}
    >
      {value}
    </div>
    {sub && <div style={{ fontSize: 11.5, fontWeight: 500, color: "var(--text-tertiary)" }}>{sub}</div>}
  </div>
);

const RecentPatchHeader: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px 8px" }}>
    <span className="t-overline" style={{ color: "var(--text-tertiary)" }}>가장 최근 패치</span>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 10px",
        borderRadius: 999,
        background: "var(--accent-50)",
        border: "1px solid var(--accent-200)",
      }}
    >
      <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-700)" }}>
        2026-D02
      </span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-700)" }}>연중 2차 패치</span>
    </span>
    <span style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>· 배포일 2026-04-22</span>
  </div>
);

const StatGrid8: React.FC<{ role: "tf" | "maint" }> = ({ role }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12, marginBottom: 20 }}>
    {role === "tf" ? (
      <>
        <StatCard label="전체 대상"  value="55" sub="고객사 (연중 2차)" />
        <StatCard label="미진행"     value="27" sub="아직 패치 안 함" />
        <StatCard label="진행중"     value="24" sub="패치 작업 중" />
        <StatCard label="반영완료"   value="3"  sub="반영 끝" accent />
        <StatCard label="실패·지연"  value="1"  sub="조치 필요" danger />
      </>
    ) : (
      <>
        <StatCard label="담당 패치" value="42"  sub="할당 받은 항목" />
        <StatCard label="진행중"    value="9"   sub="작업/검토" />
        <StatCard label="오늘 마감" value="4"   sub="D-day" />
        <StatCard label="후속조치"  value="6"   sub="대기 중" />
        <StatCard label="완료"      value="118" sub="누적" accent />
      </>
    )}
  </div>
);

const RoundBar: React.FC<{
  code: string;
  name: string;
  applied: number;
  prog: number;
  notStarted: number;
  fail: number;
}> = ({ code, name, applied, prog, notStarted, fail }) => {
  const total = applied + prog + notStarted + fail || 1;
  const pct = Math.round((applied / total) * 100);
  const segs = [
    { v: applied,    color: "var(--chart-purple)",  label: "반영"  },
    { v: prog,       color: "var(--chart-yellow)",  label: "진행"  },
    { v: fail,       color: "var(--chart-pink)",    label: "실패"  },
    { v: notStarted, color: "var(--chart-neutral)", label: "미진행" },
  ];
  return (
    <div style={{ padding: "10px 12px", borderRadius: "var(--r-md)", background: "var(--bg-surface-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span className="mono" style={{ fontWeight: 700, fontSize: 12, color: "var(--accent-700)" }}>{code}</span>
          <span style={{ fontSize: 13 }}>{name}</span>
        </div>
        <div className="mono tnum" style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
          {applied}/{total} · <span style={{ color: "var(--accent-700)", fontWeight: 700 }}>{pct}%</span>
        </div>
      </div>
      <div style={{ display: "flex", height: 12, borderRadius: 999, overflow: "hidden", background: "var(--bg-sunken)" }}>
        {segs.map(
          (s, i) =>
            s.v > 0 && (
              <div key={i} title={`${s.label} ${s.v}`} style={{ background: s.color, width: `${(s.v / total) * 100}%` }}></div>
            )
        )}
      </div>
    </div>
  );
};

type WorkloadTier = "missing" | "behind" | "onTrack" | "done";

const TIER_STYLE: Record<
  WorkloadTier,
  {
    bar: string;
    rowBg: string;
    nameColor: string;
    nameWeight: number;
    ratioColor: string;
    badgeBg: string;
    badgeFg: string;
    badgeBorder: string;
  }
> = {
  missing: {
    bar: "var(--chart-pink)",
    rowBg: "rgba(251, 212, 212, 0.45)",
    nameColor: "var(--pastel-rose-d)",
    nameWeight: 700,
    ratioColor: "var(--pastel-rose-d)",
    badgeBg: "var(--pastel-red)",
    badgeFg: "var(--pastel-rose-d)",
    badgeBorder: "var(--pastel-darkred)",
  },
  behind: {
    bar: "#f0b478",
    rowBg: "rgba(255, 230, 205, 0.55)",
    nameColor: "var(--text-primary)",
    nameWeight: 600,
    ratioColor: "var(--pastel-orange-d)",
    badgeBg: "var(--pastel-orange)",
    badgeFg: "var(--pastel-orange-d)",
    badgeBorder: "rgba(138, 74, 23, 0.18)",
  },
  onTrack: {
    bar: "var(--chart-yellow)",
    rowBg: "transparent",
    nameColor: "var(--text-primary)",
    nameWeight: 500,
    ratioColor: "var(--text-secondary)",
    badgeBg: "var(--bg-sunken)",
    badgeFg: "var(--text-secondary)",
    badgeBorder: "var(--border-subtle)",
  },
  done: {
    bar: "var(--chart-purple)",
    rowBg: "transparent",
    nameColor: "var(--text-primary)",
    nameWeight: 500,
    ratioColor: "var(--accent-700)",
    badgeBg: "var(--accent-50)",
    badgeFg: "var(--accent-700)",
    badgeBorder: "var(--accent-200)",
  },
};

const AssigneeBar: React.FC<{ name: string; done: number; total: number }> = ({ name, done, total }) => {
  const pct = total > 0 ? (done / total) * 100 : 0;
  const remaining = total - done;
  const tier: WorkloadTier =
    done === 0 ? "missing" : done >= total ? "done" : pct < 50 ? "behind" : "onTrack";
  const t = TIER_STYLE[tier];

  const labelText =
    tier === "missing"
      ? `미착수 ${total}건`
      : tier === "behind"
      ? `지연 ${remaining}건`
      : tier === "done"
      ? "완료 ✓"
      : `${remaining}건 남음`;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr 52px 92px",
        alignItems: "center",
        gap: 12,
        padding: "9px 12px",
        borderRadius: "var(--r-md)",
        background: t.rowBg,
        transition: "background 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <MiniAvatar name={name} size={20} />
        <span style={{ fontSize: 13, fontWeight: t.nameWeight, color: t.nameColor }}>{name}</span>
      </div>
      <div style={{ height: 8, background: "var(--bg-sunken)", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: t.bar,
            borderRadius: 999,
            transition: "width 0.3s",
          }}
        ></div>
      </div>
      <div
        className="mono tnum"
        style={{ fontSize: 11.5, fontWeight: 700, color: t.ratioColor, textAlign: "right" }}
      >
        {done}/{total}
      </div>
      <div style={{ textAlign: "right" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: "var(--r-pill)",
            background: t.badgeBg,
            color: t.badgeFg,
            border: `1px solid ${t.badgeBorder}`,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
          }}
        >
          {labelText}
        </span>
      </div>
    </div>
  );
};

const Donut: React.FC<{
  value?: number;
  total?: number;
  segments?: { value: number; color: string }[];
  label?: string;
  color?: string;
  trackColor?: string;
  size?: number;
  stroke?: number;
}> = ({
  value = 0,
  total = 0,
  segments,
  label = "TOTAL",
  color = "var(--accent-500)",
  trackColor = "var(--bg-sunken)",
  size = 140,
  stroke = 14,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const segs = segments && segments.length > 0 ? segments : null;
  const segTotal = segs ? segs.reduce((s, x) => s + (x.value || 0), 0) : total || 0;
  const displayTotal = segs ? segTotal : total;
  const pct = !segs && total > 0 ? value / total : 0;
  const off = c * (1 - pct);

  let acc = 0;
  const segCircles = segs
    ? segs.map((s, i) => {
        const segLen = segTotal > 0 ? (s.value / segTotal) * c : 0;
        const dashOffset = -acc;
        acc += segLen;
        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={s.color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${segLen} ${c - segLen}`}
            strokeDashoffset={dashOffset}
          />
        );
      })
    : null;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        {segs ? (
          segCircles
        ) : (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={off}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div className="tnum" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {displayTotal}
          </div>
          <div className="t-overline" style={{ marginTop: 4 }}>{label}</div>
        </div>
      </div>
    </div>
  );
};

const LegendLine: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, padding: "4px 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 10, height: 10, borderRadius: 3, background: color }}></span>
      {label}
    </div>
    <span className="mono tnum" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{count}</span>
  </div>
);

const MyTaskRow: React.FC<{ title: string; status: StatusKey; priority: PriorityKey }> = ({ title, status, priority }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 10px",
      background: "var(--bg-surface-2)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--r-md)",
    }}
  >
    <PriorityDot priority={priority} />
    <div style={{ flex: 1, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
    <StatusBadge status={status} />
  </div>
);

/* Round Item Table — 패치 차수 및 항목 (유지보수 관점, 내 담당 기준) */
const DueChip: React.FC<{ due: string; overdue?: boolean; soon?: boolean; muted?: boolean }> = ({
  due,
  overdue,
  soon,
  muted,
}) => {
  const color = overdue
    ? "var(--pastel-rose-d)"
    : soon
    ? "var(--pastel-orange-d)"
    : muted
    ? "var(--text-tertiary)"
    : "var(--text-secondary)";
  const bg = overdue
    ? "var(--pastel-red)"
    : soon
    ? "var(--pastel-orange)"
    : "var(--bg-sunken)";
  return (
    <span
      className="mono tnum"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "var(--r-pill)",
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.02em",
        color,
        background: bg,
        whiteSpace: "nowrap",
      }}
    >
      {due}
    </span>
  );
};

const RoundItemRow: React.FC<{
  no: string;
  code: string;
  name: string;
  cat: string;
  due: string;
  overdue?: boolean;
  soon?: boolean;
  mine: { done: number; total: number };
}> = ({ no, code, name, cat, due, overdue, soon, mine }) => {
  const pct = mine.total > 0 ? (mine.done / mine.total) * 100 : 0;
  const tier: WorkloadTier =
    mine.done >= mine.total ? "done" : mine.done === 0 ? "missing" : overdue || pct < 50 ? "behind" : "onTrack";
  const t = TIER_STYLE[tier];

  const statusLabel =
    tier === "missing" ? "미착수" : tier === "behind" ? "지연" : tier === "onTrack" ? "진행중" : "완료 ✓";

  return (
    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <td style={{ padding: "11px 14px", color: "var(--text-tertiary)", fontSize: 11.5 }} className="mono tnum">{no}</td>
      <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="mono" style={{ color: "var(--accent-700)", fontSize: 11.5 }}>{code}</span>
          <span>{name}</span>
        </div>
      </td>
      <td style={{ padding: "11px 14px" }}>
        <Badge variant="soft">{cat}</Badge>
      </td>
      <td style={{ padding: "11px 14px" }}>
        <DueChip due={due} overdue={overdue} soon={soon} muted={tier === "done"} />
      </td>
      <td style={{ padding: "11px 14px", minWidth: 150 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            className="tnum"
            style={{ fontSize: 11.5, fontWeight: 700, minWidth: 28, textAlign: "right", color: t.ratioColor }}
          >
            {mine.done}/{mine.total}
          </span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--bg-sunken)", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: t.bar, borderRadius: 3 }} />
          </div>
        </div>
      </td>
      <td style={{ padding: "11px 14px", textAlign: "right" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: "var(--r-pill)",
            background: t.badgeBg,
            color: t.badgeFg,
            border: `1px solid ${t.badgeBorder}`,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
          }}
        >
          {statusLabel}
        </span>
      </td>
    </tr>
  );
};

const RoundItemTable: React.FC = () => (
  <div style={{ overflowX: "auto", margin: "4px -20px -16px", padding: "0 20px" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--border-strong)" }}>
          {["No", "항목", "카테고리", "마감", "내 진행", "상태"].map((h, i) => (
            <th
              key={h}
              style={{
                padding: "8px 14px",
                textAlign: i === 5 ? "right" : "left",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <RoundItemRow no="01" code="2026-D01-001" name="간이지급명세서 양식 갱신"  cat="연중패치"     due="D-3"  soon         mine={{ done: 4, total: 4 }} />
        <RoundItemRow no="02" code="2026-Y01-001" name="연말정산 부속서류 정비"     cat="연말정산패치" due="D-16"               mine={{ done: 3, total: 4 }} />
        <RoundItemRow no="03" code="2026-I01-001" name="A고객사 맞춤 공제 항목"     cat="개별패치"     due="D-26"               mine={{ done: 0, total: 1 }} />
        <RoundItemRow no="04" code="2026-E01-001" name="원천세 W-219 양식 추가"     cat="추가패치"     due="D+2"  overdue      mine={{ done: 0, total: 2 }} />
        <RoundItemRow no="05" code="2026-D02-001" name="국세청 가이드 4월 개정"     cat="연중패치"     due="D-9"                mine={{ done: 1, total: 4 }} />
      </tbody>
    </table>
  </div>
);

const AbsenceBanner: React.FC = () => (
  <div
    style={{
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap",
      background: "var(--info-bg)",
      borderRadius: "var(--r-lg)",
      boxShadow: "0 0 0 1px var(--accent-200)",
    }}
  >
    <span className="t-overline" style={{ color: "var(--info-fg)" }}>오늘 부재</span>
    {SCHEDULES.map((s) => (
      <span
        key={s.id}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "var(--bg-canvas)",
          border: "1px solid var(--accent-200)",
          height: 28,
          padding: "0 10px",
          borderRadius: "var(--r-pill)",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        <Avatar user={s.user} size={18} />
        <span style={{ fontWeight: 600 }}>{s.user.name}</span>
        <span style={{ color: "var(--text-secondary)" }}>· {s.label}</span>
        {s.range && <span className="mono" style={{ color: "var(--text-tertiary)", fontSize: 10.5 }}>· {s.range}</span>}
      </span>
    ))}
  </div>
);

const RoleToggle: React.FC<{ role: "tf" | "maint"; onChange: (r: "tf" | "maint") => void }> = ({ role, onChange }) => (
  <div
    style={{
      display: "inline-flex",
      padding: 3,
      borderRadius: 999,
      background: "var(--bg-sunken)",
      border: "1px solid var(--border-subtle)",
    }}
  >
    {[
      { v: "tf", label: "TF 관점" },
      { v: "maint", label: "유지보수 관점" },
    ].map((o) => (
      <button
        key={o.v}
        onClick={() => onChange(o.v as "tf" | "maint")}
        style={{
          padding: "5px 14px",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: role === o.v ? "var(--bg-surface)" : "transparent",
          color: role === o.v ? "var(--text-primary)" : "var(--text-tertiary)",
          boxShadow: role === o.v ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
          transition: "all 0.15s",
        }}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export default function DashboardPage() {
  const [role, setRole] = React.useState<"tf" | "maint">("tf");

  const RoundsCard = (
    <Card padding={20}>
      <SectionHeader
        overline="차수별 완료율"
        title="Patch Round Progress"
        right={
          <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: "var(--text-secondary)" }}>
            <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--chart-purple)" }}></span>반영
            </span>
            <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--chart-yellow)" }}></span>진행
            </span>
            <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--chart-pink)" }}></span>실패
            </span>
            <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--chart-neutral)" }}></span>미진행
            </span>
          </div>
        }
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        <RoundBar code="2026-D01" name="연중패치 01"     applied={60} prog={24} notStarted={8}  fail={3} />
        <RoundBar code="2026-Y01" name="연말정산패치 01" applied={18} prog={6}  notStarted={8}  fail={2} />
        <RoundBar code="2026-I01" name="개별패치 01"     applied={14} prog={0}  notStarted={0}  fail={0} />
        <RoundBar code="2026-E01" name="추가패치 01"     applied={0}  prog={4}  notStarted={10} fail={0} />
      </div>
    </Card>
  );

  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
        <RoleToggle role={role} onChange={setRole} />
        <Btn variant="ghost" size="sm">기간: 오늘</Btn>
        <Btn variant="ghost" size="sm">차수: 전체</Btn>
        <Btn variant="secondary" size="sm" icon="refresh">새로고침</Btn>
      </div>

      {/* MascotHello — onGo navigates to /daily via Link wrapper around content */}
      <Link href="/daily" style={{ textDecoration: "none", color: "inherit" }}>
        <MascotHello />
      </Link>

      <div style={{ marginBottom: 20 }}>
        <AbsenceBanner />
      </div>

      {role === "tf" && <RecentPatchHeader />}

      <StatGrid8 role={role} />

      {role === "tf" ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 20 }}>
            <Card padding={20}>
              <SectionHeader overline="오늘의 내 업무" title="My Tasks · 이주성" right={<Badge variant="soft">4건</Badge>} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <MyTaskRow title="2026-D01-003 간이지급명세서 제출양식 갱신" status="REVIEW"  priority="P1" />
                <MyTaskRow title="국세청 가이드 4월 개정분 검토"             status="DONE"    priority="P1" />
                <MyTaskRow title="W-219 원천세 신고서식 W01 초안 작성"        status="BACKLOG" priority="P1" />
                <MyTaskRow title="주간 TF 미팅 자료 준비"                     status="TODO"    priority="P2" />
              </div>
            </Card>

            <Card padding={20}>
              <SectionHeader overline="TF 업무 상태" title="Work Items" />
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Donut
                  label="총 업무"
                  segments={[
                    { value: 8,  color: "var(--chart-neutral)" },
                    { value: 9,  color: "var(--chart-purple-d)" },
                    { value: 12, color: "var(--chart-yellow)" },
                    { value: 3,  color: "var(--chart-pink)" },
                    { value: 10, color: "var(--chart-purple)" },
                  ]}
                />
                <div style={{ flex: 1 }}>
                  <LegendLine label="대기"   count={8}  color="var(--chart-neutral)" />
                  <LegendLine label="예정"   count={9}  color="var(--chart-purple-d)" />
                  <LegendLine label="진행중" count={12} color="var(--chart-yellow)" />
                  <LegendLine label="검토"   count={3}  color="var(--chart-pink)" />
                  <LegendLine label="완료"   count={10} color="var(--chart-purple)" />
                </div>
              </div>
            </Card>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 20 }}>
            {RoundsCard}
            <Card padding={20}>
              <SectionHeader overline="후속조치" title="Follow-ups" />
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Donut
                  label="총 항목"
                  segments={[
                    { value: 6, color: "var(--chart-purple-d)" },
                    { value: 5, color: "var(--chart-yellow)" },
                    { value: 2, color: "var(--chart-pink)" },
                    { value: 5, color: "var(--chart-purple)" },
                  ]}
                />
                <div style={{ flex: 1 }}>
                  <LegendLine label="신규"   count={6} color="var(--chart-purple-d)" />
                  <LegendLine label="진행중" count={5} color="var(--chart-yellow)" />
                  <LegendLine label="보류"   count={2} color="var(--chart-pink)" />
                  <LegendLine label="완료"   count={5} color="var(--chart-purple)" />
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 20 }}>
            {RoundsCard}
            <Card padding={20}>
              <SectionHeader
                overline="담당자별 현황"
                title="Assignee Workload"
                right={
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 10px",
                      borderRadius: "var(--r-pill)",
                      background: "var(--pastel-red)",
                      color: "var(--pastel-rose-d)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--chart-pink)" }} />
                    지연 위험 3명
                  </span>
                }
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                <AssigneeBar name="최도훈" done={0} total={4} />
                <AssigneeBar name="한가영" done={1} total={5} />
                <AssigneeBar name="정우성" done={1} total={4} />
                <AssigneeBar name="박선영" done={2} total={4} />
                <AssigneeBar name="조민수" done={3} total={5} />
                <AssigneeBar name="김지혜" done={4} total={4} />
              </div>
            </Card>
          </div>

          <Card padding={20} style={{ marginBottom: 20 }}>
            <SectionHeader
              overline="패치 차수 및 항목"
              title="Round Items"
              right={
                <Link href="/rounds" style={{ textDecoration: "none" }}>
                  <Btn variant="ghost" size="sm">전체 보기 →</Btn>
                </Link>
              }
            />
            <RoundItemTable />
          </Card>
        </>
      )}
    </div>
  );
}
