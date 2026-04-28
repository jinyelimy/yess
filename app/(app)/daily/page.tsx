"use client";

// ── DAILY page — 일일업무 ──
// _design_input/screens/other.jsx (DailyPage 부분) 1:1 port. Calendar + grouped cards.

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Btn,
  Card,
  Icon,
  PageHeader,
  SectionHeader,
} from "@/components/yess/common";
import {
  ASSIGNEES,
  CATEGORY_META,
  DAILY_TASKS,
  SCHEDULES,
  type DailyTask,
  type DailyTaskCategory,
} from "@/lib/yess/data";

const CategoryChip: React.FC<{ cat: DailyTaskCategory }> = ({ cat }) => {
  const m = CATEGORY_META[cat] || CATEGORY_META.GENERAL;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        height: 22,
        borderRadius: "var(--r-pill)",
        background: m.bg,
        color: m.fg,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {m.label}
    </span>
  );
};

const MemberChip: React.FC<{ user: { name?: string; initial?: string; color?: string; illustration?: "irid" } }> = ({ user }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 9px 3px 3px",
      background: "var(--bg-surface-2)",
      borderRadius: "var(--r-pill)",
      fontSize: 12,
      fontWeight: 500,
    }}
  >
    <Avatar user={user} size={20} />
    {user.name}
  </span>
);

const DField: React.FC<React.PropsWithChildren<{ label: string; mono?: boolean }>> = ({ label, children, mono = false }) => (
  <div style={{ display: "grid", gridTemplateColumns: "92px 1fr", gap: 12, alignItems: "baseline" }}>
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--text-tertiary)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </div>
    <div className={mono ? "mono" : ""} style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.55 }}>
      {children}
    </div>
  </div>
);

const channelLabel = (c?: string) =>
  ({ 원격: "원격 접속", 유선: "유선 응대", 메일: "메일 응대" }[c || ""] || c);

const DailyTaskDetail: React.FC<{ t: DailyTask; onGotoFollowup: () => void }> = ({ t, onGotoFollowup }) => {
  const d = t.detail || {};
  const cat = t.category;

  return (
    <div
      style={{
        padding: "16px 18px 18px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {cat === "MEETING" && (
        <>
          <DField label="회의실">{d.room}</DField>
          <DField label="시간" mono>
            {t.time} – {t.endTime}
            <span style={{ color: "var(--text-tertiary)", fontWeight: 400, marginLeft: 6 }}>({t.duration}분)</span>
          </DField>
          <DField label="참석자">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(t.members || []).map((n) => {
                const u = ASSIGNEES.find((a) => a.name === n) || { name: n, initial: n[0] };
                return <MemberChip key={n} user={u} />;
              })}
            </div>
          </DField>
          {d.agenda && d.agenda.length > 0 && (
            <DField label="안건">
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                {d.agenda.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </DField>
          )}
        </>
      )}

      {cat === "BUGFIX" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <DField label="고객사">{d.company}</DField>
            <DField label="티켓" mono>{d.ticketId}</DField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <DField label="연결 차수" mono>{d.relatedRound || "—"}</DField>
            <DField label="작업 항목" mono>{d.workItemId || "—"}</DField>
          </div>
          <DField label="담당">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(t.members || []).map((n) => {
                const u = ASSIGNEES.find((a) => a.name === n) || { name: n, initial: n[0] };
                return <MemberChip key={n} user={u} />;
              })}
            </div>
          </DField>
          <DField label="증상">{d.symptom}</DField>
          <DField label="원인">{d.cause}</DField>
          <DField label="조치 내용">{d.action}</DField>
        </>
      )}

      {cat === "SERVICE_DESK" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <DField label="고객사">{d.company}</DField>
            <DField label="티켓" mono>{d.ticketId}</DField>
            <DField label="응대 방식">{channelLabel(d.channel)}</DField>
          </div>
          <DField label="담당">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(t.members || []).map((n) => {
                const u = ASSIGNEES.find((a) => a.name === n) || { name: n, initial: n[0] };
                return <MemberChip key={n} user={u} />;
              })}
            </div>
          </DField>
          <DField label="문의 내용">{d.inquiry}</DField>
          <DField label="응대 결과">{d.response}</DField>
        </>
      )}

      {cat === "FOLLOW_UP" && (
        <>
          <DField label="작업 항목" mono>{d.workItemId || "—"}</DField>
          <DField label="담당">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(t.members || []).map((n) => {
                const u = ASSIGNEES.find((a) => a.name === n) || { name: n, initial: n[0] };
                return <MemberChip key={n} user={u} />;
              })}
            </div>
          </DField>
          <DField label="내용">{d.summary}</DField>
          {d.workItemId && (
            <div>
              <Btn variant="ghost" size="sm" iconRight="chevR" onClick={onGotoFollowup}>
                후속조치 화면으로 이동
              </Btn>
            </div>
          )}
        </>
      )}

      {cat === "REVIEW" && (
        <>
          <DField label="대상" mono>{d.target}</DField>
          <DField label="리뷰어">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(t.members || []).map((n) => {
                const u = ASSIGNEES.find((a) => a.name === n) || { name: n, initial: n[0] };
                return <MemberChip key={n} user={u} />;
              })}
            </div>
          </DField>
          <DField label="코멘트 수" mono>{d.comments}건</DField>
          <DField label="요약">{d.summary}</DField>
        </>
      )}

      {cat === "GENERAL" && (
        <>
          <DField label="담당">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(t.members || []).map((n) => {
                const u = ASSIGNEES.find((a) => a.name === n) || { name: n, initial: n[0] };
                return <MemberChip key={n} user={u} />;
              })}
            </div>
          </DField>
          <DField label="메모">{d.note}</DField>
        </>
      )}
    </div>
  );
};

const DailyTaskCard: React.FC<{
  t: DailyTask;
  expanded: boolean;
  onToggle: () => void;
  highlighted: boolean;
  onGotoFollowup: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}> = ({ t, expanded, onToggle, highlighted, onGotoFollowup, cardRef }) => {
  const members = (t.members || []).map(
    (n) => ASSIGNEES.find((a) => a.name === n) || { name: n, initial: n[0] }
  );
  const m = CATEGORY_META[t.category] || CATEGORY_META.GENERAL;
  return (
    <div
      ref={cardRef}
      style={{
        background: "var(--bg-canvas)",
        boxShadow: highlighted
          ? "0 0 0 2px var(--accent-500), var(--shadow-md)"
          : expanded
          ? "var(--shadow-md)"
          : "var(--shadow-ring)",
        borderRadius: "var(--r-md)",
        overflow: "hidden",
        transition: "box-shadow 0.16s",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "4px 1fr auto",
          gap: 14,
          alignItems: "stretch",
          padding: "14px 16px 14px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
          color: "inherit",
        }}
      >
        <div style={{ background: m.fg, borderRadius: 2, opacity: 0.6 }}></div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <CategoryChip cat={t.category} />
            <span className="mono" style={{ fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 600 }}>
              {t.time} – {t.endTime}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>· {t.duration}분</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.45, letterSpacing: "-0.01em", marginBottom: 8 }}>
            {t.title}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {members.map((u) => (
              <MemberChip key={u.name} user={u} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-tertiary)" }}>
          <Icon name={expanded ? "chevU" : "chevD"} size={16} />
        </div>
      </button>
      {expanded && <DailyTaskDetail t={t} onGotoFollowup={onGotoFollowup} />}
    </div>
  );
};

const KOR_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const KOR_MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const MonthCalendar: React.FC<{
  year: number;
  month: number;
  selected: string;
  onSelect: (d: string) => void;
  onPrev: () => void;
  onNext: () => void;
  dotsByDate: Record<string, number>;
}> = ({ year, month, selected, onSelect, onPrev, onNext, dotsByDate }) => {
  const first = new Date(year, month, 1);
  const lead = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { d: number; m: number; y: number; inMonth: boolean }[] = [];
  for (let i = lead - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    cells.push({ d, m: pm, y: py, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ d, m: month, y: year, inMonth: true });
  }
  let trailing = 1;
  while (cells.length % 7) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    cells.push({ d: trailing, m: nm, y: ny, inMonth: false });
    trailing++;
  }

  const todayStr = "2026-04-28";

  const ArrowBtn: React.FC<{ dir: "L" | "R"; onClick: () => void }> = ({ dir, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--text-secondary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.12s, color 0.12s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-sunken)";
        e.currentTarget.style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      <Icon name={dir === "L" ? "chevL" : "chevR"} size={15} strokeWidth={2} />
    </button>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <ArrowBtn dir="L" onClick={onPrev} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            {KOR_MONTHS[month]}
          </span>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)" }}>{year}</span>
        </div>
        <ArrowBtn dir="R" onClick={onNext} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {KOR_DAYS.map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 10.5,
              fontWeight: 600,
              color: i === 0 ? "var(--danger-fg)" : i === 6 ? "var(--accent-700)" : "var(--text-tertiary)",
              padding: "4px 0",
              letterSpacing: "0.04em",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((cell, i) => {
          const { d, m, y, inMonth } = cell;
          const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isSelected = dateStr === selected;
          const isToday = dateStr === todayStr;
          const cnt = dotsByDate[dateStr] || 0;
          const dow = i % 7;
          const isWeekend = dow === 0 || dow === 6;

          const barWidth = cnt === 0 ? 0 : Math.min(0.55 + (cnt - 1) * 0.2, 1);

          const bg = isSelected
            ? "var(--accent-500)"
            : isToday
            ? "rgba(255, 230, 163, 0.55)"
            : "transparent";

          let fg: string;
          if (isSelected) fg = "#fff";
          else if (!inMonth) fg = "#c2c4cb";
          else if (isToday) fg = "var(--pastel-yellow-d)";
          else if (dow === 0) fg = "var(--danger-fg)";
          else if (isWeekend) fg = "var(--text-secondary)";
          else fg = "var(--text-primary)";

          const cellOpacity = inMonth || isSelected ? 1 : 0.55;

          return (
            <button
              key={i}
              onClick={() => onSelect(dateStr)}
              style={{
                position: "relative",
                aspectRatio: "1",
                background: bg,
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: isSelected ? 700 : isToday ? 700 : inMonth ? 500 : 400,
                color: fg,
                opacity: cellOpacity,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                transition: "background 0.14s, color 0.14s, transform 0.14s, opacity 0.14s",
              }}
            >
              <span>{d}</span>
              {cnt > 0 && inMonth && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: `${Math.round(barWidth * 56)}%`,
                    maxWidth: 18,
                    height: 2.5,
                    borderRadius: 2,
                    background: isSelected ? "rgba(255,255,255,0.9)" : isToday ? "var(--pastel-yellow-d)" : "var(--accent-500)",
                    opacity: isSelected ? 1 : cnt >= 3 ? 1 : 0.7 + cnt * 0.1,
                  }}
                ></span>
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 10.5,
          color: "var(--text-tertiary)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: "rgba(255, 230, 163, 0.85)" }}></span>
          오늘
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: "var(--accent-500)" }}></span>
          선택
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 2.5, borderRadius: 2, background: "var(--accent-500)", opacity: 0.7 }}></span>
          일정
        </span>
      </div>
    </div>
  );
};

export default function DailyPage() {
  const router = useRouter();
  const [selected, setSelected] = React.useState("2026-04-28");
  const [year, setYear] = React.useState(2026);
  const [month, setMonth] = React.useState(3);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [highlightId, setHighlightId] = React.useState<string | null>(null);
  const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const pending = sessionStorage.getItem("yess.pendingDailyOpen");
    if (pending) {
      const target = DAILY_TASKS.find((t) => t.id === pending || t.detail?.workItemId === pending);
      if (target) {
        setSelected(target.date);
        const [yy, mm] = target.date.split("-").map(Number);
        setYear(yy);
        setMonth(mm - 1);
        setExpandedId(target.id);
        setHighlightId(target.id);
        setTimeout(() => {
          const el = cardRefs.current[target.id];
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 60);
        setTimeout(() => setHighlightId(null), 2200);
      }
      sessionStorage.removeItem("yess.pendingDailyOpen");
    }
  }, []);

  const todayTasks = DAILY_TASKS.filter((t) => t.date === selected).sort((a, b) =>
    a.time.localeCompare(b.time)
  );
  const totalMin = todayTasks.reduce((a, t) => a + t.duration, 0);

  const dotsByDate = DAILY_TASKS.reduce<Record<string, number>>((acc, t) => {
    acc[t.date] = (acc[t.date] || 0) + 1;
    return acc;
  }, {});

  const sel = new Date(selected);
  const selTitle = `${selected.replaceAll("-", ".")} ${KOR_DAYS[sel.getDay()]}요일`;

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };
  const goToday = () => {
    setSelected("2026-04-28");
    setYear(2026);
    setMonth(3);
    setExpandedId(null);
  };

  const handleSelectDate = (d: string) => {
    setSelected(d);
    setExpandedId(null);
  };

  const ASSIGNEE_ORDER = ["이주성", "차진병", "전수현", "진예림"];

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      <PageHeader
        title={selTitle}
        subtitle={
          todayTasks.length === 0
            ? "이 날에는 일정이 없습니다."
            : `총 ${todayTasks.length}건 · 예정 소요 ${Math.floor(totalMin / 60)}h ${totalMin % 60}m`
        }
        actions={
          <>
            <Btn variant="ghost" size="md" onClick={goToday}>
              오늘
            </Btn>
            <Btn variant="primary" size="md" icon="plus">
              일정 추가
            </Btn>
          </>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {todayTasks.length === 0 ? (
            <div
              style={{
                padding: "40px 16px",
                textAlign: "center",
                fontSize: 13,
                color: "var(--text-tertiary)",
                border: "1.5px dashed var(--border-subtle)",
                borderRadius: "var(--r-md)",
              }}
            >
              이 날에는 일정이 없습니다.
            </div>
          ) : (
            (() => {
              const meetings = todayTasks.filter((t) => t.category === "MEETING");
              const nonMeetings = todayTasks.filter((t) => t.category !== "MEETING");

              const byAssignee: Record<string, DailyTask[]> = {};
              ASSIGNEE_ORDER.forEach((n) => (byAssignee[n] = []));
              const others: Record<string, DailyTask[]> = {};

              nonMeetings.forEach((t) => {
                const primary = (t.members && t.members[0]) || "미지정";
                if (ASSIGNEE_ORDER.includes(primary)) byAssignee[primary].push(t);
                else {
                  if (!others[primary]) others[primary] = [];
                  others[primary].push(t);
                }
              });

              const renderCard = (t: DailyTask) => (
                <DailyTaskCard
                  key={t.id}
                  t={t}
                  expanded={expandedId === t.id}
                  onToggle={() => setExpandedId(expandedId === t.id ? null : t.id)}
                  highlighted={highlightId === t.id}
                  onGotoFollowup={() => {
                    if (t.detail?.workItemId && typeof window !== "undefined") {
                      sessionStorage.setItem("yess.pendingFollowupOpen", t.detail.workItemId);
                    }
                    router.push("/followups");
                  }}
                  cardRef={(el) => {
                    cardRefs.current[t.id] = el;
                  }}
                />
              );

              const GroupHeader: React.FC<{ icon: React.ReactNode; label: string; count: number }> = ({
                icon,
                label,
                count,
              }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {icon}
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "var(--text-primary)",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    className="tnum"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 9px",
                      borderRadius: "var(--r-pill)",
                      background: "var(--bg-sunken)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {count}
                  </div>
                  <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }}></div>
                </div>
              );

              const sections: React.ReactNode[] = [];

              if (meetings.length > 0) {
                const meetMeta = CATEGORY_META.MEETING;
                sections.push(
                  <div key="__meeting">
                    <GroupHeader
                      icon={
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: meetMeta.bg,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon name="calendar" size={11} color={meetMeta.fg} strokeWidth={2.2} />
                        </span>
                      }
                      label="회의"
                      count={meetings.length}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {meetings.map(renderCard)}
                    </div>
                  </div>
                );
              }

              const renderAssigneeSection = (name: string, list: DailyTask[]) => {
                if (list.length === 0) return null;
                const u = ASSIGNEES.find((a) => a.name === name) || { name, initial: name[0] };
                return (
                  <div key={name}>
                    <GroupHeader icon={<Avatar user={u} size={20} />} label={name} count={list.length} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {list.map(renderCard)}
                    </div>
                  </div>
                );
              };

              ASSIGNEE_ORDER.forEach((n) => {
                const sec = renderAssigneeSection(n, byAssignee[n]);
                if (sec) sections.push(sec);
              });
              Object.keys(others).forEach((n) => {
                const sec = renderAssigneeSection(n, others[n]);
                if (sec) sections.push(sec);
              });

              return sections;
            })()
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 92 }}>
          <Card padding={16}>
            <MonthCalendar
              year={year}
              month={month}
              selected={selected}
              onSelect={handleSelectDate}
              onPrev={goPrevMonth}
              onNext={goNextMonth}
              dotsByDate={dotsByDate}
            />
          </Card>

          <Card padding={16}>
            <SectionHeader overline="요약" title="이 날의 활동" />
            {todayTasks.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", padding: "8px 0" }}>일정 없음</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(
                  todayTasks.reduce<Record<string, number>>((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + t.duration;
                    return acc;
                  }, {})
                ).map(([cat, min]) => {
                  const cm = CATEGORY_META[cat as DailyTaskCategory] || CATEGORY_META.GENERAL;
                  return (
                    <div key={cat} style={{ display: "grid", gridTemplateColumns: "92px 1fr 48px", alignItems: "center", gap: 10 }}>
                      <CategoryChip cat={cat as DailyTaskCategory} />
                      <div style={{ height: 6, background: "var(--bg-sunken)", borderRadius: 999 }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${(min / totalMin) * 100}%`,
                            background: cm.fg,
                            borderRadius: 999,
                            opacity: 0.85,
                          }}
                        ></div>
                      </div>
                      <span className="mono tnum" style={{ fontSize: 11.5, fontWeight: 600, textAlign: "right" }}>
                        {min}m
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card padding={16}>
            <SectionHeader overline="오늘 부재" title="Schedules" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SCHEDULES.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: "8px 10px",
                    background: "var(--info-bg)",
                    borderRadius: "var(--r-md)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                  }}
                >
                  <Avatar user={s.user} size={22} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>
                      {s.user.name} · {s.label}
                    </div>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--text-tertiary)" }}>{s.range}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
