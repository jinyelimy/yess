"use client";

// ── FOLLOWUPS page — 후속조치 ──
// 후속조치 풀: TF가 발견 즉시 등록 → PM이 차수에 묶고 배정.

import * as React from "react";
import {
  Avatar,
  Btn,
  Card,
  PageHeader,
  PriorityDot,
  StatusBadge,
} from "@/components/yess/common";
import {
  ASSIGNEES,
  ROUNDS,
  WORK_ITEMS,
  type WorkItem,
  type PriorityKey,
} from "@/lib/yess/data";

const FilterPill: React.FC<{
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 12px",
      borderRadius: "var(--r-pill)",
      border: `1px solid ${active ? "var(--accent-500)" : "var(--border-subtle)"}`,
      background: active ? "var(--accent-50)" : "var(--bg-canvas)",
      color: active ? "var(--accent-700)" : "var(--text-secondary)",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
      whiteSpace: "nowrap",
      transition: "all 0.12s",
    }}
  >
    {children}
  </button>
);

type RoundFilter = "all" | "unassigned" | string;

export default function FollowupsPage() {
  const initial = WORK_ITEMS.filter((w) => w.type === "FOLLOW_UP");
  const [items, setItems] = React.useState<WorkItem[]>(initial);
  const [filter, setFilter] = React.useState<RoundFilter>("all");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [quickTitle, setQuickTitle] = React.useState("");
  const [quickPriority, setQuickPriority] = React.useState<PriorityKey>("P2");
  const [bundleOpen, setBundleOpen] = React.useState(false);
  const nextIdRef = React.useRef(300);

  const visible = items.filter((w) => {
    if (filter === "all") return true;
    if (filter === "unassigned") return !w.round;
    return w.round === filter;
  });

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const allVisibleSelected =
    visible.length > 0 && visible.every((w) => selected.has(w.id));
  const toggleAll = () => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (allVisibleSelected) visible.forEach((w) => n.delete(w.id));
      else visible.forEach((w) => n.add(w.id));
      return n;
    });
  };

  const handleQuickAdd = () => {
    const t = quickTitle.trim();
    if (!t) return;
    nextIdRef.current += 1;
    const newItem: WorkItem = {
      id: `W-${nextIdRef.current}`,
      type: "FOLLOW_UP",
      title: t,
      assignee: "",
      priority: quickPriority,
      status: "BACKLOG",
    };
    setItems((xs) => [newItem, ...xs]);
    setQuickTitle("");
    setQuickPriority("P2");
  };

  const bundleToRound = (roundCode: string) => {
    setItems((xs) =>
      xs.map((w) => (selected.has(w.id) ? { ...w, round: roundCode } : w))
    );
    setSelected(new Set());
    setBundleOpen(false);
  };

  // Outside click closes bundle dropdown
  React.useEffect(() => {
    if (!bundleOpen) return;
    const close = () => setBundleOpen(false);
    const t = setTimeout(() => window.addEventListener("click", close), 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener("click", close);
    };
  }, [bundleOpen]);

  const counts: Record<string, number> = {
    all: items.length,
    unassigned: items.filter((w) => !w.round).length,
  };
  ROUNDS.forEach((r) => {
    counts[r.code] = items.filter((w) => w.round === r.code).length;
  });

  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader
        title="후속조치"
        subtitle="TF가 발견하는 즉시 풀에 쌓고, PM이 다음 차수에 묶어서 배포로 내보냅니다."
      />

      {/* 차수 필터 */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text-tertiary)", marginRight: 4 }}>차수:</span>
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
          전체 <span style={{ marginLeft: 4, color: "var(--text-tertiary)" }}>{counts.all}</span>
        </FilterPill>
        <FilterPill
          active={filter === "unassigned"}
          onClick={() => setFilter("unassigned")}
        >
          미배정 <span style={{ marginLeft: 4, color: "var(--text-tertiary)" }}>{counts.unassigned}</span>
        </FilterPill>
        {ROUNDS.map((r) => (
          <FilterPill
            key={r.code}
            active={filter === r.code}
            onClick={() => setFilter(r.code)}
          >
            <span className="mono">{r.code}</span>
            <span style={{ marginLeft: 4, color: "var(--text-tertiary)" }}>{counts[r.code] ?? 0}</span>
          </FilterPill>
        ))}
      </div>

      {/* 빠른 추가 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
          padding: "8px 12px",
          background: "var(--bg-surface-2)",
          borderRadius: "var(--r-md)",
          border: "1px dashed var(--border-default)",
        }}
      >
        <span
          style={{
            fontSize: 16,
            color: "var(--text-tertiary)",
            marginLeft: 4,
            lineHeight: 1,
          }}
        >
          +
        </span>
        <input
          placeholder="후속조치 제목 — Enter로 풀에 등록 (담당자/차수는 PM이 추후 배정)"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleQuickAdd();
          }}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 13,
            color: "var(--text-primary)",
            fontFamily: "inherit",
          }}
        />
        <select
          value={quickPriority}
          onChange={(e) => setQuickPriority(e.target.value as PriorityKey)}
          style={{
            padding: "4px 8px",
            fontSize: 12,
            fontWeight: 600,
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--r-sm)",
            background: "var(--bg-canvas)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <option value="P0">P0</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
        <Btn size="sm" variant="secondary" onClick={handleQuickAdd}>
          추가
        </Btn>
      </div>

      {/* 선택 액션 바 */}
      {selected.size > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            marginBottom: 12,
            background: "var(--accent-50)",
            border: "1px solid var(--accent-200)",
            borderRadius: "var(--r-md)",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-700)" }}>
            {selected.size}건 선택됨
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative" }}>
            <Btn
              size="sm"
              variant="primary"
              onClick={() => setBundleOpen((v) => !v)}
            >
              차수에 묶기 ▾
            </Btn>
            {bundleOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  background: "var(--bg-canvas)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--r-md)",
                  boxShadow: "var(--shadow-md)",
                  padding: 6,
                  minWidth: 240,
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text-tertiary)",
                    padding: "4px 8px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  기존 차수에 묶기
                </div>
                {ROUNDS.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => bundleToRound(r.code)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      background: "transparent",
                      border: "none",
                      borderRadius: "var(--r-sm)",
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span
                      className="mono"
                      style={{
                        color: "var(--accent-700)",
                        fontWeight: 700,
                        marginRight: 8,
                      }}
                    >
                      {r.code}
                    </span>
                    <span style={{ color: "var(--text-primary)" }}>{r.name}</span>
                  </button>
                ))}
                <div
                  style={{
                    borderTop: "1px solid var(--border-subtle)",
                    margin: "6px 0",
                  }}
                />
                <button
                  onClick={() => {
                    alert("새 차수 만들기 — 다음 단계에서 모달로 구현");
                    setBundleOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    background: "transparent",
                    border: "none",
                    borderRadius: "var(--r-sm)",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--accent-700)",
                    fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  + 새 차수 만들기
                </button>
              </div>
            )}
          </div>
          <Btn size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            선택 해제
          </Btn>
        </div>
      )}

      {/* 테이블 */}
      <Card padding={0}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg-surface-2)" }}>
                <th
                  style={{
                    padding: "10px 14px",
                    width: 36,
                    textAlign: "left",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                {[
                  "ID",
                  "제목",
                  "연결 차수",
                  "고객사",
                  "담당자",
                  "우선순위",
                  "상태",
                  "마감일",
                ].map((h) => (
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
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "32px 14px",
                      textAlign: "center",
                      color: "var(--text-tertiary)",
                      fontSize: 12,
                    }}
                  >
                    이 필터에 해당하는 후속조치가 없습니다.
                  </td>
                </tr>
              )}
              {visible.map((w) => {
                const u = w.assignee
                  ? ASSIGNEES.find((a) => a.name === w.assignee) || {
                      initial: w.assignee[0],
                      name: w.assignee,
                    }
                  : null;
                const isSel = selected.has(w.id);
                return (
                  <tr
                    key={w.id}
                    style={{
                      cursor: "pointer",
                      background: isSel ? "var(--accent-50)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel) e.currentTarget.style.background = "var(--bg-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleSelect(w.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                      className="mono"
                    >
                      <span style={{ color: "var(--text-tertiary)" }}>{w.id}</span>
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                        fontWeight: 500,
                      }}
                    >
                      {w.title}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                      className="mono"
                    >
                      {w.round ? (
                        <span style={{ color: "var(--accent-700)", fontWeight: 600 }}>
                          {w.round}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "var(--text-tertiary)",
                            fontStyle: "italic",
                            fontSize: 11.5,
                          }}
                        >
                          미배정
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {w.company || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      {u ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Avatar user={u} size={20} />
                          {w.assignee}
                        </div>
                      ) : (
                        <span
                          style={{
                            color: "var(--text-tertiary)",
                            fontStyle: "italic",
                            fontSize: 11.5,
                          }}
                        >
                          미배정
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <PriorityDot priority={w.priority} withLabel />
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <StatusBadge status={w.status} />
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                      className="mono"
                    >
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
