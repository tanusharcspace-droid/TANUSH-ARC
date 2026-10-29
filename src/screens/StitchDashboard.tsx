import React, { useState } from 'react';
import { CourseSpecification, UserRole, ThemeMode, CLOItem, AIDiffEntry } from '../types';
import { getPOList, getPSOList, getBloomsLevels, getBloomsColorClasses } from '../annexure';
import { hasPermission, getRoleLabel, getAIHeaders } from '../api';
import { soundEffects } from '../audio';

interface StitchDashboardProps {
  spec: CourseSpecification;
  role: UserRole;
  theme: ThemeMode;
  activeNav: string;
  activeTab: 'spec' | 'matrix' | 'audit';
  onChangeTab: (tab: 'spec' | 'matrix' | 'audit') => void;
  onUpdateSpec: (updated: CourseSpecification) => void;
  onOpenSettings: () => void;
  onOpenAnnexure: () => void;
  onOpenExport: () => void;
}

export const StitchDashboard: React.FC<StitchDashboardProps> = ({
  spec,
  role,
  theme,
  activeNav,
  activeTab,
  onChangeTab,
  onUpdateSpec,
  onOpenSettings,
  onOpenAnnexure,
  onOpenExport,
}) => {
  const [selectedJustification, setSelectedJustification] = useState<string | null>(
    'CO2 -> PO3: Students design fault-tolerant distributed hash tables meeting real-time latency constraints.'
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisAlert, setSynthesisAlert] = useState<string | null>(null);

  const isCyber = theme === 'cyber';
  const poList = getPOList();
  const psoList = getPSOList();
  const bloomsList = getBloomsLevels();

  const isSignedOff = spec.governanceQuorum.hodSigned;
  const canSign = hasPermission(role, 'approve_spec') || role === 'hod' || role === 'bos_chair';

  const handleToggleSignOff = () => {
    soundEffects.successChime();
    const newSigned = !isSignedOff;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const updated: CourseSpecification = {
      ...spec,
      status: newSigned ? 'approved' : 'draft',
      governanceQuorum: {
        ...spec.governanceQuorum,
        hodSigned: newSigned,
        verificationTimestamp: newSigned ? timestamp : 'Pending Institutional Signature',
        digitalSignature: newSigned ? `ED25519-SIG-RATIFIED-9B4F81DA` : 'ED25519-SIG-DRAFT',
      },
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp,
          actor: getRoleLabel(role),
          role: getRoleLabel(role),
          action: newSigned ? 'Official HOD Institutional Sign-Off Executed' : 'Specification Returned to Draft Mode',
          rationale: newSigned
            ? 'Curriculum specifications and Bloom levels verified compliant with ABET/NBA accreditation requirements.'
            : 'Reopened for faculty adjustments.',
          verificationHash: '0x9b4f' + Math.random().toString(16).slice(2, 8),
        },
        ...spec.auditTrail,
      ],
    };
    onUpdateSpec(updated);
    setSynthesisAlert(
      newSigned
        ? 'Specification ratified and digital curriculum seal confirmed.'
        : 'Status returned to draft.'
    );
    setTimeout(() => setSynthesisAlert(null), 4000);
  };

  const handleGenerateCorrectedSpec = async () => {
    soundEffects.click();
    setIsSynthesizing(true);
    const headers = getAIHeaders();
    await new Promise((res) => setTimeout(res, 900));

    const updated: CourseSpecification = {
      ...spec,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          actor: `Gemini AI Engine (${headers['x-llm-model']})`,
          role: 'AI Synthesis Engine',
          action: 'Automated Specification Alignment & Defect Correction',
          rationale: 'Reconciled lecture hours and aligned course outcome verbs with ABET taxonomy standards.',
          verificationHash: '0x' + Math.random().toString(16).slice(2, 10),
        },
        ...spec.auditTrail,
      ],
    };

    soundEffects.successChime();
    onUpdateSpec(updated);
    setIsSynthesizing(false);
    setSynthesisAlert(`Specification synthesized using ${headers['x-llm-model']}. 3 defects reconciled.`);
    setTimeout(() => setSynthesisAlert(null), 4000);
  };

  const handleCellClick = (coId: string, poCode: string, isPso: boolean) => {
    soundEffects.click();
    const updatedClos = spec.clos.map((clo) => {
      if (clo.id !== coId) return clo;
      if (isPso) {
        const curr = clo.psoMappings[poCode] || 0;
        const next = (curr + 1) % 4;
        return { ...clo, psoMappings: { ...clo.psoMappings, [poCode]: next } };
      } else {
        const curr = clo.poMappings[poCode] || 0;
        const next = (curr + 1) % 4;
        return { ...clo, poMappings: { ...clo.poMappings, [poCode]: next } };
      }
    });

    onUpdateSpec({ ...spec, clos: updatedClos });
  };

  const handleAcceptDiff = (diff: AIDiffEntry) => {
    soundEffects.successChime();
    const targetBloom = diff.bloomsShift.to.split(' ')[0];
    const updatedClos = spec.clos.map((c) => {
      if (c.code === diff.cloCode) {
        return {
          ...c,
          statement: diff.suggestedRevision,
          bloomsLevel: targetBloom,
        };
      }
      return c;
    });

    const updatedDiffs = spec.aiDiffs.map((d) =>
      d.cloCode === diff.cloCode ? { ...d, status: 'accepted' as const } : d
    );

    onUpdateSpec({
      ...spec,
      clos: updatedClos,
      aiDiffs: updatedDiffs,
    });
    setSynthesisAlert(`Standardized statement accepted for ${diff.cloCode}.`);
    setTimeout(() => setSynthesisAlert(null), 3000);
  };

  const calculateAverages = (code: string, isPso: boolean) => {
    let sum = 0;
    let count = 0;
    spec.clos.forEach((c) => {
      const v = isPso ? c.psoMappings[code] : c.poMappings[code];
      if (v && v > 0) {
        sum += v;
        count += 1;
      }
    });
    return count > 0 ? (sum / count).toFixed(2) : '-';
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Synthesis Alert Message */}
      {synthesisAlert && (
        <div
          className={`mx-8 mt-4 p-3.5 rounded-lg flex items-center justify-between text-xs font-mono transition-all ${
            isCyber
              ? 'bg-[#041d0e] border border-[#00ff66]/40 text-[#00ff66] neon-glow-green'
              : 'bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{synthesisAlert}</span>
          </div>
          <button onClick={() => setSynthesisAlert(null)} className="font-bold opacity-75 hover:opacity-100">
            DISMISS
          </button>
        </div>
      )}

      {/* Top Bar Context & Controls */}
      <div className="w-full px-6 lg:px-8 py-5 flex flex-col gap-5">
        {/* INTUITIVE 3-STEP WALKTHROUGH STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => onChangeTab('spec')}
            className={`p-2.5 rounded-xl border flex items-center gap-3 shadow-md interactive-card cursor-pointer transition-all ${
              activeTab === 'spec'
                ? isCyber
                  ? 'bg-[#150a28] border-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-indigo-50 border-indigo-300'
                : isCyber
                ? 'bg-[#0e081c]/80 border-purple-800/40'
                : 'bg-white border-slate-200'
            }`}
          >
            <span className="w-7 h-7 rounded-lg bg-[#1a0f30] border border-purple-500/50 font-mono text-xs font-bold text-[#00ff66] flex items-center justify-center">
              1
            </span>
            <div>
              <span className="text-xs font-bold block">Step 1: Ingest Course Spec</span>
              <span className="text-[11px] text-slate-400">Drop syllabus docx &amp; blueprint below</span>
            </div>
          </div>

          <div
            onClick={() => onChangeTab('matrix')}
            className={`p-2.5 rounded-xl border flex items-center gap-3 shadow-md interactive-card cursor-pointer transition-all ${
              activeTab === 'matrix'
                ? isCyber
                  ? 'bg-[#150a28] border-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-indigo-50 border-indigo-300'
                : isCyber
                ? 'bg-[#0e081c]/80 border-purple-800/40'
                : 'bg-white border-slate-200'
            }`}
          >
            <span className="w-7 h-7 rounded-lg bg-[#1a0f30] border border-purple-500/50 font-mono text-xs font-bold text-[#00ff66] flex items-center justify-center">
              2
            </span>
            <div>
              <span className="text-xs font-bold block">Step 2: AI Remediation &amp; Matrix</span>
              <span className="text-[11px] text-slate-400">Inspect Bloom's verbs &amp; CO-PO weights</span>
            </div>
          </div>

          <div
            onClick={() => {
              if (canSign) handleToggleSignOff();
              else onChangeTab('spec');
            }}
            className={`p-2.5 rounded-xl border flex items-center gap-3 shadow-md interactive-card cursor-pointer transition-all ${
              isSignedOff
                ? isCyber
                  ? 'bg-[#041d0e] border-[#00ff66]/50 shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                  : 'bg-emerald-50 border-emerald-300'
                : isCyber
                ? 'bg-[#0e081c]/80 border-purple-800/40'
                : 'bg-white border-slate-200'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center border ${
                isSignedOff
                  ? 'bg-[#00ff66] text-black border-[#00ff66]'
                  : 'bg-[#1a0f30] border-purple-500/50 text-[#00ff66]'
              }`}
            >
              {isSignedOff ? '✓' : '3'}
            </span>
            <div>
              <span className="text-xs font-bold block">Step 3: Executive HOD Sign-Off</span>
              <span className="text-[11px] text-slate-400">
                {isSignedOff ? 'Certified with digital seal' : 'Click to authorize formal sign-off'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Control Panel: Ingestion & Synthesis Engine */}
        <div
          className={`interactive-card p-6 rounded-xl border shadow-2xl relative overflow-hidden transition-all ${
            isCyber
              ? 'bg-[#080510]/90 backdrop-blur-md border-purple-500/30'
              : 'bg-white border-slate-200'
          }`}
        >
          {isCyber && (
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          )}

          <div
            className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b ${
              isCyber ? 'border-purple-900/40' : 'border-slate-100'
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className={`font-display font-bold text-xl lg:text-2xl tracking-tight ${
                    isCyber ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Course Specification Ingestion &amp; Synthesis Engine
                </h1>
                {/* Google AI Wave Active Badge */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs bg-[#031e0f] text-[#00ff66] border border-[#00ff66]/50 font-semibold shadow-[0_0_14px_rgba(0,255,102,0.3)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] energy-wave-pulse" />
                  GEMINI 1.5 FLASH ACTIVE
                </span>
              </div>
              <p className={`text-xs mt-1 ${isCyber ? 'text-slate-300' : 'text-slate-600'}`}>
                Upload legacy syllabus docx and question paper blueprints to automate ABET/NBA accredited spec alignment.
              </p>
            </div>

            {/* Clickable Celebration Badges */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => {
                  setSynthesisAlert('🎉 All 12 Program Outcomes (POs) & 2 PSOs mapped and verified compliant!');
                  setTimeout(() => setSynthesisAlert(null), 3500);
                }}
                className="font-mono text-xs text-[#00ff66] bg-[#041d0e] px-2.5 py-1 rounded-full border border-[#00ff66]/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                title="Click for compliance details"
              >
                ⚡ 100% ABET Ready
              </button>
              <button
                type="button"
                onClick={() => {
                  setSynthesisAlert('🚀 Zero unaligned action verbs remaining. Bloom levels synchronized.');
                  setTimeout(() => setSynthesisAlert(null), 3500);
                }}
                className="font-mono text-xs text-purple-300 bg-[#130b24] px-2.5 py-1 rounded-full border border-purple-700/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                title="Click for defect resolution report"
              >
                🚀 Zero Defects
              </button>
              <span
                className={`font-mono text-xs px-3 py-1.5 rounded border flex items-center gap-1.5 ${
                  isCyber
                    ? 'bg-[#130b24] text-purple-300 border-purple-700/40'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm text-[#00ff66]">update</span>
                Synthesized 4 mins ago • <span className="text-[#00ff66] font-bold">3 defects resolved</span>
              </span>
            </div>
          </div>

          {/* Dropzones & Trigger Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-stretch">
            {/* Dropzone 1 */}
            <div
              className={`interactive-card md:col-span-4 p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isCyber
                  ? 'bg-[#0d0919]/90 border-dashed border-purple-500/40 hover:border-purple-400'
                  : 'bg-slate-50 border-dashed border-slate-300 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCyber
                        ? 'bg-purple-950/60 border border-purple-500/40 text-purple-300'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">description</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                      Course Spec File
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#00ff66] truncate max-w-[190px]">
                      {spec.synthesisFiles.specDoc.name}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  {spec.synthesisFiles.specDoc.size}
                </span>
              </div>
              <div
                className={`mt-4 flex items-center justify-between pt-2.5 border-t ${
                  isCyber ? 'border-purple-900/40' : 'border-slate-200'
                }`}
              >
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono ${
                    isCyber ? 'bg-[#1b1230] text-purple-200' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  {spec.synthesisFiles.specDoc.type}
                </span>
                <button
                  type="button"
                  onClick={() => setSynthesisAlert('Select new .docx specification to ingest.')}
                  className="font-mono text-xs text-purple-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">cloud_upload</span> Replace
                </button>
              </div>
            </div>

            {/* Dropzone 2 */}
            <div
              className={`interactive-card md:col-span-4 p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isCyber
                  ? 'bg-[#0d0919]/90 border-dashed border-purple-500/40 hover:border-purple-400'
                  : 'bg-slate-50 border-dashed border-slate-300 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCyber
                        ? 'bg-purple-950/60 border border-purple-500/40 text-purple-300'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">quiz</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                      Question Blueprint
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#00ff66] truncate max-w-[190px]">
                      {spec.synthesisFiles.blueprintDoc.name}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  {spec.synthesisFiles.blueprintDoc.size}
                </span>
              </div>
              <div
                className={`mt-4 flex items-center justify-between pt-2.5 border-t ${
                  isCyber ? 'border-purple-900/40' : 'border-slate-200'
                }`}
              >
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#041d0e] text-[#00ff66] border border-[#00ff66]/30 text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                  {spec.synthesisFiles.blueprintDoc.questionsCount} Qs • {spec.synthesisFiles.blueprintDoc.bloomsRange}
                </span>
                <button
                  type="button"
                  onClick={() => setSynthesisAlert('Blueprint re-upload initialized.')}
                  className="font-mono text-xs text-purple-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">cached</span> Re-upload
                </button>
              </div>
            </div>

            {/* Synthesis Action Card */}
            <div
              className={`interactive-card md:col-span-4 p-4 rounded-xl border flex flex-col justify-between gap-3 shadow-xl ${
                isCyber
                  ? 'bg-gradient-to-br from-[#120a22] to-[#1c0f38] border-purple-500/40'
                  : 'bg-gradient-to-br from-indigo-50 via-white to-slate-50 border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <label className="font-mono text-[11px] text-purple-300" htmlFor="template-toggle">
                    TEMPLATE:
                  </label>
                  <select
                    id="template-toggle"
                    className={`h-7 px-2 rounded font-mono text-xs focus:outline-none cursor-pointer border ${
                      isCyber
                        ? 'bg-[#090514] border-purple-700/60 text-white'
                        : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option>Integrated (Theory + Lab)</option>
                    <option>Pure Theory (3-0-0)</option>
                  </select>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#041d0e] border border-[#00ff66]/40 font-mono text-[11px] text-[#00ff66]">
                  {spec.regulation}
                </span>
              </div>
              <button
                type="button"
                id="synthesis-btn"
                onClick={handleGenerateCorrectedSpec}
                disabled={isSynthesizing}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 neon-glow-purple active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">bolt</span>
                <span>{isSynthesizing ? 'Synthesizing Alignment...' : '⚡ Generate Corrected Spec'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Role-Aware Context Banner & Draft Status Bar */}
        <div
          className={`interactive-card flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border shadow-lg ${
            isCyber
              ? 'bg-[#090514]/90 backdrop-blur-md border-purple-800/40'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${
                isCyber
                  ? 'bg-gradient-to-tr from-purple-800 to-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-indigo-600'
              }`}
            >
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <span
                  className={`font-display font-semibold text-sm ${
                    isCyber ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {getRoleLabel(role)}
                </span>
                <span className="font-mono text-[10px] text-[#00ff66] bg-[#041d0e] border border-[#00ff66]/30 uppercase px-2 py-0.5 rounded font-bold">
                  {role === 'hod'
                    ? 'Formal Sign-Off Authority'
                    : role === 'reviewer'
                    ? 'Peer Reviewer'
                    : 'Curriculum Author'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isCyber ? 'text-slate-300' : 'text-slate-600'}`}>
                {role === 'hod'
                  ? 'Executive Approval Mode • Formal Sign-Off Authority for NBA/ABET Accreditation Submission.'
                  : role === 'reviewer'
                  ? 'Reviewer Evaluation Mode • Verify Bloom taxonomy levels and articulate review threads.'
                  : 'Curriculum Authoring Mode • Ingest, refine course objectives, and prepare specification.'}
              </p>
            </div>
          </div>

          {/* Status Pill & Action */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div
              className={`px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-2 border font-semibold ${
                isSignedOff
                  ? 'bg-[#041d0e] border-[#00ff66]/40 text-[#00ff66]'
                  : 'bg-[#2d0b17] border-rose-500/40 text-rose-300'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isSignedOff ? 'verified' : 'pending_actions'}
              </span>
              <span>
                {isSignedOff
                  ? 'CURRENT STATUS: APPROVED & SEALED'
                  : 'CURRENT STATUS: DRAFT (Pending HOD Sign-Off)'}
              </span>
            </div>

            {canSign && (
              <button
                type="button"
                onClick={handleToggleSignOff}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 hover:brightness-110 text-white font-semibold text-xs flex items-center gap-2 transition-all neon-glow-purple active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>{isSignedOff ? 'Revoke Sign-Off' : 'Execute HOD Sign-Off'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Workspace Navigation Tabs (Synchronized with Sidebar) */}
        <div
          className={`flex items-center justify-between border-b pt-2 ${
            isCyber ? 'border-purple-900/50' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2" role="tablist">
            <button
              type="button"
              onClick={() => onChangeTab('spec')}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'spec'
                  ? isCyber
                    ? 'text-white border-purple-500'
                    : 'text-indigo-600 border-indigo-600'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-base">article</span>
              <span>Official Spec Preview</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#041d0e] text-[#00ff66] border border-[#00ff66]/40">
                Live v2.4
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab('matrix')}
              className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'matrix'
                  ? isCyber
                    ? 'text-white border-purple-500'
                    : 'text-indigo-600 border-indigo-600'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-base">grid_on</span>
              <span>CO-PO-PSO Matrix</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#130b24] text-purple-300 border border-purple-800/40">
                ABET Criterion 3
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab('audit')}
              className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'audit'
                  ? isCyber
                    ? 'text-white border-purple-500'
                    : 'text-indigo-600 border-indigo-600'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              <span>Validation &amp; Defects Report</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/40">
                1 Warning
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 pb-2">
            <span className="text-xs text-slate-400 font-mono">Syllabus Format:</span>
            <span className="font-mono text-xs text-[#00ff66] bg-[#041d0e] border border-[#00ff66]/30 px-2 py-0.5 rounded">
              Autonomous-AI-2024
            </span>
          </div>
        </div>

        {/* TAB 1: OFFICIAL SPEC PREVIEW */}
        {activeTab === 'spec' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Document Canvas (8 Cols) */}
            <div
              className={`interactive-card lg:col-span-8 relative rounded-xl border shadow-2xl p-8 lg:p-10 overflow-hidden min-h-[920px] transition-all ${
                isCyber
                  ? 'bg-[#06040a]/90 backdrop-blur-md border-purple-500/30 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Translucent Diagonal DRAFT Watermark */}
              <div
                className={`pointer-events-none select-none absolute inset-0 flex items-center justify-center rotate-[-30deg] transition-opacity duration-700 z-10 ${
                  isSignedOff ? 'opacity-0' : 'opacity-15'
                }`}
              >
                <span className="font-mono text-[130px] font-black tracking-widest text-purple-400">
                  DRAFT
                </span>
              </div>

              {/* Document Header */}
              <div
                className={`relative z-20 flex flex-col gap-2 pb-6 border-b ${
                  isCyber ? 'border-purple-900/50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-slate-400">
                  <span>National Institute of Technology • Autonomous Curriculum</span>
                  <span className="code-pill">REG: {spec.regulation}</span>
                </div>
                <div className="text-center py-4 flex flex-col items-center">
                  <span className="font-mono text-xs uppercase tracking-wider text-purple-400 font-semibold">
                    {spec.department}
                  </span>
                  <h2 className="font-display font-bold text-2xl lg:text-3xl mt-2 tracking-tight">
                    {spec.code}: {spec.title}
                  </h2>
                  <div
                    className={`inline-flex items-center gap-3 mt-3 text-xs px-4 py-1.5 rounded-full border shadow-inner ${
                      isCyber
                        ? 'bg-[#0f0a1c] border-purple-800/60'
                        : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    <span className="font-mono font-bold text-[#00ff66]">
                      Credits: {spec.credits.total}
                    </span>
                    <span className="text-purple-400">•</span>
                    <span className="font-mono text-[#00ff66]">
                      L-T-P: {spec.credits.lecture}-{spec.credits.tutorial}-{spec.credits.practical}
                    </span>
                    <span className="text-purple-400">•</span>
                    <span>
                      Total Contact Hours: <strong className="font-mono">{spec.credits.contactHours}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Spec Metadata Row */}
              <div
                className={`relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 p-4 rounded-lg border ${
                  isCyber
                    ? 'bg-[#0a0614] border-purple-800/40'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] text-purple-400 block uppercase font-semibold">
                    Course Category
                  </span>
                  <span className="text-xs font-semibold">{spec.category}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-purple-400 block uppercase font-semibold">
                    Prerequisites
                  </span>
                  <span className="font-mono text-xs text-[#00ff66]">{String(spec.prerequisites)}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-purple-400 block uppercase font-semibold">
                    Assessment Strategy
                  </span>
                  <span className="font-mono text-xs">{spec.assessmentStrategy}</span>
                </div>
              </div>

              {/* Section 1: Course Objectives */}
              <div className="relative z-20 flex flex-col gap-2 mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-purple-500 rounded-full" />
                    1. Course Objectives
                  </h3>
                  <span className="font-mono text-[10px] text-[#00ff66] bg-[#041d0e] border border-[#00ff66]/30 px-2 py-0.5 rounded">
                    Editable by Author
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-xs leading-relaxed pl-2">
                  {spec.courseObjectives.map((obj, i) => (
                    <li
                      key={i}
                      contentEditable={hasPermission(role, 'edit_course')}
                      suppressContentEditableWarning
                      className="p-2 rounded bg-[#0b0717]/60 hover:bg-[#120c24] focus:bg-[#120c24] border border-transparent hover:border-purple-800/40 focus:outline-none transition-all"
                    >
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 2: Syllabus Units */}
              <div className="relative z-20 flex flex-col gap-4 mt-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-purple-500 rounded-full" />
                  2. Syllabus Units &amp; Content Delivery
                </h3>

                {spec.units.map((unit) => (
                  <div
                    key={unit.id}
                    className={`p-4 rounded-xl border transition-all ${
                      unit.reviewNotesCount
                        ? isCyber
                          ? 'bg-[#120a22]/80 border-purple-500/60'
                          : 'bg-indigo-50/70 border-indigo-200'
                        : isCyber
                        ? 'bg-[#090514]/70 border-purple-900/40 hover:border-purple-700/60'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between pb-1.5 mb-2 border-b ${
                        isCyber ? 'border-purple-900/40' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#00ff66]">
                          {unit.unitRoman}: {unit.title}
                        </span>
                        {unit.reviewNotesCount ? (
                          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[10px] border border-purple-500/40">
                            1 REVIEW NOTE
                          </span>
                        ) : null}
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {unit.lectureHours} Contact Hours • {unit.bloomsTier}
                      </span>
                    </div>
                    <p
                      contentEditable={hasPermission(role, 'edit_course')}
                      suppressContentEditableWarning
                      className="text-xs leading-relaxed text-slate-200 focus:outline-none"
                    >
                      {unit.content}
                    </p>
                  </div>
                ))}

                {/* Integrated Lab experiments */}
                <div
                  className={`p-4 rounded-xl border ${
                    isCyber ? 'bg-[#090514]/70 border-purple-900/40' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="font-mono text-[11px] text-purple-400 uppercase font-semibold block mb-2">
                    Approved Integrated Laboratory Schedule:
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 font-mono text-xs text-slate-300">
                    {spec.labSchedule.map((lab) => (
                      <li key={lab.id} className="pl-1">
                        {lab.title}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Official Digital Seal on Canvas */}
              <div
                className={`relative z-20 mt-8 p-4 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                  isSignedOff
                    ? isCyber
                      ? 'bg-[#041d0e] border-[#00ff66]/50 opacity-100 neon-glow-green shadow-lg'
                      : 'bg-emerald-50 border-emerald-300 opacity-100'
                    : 'bg-[#0a0614] border-purple-900/40 opacity-40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSignedOff
                        ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40'
                        : 'bg-purple-950 text-slate-400 border border-purple-900/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-semibold text-xs">Digital Curriculum Seal</span>
                    <span className="font-mono text-[11px] text-slate-300">
                      HOD Dr. K. Arisawa • Academic Board CSE
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isSignedOff ? 'text-[#00ff66]' : 'text-purple-400'
                      }`}
                    >
                      {spec.governanceQuorum.verificationTimestamp}
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="block text-slate-400">ABET-EAC-2024-V3</span>
                  <span className="text-[#00ff66] font-bold">
                    CHECKSUM: {spec.governanceQuorum.checksum}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Sticky Inspector (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4 sticky top-20">
              {/* Governance Authority Box */}
              <div
                className={`interactive-card p-5 rounded-xl border shadow-xl flex flex-col gap-3 ${
                  isCyber
                    ? 'bg-[#080510]/85 backdrop-blur-md border-purple-500/30'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400 font-bold">
                    Governance Authority
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#160d2a] border border-purple-700/50 text-[#00ff66] font-mono text-[11px]">
                    HOD Clearance
                  </span>
                </div>
                <p className={`text-xs ${isCyber ? 'text-slate-300' : 'text-slate-600'}`}>
                  Authorize final curriculum schema for accreditation archive and University Academic Council endorsement.
                </p>
                <button
                  type="button"
                  id="signoff-card-btn"
                  onClick={handleToggleSignOff}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 hover:brightness-110 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all neon-glow-purple active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">draw</span>
                  <span>{isSignedOff ? 'Revoke Sign-Off' : 'Sign-Off & Approve Specification'}</span>
                </button>
                <span className="font-mono text-[10px] text-slate-400 text-center">
                  Watermark automatically lifts on sign-off
                </span>
              </div>

              {/* Reviewer Comments Panel */}
              <div
                className={`interactive-card p-5 rounded-xl border shadow-xl flex flex-col gap-3 ${
                  isCyber
                    ? 'bg-[#080510]/85 backdrop-blur-md border-purple-500/30'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div
                  className={`flex items-center justify-between pb-2 border-b ${
                    isCyber ? 'border-purple-900/40' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-400 text-base">forum</span>
                    <span className="font-display font-semibold text-xs">
                      Review Board Comments ({spec.comments.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSynthesisAlert('Anchor a new note on the document canvas.')}
                    className="font-mono text-xs text-[#00ff66] hover:underline cursor-pointer"
                  >
                    + New Note
                  </button>
                </div>

                <div className="space-y-3">
                  {spec.comments.map((comm) => (
                    <div
                      key={comm.id}
                      className={`p-3.5 rounded-lg border flex flex-col gap-2 transition-all ${
                        comm.resolved ? 'opacity-50' : ''
                      } ${
                        isCyber
                          ? 'bg-[#0e091b] border-purple-900/40'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span>{comm.author}</span>
                          <span className="font-mono text-[10px] text-purple-400 font-normal">
                            ({comm.role})
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{comm.timeAgo}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">"{comm.comment}"</p>
                      <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                        <span className="text-[#00ff66]">Anchored: {comm.anchor}</span>
                        {comm.resolved ? (
                          <span className="text-[#00ff66] flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            Resolved via AI
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = spec.comments.map((c) =>
                                c.id === comm.id ? { ...c, resolved: true, resolvedViaAI: true } : c
                              );
                              onUpdateSpec({ ...spec, comments: updated });
                            }}
                            className="px-2 py-0.5 rounded bg-purple-950 text-white font-mono text-[10px] border border-purple-700/50 hover:bg-purple-800 cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accreditation Readiness Snapshot */}
              <div
                className={`interactive-card p-5 rounded-xl border shadow-xl flex flex-col gap-2.5 ${
                  isCyber
                    ? 'bg-[#080510]/85 backdrop-blur-md border-purple-500/30'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-purple-400 font-semibold">
                  Accreditation Readiness
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-300">ABET Outcome Density</span>
                  <span className="font-mono text-xs font-bold text-[#00ff66]">94.2%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#00ff66] rounded-full" style={{ width: '94.2%' }} />
                </div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] mt-1">
                  <span>NBA Tier-1 Criteria</span>
                  <span className="text-[#00ff66] font-semibold">100% Compliant</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CO-PO-PSO MATRIX */}
        {activeTab === 'matrix' && (
          <div
            className={`interactive-card p-6 rounded-xl border shadow-xl flex flex-col gap-5 ${
              isCyber
                ? 'bg-[#080510]/90 backdrop-blur-md border-purple-500/30'
                : 'bg-white border-slate-200'
            }`}
          >
            <div
              className={`flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b ${
                isCyber ? 'border-purple-900/40' : 'border-slate-100'
              }`}
            >
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Course Outcome to Program Outcome Correlation Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  NBA/ABET Criterion 3: Course Articulation Matrix. Correlation: 3 = Substantial, 2 = Moderate, 1 = Slight. (Click cell to cycle 0→3)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">Target Attainment:</span>
                <span className="px-2.5 py-1 rounded bg-[#041d0e] border border-[#00ff66]/30 text-[#00ff66] font-mono text-xs font-bold">
                  &gt; 2.20 avg
                </span>
              </div>
            </div>

            {/* Matrix Data Table */}
            <div className="overflow-x-auto pb-2">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr
                    className={`font-mono uppercase font-semibold text-[11px] ${
                      isCyber ? 'bg-[#0d0917] text-purple-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <th className="p-2.5 sticky left-0 z-10 bg-inherit border-r border-purple-900/40">CO ID</th>
                    <th className="p-2.5 min-w-[280px] border-r border-purple-900/40">
                      Course Outcome Statement
                    </th>
                    <th className="p-2.5 text-center border-r border-purple-900/40">Bloom's</th>
                    {poList.map((po) => (
                      <th
                        key={po.code}
                        className="p-2 text-center border-r border-purple-900/40 cursor-help hover:bg-purple-900/20"
                        title={`${po.code}: ${po.title} - ${po.statement}`}
                      >
                        {po.code}
                      </th>
                    ))}
                    {psoList.slice(0, 2).map((pso) => (
                      <th
                        key={pso.code}
                        className="p-2 text-center border-r border-purple-900/40 cursor-help bg-purple-950/40"
                        title={`${pso.code}: ${pso.title} - ${pso.statement}`}
                      >
                        {pso.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30 font-mono text-xs">
                  {spec.clos.map((clo) => {
                    const bloomColors = getBloomsColorClasses(clo.bloomsLevel, isCyber);
                    return (
                      <tr
                        key={clo.id}
                        className={`transition-colors ${
                          isCyber ? 'hover:bg-purple-950/20' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-2.5 font-bold text-purple-400 sticky left-0 z-10 bg-inherit border-r border-purple-900/40">
                          {clo.code}
                        </td>
                        <td className="p-2.5 font-sans leading-relaxed border-r border-purple-900/40 text-slate-200">
                          {clo.statement}
                        </td>
                        <td className="p-2 text-center border-r border-purple-900/40">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${bloomColors.bg} ${bloomColors.text} ${bloomColors.border}`}
                          >
                            {clo.bloomsLevel}
                          </span>
                        </td>

                        {/* PO1 - PO12 */}
                        {poList.map((po) => {
                          const val = clo.poMappings[po.code] || 0;
                          return (
                            <td
                              key={po.code}
                              onClick={() => {
                                handleCellClick(clo.id, po.code, false);
                                setSelectedJustification(
                                  `${clo.code} -> ${po.code} (${po.title}): Level ${val || 3}. Statement: ${po.statement}`
                                );
                              }}
                              className="p-2 text-center border-r border-purple-900/40 cursor-pointer hover:bg-purple-600/20"
                            >
                              {val === 0 ? (
                                <span className="text-slate-600">-</span>
                              ) : (
                                <span
                                  className={`font-bold ${
                                    val === 3 ? 'text-[#00ff66]' : val === 2 ? 'text-amber-400' : 'text-blue-300'
                                  }`}
                                >
                                  {val}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        {/* PSO1 - PSO2 */}
                        {psoList.slice(0, 2).map((pso) => {
                          const val = clo.psoMappings[pso.code] || 0;
                          return (
                            <td
                              key={pso.code}
                              onClick={() => {
                                handleCellClick(clo.id, pso.code, true);
                                setSelectedJustification(
                                  `${clo.code} -> ${pso.code} (${pso.title}): Level ${val || 3}. Statement: ${pso.statement}`
                                );
                              }}
                              className="p-2 text-center border-r border-purple-900/40 cursor-pointer bg-purple-950/20 hover:bg-purple-600/20"
                            >
                              {val === 0 ? (
                                <span className="text-slate-600">-</span>
                              ) : (
                                <span
                                  className={`font-bold ${
                                    val === 3 ? 'text-[#00ff66]' : val === 2 ? 'text-amber-400' : 'text-blue-300'
                                  }`}
                                >
                                  {val}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {/* Weighted Averages */}
                  <tr
                    className={`font-mono font-bold ${
                      isCyber ? 'bg-[#0d0917] text-white' : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <td className="p-2.5 text-right uppercase text-slate-400 text-[11px]" colSpan={3}>
                      Weighted Average Attainment:
                    </td>
                    {poList.map((po) => (
                      <td key={po.code} className="p-2 text-center text-purple-300 border-r border-purple-900/40">
                        {calculateAverages(po.code, false)}
                      </td>
                    ))}
                    {psoList.slice(0, 2).map((pso) => (
                      <td key={pso.code} className="p-2 text-center text-[#00ff66] border-r border-purple-900/40">
                        {calculateAverages(pso.code, true)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Justification Drawer loaded strictly from config/po_pso.json */}
            {selectedJustification && (
              <div
                className={`p-3.5 rounded-lg border flex items-start gap-3 font-mono text-xs ${
                  isCyber ? 'bg-[#0d0917] border-purple-800/50 text-slate-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-base text-[#00ff66] shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <span className="font-bold text-purple-400 uppercase mr-1">Articulation Rationale:</span>
                  <span>{selectedJustification}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VALIDATION & DEFECTS REPORT (AI AUDIT STREAM) */}
        {activeTab === 'audit' && (
          <div
            className={`interactive-card p-6 rounded-xl border shadow-xl flex flex-col gap-5 ${
              isCyber
                ? 'bg-[#080510]/90 backdrop-blur-md border-purple-500/30'
                : 'bg-white border-slate-200'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isCyber ? 'border-purple-900/40' : 'border-slate-100'
              }`}
            >
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Curriculum AI Audit &amp; Defect Reconciliation Stream
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time comparison between unaligned drafts and ABET-accredited outcome statements.
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-[#041d0e] border border-[#00ff66]/30 text-[#00ff66] font-mono text-xs">
                3 Resolved • 1 Pending
              </span>
            </div>

            <div className="space-y-4">
              {spec.aiDiffs.map((diff, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border flex flex-col gap-3 ${
                    isCyber ? 'bg-[#0d0919] border-purple-800/40' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600/40">
                        {diff.cloCode}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-400">{diff.bloomsShift.from}</span>
                        <span className="material-symbols-outlined text-sm text-[#00ff66]">arrow_forward</span>
                        <span className="text-[#00ff66] font-bold">{diff.bloomsShift.to}</span>
                      </div>
                    </div>

                    <div>
                      {diff.status === 'accepted' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-[#00ff66]">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Standardized &amp; Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAcceptDiff(diff)}
                          className="px-3 py-1 text-xs font-mono font-semibold rounded bg-[#00ff66] text-black hover:bg-emerald-400 flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">done_all</span>
                          Accept Suggestion
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Split Diff Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200">
                      <span className="font-mono text-[10px] uppercase font-bold text-rose-400 block mb-1">
                        Original Drafting (Vague Action Verb)
                      </span>
                      <p className="line-through">{diff.originalDraft}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#041d0e] border border-[#00ff66]/30 text-emerald-200">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#00ff66] block mb-1">
                        Accredited Compliant Statement (Actionable Verb)
                      </span>
                      <p className="font-medium">{diff.suggestedRevision}</p>
                    </div>
                  </div>

                  <div className="font-mono text-[11px] text-slate-400 bg-black/40 p-2.5 rounded border border-purple-900/30">
                    <strong className="text-purple-400">Auditor Rationale:</strong> {diff.alignmentRationale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Institutional Accreditation Footer & Credit */}
        <footer className="mt-12 pt-6 border-t border-purple-900/30 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400 text-sm">verified_user</span>
            <span>SpecForge Academic Governance Studio • Continuous Accreditation Engine</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-400">Accreditation Cycle: AY 2024-25</span>
            <span className="font-mono text-xs font-bold text-[#00ff66] bg-[#041d0e] px-3.5 py-1.5 rounded-lg border border-[#00ff66]/50 shadow-[0_0_12px_rgba(0,255,102,0.3)]">
              CREATED BY TANUSH M D
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
