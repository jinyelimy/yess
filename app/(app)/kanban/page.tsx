"use client";

// ── KANBAN — 2026-D01 차수 + TF 업무 ──
// _design_input/screens/kanban.jsx 1:1 port. (deep-link to /daily preserved via sessionStorage)

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Btn,
  FilterChip,
  Icon,
  PageHeader,
  PriorityDot,
} from "@/components/yess/common";
import { ASSIGNEES, WORK_ITEMS, type WorkItem } from "@/lib/yess/data";

const KANBAN_COLS = [
  { id: "BACKLOG",     label: "대기",   sub: "Backlog",     bg: "var(--bg-sunken)",         dot: "#9aa1ab" },
  { id: "TODO",        label: "예정",   sub: "To Do",       bg: "#ece7fb",                  dot: "var(--chart-purple-d)" },
  { id: "IN_PROGRESS", label: "진행중", sub: "In Progress", bg: "#fbeec0",                  dot: "var(--chart-yellow)" },
  { id: "REVIEW",      label: "검토",   sub: "Review",      bg: "#fbe1ea",                  dot: "var(--chart-pink)" },
  { id: "BLOCKED",     label: "보류",   sub: "Blocked",     bg: "var(--danger-bg)",         dot: "var(--danger)" },
  { id: "DONE",        label: "완료",   sub: "Done",        bg: "var(--accent-50)",         dot: "var(--chart-purple)" },
] as const;

const TYPE_LABEL: Record<string, string> = {
  FOLLOW_UP:    "후속조치",
  BUGFIX:       "버그개선",
  SERVICE_DESK: "서비스데스크",
};
const TYPE_TONE: Record<string, { color: string; bg: string }> = {
  FOLLOW_UP:    { color: "#746019", bg: "#fff3b8" },
  BUGFIX:       { color: "#b8377a", bg: "#fbe1ea" },
  SERVICE_DESK: { color: "#2563b8", bg: "#dbeafe" },
};

type DragHandler = (id: string) => void;

const KCard: React.FC<{
  w: WorkItem;
  onDragStart: DragHandler;
  isDrag: boolean;
  onOpenDaily?: (id: string) => void;
}> = ({ w, onDragStart, isDrag, onOpenDaily }) => {
  const tone = TYPE_TONE[w.type] || { color: "var(--text-secondary)", bg: "var(--bg-sunken)" };
  const u =
    ASSIGNEES.find((a) => a.name === w.assignee) ||
    { initial: w.assignee?.[0], color: "var(--text-secondary)", name: w.assignee };
  const due = w.due || "";
  const overdue = !!(w.due && w.due < "2026-05-13");
  const linkable = w.type === "BUGFIX" || w.type === "SERVICE_DESK";
  return (
    <div
      draggable
      onDragStart={(e) => {
        onDragStart(w.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={(e) => {
        if (linkable && !e.defaultPrevented) onOpenDaily && onOpenDaily(w.id);
      }}
      style={{
        background: "var(--bg-canvas)",
        boxShadow: "var(--shadow-ring)",
        borderRadius: "var(--r-lg)",
        padding: 14,
        cursor: linkable ? "pointer" : "grab",
        opacity: isDrag ? 0.5 : 1,
        transition: "box-shadow 0.12s, transform 0.12s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-ring)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "var(--r-pill)",
            background: tone.bg,
            color: tone.color,
            letterSpacing: "0.02em",
          }}
        >
          {TYPE_LABEL[w.type] || w.type}
        </span>
        {w.type === "SERVICE_DESK" && w.ticket ? (
          <span className="mono" style={{ fontSize: 10.5, color: "#2563b8", fontWeight: 600 }}>
            #{w.ticket}
          </span>
        ) : (
          w.round && (
            <span className="mono" style={{ fontSize: 10.5, color: "var(--accent-700)", fontWeight: 600 }}>
              {w.round}
            </span>
          )
        )}
        <div style={{ flex: 1 }}></div>
        <PriorityDot priority={w.priority} />
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.45,
          marginBottom: w.company ? 6 : 12,
          letterSpacing: "-0.01em",
        }}
      >
        {w.title}
      </div>
      {w.company && (
        <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginBottom: 12 }}>{w.company}</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
        <Avatar user={u} size={22} />
        <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{w.assignee}</span>
        <div style={{ flex: 1 }}></div>
        <span
          className="mono tnum"
          style={{
            color: overdue ? "var(--danger-fg)" : "var(--text-tertiary)",
            fontWeight: overdue ? 600 : 500,
            fontSize: 11,
          }}
        >
          {due}
        </span>
      </div>
    </div>
  );
};

export default function KanbanPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<WorkItem[]>(WORK_ITEMS);
  const [drag, setDrag] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<string | null>(null);
  const [showAllDone, setShowAllDone] = React.useState(false);

  const openDaily = (workItemId: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("yess.pendingDailyOpen", workItemId);
    }
    router.push("/daily");
  };

  const move = (id: string, status: WorkItem["status"]) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status } : x)));
    setDrag(null);
    setOver(null);
  };

  // 데이터 기준일 2026-05-13 → 14일 컷
  const TODAY = "2026-05-13";
  const cutoff = (() => {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - 14);
    return d.toISOString().slice(0, 10);
  })();

  const visibleItems = items.filter((w) => {
    if (w.status !== "DONE") return true;
    if (showAllDone) return true;
    return (w.due || "") >= cutoff;
  });
  const hiddenDoneCount = items.filter((w) => w.status === "DONE" && (w.due || "") < cutoff).length;

  const total = visibleItems.length;

  return (
    <div style={{ maxWidth: 1700, margin: "0 auto" }}>
      <PageHeader
        title="Kanban 보드"
        subtitle={
          <>
            활성 차수(2026-D01) 컨텍스트의 후속조치 · 버그개선 · 서비스데스크 업무. 차수 패치 항목은 〈패치 차수·항목〉 화면에서 관리됩니다.
            <span style={{ color: "var(--text-tertiary)" }}> · 완료 컬럼은 최근 14일치만 표시</span>
          </>
        }
        actions={
          <>
            <FilterChip>
              차수 2026-D01 <Icon name="chevD" size={11} />
            </FilterChip>
            <FilterChip>
              담당자 전체 <Icon name="chevD" size={11} />
            </FilterChip>
            <FilterChip>
              카테고리 전체 <Icon name="chevD" size={11} />
            </FilterChip>
            <button
              onClick={(e) => e.preventDefault()}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                fontFamily: "inherit",
                padding: "0 8px",
              }}
            >
              전체 이력 보기 →
            </button>
            <Btn variant="primary" size="md" icon="plus">업무 추가</Btn>
          </>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${KANBAN_COLS.length}, minmax(0, 1fr))`,
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        {KANBAN_COLS.map((col) => {
          const cells = visibleItems.filter((w) => w.status === col.id);
          const hot = over === col.id;
          const isDone = col.id === "DONE";
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(col.id);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={() => drag && move(drag, col.id as WorkItem["status"])}
              style={{
                background: hot ? col.bg : "var(--bg-canvas)",
                boxShadow: hot ? `inset 0 0 0 1.5px ${col.dot}` : "var(--shadow-ring)",
                borderRadius: "var(--r-lg)",
                minHeight: 320,
                display: "flex",
                flexDirection: "column",
                transition: "background 0.16s, box-shadow 0.16s",
              }}
            >
              <div style={{ padding: "14px 14px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isDone ? 4 : 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: col.dot }}></span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em" }}>{col.label}</span>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: "var(--text-tertiary)",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {col.sub}
                  </span>
                  <div style={{ flex: 1 }}></div>
                  <span
                    className="tnum"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "var(--text-primary)",
                    }}
                  >
                    {cells.length}
                  </span>
                </div>
                {isDone && (
                  <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", letterSpacing: "-0.005em" }}>
                    최근 14일치만 표시
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: "4px 10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                  minHeight: 80,
                }}
              >
                {cells.map((w) => (
                  <KCard key={w.id} w={w} onDragStart={setDrag} isDrag={drag === w.id} onOpenDaily={openDaily} />
                ))}
                {cells.length === 0 && (
                  <div
                    style={{
                      padding: "32px 10px",
                      textAlign: "center",
                      fontSize: 11.5,
                      color: "var(--text-tertiary)",
                      border: "1.5px dashed var(--border-subtle)",
                      borderRadius: "var(--r-md)",
                      margin: "4px 0",
                    }}
                  >
                    비어있음
                  </div>
                )}
                {isDone && hiddenDoneCount > 0 && (
                  <button
                    onClick={() => setShowAllDone((v) => !v)}
                    style={{
                      marginTop: 4,
                      padding: "10px 12px",
                      background: "var(--bg-surface-2)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--r-md)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-sunken)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-surface-2)")}
                  >
                    <span
                      style={{
                        fontSize: 11.5,
                        color: "var(--text-secondary)",
                        fontWeight: 500,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {showAllDone ? "최근 14일치만 보기" : `이전 완료 ${hiddenDoneCount}건 더 보기`}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
                      {showAllDone ? "↑" : "↓"}
                    </span>
                  </button>
                )}
                {!isDone && (
                  <button
                    style={{
                      marginTop: cells.length > 0 ? 4 : 0,
                      padding: "8px 10px",
                      background: "transparent",
                      border: "1px dashed var(--border-subtle)",
                      borderRadius: "var(--r-md)",
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: "var(--text-tertiary)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background 0.12s, color 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-surface-2)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-tertiary)";
                    }}
                  >
                    + 업무 추가
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* total used only for hover affordance — kept for future analytics */}
      <div hidden>{total}</div>
    </div>
  );
}
