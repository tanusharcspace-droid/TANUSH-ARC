import React from 'react';
import { CourseSpecification, ThemeMode } from '../types';
import { annexureA, getBloomsByCode } from '../annexure';
import { X, Printer, Download, CheckCircle2, Shield } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  spec: CourseSpecification;
  theme: ThemeMode;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, spec, theme }) => {
  if (!isOpen) return null;
  const isCyber = theme === 'cyber';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const exportPayload = {
      input_id: spec.input_id || "SAMPLE",
      ...spec
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'specforge_output.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg border shadow-2xl overflow-hidden ${
          isCyber
            ? 'bg-[#0a0612] text-[#f3f4f6] border-[#a855f7]/40 cyber-glow-purple'
            : 'bg-white text-[#0f172a] border-slate-300'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isCyber ? 'border-[#a855f7]/20 bg-[#050508]' : 'border-slate-200 bg-[#f8fafc]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#4338ca] dark:text-[#c084fc]" />
            <div>
              <h2 className="text-base font-bold">Official Accredited Course Specification Document</h2>
              <p className="text-xs text-slate-500 font-mono-code">
                Format: Tier-1 Autonomous Curriculum Gazette • {spec.code}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                isCyber
                  ? 'border-[#a855f7]/40 text-[#c084fc] hover:bg-[#a855f7]/20'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              JSON Payload
            </button>
            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded text-white transition-colors ${
                isCyber ? 'bg-[#a855f7] text-black font-bold' : 'bg-[#0f172a] hover:bg-slate-800'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-xs bg-white text-slate-900 leading-relaxed font-serif">
          {/* Institution Header */}
          <div className="text-center border-b pb-4 space-y-1">
            <div className="text-base font-bold uppercase tracking-widest text-slate-900 font-sans">
              Autonomous Institute of Technology & Engineering
            </div>
            <div className="text-xs uppercase font-sans text-slate-600">
              {spec.department} • {spec.program}
            </div>
            <div className="text-xs font-mono font-semibold text-slate-500">
              COURSE SPECIFICATION DOSSIER — {spec.academicYear} ({spec.regulation})
            </div>
          </div>

          {/* Core Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 border p-4 bg-slate-50 text-[11px] font-sans">
            <div>
              <span className="font-bold text-slate-600 block">Course Code & Title:</span>
              <span className="font-semibold text-slate-900 text-xs">
                {spec.code || 'SPEC'}: {spec.title || 'Course Specification'}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block">Credits & Contact Hours:</span>
              <span>
                {spec.credits.lecture}L + {spec.credits.tutorial}T + {spec.credits.practical}P = {spec.credits.total} Credits ({spec.credits.contactHours} Hours)
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block">Lead Course Instructor:</span>
              <span>
                {spec.faculty.name || 'Unassigned Faculty'} {spec.faculty.designation ? `(${spec.faculty.designation})` : ''}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-600 block">Statutory Quorum Status:</span>
              <span className="font-semibold text-emerald-800">
                {spec.status.toUpperCase()} ({spec.governanceQuorum.hodSigned ? 'HOD & BoS Ratified' : 'Draft Protocol'})
              </span>
            </div>
          </div>

          {/* Course Overview */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2 text-slate-800">
              1. Course Overview & Scope
            </h3>
            <p className="text-slate-700">{spec.courseOverview || 'Course scope and catalog descriptions will be rendered upon syllabus ingestion.'}</p>
          </div>

          {/* CLO Statements */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2 text-slate-800">
              2. Course Learning Outcomes (CLOs)
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-[11px] font-sans">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 p-2 text-left w-16">CLO</th>
                  <th className="border border-slate-300 p-2 text-left">Outcome Statement</th>
                  <th className="border border-slate-300 p-2 text-center w-24">Bloom Level</th>
                </tr>
              </thead>
              <tbody>
                {spec.clos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="border border-slate-300 p-4 text-center text-slate-500">
                      No Course Learning Outcomes defined.
                    </td>
                  </tr>
                ) : (
                  spec.clos.map((clo) => {
                    const bloom = getBloomsByCode(clo.bloomsLevel);
                    return (
                      <tr key={clo.id}>
                        <td className="border border-slate-300 p-2 font-mono font-bold">{clo.code}</td>
                        <td className="border border-slate-300 p-2">{clo.statement}</td>
                        <td className="border border-slate-300 p-2 text-center font-mono">
                          {clo.bloomsLevel} ({bloom?.name})
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Modules Table */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2 text-slate-800">
              3. Modular Syllabus Distribution
            </h3>
            <div className="space-y-3 font-sans">
              {(spec.modules || spec.units || []).length === 0 ? (
                <div className="p-3 border text-slate-500 text-center">
                  No syllabus units or modules scheduled.
                </div>
              ) : (
                (spec.modules || spec.units || []).map((m: any, idx: number) => (
                  <div key={m.id || idx} className="border p-2.5">
                    <div className="flex justify-between font-bold mb-1">
                      <span>
                        Module {m.moduleNumber || idx + 1}: {m.title}
                      </span>
                      <span className="font-mono text-slate-500">{m.lectureHours} Hours</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{Array.isArray(m.topics) ? m.topics.join(' • ') : m.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ratification Sign-off strip */}
          <div className="pt-6 border-t font-sans grid grid-cols-3 gap-4 text-center">
            <div className="border-t border-slate-400 pt-2">
              <div className="font-semibold text-xs">{spec.faculty.name || 'Course Instructor'}</div>
              <div className="text-[10px] text-slate-500">Course Instructor Signature</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div className="font-semibold text-xs">DCC Chairperson</div>
              <div className="text-[10px] text-slate-500">Department Curriculum Committee</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div className="font-semibold text-xs">Dean of Academic Affairs</div>
              <div className="text-[10px] text-slate-500">Institutional Seal & Sanction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
