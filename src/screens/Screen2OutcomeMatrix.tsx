import React, { useState } from 'react';
import { CourseSpecification, UserRole, ThemeMode, CLOItem, AIDiffEntry } from '../types';
import { getPOList, getPSOList, getBloomsLevels, getBloomsColorClasses, getPOByCode, getPSOByCode, getBloomsByCode } from '../annexure';
import { hasPermission, getAIHeaders } from '../api';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Info,
  RefreshCw,
  Plus
} from 'lucide-react';

interface Screen2Props {
  spec: CourseSpecification;
  role: UserRole;
  theme: ThemeMode;
  onUpdateSpec: (updated: CourseSpecification) => void;
  onOpenAnnexure: () => void;
}

export const Screen2OutcomeMatrix: React.FC<Screen2Props> = ({
  spec,
  role,
  theme,
  onUpdateSpec,
  onOpenAnnexure,
}) => {
  const isCyber = theme === 'cyber';
  const poList = getPOList();
  const psoList = getPSOList();
  const bloomsList = getBloomsLevels();

  const [hoveredHeader, setHoveredHeader] = useState<{ code: string; title: string; statement: string } | null>(null);
  const [optimizingCLO, setOptimizingCLO] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const canEdit = hasPermission(role, 'edit_course');
  const canAcceptDiff = hasPermission(role, 'accept_ai_diff');

  // Cell level toggle (0 -> 1 -> 2 -> 3 -> 0)
  const handleCellClick = (cloId: string, targetKey: string, isPSO: boolean) => {
    if (!canEdit) return;

    const updatedCLOs = spec.clos.map((clo) => {
      if (clo.id !== cloId) return clo;
      if (isPSO) {
        const current = clo.psoMappings[targetKey] || 0;
        const next = (current + 1) % 4;
        return {
          ...clo,
          psoMappings: { ...clo.psoMappings, [targetKey]: next },
        };
      } else {
        const current = clo.poMappings[targetKey] || 0;
        const next = (current + 1) % 4;
        return {
          ...clo,
          poMappings: { ...clo.poMappings, [targetKey]: next },
        };
      }
    });

    onUpdateSpec({ ...spec, clos: updatedCLOs });
  };

  // Calculate PO & PSO Average Attainment Weights
  const calculateAverages = (key: string, isPSO: boolean) => {
    let total = 0;
    let count = 0;
    spec.clos.forEach((clo) => {
      const val = isPSO ? clo.psoMappings[key] : clo.poMappings[key];
      if (val && val > 0) {
        total += val;
        count += 1;
      }
    });
    return count > 0 ? (total / count).toFixed(1) : '-';
  };

  // Cognitive Tier distribution calculation
  const bloomsDistribution = bloomsList.map((bloom) => {
    const count = spec.clos.filter((c) => c.bloomsLevel.toUpperCase() === bloom.code.toUpperCase()).length;
    return { ...bloom, count };
  });

  const higherOrderCount = spec.clos.filter((c) => ['L3', 'L4', 'L5', 'L6'].includes(c.bloomsLevel.toUpperCase())).length;
  const higherOrderPercent = Math.round((higherOrderCount / Math.max(spec.clos.length, 1)) * 100);

  // Handle Accepting AI Diff
  const handleAcceptDiff = (diff: AIDiffEntry) => {
    const targetBloomsCode = diff.bloomsShift.to.split(' ')[0]; // extract e.g. "L3" or "L6"
    const updatedCLOs = spec.clos.map((clo) => {
      if (clo.code === diff.cloCode) {
        return {
          ...clo,
          statement: diff.suggestedRevision,
          bloomsLevel: targetBloomsCode,
        };
      }
      return clo;
    });

    const updatedDiffs = spec.aiDiffs.map((d) =>
      d.cloCode === diff.cloCode ? { ...d, status: 'accepted' as const } : d
    );

    const updatedSpec: CourseSpecification = {
      ...spec,
      clos: updatedCLOs,
      aiDiffs: updatedDiffs,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          actor: 'Curriculum Auditor Engine',
          role: 'AI Verification System',
          action: `AI Standardized Outcome Accepted for ${diff.cloCode}`,
          rationale: `Applied revised statement: "${diff.suggestedRevision.slice(0, 50)}..." and upgraded Bloom level to ${targetBloomsCode}.`,
          verificationHash: '0x' + Math.random().toString(16).substring(2, 10),
        },
        ...spec.auditTrail,
      ],
    };

    onUpdateSpec(updatedSpec);
    setFeedback(`Standardized outcome and Bloom's alignment accepted for ${diff.cloCode}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Run AI Optimization on a CLO
  const handleRunAIOptimization = async (clo: CLOItem) => {
    setOptimizingCLO(clo.code);
    const headers = getAIHeaders();

    // Simulate AI audit delay while verifying headers
    await new Promise((res) => setTimeout(res, 900));

    // Construct AI suggestion based on Annexure A Bloom verbs
    const higherBloom = clo.bloomsLevel === 'L3' ? 'L5' : 'L6';
    const bloomMeta = getBloomsByCode(higherBloom);
    const verb = bloomMeta?.actionVerbs[0] || 'Architect';

    const newDiff: AIDiffEntry = {
      cloCode: clo.code,
      originalDraft: clo.statement,
      suggestedRevision: `${verb} scalable distributed components and verify fault invariants in accord with ABET accreditation benchmarks.`,
      bloomsShift: { from: `${clo.bloomsLevel} (Current)`, to: `${higherBloom} (${bloomMeta?.name || 'Create'})` },
      alignmentRationale: `Elevated from ${clo.bloomsLevel} to ${higherBloom} utilizing verified Annexure A verb "${verb}" for rigorous senior-level engineering competencies.`,
      status: 'pending',
    };

    const existingDiffIdx = spec.aiDiffs.findIndex((d) => d.cloCode === clo.code);
    let nextDiffs = [...spec.aiDiffs];
    if (existingDiffIdx >= 0) {
      nextDiffs[existingDiffIdx] = newDiff;
    } else {
      nextDiffs.push(newDiff);
    }

    onUpdateSpec({ ...spec, aiDiffs: nextDiffs });
    setOptimizingCLO(null);
    setFeedback(`AI Bloom audit generated for ${clo.code} with header ${headers['x-llm-model']}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded border flex items-center justify-between text-xs font-mono-code transition-all ${
            isCyber
              ? 'bg-[#002107] border-[#22c55e] text-[#00ff66] cyber-glow-green'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner: Bloom's Cognitive Tier Summary & Annexure Link */}
      <div
        className={`p-6 rounded-lg border ${
          isCyber ? 'cyber-card-bg text-[#e5e1e7]' : 'academic-card'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#4338ca] dark:text-[#c084fc]" />
              <h2
                className={`text-base font-bold uppercase tracking-wide ${
                  isCyber ? 'font-headline text-white' : 'text-[#0f172a]'
                }`}
              >
                Bloom's Revised Taxonomy Cognitive Distribution
              </h2>
            </div>
            <p className={`text-xs ${isCyber ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
              Verified against Annexure A standard definitions. Higher-order thinking (L3–L6) required: ≥ 80% for autonomous final year.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded border text-xs font-mono-code ${
                higherOrderPercent >= 80
                  ? isCyber
                    ? 'bg-[#002107] border-[#22c55e] text-[#00ff66]'
                    : 'bg-[#ccfbf1] border-[#99f6e4] text-[#115e59]'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}
            >
              Higher-Order Index: <span className="font-bold">{higherOrderPercent}%</span> ({higherOrderCount}/{spec.clos.length} CLOs)
            </div>

            <button
              onClick={onOpenAnnexure}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                isCyber
                  ? 'border-[#a855f7]/40 text-[#c084fc] hover:bg-[#a855f7]/20 font-mono-code'
                  : 'border-[#cbd5e1] text-[#0f172a] hover:bg-[#f8fafc]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Open Annexure A Drawer
            </button>
          </div>
        </div>

        {/* Bloom's Cognitive Tier Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {bloomsDistribution.map((bloom) => {
            const colors = getBloomsColorClasses(bloom.code, isCyber);
            return (
              <div
                key={bloom.code}
                className={`p-3 rounded border transition-all ${
                  isCyber ? 'bg-[#050508] border-[#a855f7]/20' : 'bg-[#f8fafc] border-[#e2e8f0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`px-2 py-0.5 text-xs font-mono-code font-bold rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    {bloom.code}
                  </span>
                  <span className="text-xs font-mono-code font-bold">
                    {bloom.count} {bloom.count === 1 ? 'CLO' : 'CLOs'}
                  </span>
                </div>
                <div className="text-xs font-semibold mb-1 truncate">{bloom.name}</div>
                <div className="text-[10px] text-slate-400 font-mono-code truncate">
                  {bloom.actionVerbs.slice(0, 3).join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Tabular Outcome Matrix */}
      <div
        className={`p-6 rounded-lg border overflow-hidden ${
          isCyber ? 'cyber-card-bg text-[#e5e1e7]' : 'academic-card'
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4338ca] dark:text-[#c084fc]" />
            <h2
              className={`text-sm font-semibold uppercase tracking-wider ${
                isCyber ? 'font-mono-code text-white' : 'text-[#0f172a]'
              }`}
            >
              CLO-PO / PSO Statutory Correlation Matrix
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono-code">
            <span className="text-slate-400">Correlation Scale:</span>
            <span className="text-slate-400">0: None</span>
            <span className="text-blue-500">1: Low</span>
            <span className="text-amber-500">2: Moderate</span>
            <span className="text-emerald-500 font-bold">3: Substantial</span>
            {canEdit && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                (Click cells to cycle 0→3)
              </span>
            )}
          </div>
        </div>

        {/* Hovered PO/PSO Statement Tooltip Bar */}
        {hoveredHeader && (
          <div
            className={`p-2.5 mb-3 rounded text-xs border flex items-start gap-2.5 transition-all ${
              isCyber
                ? 'bg-[#140c24] border-[#a855f7]/40 text-[#cfc2d6]'
                : 'bg-[#eff4ff] border-[#c7d2fe] text-[#1e1b4b]'
            }`}
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#4338ca] dark:text-[#c084fc]" />
            <div>
              <span className="font-bold font-mono-code mr-1.5">{hoveredHeader.code} - {hoveredHeader.title}:</span>
              <span>{hoveredHeader.statement}</span>
            </div>
          </div>
        )}

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className={isCyber ? 'bg-[#050508] text-white border-b border-[#a855f7]/30' : 'bg-[#f1f5f9] text-[#475569] border-b border-[#e2e8f0]'}>
                <th className="p-2 text-left font-mono-code uppercase w-20 sticky left-0 z-10 bg-inherit border-r border-slate-200 dark:border-slate-800">
                  CLO
                </th>
                <th className="p-2 text-left min-w-[280px] border-r border-slate-200 dark:border-slate-800">
                  Course Learning Outcome Statement (Annexure Aligned)
                </th>
                <th className="p-2 text-center font-mono-code w-16 border-r border-slate-200 dark:border-slate-800">
                  Bloom
                </th>

                {/* 12 Program Outcomes */}
                {poList.map((po) => (
                  <th
                    key={po.code}
                    onMouseEnter={() => setHoveredHeader(po)}
                    onMouseLeave={() => setHoveredHeader(null)}
                    className="p-2 text-center font-mono-code cursor-help hover:bg-[#4338ca]/10 transition-colors border-r border-slate-200 dark:border-slate-800 w-10"
                    title={`${po.code}: ${po.title} - ${po.statement}`}
                  >
                    {po.code}
                  </th>
                ))}

                {/* 3 Program Specific Outcomes */}
                {psoList.map((pso) => (
                  <th
                    key={pso.code}
                    onMouseEnter={() => setHoveredHeader(pso)}
                    onMouseLeave={() => setHoveredHeader(null)}
                    className="p-2 text-center font-mono-code cursor-help hover:bg-[#0d9488]/10 transition-colors border-r border-slate-200 dark:border-slate-800 w-12 bg-slate-200/50 dark:bg-slate-900/50"
                    title={`${pso.code}: ${pso.title} - ${pso.statement}`}
                  >
                    {pso.code}
                  </th>
                ))}

                <th className="p-2 text-center font-mono-code w-24">AI Audit</th>
              </tr>
            </thead>
            <tbody>
              {spec.clos.map((clo) => {
                const bloomColor = getBloomsColorClasses(clo.bloomsLevel, isCyber);
                const bloomDetail = getBloomsByCode(clo.bloomsLevel);

                return (
                  <tr
                    key={clo.id}
                    className={`border-b transition-colors ${
                      isCyber
                        ? 'border-slate-800/80 hover:bg-[#140c24]/50'
                        : 'border-slate-200 hover:bg-[#f8fafc]'
                    }`}
                  >
                    {/* CLO Code */}
                    <td className="p-2.5 font-mono-code font-bold sticky left-0 z-10 bg-inherit border-r border-slate-200 dark:border-slate-800">
                      {clo.code}
                    </td>

                    {/* Statement */}
                    <td className="p-2.5 leading-relaxed border-r border-slate-200 dark:border-slate-800">
                      <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">
                        {clo.statement}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-code">
                        Assessments: {clo.assessmentMethods.join(', ')}
                      </div>
                    </td>

                    {/* Bloom Level Badge */}
                    <td className="p-2.5 text-center border-r border-slate-200 dark:border-slate-800">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-mono-code font-bold rounded border cursor-help ${bloomColor.bg} ${bloomColor.text} ${bloomColor.border}`}
                        title={`${bloomDetail?.name || ''}: ${bloomDetail?.description || ''}`}
                      >
                        {clo.bloomsLevel}
                      </span>
                    </td>

                    {/* 12 PO Cells */}
                    {poList.map((po) => {
                      const val = clo.poMappings[po.code] || 0;
                      return (
                        <td
                          key={po.code}
                          onClick={() => handleCellClick(clo.id, po.code, false)}
                          className={`p-2 text-center font-mono-code border-r border-slate-200 dark:border-slate-800 ${
                            canEdit ? 'cursor-pointer hover:bg-indigo-500/10' : ''
                          }`}
                        >
                          {val === 0 ? (
                            <span className="text-slate-300 dark:text-slate-700">-</span>
                          ) : (
                            <span
                              className={`inline-block w-5 h-5 leading-5 rounded font-bold text-center ${
                                val === 3
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-[#00ff66]'
                                  : val === 2
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-400'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                              }`}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* 3 PSO Cells */}
                    {psoList.map((pso) => {
                      const val = clo.psoMappings[pso.code] || 0;
                      return (
                        <td
                          key={pso.code}
                          onClick={() => handleCellClick(clo.id, pso.code, true)}
                          className={`p-2 text-center font-mono-code border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 ${
                            canEdit ? 'cursor-pointer hover:bg-emerald-500/10' : ''
                          }`}
                        >
                          {val === 0 ? (
                            <span className="text-slate-300 dark:text-slate-700">-</span>
                          ) : (
                            <span
                              className={`inline-block w-5 h-5 leading-5 rounded font-bold text-center ${
                                val === 3
                                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-[#00ff66]'
                                  : val === 2
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-400'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                              }`}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* AI Audit Action */}
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleRunAIOptimization(clo)}
                        disabled={optimizingCLO === clo.code}
                        className={`p-1.5 rounded transition-colors text-xs font-mono-code ${
                          isCyber
                            ? 'hover:bg-[#a855f7]/20 text-[#c084fc]'
                            : 'hover:bg-[#e0e7ff] text-[#4338ca]'
                        }`}
                        title="Run AI Bloom verb audit on this outcome"
                      >
                        {optimizingCLO === clo.code ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Weight Averages Row */}
              <tr
                className={`font-mono-code font-bold ${
                  isCyber ? 'bg-[#050508] text-white' : 'bg-slate-100 text-[#0f172a]'
                }`}
              >
                <td className="p-2.5 sticky left-0 z-10 bg-inherit border-r border-slate-200 dark:border-slate-800">
                  AVG
                </td>
                <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                  Statutory Average Correlation Attainment
                </td>
                <td className="p-2.5 text-center border-r border-slate-200 dark:border-slate-800">-</td>

                {poList.map((po) => (
                  <td
                    key={po.code}
                    className="p-2 text-center border-r border-slate-200 dark:border-slate-800 text-[11px]"
                  >
                    {calculateAverages(po.code, false)}
                  </td>
                ))}

                {psoList.map((pso) => (
                  <td
                    key={pso.code}
                    className="p-2 text-center border-r border-slate-200 dark:border-slate-800 text-[11px] bg-slate-200/50 dark:bg-slate-900/50"
                  >
                    {calculateAverages(pso.code, true)}
                  </td>
                ))}

                <td className="p-2 text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Curriculum Diff & Audit Stream (As specified in DESIGN.md) */}
      <div
        className={`p-6 rounded-lg border ${
          isCyber ? 'cyber-card-bg text-[#e5e1e7]' : 'academic-card'
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4338ca] dark:text-[#c084fc]" />
            <h2
              className={`text-sm font-semibold uppercase tracking-wider ${
                isCyber ? 'font-mono-code text-white' : 'text-[#0f172a]'
              }`}
            >
              Curriculum Diff & AI Accreditation Audit Stream
            </h2>
          </div>
          <span className="text-xs font-mono-code text-slate-400">
            {spec.aiDiffs.filter((d) => d.status === 'accepted').length} Accepted •{' '}
            {spec.aiDiffs.filter((d) => d.status === 'pending').length} Pending Review
          </span>
        </div>

        <p className={`text-xs mb-4 ${isCyber ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
          Compares unrefined instructor drafting against AI-standardized course outcomes aligned to Bloom's taxonomy and Washington Accord verbs.
        </p>

        <div className="space-y-4">
          {spec.aiDiffs.map((diff, idx) => (
            <div
              key={idx}
              className={`p-4 rounded border transition-all ${
                isCyber
                  ? 'bg-[#050508] border-[#a855f7]/20 hover:border-[#a855f7]/50'
                  : 'bg-white border-[#e2e8f0] shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs font-mono-code font-bold rounded ${
                      isCyber ? 'bg-[#a855f7]/20 text-[#c084fc]' : 'bg-[#0f172a] text-white'
                    }`}
                  >
                    {diff.cloCode}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono-code">
                    <span className="text-slate-400">{diff.bloomsShift.from}</span>
                    <ArrowRight className="w-3 h-3 text-[#4338ca] dark:text-[#00ff66]" />
                    <span className="font-bold text-[#4338ca] dark:text-[#00ff66]">
                      {diff.bloomsShift.to}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {diff.status === 'accepted' ? (
                    <span
                      className={`px-2 py-0.5 text-xs font-mono-code font-bold rounded flex items-center gap-1 ${
                        isCyber
                          ? 'bg-[#002107] text-[#00ff66] border border-[#22c55e]'
                          : 'bg-[#ccfbf1] text-[#115e59] border border-[#99f6e4]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Standardized & Integrated
                    </span>
                  ) : canAcceptDiff ? (
                    <button
                      onClick={() => handleAcceptDiff(diff)}
                      className={`px-3 py-1 text-xs font-semibold rounded text-white flex items-center gap-1.5 transition-colors shadow-xs ${
                        isCyber
                          ? 'bg-[#a855f7] hover:bg-[#9333ea] text-black font-mono-code uppercase font-bold'
                          : 'bg-[#0f172a] hover:bg-[#1e293b]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accept Standardized Statement
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono-code">
                      Pending Committee Approval
                    </span>
                  )}
                </div>
              </div>

              {/* Split Diff Lanes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
                {/* Left lane: deletion / draft */}
                <div
                  className={`p-3 rounded border ${
                    isCyber
                      ? 'bg-[#310c0c]/40 border-[#f43f5e]/40 text-[#fecaca]'
                      : 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono-code block mb-1 font-bold opacity-75">
                    Original Instructor Text (Vague Verb)
                  </span>
                  <div className="line-through">{diff.originalDraft}</div>
                </div>

                {/* Right lane: addition / compliant standardized */}
                <div
                  className={`p-3 rounded border ${
                    isCyber
                      ? 'bg-[#002107]/40 border-[#22c55e]/40 text-[#a7f3d0]'
                      : 'bg-[#ccfbf1] border-[#99f6e4] text-[#0f766e]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono-code block mb-1 font-bold opacity-75">
                    Accredited Compliant Statement (Actionable Verb)
                  </span>
                  <div className="font-medium">{diff.suggestedRevision}</div>
                </div>
              </div>

              {/* Rationale */}
              <div
                className={`text-xs px-3 py-2 rounded font-mono-code ${
                  isCyber ? 'bg-[#0a0612] text-[#cfc2d6]' : 'bg-slate-50 text-slate-600'
                }`}
              >
                <span className="font-bold text-[#4338ca] dark:text-[#c084fc]">Auditor Rationale:</span>{' '}
                {diff.alignmentRationale}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
