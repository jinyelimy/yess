"use client";

// ── ROUNDS page — 패치 차수 · 항목 ──
// _design_input/screens/other.jsx (RoundsPage + PatchItemDrawer) 1:1 port.

import * as React from "react";
import {
  Badge,
  Btn,
  Card,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  Icon,
  Modal,
  PageHeader,
  SectionHeader,
} from "@/components/yess/common";
import { DatePicker } from "@/components/yess/datepicker";
import { COMPANIES, PATCH_ITEMS, ROUNDS, type Company, type PatchItem, type Round } from "@/lib/yess/data";

type TargetScope = "ALL" | "PREVIOUS" | "MANUAL";

const SCOPE_META: Record<TargetScope, { label: string; desc: string }> = {
  ALL:      { label: "전체",          desc: "현재 운영 중인 모든 고객사를 대상으로 추가합니다." },
  PREVIOUS: { label: "직전 차수 기준", desc: "직전 차수의 대상 고객사를 그대로 가져옵니다." },
  MANUAL:   { label: "직접 선택",     desc: "차수 생성 후 패치 현황 화면에서 개별 선택합니다." },
};

const ManualSelectPanel: React.FC<{
  pool: Company[];
  selected: Set<number>;
  onToggle: (id: number) => void;
  onSelectAll: (ids: number[]) => void;
  onClear: () => void;
}> = ({ pool, selected, onToggle, onSelectAll, onClear }) => {
  const [q, setQ] = React.useState("");
  const filtered = pool.filter((c) =>
    !q.trim() ? true : c.name.toLowerCase().includes(q.trim().toLowerCase())
  );
  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        borderLeft: "1px solid var(--border-subtle)",
        paddingLeft: 20,
        marginLeft: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div className="t-overline" style={{ color: "var(--text-tertiary)" }}>
          대상 고객사 직접 선택 · {selected.size}/{pool.length}
        </div>
        <Btn
          variant="ghost"
          size="sm"
          onClick={() =>
            allFilteredSelected ? onClear() : onSelectAll(filtered.map((c) => c.id))
          }
        >
          {allFilteredSelected ? "전체 해제" : "전체 선택"}
        </Btn>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          height: 32,
          padding: "0 10px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--r-sm)",
          marginBottom: 10,
        }}
      >
        <Icon name="search" size={13} strokeWidth={2} color="var(--text-tertiary)" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="회사명 검색"
          style={{
            flex: 1,
            border: 0,
            outline: 0,
            background: "transparent",
            fontSize: 12.5,
            fontFamily: "inherit",
            color: "var(--text-primary)",
          }}
        />
        {q && (
          <span
            onClick={() => setQ("")}
            style={{ cursor: "pointer", color: "var(--text-tertiary)", fontSize: 14, lineHeight: 1, padding: "0 2px" }}
          >
            ×
          </span>
        )}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--r-md)",
          background: "var(--bg-surface-2)",
        }}
      >
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-tertiary)", fontSize: 12.5 }}>
            검색 결과 없음
          </div>
        )}
        {filtered.map((c, i) => {
          const checked = selected.has(c.id);
          return (
            <label
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)",
                cursor: "pointer",
                background: checked ? "var(--accent-50)" : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(c.id)}
                style={{ accentColor: "var(--accent-500)" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>
                  CO-{String(c.id).padStart(4, "0")} · {c.ver} · {c.maintainer}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const CreateRoundModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    code: string;
    name: string;
    type: Round["type"];
    due: string;
    note: string;
    scope: TargetScope;
    selectedCompanyIds?: number[];
  }) => void;
}> = ({ open, onClose, onCreate }) => {
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<Round["type"]>("REGULAR");
  const [due, setDue] = React.useState("");
  const [note, setNote] = React.useState("");
  const [scope, setScope] = React.useState<TargetScope>("ALL");
  const [selectedCompanyIds, setSelectedCompanyIds] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    if (open) {
      setCode("");
      setName("");
      setType("REGULAR");
      setDue("");
      setNote("");
      setScope("ALL");
      setSelectedCompanyIds(new Set());
    }
  }, [open]);

  const operatingCompanies = React.useMemo(
    () => COMPANIES.filter((c) => !c.terminatedAtRound),
    []
  );

  const isManual = scope === "MANUAL";
  const canSubmit =
    code.trim() && name.trim() && (!isManual || selectedCompanyIds.size > 0);

  const toggleCompany = (id: number) =>
    setSelectedCompanyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="패치 차수 생성"
      subtitle="TF 리더가 새로운 패치 차수를 생성합니다. 생성 직후 상태는 초안(DRAFT)입니다."
      width={isManual ? 1080 : 560}
      footer={
        <>
          <Btn variant="ghost" size="md" onClick={onClose}>취소</Btn>
          <Btn
            variant="primary"
            size="md"
            disabled={!canSubmit}
            onClick={() => {
              onCreate({
                code: code.trim(),
                name: name.trim(),
                type,
                due: due.trim(),
                note: note.trim(),
                scope,
                selectedCompanyIds: isManual ? Array.from(selectedCompanyIds) : undefined,
              });
              onClose();
            }}
          >
            생성
            {isManual && selectedCompanyIds.size > 0 ? ` · ${selectedCompanyIds.size}건` : ""}
          </Btn>
        </>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isManual ? "1fr 1fr" : "1fr",
          gap: 24,
          minHeight: isManual ? 480 : undefined,
        }}
      >
        {/* 좌측: 폼 */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FieldInput
              label="차수 코드"
              required
              mono
              value={code}
              placeholder="2026-D02"
              onChange={(e) => setCode(e.target.value)}
            />
            <FieldSelect
              label="차수 유형"
              value={type}
              options={[
                { value: "REGULAR",    label: "REGULAR · 연중패치" },
                { value: "YEAR_END",   label: "YEAR_END · 연말정산패치" },
                { value: "INDIVIDUAL", label: "INDIVIDUAL · 개별패치" },
                { value: "EXTRA",      label: "EXTRA · 추가패치" },
              ]}
              onChange={(e) => setType(e.target.value as Round["type"])}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <FieldInput
              label="차수명"
              required
              value={name}
              placeholder="연중패치 02"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <DatePicker label="마감일" value={due} onChange={setDue} />
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="t-overline" style={{ marginBottom: 8, color: "var(--text-tertiary)" }}>대상 고객사 옵션</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(Object.keys(SCOPE_META) as TargetScope[]).map((key) => {
                const meta = SCOPE_META[key];
                const checked = scope === key;
                return (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 12px",
                      border: `1px solid ${checked ? "var(--accent-300)" : "var(--border-subtle)"}`,
                      background: checked ? "var(--accent-50)" : "var(--bg-canvas)",
                      borderRadius: "var(--r-md)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="target-scope"
                      checked={checked}
                      onChange={() => setScope(key)}
                      style={{ accentColor: "var(--accent-500)", marginTop: 3 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{meta.label}</div>
                      <div style={{ marginTop: 2, fontSize: 12, color: "var(--text-tertiary)" }}>{meta.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--text-tertiary)" }}>
              * 서비스 종료 처리된 고객사는 옵션과 무관하게 자동 제외됩니다.
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <FieldTextarea
              label="비고"
              value={note}
              placeholder="이 차수의 메모 / 특이사항"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* 우측: 직접 선택 패널 (scope=MANUAL일 때만) */}
        {isManual && (
          <ManualSelectPanel
            pool={operatingCompanies}
            selected={selectedCompanyIds}
            onToggle={toggleCompany}
            onSelectAll={(ids) =>
              setSelectedCompanyIds((prev) => {
                const next = new Set(prev);
                ids.forEach((id) => next.add(id));
                return next;
              })
            }
            onClear={() => setSelectedCompanyIds(new Set())}
          />
        )}
      </div>
    </Modal>
  );
};

const ROUND_STATUS_LABEL: Record<string, string> = {
  DRAFT: "초안",
  RELEASED: "배포",
  IN_PROGRESS: "진행",
  CLOSED: "종료",
};
const ROUND_STATUS_CLS: Record<string, "pending" | "progress" | "done"> = {
  DRAFT: "pending",
  RELEASED: "progress",
  IN_PROGRESS: "progress",
  CLOSED: "done",
};

const FILE_TYPE_TONES: Record<string, { bg: string; fg: string; label: string }> = {
  NEW:    { bg: "#dff5e3", fg: "#1f6e3a", label: "신규" },
  MODIFY: { bg: "#e3ecfb", fg: "#2c4f97", label: "수정" },
  DELETE: { bg: "#fbe1ea", fg: "#9a3358", label: "삭제" },
};

const groupTones: Record<string, { bg: string; fg: string }> = {
  SOURCE: { bg: "#ece7fb", fg: "#4a3b9b" },
  DB:     { bg: "#fbeec0", fg: "#7a6418" },
  RD:     { bg: "#fbe1ea", fg: "#9a3358" },
};

const PatchItemDrawer: React.FC<{
  item: PatchItem | null;
  roundCode: string;
  onClose: () => void;
}> = ({ item, roundCode, onClose }) => {
  const open = !!item;
  const [activeVer, setActiveVer] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (item) setActiveVer(item.versions[0]);
  }, [item]);
  if (!item) return null;
  const filesForVer = item.files.filter((f) => f.ver === activeVer);
  const gt = groupTones[item.group] || groupTones.SOURCE;

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
          width: 620,
          maxWidth: "94vw",
          background: "var(--bg-canvas)",
          boxShadow: "var(--shadow-drawer)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.24s ease",
          zIndex: 61,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-overline mono">
              {roundCode} · {item.no}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: "-0.02em",
                marginTop: 6,
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "2px 7px",
                  borderRadius: "var(--r-pill)",
                  background: gt.bg,
                  color: gt.fg,
                }}
              >
                {item.group}
              </span>
              <Badge variant="soft">{item.cat}</Badge>
              {item.versions.map((v) => (
                <Badge key={v} variant="outline">
                  {v}
                </Badge>
              ))}
              <span style={{ width: 1, height: 14, background: "var(--border-subtle)", margin: "0 4px" }}></span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--accent-100)",
                    color: "var(--accent-700)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {(item.assignee || "").slice(0, 1)}
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 500 }}>{item.assignee}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid var(--border-subtle)",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 14,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div style={{ marginBottom: 24 }}>
            <div className="t-overline" style={{ marginBottom: 8 }}>변경 내용</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)" }}>{item.summary}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="t-overline" style={{ marginBottom: 8 }}>적용 범위</div>
            {item.scope === "ALL" ? (
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>전체 고객사 공통 적용</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.companies.map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "var(--r-pill)",
                      background: "#ece7fb",
                      color: "#4a3b9b",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="t-overline">수정 파일 · {item.files.length}건</div>
              <div style={{ display: "flex", gap: 4 }}>
                {item.versions.map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVer(v)}
                    style={{
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: "var(--r-pill)",
                      border: "1px solid " + (activeVer === v ? "var(--accent-500)" : "var(--border-subtle)"),
                      background: activeVer === v ? "var(--accent-50)" : "transparent",
                      color: activeVer === v ? "var(--accent-700)" : "var(--text-secondary)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filesForVer.map((f, i) => {
                const t = FILE_TYPE_TONES[f.type];
                return (
                  <div
                    key={i}
                    style={{
                      padding: "10px 12px",
                      background: "var(--bg-surface-2)",
                      borderRadius: "var(--r-md)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "var(--r-pill)",
                        background: t.bg,
                        color: t.fg,
                        flexShrink: 0,
                      }}
                    >
                      {t.label}
                    </span>
                    <span
                      className="mono"
                      style={{
                        fontSize: 11.5,
                        color: "var(--text-primary)",
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.path}
                    </span>
                    <span
                      className="mono tnum"
                      style={{ fontSize: 11, color: "var(--success-fg)", fontWeight: 600, flexShrink: 0 }}
                    >
                      +{f.plus}
                    </span>
                    <span
                      className="mono tnum"
                      style={{ fontSize: 11, color: "var(--danger-fg)", fontWeight: 600, flexShrink: 0 }}
                    >
                      -{f.minus}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="t-overline" style={{ marginBottom: 8 }}>가이드 문서</div>
            {item.guide && item.guideMeta ? (
              <div
                style={{
                  padding: 14,
                  background: "var(--bg-surface-2)",
                  borderRadius: "var(--r-md)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "var(--accent-100)",
                    color: "var(--accent-700)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                  }}
                >
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>가이드 작성 완료</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 2 }}>
                    {item.guideMeta.author} · 최근 수정 {item.guideMeta.updatedAt}
                  </div>
                </div>
                <Btn variant="secondary" size="sm">미리보기</Btn>
              </div>
            ) : (
              <div
                style={{
                  padding: 14,
                  background: "var(--bg-sunken)",
                  borderRadius: "var(--r-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>가이드 문서가 작성되지 않았습니다.</span>
                <Btn variant="primary" size="sm" icon="plus">초안 만들기</Btn>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default function RoundsPage() {
  const [rounds, setRounds] = React.useState<Round[]>(ROUNDS);
  const [activeRound, setActiveRound] = React.useState("2026-D01");
  const [activeItem, setActiveItem] = React.useState<PatchItem | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const items = PATCH_ITEMS.map((it) => ({ ...it, code: `${activeRound}-${it.no}` }));

  const handleCreateRound = (data: {
    code: string;
    name: string;
    type: Round["type"];
    due: string;
    note: string;
    scope: TargetScope;
    selectedCompanyIds?: number[];
  }) => {
    const newRound: Round = {
      code: data.code,
      name: data.name,
      type: data.type,
      status: "DRAFT",
      items: 0,
      release: "",
      due: data.due,
    };
    setRounds((prev) => [newRound, ...prev]);
    setActiveRound(data.code);
    // v0 mock: scope/note/selectedCompanyIds는 Round 모델에 없어 미저장.
    // 실제 API에선 POST /patch-rounds 시 body에 target_scope/description/company_ids 포함하여 generate-targets 트리거.
    void data.scope;
    void data.note;
    void data.selectedCompanyIds;
  };

  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader
        title="패치 차수 · 항목"
        subtitle="배포 차수와 그 안에 포함되는 패치 항목을 관리합니다."
        actions={
          <Btn variant="primary" size="md" icon="plus" onClick={() => setCreateOpen(true)}>
            차수 생성
          </Btn>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rounds.map((r) => {
            const active = r.code === activeRound;
            const cls = ROUND_STATUS_CLS[r.status];
            return (
              <button
                key={r.code}
                onClick={() => setActiveRound(r.code)}
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  background: active ? "var(--accent-50)" : "var(--bg-canvas)",
                  boxShadow: active ? "inset 0 0 0 1.5px var(--accent-500)" : "var(--shadow-ring)",
                  borderRadius: "var(--r-lg)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-700)" }}>
                    {r.code}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</span>
                  <div style={{ flex: 1 }}></div>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "var(--r-pill)",
                      fontSize: 10.5,
                      fontWeight: 700,
                      background: `var(--status-${cls}-bg)`,
                      color: `var(--status-${cls}-fg)`,
                    }}
                  >
                    {ROUND_STATUS_LABEL[r.status]}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: "var(--text-tertiary)" }}>
                  <span>
                    항목{" "}
                    <b className="tnum" style={{ color: "var(--text-primary)" }}>
                      {r.items}
                    </b>
                  </span>
                  <span>
                    마감 <span className="mono">{r.due}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <Card padding={0}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
            <SectionHeader
              overline={activeRound}
              title={`패치 항목 · ${items.length}건`}
              right={
                <Btn variant="secondary" size="sm" icon="plus">
                  항목 추가
                </Btn>
              }
            />
          </div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-surface-2)" }}>
                {["No", "항목명", "카테고리", "버전", "범위", "가이드", "담당자"].map((h) => (
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
              {items.map((it) => (
                <tr
                  key={it.no}
                  onClick={() => setActiveItem(it)}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                    <span style={{ color: "var(--text-tertiary)" }}>{it.no}</span>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", fontWeight: 500 }}>
                    {it.title}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                    {(() => {
                      const t = groupTones[it.group] || groupTones.SOURCE;
                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                              padding: "2px 7px",
                              borderRadius: "var(--r-pill)",
                              background: t.bg,
                              color: t.fg,
                            }}
                          >
                            {it.group}
                          </span>
                          <Badge variant="soft">{it.cat}</Badge>
                        </div>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {it.versions.map((v) => (
                        <Badge key={v} variant="outline">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                    {(() => {
                      const isAll = it.scope === "ALL";
                      const scopeBg = isAll ? "var(--bg-sunken)" : "#ece7fb";
                      const scopeFg = isAll ? "var(--text-secondary)" : "#4a3b9b";
                      const scopeLbl = isAll
                        ? "전체"
                        : it.companies.length <= 1
                        ? it.companies[0]
                        : `${it.companies[0]} +${it.companies.length - 1}`;
                      return (
                        <span
                          title={!isAll ? it.companies.join(", ") : undefined}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "var(--r-pill)",
                            background: scopeBg,
                            color: scopeFg,
                            cursor: !isAll ? "help" : "default",
                          }}
                        >
                          {scopeLbl}
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                    {it.guide ? (
                      <span style={{ color: "var(--success-fg)", fontSize: 12, fontWeight: 600 }}>✓ 작성</span>
                    ) : (
                      <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "var(--accent-100)",
                          color: "var(--accent-700)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {(it.assignee || "").slice(0, 1)}
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{it.assignee}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <PatchItemDrawer item={activeItem} roundCode={activeRound} onClose={() => setActiveItem(null)} />
      <CreateRoundModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateRound}
      />
    </div>
  );
}
