import { CourseSpecification, LLMSettings, UserRole } from './types';

const SETTINGS_KEY = 'specforge_llm_settings';
const COURSE_SPEC_KEY = 'specforge_active_course_spec_v2';

export const DEFAULT_SETTINGS: LLMSettings = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-1.5-flash',
  temperature: 0.2,
  systemInstruction: 'You are an institutional academic accreditation auditor and curriculum engineer specializing in Washington Accord, NBA Tier-1, and ABET outcome-based education standards.'
};

/**
 * Load AI LLM configuration settings from client localStorage.
 * Guaranteed never to leak into codebase, server, or env files.
 */
export function loadSettings(): LLMSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save AI LLM configuration settings securely to client localStorage.
 */
export function saveSettings(settings: LLMSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Generates exact headers required for AI requests:
 * x-llm-provider, x-llm-key, x-llm-model
 */
export function getAIHeaders(): Record<string, string> {
  const settings = loadSettings();
  return {
    'x-llm-provider': settings.provider,
    'x-llm-key': settings.apiKey || '',
    'x-llm-model': settings.model,
  };
}

/**
 * Canonical Initial Specification Data for SpecForge:
 * Clean, unseeded specification without demo data.
 */
export const INITIAL_SPEC: CourseSpecification = {
  input_id: 'SAMPLE',
  id: '',
  code: '',
  title: '',
  academicYear: '',
  regulation: '',
  semester: '',
  department: '',
  program: '',
  category: '',
  courseOverview: '',
  credits: {
    lecture: 0,
    tutorial: 0,
    practical: 0,
    total: 0,
    contactHours: 0
  },
  status: 'draft',
  faculty: {
    name: '',
    designation: '',
    empId: '',
    email: ''
  },
  prerequisites: '',
  assessmentStrategy: '',
  evaluationScheme: {
    continuousAssessment: 0,
    midTermExamination: 0,
    endSemesterExamination: 0
  },
  modules: [],
  courseObjectives: [],
  units: [],
  labSchedule: [],
  comments: [],
  clos: [],
  auditTrail: [],
  aiDiffs: [],
  governanceQuorum: {
    hodSigned: false,
    reviewerEndorsed: false,
    dccSigned: false,
    bosSigned: false,
    deanApproved: false,
    verificationTimestamp: 'Pending Institutional Signature',
    checksum: '',
    digitalSignature: '',
    consensusSignature: ''
  },
  synthesisFiles: {
    specDoc: { name: '', size: '', type: '' },
    blueprintDoc: { name: '', size: '', questionsCount: 0, bloomsRange: '' }
  }
};

/**
 * Fetch the active course specification from localStorage or fallback to default
 */
export function fetchCourseSpecification(): CourseSpecification {
  try {
    const raw = localStorage.getItem(COURSE_SPEC_KEY);
    if (!raw) return INITIAL_SPEC;
    const parsed = JSON.parse(raw);
    // Purge any legacy demo data from previous sessions
    if (
      parsed.id === 'spec_cs304_v24' ||
      parsed.code === 'CS304' ||
      parsed.title?.includes('Distributed Systems') ||
      parsed.faculty?.name === 'Dr. A. Sharma'
    ) {
      localStorage.removeItem(COURSE_SPEC_KEY);
      localStorage.removeItem('specforge_active_course_spec_v2');
      localStorage.removeItem('specforge_active_course_spec');
      return INITIAL_SPEC;
    }
    return parsed;
  } catch {
    return INITIAL_SPEC;
  }
}

/**
 * Explicitly clear all course specification data from localStorage
 */
export function clearAllCourseData(): CourseSpecification {
  try {
    localStorage.removeItem(COURSE_SPEC_KEY);
    localStorage.removeItem('specforge_active_course_spec_v2');
    localStorage.removeItem('specforge_active_course_spec');
  } catch {
    // Ignore
  }
  return INITIAL_SPEC;
}

/**
 * Save active course specification to localStorage
 */
export function saveCourseSpecification(spec: CourseSpecification): void {
  localStorage.setItem(COURSE_SPEC_KEY, JSON.stringify(spec));
}

/**
 * Role Permission Check Matrix
 */
export const ROLE_PERMISSIONS: Record<UserRole, Record<string, boolean>> = {
  hod: {
    edit_course: true,
    submit_for_review: true,
    approve_spec: true,
    reject_spec: true,
    manage_ai_settings: true,
    export_curriculum: true,
    sign_protocol: true,
    accept_ai_diff: true,
  },
  reviewer: {
    edit_course: false,
    submit_for_review: false,
    approve_spec: false,
    reject_spec: true,
    manage_ai_settings: true,
    export_curriculum: true,
    sign_protocol: false,
    accept_ai_diff: false,
  },
  author: {
    edit_course: true,
    submit_for_review: true,
    approve_spec: false,
    reject_spec: false,
    manage_ai_settings: true,
    export_curriculum: true,
    sign_protocol: false,
    accept_ai_diff: true,
  },
  auditor: {
    edit_course: false,
    submit_for_review: false,
    approve_spec: false,
    reject_spec: false,
    manage_ai_settings: false,
    export_curriculum: true,
    sign_protocol: false,
    accept_ai_diff: false,
  },
  instructor: {
    edit_course: true,
    submit_for_review: true,
    approve_spec: false,
    reject_spec: false,
    manage_ai_settings: true,
    export_curriculum: true,
    sign_protocol: false,
    accept_ai_diff: true,
  },
  dcc_reviewer: {
    edit_course: false,
    submit_for_review: false,
    approve_spec: false,
    reject_spec: true,
    manage_ai_settings: true,
    export_curriculum: true,
    sign_protocol: false,
    accept_ai_diff: false,
  },
  bos_chair: {
    edit_course: true,
    submit_for_review: true,
    approve_spec: true,
    reject_spec: true,
    manage_ai_settings: true,
    export_curriculum: true,
    sign_protocol: true,
    accept_ai_diff: true,
  }
};

export function hasPermission(role: UserRole, action: string): boolean {
  return !!ROLE_PERMISSIONS[role]?.[action];
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'hod':
    case 'bos_chair':
      return 'HOD (Dr. K. Arisawa - Department Chair)';
    case 'reviewer':
    case 'dcc_reviewer':
      return 'Reviewer (Prof. M. Vance)';
    case 'author':
    case 'instructor':
      return 'Author (Dr. A. Sharma)';
    case 'auditor':
      return 'Accreditation Auditor (NBA / ABET)';
    default:
      return role;
  }
}
