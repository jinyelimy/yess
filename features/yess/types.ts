export type UserRole =
  | "ADMIN"
  | "TF_LEAD"
  | "TF_MEMBER"
  | "MAINTAINER"
  | "VIEWER";

export type YearPhase = "PREPARE" | "ACTIVE" | "CLOSED";
export type ApplyStatus =
  | "NOT_STARTED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "APPLIED"
  | "FAILED"
  | "HOLD"
  | "NOT_REQUIRED";
export type PatchRoundStatus = "DRAFT" | "RELEASED" | "IN_PROGRESS" | "CLOSED";
export type PatchType = "YEAR_END" | "WITHHOLDING" | "SEPARATE" | "GUIDE";
export type PatchCategory = "SOURCE" | "DB" | "RD" | "CONFIG" | "GUIDE";
export type VersionScope = "V4" | "V5" | "BOTH";
export type ArtifactType = "FILE_PATH" | "SQL" | "URL" | "NOTE";
export type WorkItemType =
  | "PATCH"
  | "FOLLOW_UP"
  | "CUSTOMER_SUPPORT"
  | "TEST"
  | "MEETING"
  | "GENERAL";
export type WorkItemStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "REVIEW"
  | "DONE";
export type Priority = "P0" | "P1" | "P2" | "P3";
export type LogType = "PATCH" | "FOLLOW_UP" | "GENERAL" | "MEETING" | "SUPPORT";
export type PersonalEventType =
  | "ANNUAL"
  | "HALF_AM"
  | "HALF_PM"
  | "BUSINESS_TRIP"
  | "MEETING"
  | "OTHER";

export interface YearContext {
  id: string;
  taxYear: number;
  name: string;
  phase: YearPhase;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleCode: string;
  initials: string;
  team: string;
  accent: string;
  permissions: string[];
}

export interface Company {
  id: string;
  name: string;
  segment: string;
  city: string;
}

export interface CompanyYearProfile {
  id: string;
  companyId: string;
  yearContextId: string;
  version: string;
  charset: string;
  contractType: string;
  accessMethod: string;
  deployMethod: string;
  usesYearEndSettlement: boolean;
  usesWithholdingTax: boolean;
  specialNotes: string;
  primaryMaintainerId: string;
}

export interface PatchRound {
  id: string;
  roundCode: string;
  label: string;
  patchType: PatchType;
  status: PatchRoundStatus;
  releaseDate: string;
  dueDate: string;
  progress: number;
}

export interface PatchItem {
  id: string;
  patchRoundId: string;
  patchNo: string;
  title: string;
  category: PatchCategory;
  versionScope: VersionScope;
  releaseDate: string;
  dueDate: string;
  contents: string;
  specialNotes: string;
  memo: string;
}

export interface PatchArtifact {
  id: string;
  patchItemId: string;
  artifactType: ArtifactType;
  versionScope: VersionScope;
  label: string;
  content: string;
}

export interface PatchTarget {
  id: string;
  patchRoundId: string;
  companyYearProfileId: string;
  maintainerId: string;
  applyStatus: ApplyStatus;
  scheduledDate: string;
  appliedAt?: string;
  issueSummary?: string;
  specialNote?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface WorkItem {
  id: string;
  yearContextId: string;
  type: WorkItemType;
  status: WorkItemStatus;
  priority: Priority;
  title: string;
  assigneeId: string;
  companyId?: string;
  patchRoundId?: string;
  patchItemId?: string;
  dueDate: string;
  resultNote?: string;
}

export interface WorkLog {
  id: string;
  workItemId?: string;
  userId: string;
  logType: LogType;
  workDate: string;
  content: string;
  issueNote?: string;
  nextAction?: string;
  spentMinutes: number;
  patchRoundId?: string;
  patchItemId?: string;
  companyId?: string;
}

export interface PersonalEvent {
  id: string;
  userId: string;
  eventType: PersonalEventType;
  title: string;
  startDate: string;
  endDate: string;
}

export interface ImportRun {
  id: string;
  source: string;
  status: "QUEUED" | "VALIDATING" | "READY" | "APPLIED";
  totalRows: number;
  validRows: number;
  createdAt: string;
}

