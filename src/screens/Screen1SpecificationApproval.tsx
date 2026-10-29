import React, { useState } from 'react';
import { CourseSpecification, UserRole, ThemeMode, SpecStatus } from '../types';
import { hasPermission, getRoleLabel } from '../api';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  UserCheck,
  Send,
  ThumbsUp,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ListOrdered,
  FileCheck2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface Screen1Props {
  spec: CourseSpecification;
  role: UserRole;
  theme: ThemeMode;
  onUpdateSpec: (updated: CourseSpecification) => void;
  onOpenAnnexure: () => void;
  onSwitchScreen: (screenId: 'screen1' | 'screen2' | 'screen3') => void;
}

export const Screen1SpecificationApproval: React.FC<Screen1Props> = ({
  spec,
  role,
  theme,
  onUpdateSpec,
  onOpenAnnexure,
  onSwitchScreen,
}) => {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const isCyber = theme === 'cyber';

  const getStatusBadge = (status: SpecStatus) => {
    if (isCyber) {
      switch (status) {
        case 'approved':
          return (
            <span className="px-2.5 py-1 text-xs font-mono-code font-bold uppercase tracking-wider rounded bg-[#002107] text-[#00ff66] border border-[#22c55e] flex items-center gap-1.5 cyber-glow-green">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
              Approved & Sealed
            </span>
          );
        case 'under_review':
          return (
            <span className="px-2.5 py-1 text-xs font-mono-code font-bold uppercase tracking-wider rounded bg-[#140c24] text-[#c084fc] border border-[#a855f7] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-ping" />
              DCC Review In-Progress
            </span>
          );
        case 'revision_requested':
          return (
            <span className="px-2.5 py-1 text-xs font-mono-code font-bold uppercase tracking-wider rounded bg-[#310c0c] text-[#fb7185] border border-[#f43f5e] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Revision Directive
            </span>
          );
        default:
          return (
            <span className="px-2.5 py-1 text-xs font-mono-code font-bold uppercase tracking-wider rounded bg-[#1b1b1f] text-[#94a3b8] border border-[#475569]">
              Draft Staging
            </span>
          );
      }
    }

    // Academic Theme
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 text-xs font-mono-code font-semibold uppercase tracking-wider rounded bg-[#ccfbf1] text-[#115e59] border border-[#99f6e4] flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0d9488]" />
            Approved by BoS
          </span>
        );
      case 'under_review':
        return (
          <span className="px-3 py-1 text-xs font-mono-code font-semibold uppercase tracking-wider rounded bg-[#eef2ff] text-[#3730a3] border border-[#c7d2fe] flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#4338ca]" />
            Under Committee Review
          </span>
        );
      case 'revision_requested':
        return (
          <span className="px-3 py-1 text-xs font-mono-code font-semibold uppercase tracking-wider rounded bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] flex items-center gap-1.5 shadow-2xs">
            <AlertCircle className="w-3.5 h-3.5 text-[#ef4444]" />
            Revision Requested
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-mono-code font-semibold uppercase tracking-wider rounded bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]">
            Faculty Draft
          </span>
        );
    }
  };

  const handleApprove = () => {
    const actorLabel = getRoleLabel(role);
    const updated: CourseSpecification = {
      ...spec,
      status: role === 'bos_chair' ? 'approved' : 'under_review',
      governanceQuorum: {
        ...spec.governanceQuorum,
        dccSigned: true,
        bosSigned: role === 'bos_chair' ? true : spec.governanceQuorum.bosSigned,
        deanApproved: role === 'bos_chair' ? true : spec.governanceQuorum.deanApproved,
        consensusSignature: `SIG-RATIFIED-${Date.now().toString(16).toUpperCase()}`,
        verificationTimestamp: new Date().toISOString(),
      },
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          actor: actorLabel,
          role: actorLabel,
          action: role === 'bos_chair' ? 'Board of Studies Final Sanction Signed' : 'DCC Formal Endorsement Signed',
          rationale: 'Curriculum structure, learning outcome matrices, and credit distributions verified compliant.',
          verificationHash: '0x' + Math.random().toString(16).substring(2, 12) + 'a9',
        },
        ...spec.auditTrail,
      ],
    };
    onUpdateSpec(updated);
    setActionFeedback(`Specification successfully endorsed and recorded in governance audit stream by ${actorLabel}.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleRequestRevision = () => {
    if (!revisionNote.trim()) return;
    const actorLabel = getRoleLabel(role);
    const updated: CourseSpecification = {
      ...spec,
      status: 'revision_requested',
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          actor: actorLabel,
          role: actorLabel,
          action: 'Formal Revision Directive Issued',
          rationale: revisionNote,
          verificationHash: '0x' + Math.random().toString(16).substring(2, 12) + 'rev',
        },
        ...spec.auditTrail,
      ],
    };
    onUpdateSpec(updated);
    setShowRevisionModal(false);
    setRevisionNote('');
    setActionFeedback('Revision directive submitted to course instructor.');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleSubmitDraft = () => {
    const actorLabel = getRoleLabel(role);
    const updated: CourseSpecification = {
      ...spec,
      status: 'under_review',
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          actor: actorLabel,
          role: actorLabel,
          action: 'Course Specification Resubmitted to DCC',
          rationale: 'Course specification updated and resubmitted for committee verification.',
          verificationHash: '0x' + Math.random().toString(16).substring(2, 12) + 'sub',
        },
        ...spec.auditTrail,
      ],
    };
    onUpdateSpec(updated);
    setActionFeedback('Specification resubmitted for committee appraisal.');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded border flex items-center justify-between text-sm transition-all ${
            isCyber
              ? 'bg-[#002107] border-[#22c55e] text-[#00ff66] cyber-glow-green font-mono-code'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-xs uppercase font-bold tracking-wider opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Header Card */}
      <div
        className={`p-6 rounded-lg border transition-all ${
          isCyber
            ? 'cyber-card-bg text-[#e5e1e7]'
            : 'academic-card'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-sm font-mono-code font-bold tracking-wide rounded ${
                  isCyber
                    ? 'bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/50'
                    : 'bg-[#0f172a] text-white'
                }`}
              >
                {spec.code}
              </span>
              <span
                className={`text-xs font-mono-code px-2 py-0.5 rounded ${
                  isCyber ? 'bg-[#1b1b1f] text-[#cfc2d6]' : 'bg-[#eff4ff] text-[#3730a3]'
                }`}
              >
                {spec.regulation}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono-code ${
                  isCyber ? 'bg-[#140c24] text-[#cfc2d6]' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {spec.semester}
              </span>
            </div>
            <h1
              className={`text-2xl font-bold tracking-tight ${
                isCyber ? 'font-headline text-white' : 'text-[#0f172a]'
              }`}
            >
              {spec.title}
            </h1>
            <p className={`text-xs ${isCyber ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
              {spec.department} • {spec.program} • AY {spec.academicYear}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {getStatusBadge(spec.status)}

            {/* Credit Breakdown Monospace Box */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono-code ${
                isCyber
                  ? 'bg-[#050508] border-[#a855f7]/30 text-white'
                  : 'bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a]'
              }`}
            >
              <span>L: {spec.credits.lecture}</span>
              <span className="text-slate-400">|</span>
              <span>T: {spec.credits.tutorial}</span>
              <span className="text-slate-400">|</span>
              <span>P: {spec.credits.practical}</span>
              <span className="text-slate-400">|</span>
              <span className="font-bold text-[#4338ca] dark:text-[#c084fc]">
                Total Credits: {spec.credits.total}
              </span>
            </div>
          </div>
        </div>

        {/* Governance Workflow Stepper */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-xs font-mono-code uppercase font-semibold tracking-wider ${
                isCyber ? 'text-[#c084fc]' : 'text-[#475569]'
              }`}
            >
              Institutional Governance Protocol Pipeline
            </span>
            <span className="text-xs text-slate-400 font-mono-code">
              Quorum Verification: {spec.governanceQuorum.bosSigned ? '3 / 3 Sanctioned' : spec.governanceQuorum.dccSigned ? '1 / 3 Endorsed' : '0 / 3 In-Draft'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div
              className={`p-3 rounded border text-xs ${
                isCyber
                  ? 'bg-[#002107]/50 border-[#22c55e]/60 text-white'
                  : 'bg-emerald-50/70 border-emerald-300 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-600 dark:text-[#00ff66]">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Faculty Syllabus Draft</span>
              </div>
              <p className="text-[11px] opacity-80">{spec.faculty.name}</p>
            </div>

            {/* Step 2 */}
            <div
              className={`p-3 rounded border text-xs ${
                spec.governanceQuorum.dccSigned
                  ? isCyber
                    ? 'bg-[#002107]/50 border-[#22c55e]/60 text-white'
                    : 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                  : isCyber
                  ? 'bg-[#140c24] border-[#a855f7] text-[#c084fc]'
                  : 'bg-indigo-50 border-indigo-300 text-indigo-900'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-bold mb-1 ${
                  spec.governanceQuorum.dccSigned
                    ? 'text-emerald-600 dark:text-[#00ff66]'
                    : 'text-[#4338ca] dark:text-[#c084fc]'
                }`}
              >
                {spec.governanceQuorum.dccSigned ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4 animate-spin" />
                )}
                <span>2. DCC Committee Audit</span>
              </div>
              <p className="text-[11px] opacity-80">
                {spec.governanceQuorum.dccSigned ? 'Endorsed & Matrix Verified' : 'Under Assessment'}
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`p-3 rounded border text-xs ${
                spec.governanceQuorum.bosSigned
                  ? isCyber
                    ? 'bg-[#002107]/50 border-[#22c55e]/60 text-white'
                    : 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                  : isCyber
                  ? 'bg-[#050508] border-[#475569]/40 text-[#94a3b8]'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-bold mb-1 ${
                  spec.governanceQuorum.bosSigned
                    ? 'text-emerald-600 dark:text-[#00ff66]'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {spec.governanceQuorum.bosSigned ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                    3
                  </span>
                )}
                <span>3. BoS Academic Sanction</span>
              </div>
              <p className="text-[11px] opacity-80">
                {spec.governanceQuorum.bosSigned ? 'Formal Sanction Issued' : 'Awaiting DCC Transmission'}
              </p>
            </div>

            {/* Step 4 */}
            <div
              className={`p-3 rounded border text-xs ${
                spec.governanceQuorum.deanApproved
                  ? isCyber
                    ? 'bg-[#002107]/50 border-[#22c55e]/60 text-white'
                    : 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                  : isCyber
                  ? 'bg-[#050508] border-[#475569]/40 text-[#94a3b8]'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-bold mb-1 ${
                  spec.governanceQuorum.deanApproved
                    ? 'text-emerald-600 dark:text-[#00ff66]'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {spec.governanceQuorum.deanApproved ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                    4
                  </span>
                )}
                <span>4. Dean Accreditation Seal</span>
              </div>
              <p className="text-[11px] opacity-80">
                {spec.governanceQuorum.deanApproved ? 'Statutory Gazette Stamped' : 'Institutional Ratification'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Course Dossier + Institutional Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scope & Modules (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Scope Card */}
          <div
            className={`p-6 rounded-lg border ${
              isCyber ? 'cyber-card-bg text-[#e5e1e7]' : 'academic-card'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4338ca] dark:text-[#c084fc]" />
                <h2
                  className={`text-sm font-semibold tracking-wide uppercase ${
                    isCyber ? 'font-mono-code text-white' : 'text-[#0f172a]'
                  }`}
                >
                  Course Overview & Pedagogical Scope
                </h2>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-mono-code ${
                  isCyber ? 'bg-[#140c24] text-[#c084fc]' : 'bg-[#eef2ff] text-[#3730a3]'
                }`}
              >
                Accreditation Tier-1 Compliant
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed mb-4 ${
                isCyber ? 'text-[#cfc2d6]' : 'text-[#334155]'
              }`}
            >
              {spec.courseOverview}
            </p>

            {/* Prerequisites */}
            <div>
              <span
                className={`text-xs font-mono-code uppercase font-semibold tracking-wider block mb-2 ${
                  isCyber ? 'text-[#94a3b8]' : 'text-[#64748b]'
                }`}
              >
                Statutory Prerequisites
              </span>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(spec.prerequisites) ? spec.prerequisites : [String(spec.prerequisites)]).map((req: string, idx: number) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 text-xs rounded font-mono-code border ${
                      isCyber
                        ? 'bg-[#050508] border-[#a855f7]/30 text-white'
                        : 'bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a]'
                    }`}
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Syllabus Modules (5 Modules Grid) */}
          <div
            className={`p-6 rounded-lg border ${
              isCyber ? 'cyber-card-bg text-[#e5e1e7]' : 'academic-card'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#4338ca] dark:text-[#c084fc]" />
                <h2
                  className={`text-sm font-semibold tracking-wide uppercase ${
                    isCyber ? 'font-mono-code text-white' : 'text-[#0f172a]'
                  }`}
                >
                  Curricular Modules & Lecture Distribution
                </h2>
              </div>
              <span className="text-xs font-mono-code text-slate-500">
                Total Lecture Hours: {(spec.modules || []).reduce((sum: number, m: any) => sum + (m.lectureHours || 0), 0)} Hours
              </span>
            </div>

            <div className="space-y-4">
              {(spec.modules || []).map((mod: any) => (
                <div
                  key={mod.id}
                  className={`p-4 rounded border transition-all ${
                    isCyber
                      ? 'bg-[#050508] border-[#a855f7]/20 hover:border-[#a855f7]/50'
                      : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1] shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 text-xs font-mono-code font-bold rounded ${
                          isCyber
                            ? 'bg-[#a855f7]/20 text-[#c084fc]'
                            : 'bg-[#0f172a] text-white'
                        }`}
                      >
                        Module {mod.moduleNumber}
                      </span>
                      <h3
                        className={`text-sm font-semibold ${
                          isCyber ? 'text-white' : 'text-[#0f172a]'
                        }`}
                      >
                        {mod.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-mono-code ${
                          isCyber ? 'bg-[#140c24] text-[#cfc2d6]' : 'bg-[#f1f5f9] text-[#475569]'
                        }`}
                      >
                        {mod.lectureHours} Contact Hrs
                      </span>
                      {(mod.mappedCLOs || []).map((clo: string) => (
                        <span
                          key={clo}
                          className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded ${
                            isCyber
                              ? 'bg-[#002107] text-[#00ff66] border border-[#22c55e]'
                              : 'bg-[#ccfbf1] text-[#115e59] border border-[#99f6e4]'
                          }`}
                        >
                          {clo}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-900">
                    {(mod.topics || []).map((t: string, tidx: number) => (
                      <div key={tidx} className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-mono-code text-[11px]">•</span>
                        <span className={isCyber ? 'text-[#cfc2d6]' : 'text-[#475569]'}>
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Faculty Dossier, Assessment & Governance Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Institutional Actions Box */}
          <div
            className={`p-6 rounded-lg border ${
              isCyber
                ? 'bg-[#0a0612] border-[#a855f7]/40 cyber-glow-purple'
                : 'academic-card'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4338ca] dark:text-[#00ff66]" />
                <h3
                  className={`text-sm font-semibold uppercase ${
                    isCyber ? 'font-mono-code text-white' : 'text-[#0f172a]'
                  }`}
                >
                  Governance Mandate
                </h3>
              </div>
              <span
                className={`text-[11px] font-mono-code px-2 py-0.5 rounded font-bold ${
                  isCyber ? 'bg-[#002107] text-[#00ff66]' : 'bg-[#e0e7ff] text-[#4338ca]'
                }`}
              >
                {getRoleLabel(role)}
              </span>
            </div>

            <p
              className={`text-xs mb-4 ${
                isCyber ? 'text-[#cfc2d6]' : 'text-[#64748b]'
              }`}
            >
              Action triggers are bound to your authenticated governance role. All sanctions emit cryptographic verification logs.
            </p>

            <div className="space-y-2.5">
              {hasPermission(role, 'approve_spec') && (
                <button
                  onClick={handleApprove}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded text-white flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isCyber
                      ? 'bg-[#a855f7] hover:bg-[#9333ea] text-black font-mono-code uppercase font-bold tracking-wider cyber-glow-purple'
                      : 'bg-[#0f172a] hover:bg-[#1e293b]'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {role === 'bos_chair' ? 'Ratify & Finalize BoS Sanction' : 'Sign DCC Review Endorsement'}
                </button>
              )}

              {hasPermission(role, 'reject_spec') && (
                <button
                  onClick={() => setShowRevisionModal(true)}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded border flex items-center justify-center gap-2 transition-all ${
                    isCyber
                      ? 'border-[#f43f5e] text-[#fb7185] hover:bg-[#310c0c]'
                      : 'border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Issue Revision Directive
                </button>
              )}

              {hasPermission(role, 'submit_for_review') && role === 'instructor' && (
                <button
                  onClick={handleSubmitDraft}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded text-white flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isCyber
                      ? 'bg-[#a855f7] hover:bg-[#9333ea] text-black font-mono-code font-bold uppercase'
                      : 'bg-[#4338ca] hover:bg-[#3730a3]'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Submit Specification to DCC
                </button>
              )}

              <button
                onClick={() => onSwitchScreen('screen2')}
                className={`w-full py-2.5 px-4 text-xs font-semibold rounded border flex items-center justify-center gap-2 transition-colors ${
                  isCyber
                    ? 'border-[#a855f7]/30 text-white hover:bg-[#140c24]'
                    : 'border-[#cbd5e1] text-[#0f172a] hover:bg-[#f8fafc]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#4338ca] dark:text-[#c084fc]" />
                Inspect Outcome Matrix (Screen 2)
              </button>
            </div>
          </div>

          {/* Faculty Dossier */}
          <div
            className={`p-6 rounded-lg border ${
              isCyber ? 'cyber-card-bg text-[#e5e1e7]' : 'academic-card'
            }`}
          >
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <UserCheck className="w-4 h-4 text-[#4338ca] dark:text-[#c084fc]" />
              <h3
                className={`text-sm font-semibold uppercase ${
                  isCyber ? 'font-mono-code text-white' : 'text-[#0f172a]'
                }`}
              >
                Course Faculty Dossier
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                <span className="text-slate-500 font-mono-code">Lead Instructor</span>
                <span className="font-semibold text-right">{spec.faculty.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                <span className="text-slate-500 font-mono-code">Designation</span>
                <span className="text-right">{spec.faculty.designation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                <span className="text-slate-500 font-mono-code">Employee ID</span>
                <span className="font-mono-code text-right font-bold">{spec.faculty.empId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-mono-code">Institutional Email</span>
                <span className="font-mono-code text-right text-[#4338ca] dark:text-[#c084fc]">
                  {spec.faculty.email}
                </span>
              </div>
            </div>
          </div>

          {/* Evaluation Scheme */}
          <div
            className={`p-6 rounded-lg border ${
              isCyber ? 'cyber-card-bg text-[#e5e1e7]' : 'academic-card'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#4338ca] dark:text-[#c084fc]" />
                <h3
                  className={`text-sm font-semibold uppercase ${
                    isCyber ? 'font-mono-code text-white' : 'text-[#0f172a]'
                  }`}
                >
                  Statutory Evaluation Weights
                </h3>
              </div>
              <span className="text-xs font-mono-code font-bold text-emerald-600 dark:text-[#00ff66]">
                100% Total
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Continuous Internal Assessment (CIA)</span>
                  <span className="font-mono-code font-bold">{spec.evaluationScheme.continuousAssessment}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4338ca] dark:bg-[#a855f7]"
                    style={{ width: `${spec.evaluationScheme.continuousAssessment}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Midterm Examination</span>
                  <span className="font-mono-code font-bold">{spec.evaluationScheme.midTermExamination}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0d9488] dark:bg-[#00ff66]"
                    style={{ width: `${spec.evaluationScheme.midTermExamination}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">End-Semester Final Examination</span>
                  <span className="font-mono-code font-bold">{spec.evaluationScheme.endSemesterExamination}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0f172a] dark:bg-[#c084fc]"
                    style={{ width: `${spec.evaluationScheme.endSemesterExamination}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revision Directive Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg p-6 rounded-lg border shadow-2xl ${
              isCyber
                ? 'bg-[#0a0612] border-[#f43f5e] text-white'
                : 'bg-white border-slate-300 text-[#0f172a]'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-bold">Issue Formal Revision Directive</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Specify the exact curriculum amendments required (e.g. Bloom's Taxonomy adjustment, credit reallocation, or additional laboratory hours).
            </p>
            <textarea
              rows={4}
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="Enter detailed review feedback for the instructor..."
              className={`w-full p-3 text-xs rounded border mb-4 outline-none ${
                isCyber
                  ? 'bg-[#050508] border-[#a855f7]/40 text-white focus:border-[#f43f5e]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#4338ca]'
              }`}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 text-xs font-medium rounded border border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={!revisionNote.trim()}
                className="px-4 py-2 text-xs font-semibold rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Submit Directive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
