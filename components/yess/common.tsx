"use client";

// ── YESS Common Components (Miro-inspired light theme) ──
// 디자인 익스포트(_design_input/components.jsx)를 1:1 포팅. 인라인 스타일 + tokens.css 변수.

import * as React from "react";
import {
  STATUS_META,
  PRIORITY_META,
  TAG_META,
  type StatusKey,
  type PriorityKey,
  type User,
} from "@/lib/yess/data";

/* ─────────────────────────────────────────────
   Icon — minimal stroke icons
   ───────────────────────────────────────────── */
export const ICONS: Record<string, string> = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  patch:     "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 3v9l6 3",
  rounds:    "M4 6h16M4 12h16M4 18h16",
  kanban:    "M3 3h5v18H3zM10 3h5v12h-5zM17 3h4v8h-4z",
  daily:     "M3 4h18v17H3zM3 10h18M8 2v4M16 2v4",
  followup:  "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10",
  company:   "M3 21V7l9-4 9 4v14M9 21V12h6v9",
  report:    "M3 3v18h18M7 14l4-4 4 4 5-6",
  search:    "M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M21 21l-4.3-4.3",
  plus:      "M12 5v14M5 12h14",
  check:     "M5 13l4 4L19 7",
  alert:     "M12 9v4M12 17h0M10.3 3.86a2 2 0 0 1 3.4 0l8.6 14.86A2 2 0 0 1 20.6 22H3.4a2 2 0 0 1-1.7-3.28z",
  user:      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 11h-6M19 8v6",
  calendar:  "M3 4h18v17H3zM3 10h18M8 2v4M16 2v4",
  clock:     "M12 7v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20",
  filter:    "M22 3H2l8 9.46V19l4 2v-8.54z",
  more:      "M12 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2M19 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2M5 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2",
  chevR:     "M9 6l6 6-6 6",
  chevL:     "M15 6l-6 6 6 6",
  chevD:     "M6 9l6 6 6-6",
  chevU:     "M6 15l6-6 6 6",
  close:     "M18 6L6 18M6 6l12 12",
  download:  "M12 3v12M7 10l5 5 5-5M3 21h18",
  refresh:   "M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4",
  settings:  "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  bell:      "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  drag:      "M9 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2M9 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2M9 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2M15 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2M15 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2M15 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2",
  link:      "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  trash:     "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z",
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z",
};

export const Icon: React.FC<{
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
} & React.SVGAttributes<SVGSVGElement>> = ({
  name,
  size = 16,
  color = "currentColor",
  strokeWidth = 1.6,
  ...rest
}) => {
  const d = ICONS[name];
  if (!d) return <span style={{ width: size, height: size, display: "inline-block" }} />;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
};

/* ─────────────────────────────────────────────
   Avatar — illustrated avatar variants per user
   ───────────────────────────────────────────── */
export type AvatarIllust =
  | "irid"
  | "rose"
  | "sage"
  | "amber"
  | "lilac"
  | "mint"
  | "peach"
  | "ocean"
  | "ivory"
  | "cocoa";

type IllustParams = {
  bgFrom: string;
  bgTo: string;
  body: string;       // 어깨/옷 색
  hair: string;       // 머리 색
  skin: string;       // 피부 톤
  hairStyle: 1 | 2 | 3; // 1: 짧은 곱슬, 2: 사이드 가르마, 3: 긴 머리(양 옆 흘러내림)
  mouth: "smile" | "neutral" | "open";
  glasses: boolean;
  blush: boolean;
};

const ILLUST_VARIANTS: Record<AvatarIllust, IllustParams> = {
  irid:  { bgFrom: "var(--pastel-teal)",   bgTo: "var(--accent-100)",     body: "var(--accent-700)", hair: "#2b1f17", skin: "#f0c9a8", hairStyle: 1, mouth: "smile",   glasses: true,  blush: true  },
  rose:  { bgFrom: "#fbe1ea",              bgTo: "var(--pastel-yellow)",  body: "#b8377a",           hair: "#3b2410", skin: "#f5d5b5", hairStyle: 3, mouth: "smile",   glasses: false, blush: true  },
  sage:  { bgFrom: "var(--pastel-yellow)", bgTo: "var(--pastel-teal)",    body: "#187574",           hair: "#1a1a1a", skin: "#e3b899", hairStyle: 2, mouth: "neutral", glasses: false, blush: false },
  amber: { bgFrom: "#fde4c5",              bgTo: "#f8d4a3",               body: "#d97706",           hair: "#5a3a2a", skin: "#f5d5b5", hairStyle: 3, mouth: "smile",   glasses: false, blush: true  },
  lilac: { bgFrom: "var(--pastel-violet)", bgTo: "var(--pastel-blue)",    body: "#7a4fd0",           hair: "#1f1209", skin: "#efc8a3", hairStyle: 3, mouth: "open",    glasses: true,  blush: true  },
  mint:  { bgFrom: "#d6f0e1",              bgTo: "var(--pastel-yellow)",  body: "#1f5a2d",           hair: "#0d0d0d", skin: "#f5d5b5", hairStyle: 2, mouth: "neutral", glasses: false, blush: false },
  peach: { bgFrom: "var(--pastel-coral)",  bgTo: "#fde4c5",               body: "#c2348a",           hair: "#3a1810", skin: "#f7d7b5", hairStyle: 1, mouth: "neutral", glasses: false, blush: false },
  ocean: { bgFrom: "var(--pastel-blue)",   bgTo: "var(--pastel-teal)",    body: "#5b76fe",           hair: "#1a1a1a", skin: "#e8c19c", hairStyle: 3, mouth: "smile",   glasses: true,  blush: true  },
  ivory: { bgFrom: "#fff3e0",              bgTo: "var(--pastel-coral)",   body: "#a06016",           hair: "#3b1f0c", skin: "#f0c9a8", hairStyle: 3, mouth: "smile",   glasses: false, blush: true  },
  cocoa: { bgFrom: "#e6d8c5",              bgTo: "#f8d4a3",               body: "#5a3a2a",           hair: "#1a0a05", skin: "#d4a585", hairStyle: 1, mouth: "neutral", glasses: false, blush: false },
};

const IllustAvatar: React.FC<{ size?: number; variant: AvatarIllust }> = ({ size = 28, variant }) => {
  const v = ILLUST_VARIANTS[variant] ?? ILLUST_VARIANTS.irid;
  const id = `irid-${variant}`;

  // hairStyle: 1 = 짧은 곱슬 / 2 = 사이드 가르마 / 3 = 긴 생머리 양 갈래
  const hairPath =
    v.hairStyle === 1
      ? "M19 26 C 19 16, 28 13, 33 13 C 41 13, 46 19, 46 26 C 46 23, 42 21, 39 22 C 37 18, 30 18, 27 22 C 24 22, 20 23, 19 26 Z"
      : v.hairStyle === 2
      ? "M19 27 C 19 16, 27 12, 33 12 C 42 12, 47 19, 47 28 C 44 24, 38 22, 34 23 C 33 19, 28 19, 25 22 C 22 22, 20 24, 19 27 Z"
      : "M17 36 C 17 32, 17 24, 19 20 C 22 14, 28 11, 33 11 C 42 11, 47 18, 47 28 C 47 34, 47 38, 47 42 C 45 36, 44 32, 43 28 C 42 23, 38 21, 34 22 C 31 19, 27 19, 25 22 C 22 22, 20 25, 20 28 C 20 34, 19 38, 17 42 Z";

  const earsVisible = v.hairStyle !== 3;

  const mouthEl =
    v.mouth === "smile" ? (
      <path d="M29 38 Q 32 40.4, 35 38" stroke="#5a3a2a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    ) : v.mouth === "open" ? (
      <ellipse cx="32" cy="38.6" rx="2" ry="1.4" fill="#5a3a2a" />
    ) : (
      <line x1="30" y1="38.7" x2="34" y2="38.7" stroke="#5a3a2a" strokeWidth="1.2" strokeLinecap="round" />
    );

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={{ display: "block", borderRadius: "50%" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={v.bgFrom} />
          <stop offset="100%" stopColor={v.bgTo} />
        </linearGradient>
        <clipPath id={`${id}-clip`}><circle cx="32" cy="32" r="32" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="64" height="64" fill={`url(#${id}-bg)`} />
        {/* 어깨/옷 */}
        <path d="M6 64 C 12 50, 22 46, 32 46 C 42 46, 52 50, 58 64 Z" fill={v.body} />
        {/* 칼라 포인트 */}
        <path d="M28 46 L32 52 L36 46 Z" fill="#ffffff" opacity="0.85" />
        {/* 목 */}
        <rect x="29" y="40" width="6" height="6" fill={v.skin} />
        {/* 얼굴 */}
        <ellipse cx="32" cy="30" rx="13" ry="14.5" fill={v.skin} />
        {/* 헤어 */}
        <path d={hairPath} fill={v.hair} />
        {/* 귀 (긴머리에선 가려짐) */}
        {earsVisible && <ellipse cx="19.5" cy="31" rx="1.5" ry="2.4" fill={v.skin} />}
        {earsVisible && <ellipse cx="44.5" cy="31" rx="1.5" ry="2.4" fill={v.skin} />}
        {/* 안경 또는 눈 외곽 */}
        {v.glasses ? (
          <g fill="none" stroke="var(--accent-600)" strokeWidth="1.3" strokeLinecap="round">
            <circle cx="26" cy="30.5" r="3.6" fill="#ffffff" fillOpacity="0.55" />
            <circle cx="38" cy="30.5" r="3.6" fill="#ffffff" fillOpacity="0.55" />
            <line x1="29.6" y1="30.5" x2="34.4" y2="30.5" />
            <line x1="22.4" y1="30.5" x2="20" y2="30" />
            <line x1="41.6" y1="30.5" x2="44" y2="30" />
          </g>
        ) : null}
        {/* 눈동자 */}
        <circle cx="26" cy="30.7" r="0.95" fill="#1c1c1e" />
        <circle cx="38" cy="30.7" r="0.95" fill="#1c1c1e" />
        {/* 눈썹 */}
        <path d="M22.5 26.5 L29 26" stroke={v.hair} strokeWidth="1.1" strokeLinecap="round" fill="none" />
        <path d="M35 26 L41.5 26.5" stroke={v.hair} strokeWidth="1.1" strokeLinecap="round" fill="none" />
        {/* 볼터치 */}
        {v.blush && <circle cx="22.5" cy="35" r="1.6" fill="var(--pastel-coral)" opacity="0.55" />}
        {v.blush && <circle cx="41.5" cy="35" r="1.6" fill="var(--pastel-coral)" opacity="0.55" />}
        {/* 입 */}
        {mouthEl}
      </g>
    </svg>
  );
};

export type AvatarUser = Partial<User> & {
  name?: string;
  initial?: string;
  color?: string;
  illustration?: AvatarIllust;
};

export const Avatar: React.FC<{ user: AvatarUser; size?: number; ring?: boolean }> = ({
  user,
  size = 28,
  ring = false,
}) => {
  const color = user?.color || "var(--text-secondary)";
  if (user?.illustration) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          flexShrink: 0,
          overflow: "hidden",
          boxShadow: ring
            ? "0 0 0 2px var(--bg-canvas), 0 0 0 3px " + color
            : "inset 0 0 0 1px rgba(20,22,30,0.08)",
        }}
        title={user?.name}
      >
        <IllustAvatar size={size} variant={user.illustration} />
      </div>
    );
  }
  const initial = user?.initial || (user?.name ? user.name[0] : "?");
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        background: "var(--bg-sunken)",
        color,
        fontSize: Math.round(size * 0.42),
        fontWeight: 700,
        fontFamily: "var(--font-display)",
        boxShadow: ring
          ? "0 0 0 2px var(--bg-canvas), 0 0 0 3px " + color
          : "inset 0 0 0 1px rgba(20,22,30,0.06)",
        userSelect: "none",
      }}
      title={user?.name}
    >
      {initial}
    </div>
  );
};

export const AvatarStack: React.FC<{ users: AvatarUser[]; size?: number; max?: number }> = ({
  users,
  size = 22,
  max = 3,
}) => {
  const visible = users.slice(0, max);
  const extra = users.length - visible.length;
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {visible.map((u, i) => (
        <span
          key={u.id || u.name || i}
          style={{ marginLeft: i === 0 ? 0 : -6, position: "relative", zIndex: visible.length - i }}
        >
          <Avatar user={u} size={size} ring />
        </span>
      ))}
      {extra > 0 && (
        <span
          style={{
            marginLeft: -6,
            width: size,
            height: size,
            borderRadius: "50%",
            background: "var(--bg-sunken)",
            color: "var(--text-secondary)",
            display: "grid",
            placeItems: "center",
            fontSize: Math.round(size * 0.4),
            fontWeight: 700,
            boxShadow: "0 0 0 2px var(--bg-canvas)",
          }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Badge / StatusBadge / PriorityDot / Tag
   ───────────────────────────────────────────── */
type BadgeVariant = "soft" | "outline" | "solid" | "ghost";
export const Badge: React.FC<
  React.PropsWithChildren<{ variant?: BadgeVariant; tone?: string; style?: React.CSSProperties }>
> = ({ children, variant = "soft", style, ...rest }) => {
  const palettes: Record<BadgeVariant, { bg: string; fg: string; border: string }> = {
    soft:    { bg: "var(--bg-sunken)",     fg: "var(--text-secondary)", border: "transparent" },
    outline: { bg: "transparent",          fg: "var(--text-secondary)", border: "var(--border-default)" },
    solid:   { bg: "var(--accent-500)",    fg: "var(--text-on-blue)",   border: "transparent" },
    ghost:   { bg: "transparent",          fg: "var(--text-tertiary)",  border: "transparent" },
  };
  const p = palettes[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        fontSize: 11,
        lineHeight: 1.5,
        fontWeight: 600,
        letterSpacing: "0.02em",
        borderRadius: "var(--r-sm)",
        background: p.bg,
        color: p.fg,
        border: `1px solid ${p.border}`,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: StatusKey; withCaret?: boolean }> = ({
  status,
  withCaret = false,
}) => {
  const m = STATUS_META[status];
  if (!m) return <Badge>{status}</Badge>;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 8px 2px 7px",
        fontSize: 11,
        lineHeight: 1.5,
        fontWeight: 600,
        letterSpacing: "0.02em",
        borderRadius: "var(--r-sm)",
        background: `var(--status-${m.cls}-bg)`,
        color: `var(--status-${m.cls}-fg)`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: `var(--status-${m.cls}-dot)` }}></span>
      {m.label}
      {withCaret && <Icon name="chevD" size={10} strokeWidth={2} />}
    </span>
  );
};

export const PriorityDot: React.FC<{ priority: PriorityKey; withLabel?: boolean }> = ({
  priority,
  withLabel = false,
}) => {
  const m = PRIORITY_META[priority];
  if (!m) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }}></span>
      {withLabel && (
        <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)" }}>
          {m.label}
        </span>
      )}
    </span>
  );
};

export const Tag: React.FC<React.PropsWithChildren<{ kind?: string }>> = ({ kind, children }) => {
  const m = kind ? TAG_META[kind] : undefined;
  const cls = m?.cls || "general";
  const label = children ?? m?.label ?? kind;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "1px 6px",
        fontSize: 9.5,
        lineHeight: 1.5,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        borderRadius: 3,
        background: `var(--tag-${cls}-bg)`,
        color: `var(--tag-${cls}-fg)`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Btn / IconBtn
   ───────────────────────────────────────────── */
type BtnVariant = "primary" | "secondary" | "ghost" | "soft" | "danger";
type BtnSize = "sm" | "md" | "lg";

export const Btn: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: BtnVariant;
    size?: BtnSize;
    icon?: string;
    iconRight?: string;
  }
> = ({
  variant = "secondary",
  size = "md",
  icon,
  iconRight,
  children,
  style,
  type,
  disabled,
  ...rest
}) => {
  const sizes: Record<BtnSize, { h: number; px: number; fs: number; gap: number; iconSize: number }> = {
    sm: { h: 28, px: 10, fs: 12.5, gap: 6, iconSize: 13 },
    md: { h: 36, px: 14, fs: 13.5, gap: 8, iconSize: 15 },
    lg: { h: 44, px: 18, fs: 15,   gap: 8, iconSize: 17 },
  };
  const s = sizes[size];
  const variants: Record<BtnVariant, { bg: string; fg: string; border: string; hoverBg: string; activeBg: string }> = {
    primary:   { bg: "var(--accent-500)",  fg: "var(--text-on-blue)",   border: "transparent",          hoverBg: "var(--accent-600)", activeBg: "var(--accent-700)" },
    secondary: { bg: "var(--bg-canvas)",   fg: "var(--text-primary)",   border: "var(--border-default)", hoverBg: "var(--bg-hover)",  activeBg: "var(--bg-active)" },
    ghost:     { bg: "transparent",        fg: "var(--text-secondary)", border: "transparent",          hoverBg: "var(--bg-hover)",  activeBg: "var(--bg-active)" },
    soft:      { bg: "var(--accent-50)",   fg: "var(--accent-700)",     border: "transparent",          hoverBg: "var(--accent-100)", activeBg: "var(--accent-200)" },
    danger:    { bg: "var(--pastel-coral)",fg: "var(--pastel-coral-d)", border: "transparent",          hoverBg: "#ffb5b5",          activeBg: "#ff9999" },
  };
  const v = variants[variant];
  return (
    <button
      type={type || "button"}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.fs,
        fontWeight: 600,
        fontFamily: "var(--font-display)",
        letterSpacing: 0.01,
        background: v.bg,
        color: v.fg,
        border: `1px solid ${v.border}`,
        borderRadius: "var(--r-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        whiteSpace: "nowrap",
        transition: "background 0.12s, color 0.12s, border-color 0.12s, box-shadow 0.12s",
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = v.hoverBg; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = v.bg; }}
      onMouseDown={(e)  => { if (!disabled) e.currentTarget.style.background = v.activeBg; }}
      onMouseUp={(e)    => { if (!disabled) e.currentTarget.style.background = v.hoverBg; }}
      {...rest}
    >
      {icon && <Icon name={icon} size={s.iconSize} strokeWidth={1.8} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.iconSize} strokeWidth={1.8} />}
    </button>
  );
};

export const IconBtn: React.FC<{
  icon: string;
  size?: BtnSize;
  variant?: "ghost" | "secondary";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  style?: React.CSSProperties;
}> = ({ icon, size = "md", variant = "ghost", onClick, title, style }) => {
  const sizes: Record<BtnSize, number> = { sm: 28, md: 32, lg: 36 };
  const dim = sizes[size];
  const variants = {
    ghost:     { bg: "transparent",      fg: "var(--text-secondary)", border: "transparent",           hoverBg: "var(--bg-hover)" },
    secondary: { bg: "var(--bg-canvas)", fg: "var(--text-primary)",   border: "var(--border-default)", hoverBg: "var(--bg-hover)" },
  } as const;
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{
        width: dim,
        height: dim,
        display: "grid",
        placeItems: "center",
        background: v.bg,
        color: v.fg,
        border: `1px solid ${v.border}`,
        borderRadius: "var(--r-md)",
        cursor: "pointer",
        transition: "background 0.12s",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = v.hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = v.bg)}
    >
      <Icon name={icon} size={Math.round(dim * 0.5)} strokeWidth={1.8} />
    </button>
  );
};

/* ─────────────────────────────────────────────
   Card / FilterChip / Field*
   ───────────────────────────────────────────── */
export const Card: React.FC<
  React.PropsWithChildren<{ style?: React.CSSProperties; padding?: number }>
> = ({ children, style, padding = 0, ...rest }) => (
  <div
    style={{
      background: "var(--bg-surface)",
      borderRadius: "var(--r-lg)",
      boxShadow: "var(--shadow-ring)",
      padding,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const FilterChip: React.FC<
  React.PropsWithChildren<{
    active?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    count?: number;
    icon?: string;
    style?: React.CSSProperties;
  }>
> = ({ active, onClick, children, count, icon, style }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 10px",
      height: 30,
      fontSize: 12.5,
      fontWeight: 500,
      background: active ? "var(--accent-50)" : "var(--bg-canvas)",
      color: active ? "var(--accent-700)" : "var(--text-primary)",
      border: `1px solid ${active ? "var(--accent-300)" : "var(--border-default)"}`,
      borderRadius: "var(--r-md)",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background 0.12s, border-color 0.12s",
      ...style,
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-hover)"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-canvas)"; }}
  >
    {icon && <Icon name={icon} size={12} />}
    <span>{children}</span>
    {count != null && (
      <span
        className="mono tnum"
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: "1px 6px",
          borderRadius: 999,
          background: active ? "var(--accent-100)" : "var(--bg-sunken)",
          color: active ? "var(--accent-700)" : "var(--text-tertiary)",
        }}
      >
        {count}
      </span>
    )}
  </button>
);

export const FieldLabel: React.FC<React.PropsWithChildren<{ required?: boolean }>> = ({ children, required }) => (
  <div className="t-overline" style={{ marginBottom: 6, color: "var(--text-tertiary)" }}>
    {children}
    {required && <span style={{ color: "var(--danger)", marginLeft: 4 }}>*</span>}
  </div>
);

const fieldInputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: 36,
  padding: "0 12px",
  fontSize: 13.5,
  fontFamily: "inherit",
  color: "var(--text-primary)",
  background: "var(--bg-canvas)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--r-md)",
  outline: "none",
  transition: "border-color 0.12s, box-shadow 0.12s",
};

export const FieldInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean; mono?: boolean }
> = ({ label, required, mono, style, ...rest }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {label && <FieldLabel required={required}>{label}</FieldLabel>}
    <input
      className={mono ? "mono" : ""}
      style={{ ...fieldInputStyle, ...style }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-500)";
        e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-50)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.boxShadow = "none";
      }}
      {...rest}
    />
  </div>
);

export const FieldTextarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; required?: boolean }
> = ({ label, required, style, ...rest }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {label && <FieldLabel required={required}>{label}</FieldLabel>}
    <textarea
      style={{
        ...fieldInputStyle,
        height: "auto",
        minHeight: 80,
        padding: "10px 12px",
        resize: "vertical",
        fontFamily: "inherit",
        lineHeight: 1.5,
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-500)";
        e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-50)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.boxShadow = "none";
      }}
      {...rest}
    />
  </div>
);

export const FieldSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    required?: boolean;
    options?: Array<string | { value: string; label: string }>;
  }
> = ({ label, required, options = [], value, onChange, style, ...rest }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {label && <FieldLabel required={required}>{label}</FieldLabel>}
    <select
      value={value}
      onChange={onChange}
      style={{
        ...fieldInputStyle,
        appearance: "none",
        WebkitAppearance: "none",
        paddingRight: 32,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237a8194' stroke-width='1.8' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        backgroundSize: "14px",
        ...style,
      }}
      {...rest}
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  </div>
);

/* ─────────────────────────────────────────────
   Mascot / PageHeader / SectionHeader / EmptyState
   ───────────────────────────────────────────── */
export const Mascot: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <svg viewBox="0 0 120 120" width={size} height={size} style={{ display: "block" }} aria-hidden="true">
    <defs>
      <radialGradient id="ma-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--accent-200)" stopOpacity="0.55" />
        <stop offset="100%" stopColor="var(--accent-200)" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="60" cy="60" r="56" fill="url(#ma-glow)" />
    <rect x="28" y="34" width="64" height="66" rx="32" fill="var(--accent-500)" />
    <rect x="28" y="34" width="64" height="36" rx="18" fill="var(--accent-400)" />
    <line x1="60" y1="22" x2="60" y2="34" stroke="var(--accent-700)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="20" r="4" fill="var(--pastel-yellow)" stroke="var(--accent-700)" strokeWidth="2" />
    <rect x="38" y="44" width="44" height="22" rx="11" fill="#ffffff" />
    <circle cx="50" cy="55" r="3.2" fill="var(--text-primary)" />
    <circle cx="70" cy="55" r="3.2" fill="var(--text-primary)" />
    <circle cx="51" cy="54" r="1" fill="#ffffff" />
    <circle cx="71" cy="54" r="1" fill="#ffffff" />
    <path d="M52 60 Q60 64 68 60" stroke="var(--text-primary)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <circle cx="44" cy="62" r="2.5" fill="var(--pastel-coral)" opacity="0.7" />
    <circle cx="76" cy="62" r="2.5" fill="var(--pastel-coral)" opacity="0.7" />
    <circle cx="60" cy="86" r="3.5" fill="var(--accent-700)" />
  </svg>
);

export const PageHeader: React.FC<{
  overline?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ overline, title, subtitle, actions, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
      marginBottom: 20,
      ...style,
    }}
  >
    <div style={{ minWidth: 0 }}>
      {overline && <div className="t-overline" style={{ marginBottom: 8 }}>{overline}</div>}
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <div style={{ marginTop: 6, fontSize: 13.5, color: "var(--text-secondary)" }}>{subtitle}</div>
      )}
    </div>
    {actions && <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{actions}</div>}
  </div>
);

export const SectionHeader: React.FC<{
  overline?: React.ReactNode;
  title?: React.ReactNode;
  right?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ overline, title, right, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 14,
      ...style,
    }}
  >
    <div>
      {overline && <div className="t-overline" style={{ marginBottom: 4 }}>{overline}</div>}
      {title && (
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em" }}>
          {title}
        </div>
      )}
    </div>
    {right && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{right}</div>}
  </div>
);

export const EmptyState: React.FC<{
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, sub, action }) => (
  <div
    style={{
      padding: "48px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      textAlign: "center",
    }}
  >
    <Mascot size={120} />
    <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700 }}>{title}</div>
    {sub && <div style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 360, lineHeight: 1.55 }}>{sub}</div>}
    {action}
  </div>
);
