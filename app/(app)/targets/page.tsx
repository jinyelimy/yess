"use client";

// ── TARGETS page (고객사 패치 현황) — 엑셀형 그리드 + Drawer ──
// _design_input/screens/targets.jsx 1:1 port.

import * as React from "react";
import {
  Avatar,
  Badge,
  Btn,
  Card,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  FilterChip,
  Icon,
  IconBtn,
  Modal,
  PageHeader,
  StatusBadge,
  Tag,
} from "@/components/yess/common";
import { ASSIGNEES, COMPANIES, type Company, type StatusKey } from "@/lib/yess/data";

const GRID_BORDER = "1px solid var(--border-subtle)";

function avatarOf(name?: string) {
  return (
    ASSIGNEES.find((x) => x.name === name) || {
      initial: name?.[0],
      color: "var(--text-secondary)",
      name,
    }
  );
}

const InlineAssignee: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
    <Avatar user={avatarOf(name)} size={20} />
    <span>{name}</span>
  </div>
);

const YesNo: React.FC<{ on: boolean; tone?: "success" | "yellow" | "purple" }> = ({ on, tone = "success" }) => {
  const tones = {
    success: { on: "var(--success)", off: "var(--border-default)" },
    yellow:  { on: "#f5d76e",        off: "#ece9f0" },
    purple:  { on: "#b6b6f0",        off: "#ece9f0" },
  } as const;
  const c = tones[tone];
  return (
    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: on ? c.on : c.off }}></span>
  );
};

const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({
  value,
  onChange,
  placeholder,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 30,
      padding: "0 10px",
      background: "var(--bg-surface)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-sm)",
      minWidth: 220,
    }}
  >
    <Icon name="search" size={13} strokeWidth={2} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1,
        border: 0,
        outline: 0,
        background: "transparent",
        fontSize: 12.5,
        color: "var(--text-primary)",
        fontFamily: "inherit",
      }}
    />
    {value && (
      <span
        onClick={() => onChange("")}
        style={{ cursor: "pointer", color: "var(--text-tertiary)", fontSize: 14, lineHeight: 1, padding: "0 2px" }}
      >
        ×
      </span>
    )}
  </div>
);

const CheckLabel: React.FC<React.PropsWithChildren<{ defaultChecked?: boolean }>> = ({ children, defaultChecked }) => (
  <label
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12.5,
      color: "var(--text-secondary)",
      cursor: "pointer",
      padding: "0 4px",
    }}
  >
    <input type="checkbox" defaultChecked={defaultChecked} style={{ accentColor: "var(--accent-500)" }} />
    {children}
  </label>
);

type FilterState = { round?: string; q?: string };

const TargetsToolbar: React.FC<{
  filter: FilterState;
  setFilter: (f: FilterState) => void;
}> = ({ filter, setFilter }) => (
  <div
    style={{
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
      borderBottom: GRID_BORDER,
    }}
  >
    <SearchInput value={filter.q || ""} onChange={(v) => setFilter({ ...filter, q: v })} placeholder="회사명 / 담당자 검색" />
    <FilterChip active={filter.round === "2026-D01"} onClick={() => setFilter({ ...filter, round: "2026-D01" })}>
      <span style={{ color: "var(--text-tertiary)", fontWeight: 500 }}>차수</span>&nbsp;2026-D01 · 연중 01
      <Icon name="chevD" size={11} />
    </FilterChip>
    <FilterChip>
      <span style={{ color: "var(--text-tertiary)", fontWeight: 500 }}>상태</span>&nbsp;전체 <Icon name="chevD" size={11} />
    </FilterChip>
    <FilterChip>
      <span style={{ color: "var(--text-tertiary)", fontWeight: 500 }}>버전</span>&nbsp;전체 <Icon name="chevD" size={11} />
    </FilterChip>
    <FilterChip>
      <span style={{ color: "var(--text-tertiary)", fontWeight: 500 }}>접속</span>&nbsp;전체 <Icon name="chevD" size={11} />
    </FilterChip>
    <div style={{ flex: 1 }}></div>
    <CheckLabel>지연 건만</CheckLabel>
    <CheckLabel>이슈 있음</CheckLabel>
    <CheckLabel>내 담당만</CheckLabel>
    <Btn variant="ghost" size="sm">필터 저장</Btn>
  </div>
);

const Th: React.FC<React.PropsWithChildren<{ sticky?: boolean; left?: number; minWidth?: string }>> = ({
  children,
  sticky,
  left,
  minWidth,
}) => (
  <th
    style={{
      padding: "10px 12px",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--text-tertiary)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      textAlign: "left",
      background: "var(--bg-surface-2)",
      borderBottom: GRID_BORDER,
      whiteSpace: "nowrap",
      minWidth,
      ...(sticky
        ? {
            position: "sticky" as const,
            left,
            zIndex: 2,
            background: "var(--bg-surface-2)",
            boxShadow: "inset -1px 0 0 var(--border-subtle)",
          }
        : {}),
    }}
  >
    {children}
  </th>
);

const Td: React.FC<
  React.PropsWithChildren<{
    sticky?: boolean;
    left?: number;
    mono?: boolean;
    muted?: boolean;
    style?: React.CSSProperties;
    bgHover?: boolean;
  }>
> = ({ children, sticky, left, mono, muted, style, bgHover }) => (
  <td
    style={{
      padding: "8px 12px",
      fontSize: 13,
      borderBottom: GRID_BORDER,
      whiteSpace: "nowrap",
      fontFamily: mono ? "var(--font-mono)" : "inherit",
      color: muted ? "var(--text-tertiary)" : "var(--text-primary)",
      ...(sticky
        ? {
            position: "sticky" as const,
            left,
            zIndex: 1,
            background: bgHover ? "var(--bg-hover)" : "var(--bg-canvas)",
            boxShadow: "inset -1px 0 0 var(--border-subtle)",
          }
        : {}),
      ...style,
    }}
  >
    {children}
  </td>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
    <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, letterSpacing: "0.02em" }}>{label}</div>
    <div
      className={mono ? "mono" : ""}
      style={{
        fontSize: 13.5,
        fontWeight: 500,
        color: "var(--text-primary)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {value}
    </div>
  </div>
);

const UseTag: React.FC<{ on: boolean; tone?: "yellow" | "purple" }> = ({ on, tone = "yellow" }) => {
  const tones = {
    yellow: { bg: "#fbeec0", fg: "#7a6418" },
    purple: { bg: "#e6dffb", fg: "#5a3fa0" },
  } as const;
  const c = on ? tones[tone] : null;
  if (!on || !c) return <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>미사용</span>;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 9px",
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        fontSize: 11.5,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      <span style={{ fontSize: 11 }}>✓</span>사용
    </span>
  );
};

type Contact = {
  name: string;
  role: string;
  phone: string;
  email: string;
  tag?: string;
  tagTone?: "primary";
};

const ContactCard: React.FC<Contact> = ({ name, role, tag, tagTone, phone, email }) => (
  <div
    style={{
      padding: "10px 12px",
      border: GRID_BORDER,
      borderRadius: "var(--r-md)",
      background: "var(--bg-surface-2)",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <span style={{ fontWeight: 600, fontSize: 13.5 }}>{name}</span>
        {role && <span style={{ color: "var(--text-tertiary)", fontSize: 12.5 }}> · {role}</span>}
      </div>
      {tag &&
        (tagTone === "primary" ? (
          <Badge variant="solid" style={{ background: "var(--accent-500)" }}>
            {tag}
          </Badge>
        ) : (
          <Badge variant="soft">{tag}</Badge>
        ))}
    </div>
    {(phone || email) && (
      <div className="mono" style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 4 }}>
        {[phone, email].filter(Boolean).join(" · ")}
      </div>
    )}
  </div>
);

const DEFAULT_CONTACTS: Contact[] = [
  { name: "김영수", role: "전산실장", tag: "PRIMARY", tagTone: "primary", phone: "010-1234-5678", email: "kim@sample.co.kr" },
  { name: "박민주", role: "인사팀",   tag: "YEAR_END",                       phone: "010-9876-5432", email: "park@sample.co.kr" },
];

const DirtyDot: React.FC = () => (
  <span
    aria-label="변경됨"
    title="변경됨"
    style={{
      display: "inline-block",
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "var(--accent-500)",
    }}
  />
);

const DirtyLabel: React.FC<{ children: React.ReactNode; dirty: boolean }> = ({ children, dirty }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
    {children}
    {dirty && <DirtyDot />}
  </span>
);

const ContactForm: React.FC<{
  onAdd: (c: Contact) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const canSubmit = name.trim().length > 0;
  return (
    <div
      style={{
        padding: 12,
        border: "1px dashed var(--accent-300)",
        borderRadius: "var(--r-md)",
        background: "var(--accent-50)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <FieldInput label="이름" required value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />
        <FieldInput label="직책" value={role} onChange={(e) => setRole(e.target.value)} placeholder="전산팀장" />
        <FieldInput label="전화번호" mono value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
        <FieldInput label="이메일" mono value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@sample.co.kr" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn variant="ghost" size="sm" onClick={onCancel}>취소</Btn>
        <Btn
          variant="primary"
          size="sm"
          disabled={!canSubmit}
          onClick={() => onAdd({ name: name.trim(), role: role.trim(), phone: phone.trim(), email: email.trim() })}
        >
          추가
        </Btn>
      </div>
    </div>
  );
};

const AuditRow: React.FC<{
  field: string;
  change: string;
  who: string;
  when: string;
  type: string;
  highlight?: boolean;
}> = ({ field, change, who, when, type, highlight }) => (
  <div
    style={{
      padding: "10px 12px",
      borderLeft: highlight ? "3px solid var(--accent-500)" : `3px solid var(--border-subtle)`,
      background: highlight ? "var(--accent-50)" : "var(--bg-surface-2)",
      borderRadius: "0 var(--r-sm) var(--r-sm) 0",
      fontSize: 12.5,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <span style={{ fontWeight: 600 }}>{field}</span>
        <span style={{ color: "var(--text-tertiary)" }}> {change}</span>
      </div>
      <span className="mono" style={{ fontSize: 10.5, color: "var(--text-tertiary)" }}>{when}</span>
    </div>
    <div style={{ color: "var(--text-tertiary)", marginTop: 2, fontSize: 11.5 }}>{who} · {type}</div>
  </div>
);

const DrawerBody: React.FC<{ company: Company; onClose: () => void }> = ({ company: c, onClose }) => {
  const initial = React.useMemo(
    () => ({
      status: c.status as string,
      scheduled: c.scheduled || "",
      applied: c.applied || "",
      issue: c.issue || "",
    }),
    [c.status, c.scheduled, c.applied, c.issue]
  );

  const [status, setStatus] = React.useState(initial.status);
  const [scheduled, setScheduled] = React.useState(initial.scheduled);
  const [applied, setApplied] = React.useState(initial.applied);
  const [issue, setIssue] = React.useState(initial.issue);
  const [contacts, setContacts] = React.useState<Contact[]>(DEFAULT_CONTACTS);
  const [showAddContact, setShowAddContact] = React.useState(false);

  // 회사 변경 시 폼 초기화
  React.useEffect(() => {
    setStatus(initial.status);
    setScheduled(initial.scheduled);
    setApplied(initial.applied);
    setIssue(initial.issue);
    setContacts(DEFAULT_CONTACTS);
    setShowAddContact(false);
  }, [c.id, initial]);

  const dirty = {
    status: status !== initial.status,
    scheduled: scheduled !== initial.scheduled,
    applied: applied !== initial.applied,
    issue: issue !== initial.issue,
  };
  const dirtyCount = Object.values(dirty).filter(Boolean).length;
  const hasChanges = dirtyCount > 0;

  return (
    <>
      <div
        style={{
          padding: "20px 24px",
          borderBottom: GRID_BORDER,
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-overline">2026-D01 · CO-{String(c.id).padStart(4, "0")}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.025em", marginTop: 6 }}>
            {c.name} · 연중 01
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 12 }}>
            <StatusBadge status={c.status} />
            <Tag>YEAR_END</Tag>
            <Badge variant="soft">P1</Badge>
            {hasChanges && (
              <Badge variant="solid" style={{ background: "var(--accent-500)" }}>
                변경됨 · {dirtyCount}
              </Badge>
            )}
          </div>
        </div>
        <IconBtn icon="close" onClick={onClose} title="닫기" />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <FieldSelect
          label={<DirtyLabel dirty={dirty.status}>반영 상태 (apply_status)</DirtyLabel>}
          value={status}
          options={[
            { value: "NOT_STARTED",  label: "NOT_STARTED · 미진행" },
            { value: "SCHEDULED",    label: "SCHEDULED · 예정" },
            { value: "IN_PROGRESS",  label: "IN_PROGRESS · 진행중" },
            { value: "APPLIED",      label: "APPLIED · 반영완료" },
            { value: "FAILED",       label: "FAILED · 실패" },
            { value: "HOLD",         label: "HOLD · 보류" },
            { value: "NOT_REQUIRED", label: "NOT_REQUIRED · 대상아님" },
          ]}
          onChange={(e) => setStatus(e.target.value)}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          <FieldInput
            label={<DirtyLabel dirty={dirty.scheduled}>마감일</DirtyLabel>}
            mono
            value={scheduled}
            placeholder="YYYY-MM-DD"
            onChange={(e) => setScheduled(e.target.value)}
          />
          <FieldInput
            label={<DirtyLabel dirty={dirty.applied}>반영일</DirtyLabel>}
            mono
            value={applied}
            placeholder="YYYY-MM-DD"
            onChange={(e) => setApplied(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <FieldTextarea
            label={<DirtyLabel dirty={dirty.issue}>이슈 / 특이사항</DirtyLabel>}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
        </div>

        <hr style={{ margin: "20px 0", border: 0, borderTop: GRID_BORDER }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="t-overline">환경정보</div>
          <Btn
            variant="ghost"
            size="sm"
            icon="link"
            title="Jarvis 화면에서 환경정보를 직접 편집합니다"
            onClick={() => {
              // TODO: Jarvis 화면 링크 연결
            }}
          >
            Jarvis에서 편집
          </Btn>
        </div>
        <div
          style={{
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--r-md)",
            padding: "14px 16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: 12,
            columnGap: 24,
          }}
        >
          <InfoRow label="제품 버전"  value={c.ver} mono />
          <InfoRow label="charset"   value={c.charset} mono />
          <InfoRow label="보안 버전"  value="v2.3.1" mono />
          <InfoRow label="Java 버전"  value="1.8.0_382" mono />
          <InfoRow label="계약 형태"  value={["유지보수", "하자보수", "패키지 유지보수", "방문 유지보수"][(c.id || 0) % 4]} />
          <InfoRow label="접속 방법"  value={c.access} />
          <InfoRow label="반영 방법"  value={c.deploy} />
          <InfoRow label="연말정산"   value={<UseTag on={c.ye} tone="yellow" />} />
          <InfoRow label="원천세"     value={<UseTag on={c.wh} tone="purple" />} />
        </div>

        <hr style={{ margin: "20px 0", border: 0, borderTop: GRID_BORDER }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div className="t-overline">연락처 · {contacts.length}명</div>
          {!showAddContact && (
            <Btn variant="ghost" size="sm" icon="plus" onClick={() => setShowAddContact(true)}>
              추가
            </Btn>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {contacts.map((ct, i) => (
            <ContactCard key={`${ct.name}-${i}`} {...ct} />
          ))}
          {showAddContact && (
            <ContactForm
              onCancel={() => setShowAddContact(false)}
              onAdd={(nc) => {
                setContacts((prev) => [...prev, nc]);
                setShowAddContact(false);
              }}
            />
          )}
        </div>

        <hr style={{ margin: "20px 0", border: 0, borderTop: GRID_BORDER }} />

        <div className="t-overline" style={{ marginBottom: 10 }}>변경 이력 (audit_log)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <AuditRow field="apply_status"   change="IN_PROGRESS → APPLIED" who={c.maintainer} when="2시간 전" type="STATUS_CHANGE" highlight />
          <AuditRow field="scheduled_date" change={`→ ${c.scheduled || "—"}`} who={c.maintainer} when="1일 전" type="UPDATE" />
          <AuditRow field="maintainer_id"  change={`→ ${c.maintainer}`}        who="이주성"     when="3일 전" type="UPDATE" />
        </div>
      </div>

      <div
        style={{
          padding: 20,
          borderTop: GRID_BORDER,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>
          {hasChanges ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <DirtyDot />
              저장되지 않은 변경 {dirtyCount}건
            </span>
          ) : (
            "변경 사항 없음"
          )}
        </div>
        <div style={{ flex: 1 }} />
        <Btn variant="primary" size="md" disabled={!hasChanges}>
          저장
        </Btn>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   Action modals (Bulk / Regenerate)
   ───────────────────────────────────────────── */
const BulkActionModal: React.FC<{
  open: boolean;
  onClose: () => void;
  selectedIds: number[];
  companies: Company[];
  onChangeDue: (ids: number[], due: string) => void;
  onDelete: (ids: number[]) => void;
}> = ({ open, onClose, selectedIds, companies, onChangeDue, onDelete }) => {
  const [mode, setMode] = React.useState<"choose" | "due" | "delete">("choose");
  const [due, setDue] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setMode("choose");
      setDue("");
    }
  }, [open]);

  const selectedNames = companies.filter((c) => selectedIds.includes(c.id)).map((c) => c.name);
  const preview =
    selectedNames.length <= 3
      ? selectedNames.join(", ")
      : `${selectedNames.slice(0, 3).join(", ")} 외 ${selectedNames.length - 3}곳`;

  let footer: React.ReactNode = (
    <Btn variant="ghost" size="md" onClick={onClose}>
      닫기
    </Btn>
  );
  if (mode === "due") {
    footer = (
      <>
        <Btn variant="ghost" size="md" onClick={() => setMode("choose")}>뒤로</Btn>
        <Btn
          variant="primary"
          size="md"
          disabled={!due}
          onClick={() => {
            onChangeDue(selectedIds, due);
            onClose();
          }}
        >
          적용 ({selectedIds.length}건)
        </Btn>
      </>
    );
  } else if (mode === "delete") {
    footer = (
      <>
        <Btn variant="ghost" size="md" onClick={() => setMode("choose")}>뒤로</Btn>
        <Btn
          variant="danger"
          size="md"
          onClick={() => {
            onDelete(selectedIds);
            onClose();
          }}
        >
          삭제 ({selectedIds.length}건)
        </Btn>
      </>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="일괄 변경"
      subtitle={`선택 ${selectedIds.length}건 · ${preview || "—"}`}
      footer={footer}
    >
      {mode === "choose" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={() => setMode("due")}
            style={{
              textAlign: "left",
              padding: "14px 16px",
              border: GRID_BORDER,
              borderRadius: "var(--r-md)",
              background: "var(--bg-surface)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14 }}>마감일 일괄 변경</div>
            <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--text-tertiary)" }}>
              선택한 고객사들의 마감일을 한번에 같은 날짜로 설정합니다.
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode("delete")}
            style={{
              textAlign: "left",
              padding: "14px 16px",
              border: "1px solid var(--pastel-coral)",
              borderRadius: "var(--r-md)",
              background: "var(--bg-surface)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--pastel-coral-d)" }}>선택 삭제</div>
            <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--text-tertiary)" }}>
              선택한 고객사를 이 차수의 반영 대상에서 제거합니다. (audit 기록 남김 권장)
            </div>
          </button>
        </div>
      )}

      {mode === "due" && (
        <FieldInput
          label="새 마감일"
          mono
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
      )}

      {mode === "delete" && (
        <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          선택한 <b>{selectedIds.length}건</b>의 패치 대상을 삭제합니다.
          <br />
          삭제된 항목은 그리드에서 즉시 사라지며, 이후 <b>대상 재생성</b>으로 다시 포함시킬 수 있습니다.
        </div>
      )}
    </Modal>
  );
};

const Drawer: React.FC<{ open: boolean; onClose: () => void; company: Company | null }> = ({
  open,
  onClose,
  company,
}) => {
  if (!company) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20,22,30,0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s",
          zIndex: 60,
        }}
      ></div>
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 580,
          maxWidth: "92vw",
          background: "var(--bg-canvas)",
          boxShadow: "var(--shadow-drawer)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.24s ease",
          zIndex: 61,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DrawerBody company={company} onClose={onClose} />
      </aside>
    </>
  );
};

export default function TargetsPage() {
  const [filter, setFilter] = React.useState<FilterState>({ round: "2026-D01" });
  const [companies, setCompanies] = React.useState<Company[]>(COMPANIES);
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [activeRowId, setActiveRowId] = React.useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [hoverRow, setHoverRow] = React.useState<number | null>(null);
  const [bulkOpen, setBulkOpen] = React.useState(false);

  const activeRound = filter.round || "2026-D01";
  const activeRow = activeRowId != null ? companies.find((c) => c.id === activeRowId) ?? null : null;

  // 서비스 종료된 회사는 활성 차수 이후로 자동 제외 (generate-targets 로직의 클라이언트 미러링).
  const inScope = companies.filter(
    (c) => !c.terminatedAtRound || c.terminatedAtRound > activeRound
  );

  const filtered = inScope.filter((c) => {
    const q = (filter.q || "").trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || (c.maintainer || "").toLowerCase().includes(q);
  });

  const open = (c: Company) => {
    setActiveRowId(c.id);
    setDrawerOpen(true);
  };
  const close = () => setDrawerOpen(false);

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));
  const toggleSelectAll = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filtered.forEach((c) => next.delete(c.id));
      } else {
        filtered.forEach((c) => next.add(c.id));
      }
      return next;
    });

  const handleBulkChangeDue = (ids: number[], due: string) => {
    const idSet = new Set(ids);
    setCompanies((prev) =>
      prev.map((c) => (idSet.has(c.id) ? { ...c, scheduled: due } : c))
    );
    setSelectedIds(new Set());
  };
  const handleBulkDelete = (ids: number[]) => {
    const idSet = new Set(ids);
    setCompanies((prev) => prev.filter((c) => !idSet.has(c.id)));
    setSelectedIds(new Set());
    if (activeRowId != null && idSet.has(activeRowId)) {
      setDrawerOpen(false);
      setActiveRowId(null);
    }
  };
  const counts = inScope.reduce<Record<string, number>>(
    (acc, c) => {
      acc.total++;
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );

  const selectedCount = selectedIds.size;

  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader
        title="고객사 패치 현황"
        subtitle="차수별 · 고객사별 반영 상태를 인라인 편집. 신규 등록 / 서비스 종료는 고객사 마스터에서 관리합니다."
        actions={
          <>
            <Btn
              variant="ghost"
              size="md"
              disabled={selectedCount === 0}
              onClick={() => setBulkOpen(true)}
            >
              일괄 변경{selectedCount > 0 ? ` (${selectedCount})` : ""}
            </Btn>
          </>
        }
      />

      <Card style={{ overflow: "hidden" }}>
        <TargetsToolbar filter={filter} setFilter={setFilter} />

        <div style={{ overflowX: "auto", maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13, tableLayout: "auto" }}>
            <thead>
              <tr>
                <Th sticky left={0} minWidth="36px">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    style={{ accentColor: "var(--accent-500)" }}
                  />
                </Th>
                <Th sticky left={36} minWidth="200px">회사명</Th>
                <Th>버전</Th>
                <Th>charset</Th>
                <Th>담당자</Th>
                <Th>접속</Th>
                <Th>반영</Th>
                <Th>연말</Th>
                <Th>원천</Th>
                <Th>apply_status</Th>
                <Th>마감일</Th>
                <Th>반영일</Th>
                <Th minWidth="220px">이슈 / 특이사항</Th>
                <Th>최근수정</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const active = activeRowId === c.id;
                const hover = hoverRow === c.id;
                const checked = selectedIds.has(c.id);
                const rowBg = active ? "var(--accent-50)" : hover ? "var(--bg-hover)" : "transparent";
                return (
                  <tr
                    key={c.id}
                    onClick={() => open(c)}
                    onMouseEnter={() => setHoverRow(c.id)}
                    onMouseLeave={() => setHoverRow(null)}
                    style={{ cursor: "pointer", background: rowBg }}
                  >
                    <Td
                      sticky
                      left={0}
                      bgHover={hover || active}
                      style={{
                        background: active ? "var(--accent-50)" : hover ? "var(--bg-hover)" : "var(--bg-canvas)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelect(c.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ accentColor: "var(--accent-500)" }}
                      />
                    </Td>
                    <Td
                      sticky
                      left={36}
                      bgHover={hover || active}
                      style={{
                        background: active ? "var(--accent-50)" : hover ? "var(--bg-hover)" : "var(--bg-canvas)",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: "var(--text-tertiary)", marginTop: 1 }}>
                        CO-{String(c.id).padStart(4, "0")}
                      </div>
                    </Td>
                    <Td mono>{c.ver}</Td>
                    <Td muted mono>{c.charset}</Td>
                    <Td><InlineAssignee name={c.maintainer} /></Td>
                    <Td><Badge variant="soft">{c.access}</Badge></Td>
                    <Td><Badge variant="soft">{c.deploy}</Badge></Td>
                    <Td><YesNo on={c.ye} tone="yellow" /></Td>
                    <Td><YesNo on={c.wh} tone="purple" /></Td>
                    <Td><StatusBadge status={c.status as StatusKey} /></Td>
                    <Td mono muted>{c.scheduled || "—"}</Td>
                    <Td mono style={{ color: c.applied ? "var(--success-fg)" : "var(--text-tertiary)" }}>
                      {c.applied || "—"}
                    </Td>
                    <Td muted style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.issue || "—"}
                    </Td>
                    <Td muted style={{ fontSize: 11 }}>김지혜 · 2h ago</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderTop: GRID_BORDER,
            fontSize: 12.5,
            color: "var(--text-secondary)",
          }}
        >
          <div>
            총 <span style={{ color: "var(--accent-700)", fontWeight: 700 }}>{counts.total}</span>건 · 반영완료 <b>{counts.APPLIED || 0}</b> · 진행중 <b>{counts.IN_PROGRESS || 0}</b> · 예정 <b>{counts.SCHEDULED || 0}</b> · 미진행 <b>{counts.NOT_STARTED || 0}</b> · 실패 <b>{counts.FAILED || 0}</b> · 보류 <b>{counts.HOLD || 0}</b>
          </div>
          <div style={{ flex: 1 }}></div>
          <Btn variant="ghost" size="sm" icon="chevL">이전</Btn>
          <span className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)" }}>1 / 1</span>
          <Btn variant="ghost" size="sm" iconRight="chevR">다음</Btn>
        </div>
      </Card>

      <Drawer open={drawerOpen} onClose={close} company={activeRow} />

      <BulkActionModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        selectedIds={Array.from(selectedIds)}
        companies={companies}
        onChangeDue={handleBulkChangeDue}
        onDelete={handleBulkDelete}
      />

    </div>
  );
}
