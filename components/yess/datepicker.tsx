"use client";

// ── DatePicker — 인라인 스타일 기반 커스텀 캘린더 popover ──
// shadcn/react-day-picker 등 외부 의존성 없이 v0 디자인 톤(--accent, --bg-*)에 맞춰 직접 구현.

import * as React from "react";
import { FieldLabel, Icon } from "./common";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

const pad = (n: number) => String(n).padStart(2, "0");
const fmtISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (s: string): Date | null => {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
};

const NavBtn: React.FC<{ icon: "chevL" | "chevR"; onClick: () => void; title: string }> = ({
  icon,
  onClick,
  title,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    style={{
      width: 28,
      height: 28,
      display: "grid",
      placeItems: "center",
      background: "transparent",
      color: "var(--text-secondary)",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    <Icon name={icon} size={14} strokeWidth={2} />
  </button>
);

const Calendar: React.FC<{
  value: Date | null;
  onPick: (d: Date) => void;
  view: { y: number; m: number };
  setView: (v: { y: number; m: number }) => void;
}> = ({ value, onPick, view, setView }) => {
  const today = new Date();
  const todayISO = fmtISO(today);
  const valueISO = value ? fmtISO(value) : "";

  const first = new Date(view.y, view.m, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.y, view.m, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrev = () => {
    const m = view.m - 1;
    setView(m < 0 ? { y: view.y - 1, m: 11 } : { y: view.y, m });
  };
  const goNext = () => {
    const m = view.m + 1;
    setView(m > 11 ? { y: view.y + 1, m: 0 } : { y: view.y, m });
  };
  const goToday = () => {
    setView({ y: today.getFullYear(), m: today.getMonth() });
  };

  return (
    <div
      style={{
        width: 280,
        padding: 12,
        background: "var(--bg-canvas)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--r-md)",
        boxShadow: "var(--shadow-drawer)",
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <NavBtn icon="chevL" onClick={goPrev} title="이전 달" />
        <button
          type="button"
          onClick={goToday}
          title="오늘로 이동"
          style={{
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
            background: "transparent",
            border: "none",
            padding: "4px 8px",
            borderRadius: "var(--r-sm)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {view.y}년 {view.m + 1}월
        </button>
        <NavBtn icon="chevR" onClick={goNext} title="다음 달" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {WEEK.map((w, i) => (
          <div
            key={w}
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: 600,
              color:
                i === 0 ? "var(--pastel-coral-d)" : i === 6 ? "var(--accent-700)" : "var(--text-tertiary)",
              padding: "4px 0",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const iso = fmtISO(d);
          const isSel = iso === valueISO;
          const isToday = iso === todayISO;
          const dow = d.getDay();
          const baseColor = isSel
            ? "var(--text-on-blue)"
            : dow === 0
            ? "var(--pastel-coral-d)"
            : dow === 6
            ? "var(--accent-700)"
            : "var(--text-primary)";
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(d)}
              style={{
                height: 32,
                fontSize: 12.5,
                fontFamily: "var(--font-display)",
                fontWeight: isSel ? 700 : 500,
                color: baseColor,
                background: isSel ? "var(--accent-500)" : "transparent",
                border: isToday && !isSel ? "1.5px solid var(--accent-300)" : "1.5px solid transparent",
                borderRadius: "var(--r-sm)",
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isSel) e.currentTarget.style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isSel) e.currentTarget.style.background = "transparent";
              }}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DatePicker: React.FC<{
  label?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder = "YYYY-MM-DD", required }) => {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const seed = parseISO(value) || new Date();
  const [view, setView] = React.useState({ y: seed.getFullYear(), m: seed.getMonth() });

  React.useEffect(() => {
    if (open) {
      const d = parseISO(value) || new Date();
      setView({ y: d.getFullYear(), m: d.getMonth() });
    }
  }, [open, value]);

  React.useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = parseISO(value);

  return (
    <div ref={wrapRef} style={{ display: "flex", flexDirection: "column", position: "relative" }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          height: 36,
          padding: "0 12px",
          fontSize: 13.5,
          fontFamily: "var(--font-mono)",
          color: value ? "var(--text-primary)" : "var(--text-tertiary)",
          background: "var(--bg-canvas)",
          border: `1px solid ${open ? "var(--accent-500)" : "var(--border-subtle)"}`,
          boxShadow: open ? "0 0 0 3px var(--accent-50)" : "none",
          borderRadius: "var(--r-md)",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "border-color 0.12s, box-shadow 0.12s",
        }}
      >
        <span>{value || placeholder}</span>
        <Icon name="calendar" size={14} color="var(--text-tertiary)" />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, zIndex: 100 }}>
          <Calendar
            value={selected}
            onPick={(d) => {
              onChange(fmtISO(d));
              setOpen(false);
            }}
            view={view}
            setView={setView}
          />
        </div>
      )}
    </div>
  );
};
