"use client";

// ── ROUNDS page — 패치 차수 · 항목 ──
// _design_input/screens/other.jsx (RoundsPage + PatchItemDrawer) 1:1 port.

import * as React from "react";
import {
  Badge,
  Btn,
  Card,
  PageHeader,
  SectionHeader,
} from "@/components/yess/common";
import { PATCH_ITEMS, ROUNDS, type PatchItem } from "@/lib/yess/data";

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
  const [activeRound, setActiveRound] = React.useState("2026-D01");
  const [activeItem, setActiveItem] = React.useState<PatchItem | null>(null);
  const items = PATCH_ITEMS.map((it) => ({ ...it, code: `${activeRound}-${it.no}` }));

  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader
        title="패치 차수 · 항목"
        subtitle="배포 차수와 그 안에 포함되는 패치 항목을 관리합니다."
        actions={
          <Btn variant="primary" size="md" icon="plus">
            차수 생성
          </Btn>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ROUNDS.map((r) => {
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
    </div>
  );
}
