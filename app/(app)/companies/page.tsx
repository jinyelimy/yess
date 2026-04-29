"use client";

// ── COMPANIES page — 고객사 마스터 ──
// 신규 고객사 등록과 서비스 종료/복원이 일어나는 단일 진실 원천(Single Source of Truth).
// 종료 마커(terminatedAtRound)는 generate-targets 시 자동 제외에 사용됨.

import * as React from "react";
import {
  Avatar,
  Badge,
  Btn,
  Card,
  FieldInput,
  FieldSelect,
  Modal,
  PageHeader,
} from "@/components/yess/common";
import { ASSIGNEES, COMPANIES, ROUNDS, type Company } from "@/lib/yess/data";

const ROUND_OPTIONS = ROUNDS.map((r) => ({
  value: r.code,
  label: `${r.code} · ${r.name}`,
}));

const TerminationBadge: React.FC<{ round: string }> = ({ round }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px",
      borderRadius: "var(--r-sm)",
      background: "var(--bg-sunken)",
      color: "var(--text-secondary)",
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    종료 · {round}부터
  </span>
);

const TerminateModal: React.FC<{
  open: boolean;
  company: Company | null;
  onClose: () => void;
  onConfirm: (round: string) => void;
}> = ({ open, company, onClose, onConfirm }) => {
  const [round, setRound] = React.useState(ROUND_OPTIONS[0]?.value || "");
  React.useEffect(() => {
    if (open) setRound(ROUND_OPTIONS[0]?.value || "");
  }, [open]);

  if (!company) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="서비스 종료 처리"
      subtitle={`${company.name}을(를) 어느 차수부터 제외할지 선택하세요.`}
      width={460}
      footer={
        <>
          <Btn variant="ghost" size="md" onClick={onClose}>취소</Btn>
          <Btn
            variant="danger"
            size="md"
            disabled={!round}
            onClick={() => {
              onConfirm(round);
              onClose();
            }}
          >
            종료 처리
          </Btn>
        </>
      }
    >
      <FieldSelect
        label="종료 시작 차수"
        value={round}
        options={ROUND_OPTIONS}
        onChange={(e) => setRound(e.target.value)}
      />
      <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--text-tertiary)", lineHeight: 1.6 }}>
        선택한 차수 및 그 이후 모든 차수의 <b>generate-targets</b>에서 자동 제외됩니다.
        <br />
        선택한 차수보다 이전 차수의 진행/이력은 그대로 보존됩니다.
      </div>
    </Modal>
  );
};

const AddCompanyModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; ver: string; charset: string; access: string; deploy: string; ye: boolean; wh: boolean; maintainer: string }) => void;
}> = ({ open, onClose, onAdd }) => {
  const [name, setName] = React.useState("");
  const [ver, setVer] = React.useState("5.2");
  const [charset, setCharset] = React.useState("UTF-8");
  const [access, setAccess] = React.useState("VPN");
  const [deploy, setDeploy] = React.useState("원격");
  const [ye, setYe] = React.useState(true);
  const [wh, setWh] = React.useState(false);
  const [maintainer, setMaintainer] = React.useState(ASSIGNEES[0]?.name || "");

  React.useEffect(() => {
    if (open) {
      setName("");
      setVer("5.2");
      setCharset("UTF-8");
      setAccess("VPN");
      setDeploy("원격");
      setYe(true);
      setWh(false);
      setMaintainer(ASSIGNEES[0]?.name || "");
    }
  }, [open]);

  const canSubmit = name.trim().length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="고객사 추가"
      subtitle="신규 고객사를 마스터에 등록합니다."
      width={560}
      footer={
        <>
          <Btn variant="ghost" size="md" onClick={onClose}>취소</Btn>
          <Btn
            variant="primary"
            size="md"
            disabled={!canSubmit}
            onClick={() => {
              onAdd({
                name: name.trim(),
                ver,
                charset,
                access,
                deploy,
                ye,
                wh,
                maintainer,
              });
              onClose();
            }}
          >
            추가
          </Btn>
        </>
      }
    >
      <FieldInput
        label="회사명"
        required
        value={name}
        placeholder="예: 오미크론파트너스"
        onChange={(e) => setName(e.target.value)}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <FieldInput label="제품 버전" mono value={ver} onChange={(e) => setVer(e.target.value)} />
        <FieldSelect
          label="charset"
          value={charset}
          options={["UTF-8", "EUC-KR"]}
          onChange={(e) => setCharset(e.target.value)}
        />
        <FieldSelect
          label="접속"
          value={access}
          options={["VPN", "VDI", "REMOTE", "MAIL"]}
          onChange={(e) => setAccess(e.target.value)}
        />
        <FieldSelect
          label="반영"
          value={deploy}
          options={["원격", "FTP", "메일"]}
          onChange={(e) => setDeploy(e.target.value)}
        />
        <FieldSelect
          label="유지보수 담당"
          value={maintainer}
          options={ASSIGNEES.map((a) => a.name)}
          onChange={(e) => setMaintainer(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8, paddingBottom: 4 }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={ye}
              onChange={(e) => setYe(e.target.checked)}
              style={{ accentColor: "var(--accent-500)" }}
            />
            연말정산 사용
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={wh}
              onChange={(e) => setWh(e.target.checked)}
              style={{ accentColor: "var(--accent-500)" }}
            />
            원천세 사용
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default function CompaniesPage() {
  const [companies, setCompanies] = React.useState<Company[]>(COMPANIES);
  const [showTerminated, setShowTerminated] = React.useState(true);
  const [addOpen, setAddOpen] = React.useState(false);
  const [terminateTarget, setTerminateTarget] = React.useState<Company | null>(null);

  const visible = showTerminated
    ? companies
    : companies.filter((c) => !c.terminatedAtRound);

  const terminatedCount = companies.filter((c) => c.terminatedAtRound).length;

  const handleAdd = (data: { name: string; ver: string; charset: string; access: string; deploy: string; ye: boolean; wh: boolean; maintainer: string }) => {
    setCompanies((prev) => {
      const nextId = prev.reduce((m, c) => Math.max(m, c.id), 0) + 1;
      const newCo: Company = {
        id: nextId,
        ...data,
        status: "NOT_STARTED",
        scheduled: "",
        applied: "",
        issue: "",
      };
      return [...prev, newCo];
    });
  };

  const handleTerminate = (id: number, round: string) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, terminatedAtRound: round } : c)));
  };

  const handleRestore = (id: number) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const { terminatedAtRound, ...rest } = c;
        void terminatedAtRound;
        return rest;
      })
    );
  };

  return (
    <div style={{ maxWidth: 1500, margin: "0 auto" }}>
      <PageHeader
        title="고객사 마스터"
        subtitle="환경정보 · 연락처 · 계약 정보 관리. 서비스 종료 처리는 여기에서 단일 관리됩니다."
        actions={
          <>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-secondary)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showTerminated}
                onChange={(e) => setShowTerminated(e.target.checked)}
                style={{ accentColor: "var(--accent-500)" }}
              />
              종료 회사 표시
              {terminatedCount > 0 && (
                <span style={{ color: "var(--text-tertiary)" }}>· {terminatedCount}</span>
              )}
            </label>
            <Btn variant="primary" size="md" icon="plus" onClick={() => setAddOpen(true)}>
              고객사 추가
            </Btn>
          </>
        }
      />
      <Card padding={0}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-surface-2)" }}>
                {["ID", "회사명", "버전", "charset", "접속", "반영", "연말정산", "원천세", "유지보수 담당", ""].map((h, i) => (
                  <th
                    key={`${h}-${i}`}
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
              {visible.map((c) => {
                const u =
                  ASSIGNEES.find((a) => a.name === c.maintainer) ||
                  { initial: c.maintainer?.[0], name: c.maintainer };
                const terminated = !!c.terminatedAtRound;
                return (
                  <tr
                    key={c.id}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    style={{ cursor: "default", opacity: terminated ? 0.55 : 1 }}
                  >
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      <span style={{ color: "var(--text-tertiary)" }}>CO-{String(c.id).padStart(4, "0")}</span>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", fontWeight: 600 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ textDecoration: terminated ? "line-through" : "none" }}>{c.name}</span>
                        {terminated && c.terminatedAtRound && <TerminationBadge round={c.terminatedAtRound} />}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      {c.ver}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }} className="mono">
                      <span style={{ color: "var(--text-tertiary)" }}>{c.charset}</span>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <Badge variant="soft">{c.access}</Badge>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <Badge variant="soft">{c.deploy}</Badge>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      {c.ye ? (
                        <span style={{ color: "var(--success-fg)", fontWeight: 600 }}>✓ 사용</span>
                      ) : (
                        <span style={{ color: "var(--text-tertiary)" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      {c.wh ? (
                        <span style={{ color: "var(--success-fg)", fontWeight: 600 }}>✓ 사용</span>
                      ) : (
                        <span style={{ color: "var(--text-tertiary)" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Avatar user={u} size={20} />
                        {c.maintainer}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", textAlign: "right" }}>
                      {terminated ? (
                        <Btn variant="ghost" size="sm" onClick={() => handleRestore(c.id)}>
                          종료 해제
                        </Btn>
                      ) : (
                        <Btn variant="ghost" size="sm" onClick={() => setTerminateTarget(c)}>
                          서비스 종료
                        </Btn>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <AddCompanyModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      <TerminateModal
        open={!!terminateTarget}
        company={terminateTarget}
        onClose={() => setTerminateTarget(null)}
        onConfirm={(round) => {
          if (terminateTarget) handleTerminate(terminateTarget.id, round);
        }}
      />
    </div>
  );
}
