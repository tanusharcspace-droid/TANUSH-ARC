export type UserRole = 'hod' | 'reviewer' | 'author' | 'auditor' | 'instructor' | 'dcc_reviewer' | 'bos_chair';

export type SpecStatus = 'draft' | 'under_review' | 'approved' | 'revision_requested';

export interface POItem {
  code: string;
  title: string;
  statement: string;
  category: string;
}

export interface PSOItem {
  code: string;
  title: string;
  statement: string;
  category: string;
}

export interface BloomsItem {
  code: string;
  name: string;
  description: string;
  actionVerbs: string[];
  color: string;
}

export interface AnnexureAConfig {
  annexure: string;
  version: string;
  programOutcomes: POItem[];
  programSpecificOutcomes: PSOItem[];
  bloomsLevels: BloomsItem[];
}

export interface CLOItem {
  id: string;
  code: string;
  statement: string;
  bloomsLevel: string; // e.g. "L3", "L4", "L5"
  poMappings: Record<string, number>; // 0, 1, 2, 3
  psoMappings: Record<string, number>; // 0, 1, 2, 3
  assessmentMethods: string[];
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  unitRoman: string; // "UNIT I", "UNIT II", etc.
  title: string;
  lectureHours: number;
  bloomsTier: string;
  content: string;
  reviewNotesCount?: number;
}

export interface LabExperiment {
  id: number;
  title: string;
}

export interface ReviewComment {
  id: string;
  author: string;
  role: string;
  timeAgo: string;
  comment: string;
  anchor: string;
  resolved: boolean;
  resolvedViaAI?: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  rationale: string;
  verificationHash?: string;
}

export interface AIDiffEntry {
  cloCode: string;
  originalDraft: string;
  suggestedRevision: string;
  bloomsShift: { from: string; to: string };
  alignmentRationale: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CourseSpecification {
  id: string;
  code: string;
  title: string;
  academicYear: string;
  regulation: string;
  semester: string;
  department: string;
  program: string;
  category: string;
  credits: {
    lecture: number;
    tutorial: number;
    practical: number;
    total: number;
    contactHours?: number;
  };
  status: SpecStatus;
  faculty: {
    name: string;
    designation: string;
    empId: string;
    email: string;
  };
  prerequisites: string | string[];
  courseOverview?: string;
  assessmentStrategy?: string;
  courseObjectives: string[];
  units: SyllabusUnit[];
  modules: any[];
  labSchedule: LabExperiment[];
  comments: ReviewComment[];
  clos: CLOItem[];
  evaluationScheme?: any;
  auditTrail: AuditEntry[];
  aiDiffs: AIDiffEntry[];
  governanceQuorum: {
    hodSigned: boolean;
    reviewerEndorsed: boolean;
    dccSigned?: boolean;
    bosSigned?: boolean;
    deanApproved?: boolean;
    verificationTimestamp?: string;
    checksum: string;
    digitalSignature?: string;
    consensusSignature?: string;
  };
  synthesisFiles: {
    specDoc: { name: string; size: string; type: string };
    blueprintDoc: { name: string; size: string; questionsCount: number; bloomsRange: string };
  };
}

export interface LLMSettings {
  provider: 'gemini' | 'openai' | 'anthropic';
  apiKey: string;
  model: string;
  temperature: number;
  systemInstruction?: string;
}

export type ThemeMode = 'cyber' | 'academic';
