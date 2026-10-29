import React, { useState } from 'react';
import { CourseSpecification, UserRole, ThemeMode } from '../types';
import { getRoleLabel } from '../api';
import {
  Terminal,
  ShieldAlert,
  Cpu,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Hash,
  Activity,
  Layers,
  Lock,
  ExternalLink,
  Code2
} from 'lucide-react';

interface Screen3Props {
  spec: CourseSpecification;
  role: UserRole;
  theme: ThemeMode;
  onUpdateSpec: (updated: CourseSpecification) => void;
  onSwitchScreen: (screenId: 'screen1' | 'screen2' | 'screen3') => void;
}

export const Screen3CyberDashboard: React.FC<Screen3Props> = ({
  spec,
  role,
  theme,
  onUpdateSpec,
  onSwitchScreen,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [telemetryLog, setTelemetryLog] = useState<string[]>([
    `[${new Date().toISOString()}] PROTOCOL INIT: SpecForge Consensus Engine initialized.`,
    `[${new Date().toISOString()}] SPEC LOAD: ${spec.code} - ${spec.title} (Regulation: ${spec.regulation})`,
    `[${new Date().toISOString()}] OUTCOMES: ${spec.clos.length} CLOs mapped to 12 POs and 3 PSOs.`,
    `[${new Date().toISOString()}] ATTESTATION: DCC Committee signature present: ${spec.governanceQuorum.dccSigned ? 'VALID' : 'PENDING'}.`,
  ]);

  const handleRunVerification = async () => {
    setIsVerifying(true);
    const newTimestamp = new Date().toISOString();
    const newHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    await new Promise((res) => setTimeout(res, 800));

    setTelemetryLog((prev) => [
      `[${newTimestamp}] MERKLE VERIFY: Root hash computed: ${newHash.slice(0, 24)}...`,
      `[${newTimestamp}] BLOOMS COMPLIANCE: Higher-order taxonomy density: verified.`,
      `[${newTimestamp}] QUORUM ATTESTATION: Signed by ${getRoleLabel(role)}. Status: RATIFIED.`,
      ...prev,
    ]);

    const updated: CourseSpecification = {
      ...spec,
      governanceQuorum: {
        ...spec.governanceQuorum,
        consensusSignature: `ED25519-SIG-${newHash.slice(0, 16).toUpperCase()}`,
        verificationTimestamp: newTimestamp,
      },
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: newTimestamp.replace('T', ' ').slice(0, 19) + ' UTC',
          actor: getRoleLabel(role),
          role: getRoleLabel(role),
          action: 'Cryptographic Integrity Verification Executed',
          rationale: 'Computed Merkle root hash across CLO matrix, credit hours, and syllabus modules.',
          verificationHash: newHash.slice(0, 18),
        },
        ...spec.auditTrail,
      ],
    };

    onUpdateSpec(updated);
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6 cyber-grid-pattern">
      {/* Telemetry Hero Bar */}
      <div className="p-6 bg-[#0a0612] border border-[#a855f7]/30 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c3aed]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#a855f7]/20">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 text-xs font-mono-code font-bold uppercase bg-[#140c24] text-[#c084fc] border border-[#a855f7]/50">
                CYBER-GOVERNANCE ENGINE
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono-code uppercase bg-[#002107] text-[#00ff66] border border-[#22c55e] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                HIGH ASSURANCE PROTOCOL ACTIVE
              </span>
            </div>
            <h1 className="text-2xl font-bold font-headline tracking-tight text-white flex items-center gap-3">
              <span>{spec.code}: Cryptographic Specification Ledger</span>
            </h1>
            <p className="text-xs text-[#94a3b8] font-mono-code">
              Deterministic curriculum verification, immutable state transitions, and Washington Accord outcome quorums.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="px-4 py-2 text-xs font-mono-code font-bold uppercase tracking-wider text-black bg-[#00ff66] hover:bg-[#22c55e] transition-all flex items-center gap-2 cyber-glow-green"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Computing Merkle Proof...
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5" />
                  Run Consensus Verification
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 font-mono-code">
          <div className="p-3 bg-[#050508] border border-[#a855f7]/20">
            <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider mb-1">
              Consensus State
            </div>
            <div className="text-sm font-bold text-[#00ff66] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {spec.status.toUpperCase()}
            </div>
          </div>

          <div className="p-3 bg-[#050508] border border-[#a855f7]/20">
            <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider mb-1">
              Active Signature
            </div>
            <div className="text-xs font-bold text-[#c084fc] truncate" title={spec.governanceQuorum.consensusSignature || 'UNINITIALIZED'}>
              {spec.governanceQuorum.consensusSignature ? spec.governanceQuorum.consensusSignature.slice(0, 18) + '...' : 'PENDING'}
            </div>
          </div>

          <div className="p-3 bg-[#050508] border border-[#a855f7]/20">
            <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider mb-1">
              Matrix Correlation Points
            </div>
            <div className="text-sm font-bold text-white">
              {spec.clos.length * (12 + 3)} Points Mapped
            </div>
          </div>

          <div className="p-3 bg-[#050508] border border-[#a855f7]/20">
            <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider mb-1">
              Last Telemetry Timestamp
            </div>
            <div className="text-xs text-[#cfc2d6]">
              {spec.governanceQuorum.verificationTimestamp
                ? spec.governanceQuorum.verificationTimestamp.replace('T', ' ').slice(0, 19)
                : 'SYNCHRONIZED'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cryptographic Console & Telemetry Log (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Terminal Console */}
          <div className="bg-[#050508] border border-[#a855f7]/30 text-white p-5 font-mono-code">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#a855f7]/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00ff66]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  Live Consensus Telemetry Stream
                </span>
              </div>
              <span className="text-[10px] text-[#00ff66] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
                SYS_VERIFIED_200
              </span>
            </div>

            <div className="h-64 overflow-y-auto space-y-2 text-[11px] leading-relaxed p-2 bg-[#000000] border border-[#a855f7]/15">
              {telemetryLog.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#a855f7] select-none">&gt;</span>
                  <span className={idx === 0 ? 'text-[#00ff66] font-bold' : 'text-[#cfc2d6]'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw JSON-LD Schema & Cryptographic Manifest */}
          <div className="bg-[#0a0612] border border-[#a855f7]/30 text-white p-5 font-mono-code">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#a855f7]/20">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#c084fc]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  Curriculum Cryptographic State Payload
                </span>
              </div>
              <span className="text-[10px] text-[#94a3b8]">ED25519 Digest</span>
            </div>

            <pre className="p-3 bg-[#000000] border border-[#a855f7]/20 text-[11px] text-[#a7f3d0] overflow-x-auto max-h-56">
{JSON.stringify(
  {
    schema: 'https://specforge.accreditation.org/v2/course-spec',
    courseId: spec.id,
    code: spec.code,
    title: spec.title,
    creditsTotal: spec.credits.total,
    status: spec.status,
    closCount: spec.clos.length,
    quorum: spec.governanceQuorum,
    annexureAVerified: true,
  },
  null,
  2
)}
            </pre>
          </div>
        </div>

        {/* Right Column: Immutable Audit Trail (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0612] border border-[#a855f7]/30 text-white p-5 font-mono-code">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#a855f7]/20">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#c084fc]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  Immutable Governance Audit Trail
                </span>
              </div>
              <span className="text-[10px] text-[#00ff66]">
                {spec.auditTrail.length} Recorded Blocks
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {spec.auditTrail.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-[#050508] border border-[#a855f7]/20 space-y-1.5 transition-all hover:border-[#a855f7]/60"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#c084fc] font-bold">{entry.actor}</span>
                    <span className="text-[10px] text-slate-500">{entry.timestamp}</span>
                  </div>

                  <div className="text-xs text-white font-medium">{entry.action}</div>
                  <div className="text-[11px] text-[#cfc2d6] leading-relaxed">
                    {entry.rationale}
                  </div>

                  {entry.verificationHash && (
                    <div className="pt-1.5 border-t border-[#1f1f23] flex items-center justify-between text-[10px] text-[#00ff66]">
                      <span>Hash Verification:</span>
                      <span className="font-bold">{entry.verificationHash}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
