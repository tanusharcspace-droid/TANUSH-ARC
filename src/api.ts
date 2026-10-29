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
 * CS304: Distributed Systems & Cloud Computing
 * Matching the exact Stitch design specification
 */
export const INITIAL_SPEC: CourseSpecification = {
  id: 'spec_cs304_v24',
  code: 'CS304',
  title: 'Distributed Systems & Cloud Computing',
  academicYear: '2024-25 Fall',
  regulation: 'R2022-CBCS',
  semester: 'Semester VI (B.Tech)',
  department: 'Department of Computer Science & Engineering',
  program: 'B.Tech in Computer Science & Engineering',
  category: 'Professional Core (PC)',
  courseOverview: 'Formal treatment of distributed computation primitives, consensus algorithms (Raft, Paxos, PBFT), distributed state machines, vector clocks, Byzantine fault tolerance, and eventual consistency models.',
  credits: {
    lecture: 3,
    tutorial: 0,
    practical: 2,
    total: 4,
    contactHours: 75
  },
  status: 'draft',
  faculty: {
    name: 'Dr. A. Sharma',
    designation: 'Associate Professor & Systems Lead',
    empId: 'FAC-CSE-402',
    email: 'a.sharma@nit.ac.in'
  },
  prerequisites: 'CS201 Data Structures, CS204 OS',
  assessmentStrategy: 'CIE: 50% | SEE: 50%',
  evaluationScheme: {
    continuousAssessment: 30,
    midTermExamination: 20,
    endSemesterExamination: 50
  },
  modules: [
    {
      id: 'mod-1',
      moduleNumber: 1,
      title: 'Foundations & Logical Clocks',
      lectureHours: 9,
      topics: ['Distributed Systems Characterization', 'Lamport Logical Clocks', 'Vector Clocks'],
      mappedCLOs: ['CO-1']
    },
    {
      id: 'mod-2',
      moduleNumber: 2,
      title: 'Consensus & State Machine Replication',
      lectureHours: 9,
      topics: ['Consensus Impossibility FLP', 'Paxos Protocol', 'Raft Consensus'],
      mappedCLOs: ['CO-2']
    },
    {
      id: 'mod-3',
      moduleNumber: 3,
      title: 'Distributed Storage & Consistency',
      lectureHours: 9,
      topics: ['CAP & PACELC Trade-offs', 'Two-Phase Commit', 'Spanner TrueTime'],
      mappedCLOs: ['CO-3']
    },
    {
      id: 'mod-4',
      moduleNumber: 4,
      title: 'Cloud Systems & Microservices',
      lectureHours: 14,
      topics: ['Kubernetes Architecture', 'Serverless Functions', 'Microservices'],
      mappedCLOs: ['CO-4']
    },
    {
      id: 'mod-5',
      moduleNumber: 5,
      title: 'Experimental Benchmarks',
      lectureHours: 13,
      topics: ['MapReduce Streaming', 'SLA Latency Bounds', 'Chaos Engineering'],
      mappedCLOs: ['CO-5']
    }
  ],
  courseObjectives: [
    'Examine fundamental architectural models, communication primitives, and state synchronization across distributed nodes.',
    'Analyze consensus protocols (Paxos, Raft), Byzantine agreement, and distributed commit semantics under asynchronous fault domains.',
    'Construct scalable, fault-tolerant cloud microservices using distributed storage frameworks and container orchestration.'
  ],
  units: [
    {
      id: 'unit-1',
      unitNumber: 1,
      unitRoman: 'UNIT I',
      title: 'FOUNDATIONS & LOGICAL TIME',
      lectureHours: 9,
      bloomsTier: 'Bloom L2-L3',
      content: 'Characterization of distributed systems; System models (architectural, interaction, failure models). Remote Procedure Calls (gRPC, protocol buffers). Logical Clocks: Lamport timestamps, Vector clocks, Matrix clocks. Global state recording: Chandy-Lamport snapshot algorithm. Distributed mutual exclusion: Ricart-Agrawala, Maekawa quorum.'
    },
    {
      id: 'unit-2',
      unitNumber: 2,
      unitRoman: 'UNIT II',
      title: 'CONSENSUS & REPLICATION',
      lectureHours: 9,
      bloomsTier: 'Bloom L3-L4',
      content: 'Fault tolerance fundamentals: Crash-stop vs. Byzantine failures. Consensus in synchronous vs. asynchronous systems; FLP impossibility result. Paxos protocol (Classic & Multi-Paxos), Raft consensus algorithm (Leader election, Log replication, Safety). Primary-backup replication, Viewstamped Replication, State Machine Replication (SMR).'
    },
    {
      id: 'unit-3',
      unitNumber: 3,
      unitRoman: 'UNIT III',
      title: 'DISTRIBUTED STORAGE & TRANSACTIONAL SEMANTICS',
      lectureHours: 9,
      bloomsTier: 'Bloom L4-L5',
      content: 'Distributed transactions: Atomicity, Consistency, Isolation, Durability (ACID). Two-Phase Commit (2PC) and Three-Phase Commit (3PC). CAP Theorem and PACELC trade-offs. Distributed hash tables (Chord, Dynamo DHT), consistent hashing with virtual nodes. Google Spanner: TrueTime API and external consistency.',
      reviewNotesCount: 1
    },
    {
      id: 'unit-4-5',
      unitNumber: 4,
      unitRoman: 'UNIT IV & V',
      title: 'CLOUD SYSTEMS & INTEGRATED EXPERIMENTAL LAB',
      lectureHours: 27,
      bloomsTier: 'Bloom L3-L5',
      content: 'Cloud infrastructure virtualization: hypervisors, containers (OIDC, Kubernetes architecture). MapReduce and Spark distributed compute primitives. Serverless compute runtimes and event-driven orchestration.'
    }
  ],
  labSchedule: [
    { id: 1, title: 'Implement gRPC microservice with bi-directional streaming and payload serialization.' },
    { id: 2, title: 'Simulate Lamport Clock event ordering across 4 asynchronous Docker containers.' },
    { id: 3, title: 'Implement Raft consensus leader election and heartbeats with simulated packet drops.' },
    { id: 4, title: 'Build a consistent-hash Key-Value store with node joining/leaving repartitioning.' },
    { id: 5, title: 'Deploy auto-scaling stateless REST API on Kubernetes cluster with ingress routing.' }
  ],
  comments: [
    {
      id: 'comm-1',
      author: 'Prof. M. Vance',
      role: 'Peer Reviewer',
      timeAgo: '1h ago',
      comment: 'Unit III lecture hours (9 hrs) seem insufficient for Paxos/Raft consensus proofs. Recommend increasing from 7 to 9 hrs.',
      anchor: 'Unit III',
      resolved: false
    },
    {
      id: 'comm-2',
      author: 'Dr. K. Arisawa',
      role: 'HOD',
      timeAgo: '2h ago',
      comment: "Align CO-3 action verb 'Understand' to Bloom's L3 'Apply' or L4 'Analyze' for ABET Criterion 3.",
      anchor: 'CO-3',
      resolved: true,
      resolvedViaAI: true
    }
  ],
  clos: [
    {
      id: 'co-1',
      code: 'CO-1',
      statement: 'Formulate foundational distributed communication models, RPC interfaces, and logical clock orderings.',
      bloomsLevel: 'L3',
      poMappings: { PO1: 3, PO2: 2, PO3: 0, PO4: 0, PO5: 3, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 0, PO11: 0, PO12: 0 },
      psoMappings: { PSO1: 3, PSO2: 0, PSO3: 0 },
      assessmentMethods: ['Continuous Assessment Test 1', 'Theoretical Assignment']
    },
    {
      id: 'co-2',
      code: 'CO-2',
      statement: 'Design fault-tolerant distributed state replication using Paxos and Raft consensus algorithms.',
      bloomsLevel: 'L4',
      poMappings: { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 0, PO11: 0, PO12: 0 },
      psoMappings: { PSO1: 3, PSO2: 2, PSO3: 0 },
      assessmentMethods: ['Hands-on Laboratory Assignment', 'Midterm Practical Exam']
    },
    {
      id: 'co-3',
      code: 'CO-3',
      statement: 'Evaluate transactional consistency models and CAP trade-offs across distributed databases.',
      bloomsLevel: 'L5',
      poMappings: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 0, PO6: 0, PO7: 0, PO8: 1, PO9: 0, PO10: 0, PO11: 0, PO12: 0 },
      psoMappings: { PSO1: 2, PSO2: 3, PSO3: 0 },
      assessmentMethods: ['Case Study Analysis', 'Midterm Examination']
    },
    {
      id: 'co-4',
      code: 'CO-4',
      statement: 'Construct resilient microservice architectures deployed via Kubernetes cluster orchestration.',
      bloomsLevel: 'L3',
      poMappings: { PO1: 2, PO2: 2, PO3: 3, PO4: 0, PO5: 3, PO6: 0, PO7: 0, PO8: 0, PO9: 2, PO10: 0, PO11: 2, PO12: 0 },
      psoMappings: { PSO1: 3, PSO2: 0, PSO3: 0 },
      assessmentMethods: ['Capstone System Project', 'Lab Viva Voce']
    },
    {
      id: 'co-5',
      code: 'CO-5',
      statement: 'Assess distributed streaming and large-scale MapReduce workflows against SLA thresholds.',
      bloomsLevel: 'L5',
      poMappings: { PO1: 3, PO2: 3, PO3: 2, PO4: 2, PO5: 3, PO6: 0, PO7: 0, PO8: 0, PO9: 2, PO10: 1, PO11: 0, PO12: 0 },
      psoMappings: { PSO1: 3, PSO2: 2, PSO3: 0 },
      assessmentMethods: ['Performance Benchmark', 'End Semester Examination']
    }
  ],
  auditTrail: [
    {
      id: 'aud-1',
      timestamp: '2026-10-28 14:10:00 UTC',
      actor: 'Dr. A. Sharma (Author)',
      role: 'Course Author',
      action: 'Legacy Syllabus Ingested from CS304_Adv_Algorithms_v1.docx',
      rationale: 'Converted legacy unformatted syllabus into autonomous R2022 CBCS format.',
      verificationHash: '0x8f2a419c72e9'
    },
    {
      id: 'aud-2',
      timestamp: '2026-10-28 15:20:12 UTC',
      actor: 'Prof. M. Vance (Reviewer)',
      role: 'Review Board Member',
      action: 'Curriculum Note Anchored on Unit III',
      rationale: 'Reviewer requested increasing lecture hours for consensus algorithms.',
      verificationHash: '0x3c990ef148a0'
    },
    {
      id: 'aud-3',
      timestamp: '2026-10-29 02:15:30 UTC',
      actor: 'SpecForge Curriculum AI',
      role: 'AI Verification Engine',
      action: 'Automated Bloom Verbs & ABET Alignment Synthesized',
      rationale: 'Resolved 3 defects: upgraded CO-3 verb from Understand (L2) to Evaluate (L5).',
      verificationHash: '0x9b4f81da22e1'
    }
  ],
  aiDiffs: [
    {
      cloCode: 'CO-3',
      originalDraft: 'Students will understand distributed database consistency and CAP theorem.',
      suggestedRevision: 'Evaluate transactional consistency models and CAP trade-offs across distributed databases.',
      bloomsShift: { from: 'L2 (Understand)', to: 'L5 (Evaluate)' },
      alignmentRationale: 'Upgraded unmeasurable passive verb to ABET Criterion 3 evaluative outcome.',
      status: 'accepted'
    },
    {
      cloCode: 'CO-4',
      originalDraft: 'Explain microservices and Kubernetes cluster orchestration.',
      suggestedRevision: 'Construct resilient microservice architectures deployed via Kubernetes cluster orchestration.',
      bloomsShift: { from: 'L2 (Understand)', to: 'L3 (Apply)' },
      alignmentRationale: 'Integrated practical laboratory deliverable aligned with modern tooling (PO5).',
      status: 'accepted'
    }
  ],
  governanceQuorum: {
    hodSigned: false,
    reviewerEndorsed: true,
    dccSigned: true,
    bosSigned: false,
    deanApproved: false,
    verificationTimestamp: 'Pending Institutional Signature',
    checksum: '9B4F81DA',
    digitalSignature: 'ED25519-SIG-DRAFT',
    consensusSignature: 'ED25519-SIG-DRAFT'
  },
  synthesisFiles: {
    specDoc: { name: 'CS304_Adv_Algorithms_v1.docx', size: '2.4 MB', type: 'Non-Lab / Hybrid' },
    blueprintDoc: { name: 'CS304_EndSem_2024.doc', size: '840 KB', questionsCount: 10, bloomsRange: 'Bloom L1-L5' }
  }
};

/**
 * Fetch the active course specification from localStorage or fallback to default
 */
export function fetchCourseSpecification(): CourseSpecification {
  try {
    const raw = localStorage.getItem(COURSE_SPEC_KEY);
    if (!raw) return INITIAL_SPEC;
    return JSON.parse(raw);
  } catch {
    return INITIAL_SPEC;
  }
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
