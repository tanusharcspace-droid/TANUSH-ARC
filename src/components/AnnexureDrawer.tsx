import React, { useState } from 'react';
import { annexureA, getBloomsColorClasses } from '../annexure';
import { ThemeMode } from '../types';
import { X, BookOpen, Layers, CheckCircle2, Search, ExternalLink } from 'lucide-react';

interface AnnexureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const AnnexureDrawer: React.FC<AnnexureDrawerProps> = ({ isOpen, onClose, theme }) => {
  const [activeTab, setActiveTab] = useState<'po' | 'pso' | 'blooms'>('po');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const isCyber = theme === 'cyber';

  const filteredPOs = annexureA.programOutcomes.filter(
    (po) =>
      po.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPSOs = annexureA.programSpecificOutcomes.filter(
    (pso) =>
      pso.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pso.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pso.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pso.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlooms = annexureA.bloomsLevels.filter(
    (b) =>
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.actionVerbs.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl h-full flex flex-col shadow-2xl transition-all border-l ${
          isCyber
            ? 'bg-[#0a0612] text-[#f3f4f6] border-[#a855f7]/30'
            : 'bg-white text-[#0f172a] border-[#cbd5e1]'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isCyber ? 'border-[#a855f7]/20 bg-[#050508]' : 'border-[#e2e8f0] bg-[#f8fafc]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded ${
                isCyber ? 'bg-[#a855f7]/20 text-[#c084fc]' : 'bg-[#e0e7ff] text-[#4338ca]'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`text-base font-semibold ${
                    isCyber ? 'font-headline text-white' : 'text-[#0f172a]'
                  }`}
                >
                  Statutory Reference Drawer
                </h2>
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono-code font-bold rounded ${
                    isCyber
                      ? 'bg-[#002107] text-[#00ff66] border border-[#22c55e]'
                      : 'bg-[#ccfbf1] text-[#115e59] border border-[#99f6e4]'
                  }`}
                >
                  {annexureA.version}
                </span>
              </div>
              <p
                className={`text-xs ${
                  isCyber ? 'text-[#94a3b8] font-mono-code' : 'text-[#64748b]'
                }`}
              >
                {annexureA.annexure}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded transition-colors ${
              isCyber
                ? 'hover:bg-[#1f1f23] text-[#94a3b8] hover:text-white'
                : 'hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Search */}
        <div
          className={`px-6 py-3 border-b space-y-3 ${
            isCyber ? 'border-[#a855f7]/20 bg-[#0e0e12]' : 'border-[#e2e8f0] bg-white'
          }`}
        >
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('po')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded border transition-colors ${
                activeTab === 'po'
                  ? isCyber
                    ? 'bg-[#a855f7]/20 border-[#a855f7] text-[#c084fc]'
                    : 'bg-[#4338ca] border-[#4338ca] text-white shadow-xs'
                  : isCyber
                  ? 'border-transparent text-[#94a3b8] hover:text-white'
                  : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              Program Outcomes (12 POs)
            </button>
            <button
              onClick={() => setActiveTab('pso')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded border transition-colors ${
                activeTab === 'pso'
                  ? isCyber
                    ? 'bg-[#a855f7]/20 border-[#a855f7] text-[#c084fc]'
                    : 'bg-[#4338ca] border-[#4338ca] text-white shadow-xs'
                  : isCyber
                  ? 'border-transparent text-[#94a3b8] hover:text-white'
                  : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              Program Specific (3 PSOs)
            </button>
            <button
              onClick={() => setActiveTab('blooms')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded border transition-colors ${
                activeTab === 'blooms'
                  ? isCyber
                    ? 'bg-[#a855f7]/20 border-[#a855f7] text-[#c084fc]'
                    : 'bg-[#4338ca] border-[#4338ca] text-white shadow-xs'
                  : isCyber
                  ? 'border-transparent text-[#94a3b8] hover:text-white'
                  : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              Bloom's Taxonomy (L1 - L6)
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toUpperCase()} statements, codes, or keywords...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded border transition-colors ${
                isCyber
                  ? 'bg-[#050508] border-[#a855f7]/30 text-white placeholder-slate-500 focus:border-[#c084fc]'
                  : 'bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a] placeholder-slate-400 focus:border-[#4338ca]'
              } outline-none font-mono-code`}
            />
          </div>
        </div>

        {/* Tab Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'po' && (
            <div className="space-y-3">
              {filteredPOs.map((po) => (
                <div
                  key={po.code}
                  className={`p-4 rounded border transition-all ${
                    isCyber
                      ? 'bg-[#050508] border-[#a855f7]/20 hover:border-[#a855f7]/50'
                      : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-mono-code font-bold rounded ${
                          isCyber
                            ? 'bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40'
                            : 'bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]'
                        }`}
                      >
                        {po.code}
                      </span>
                      <h3
                        className={`text-sm font-semibold ${
                          isCyber ? 'text-white' : 'text-[#0f172a]'
                        }`}
                      >
                        {po.title}
                      </h3>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-mono-code ${
                        isCyber
                          ? 'bg-[#140c24] text-[#cfc2d6]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {po.category}
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isCyber ? 'text-[#cfc2d6]' : 'text-[#475569]'
                    }`}
                  >
                    {po.statement}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pso' && (
            <div className="space-y-3">
              {filteredPSOs.map((pso) => (
                <div
                  key={pso.code}
                  className={`p-4 rounded border transition-all ${
                    isCyber
                      ? 'bg-[#050508] border-[#a855f7]/20 hover:border-[#a855f7]/50'
                      : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-mono-code font-bold rounded ${
                          isCyber
                            ? 'bg-[#002107] text-[#00ff66] border border-[#22c55e]'
                            : 'bg-[#ccfbf1] text-[#115e59] border border-[#99f6e4]'
                        }`}
                      >
                        {pso.code}
                      </span>
                      <h3
                        className={`text-sm font-semibold ${
                          isCyber ? 'text-white' : 'text-[#0f172a]'
                        }`}
                      >
                        {pso.title}
                      </h3>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-mono-code ${
                        isCyber
                          ? 'bg-[#140c24] text-[#cfc2d6]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {pso.category}
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isCyber ? 'text-[#cfc2d6]' : 'text-[#475569]'
                    }`}
                  >
                    {pso.statement}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'blooms' && (
            <div className="space-y-4">
              {filteredBlooms.map((bloom) => {
                const colors = getBloomsColorClasses(bloom.code, isCyber);
                return (
                  <div
                    key={bloom.code}
                    className={`p-4 rounded border transition-all ${
                      isCyber
                        ? 'bg-[#050508] border-[#a855f7]/20 hover:border-[#a855f7]/50'
                        : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-mono-code font-bold rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {bloom.code}
                        </span>
                        <h3
                          className={`text-sm font-semibold ${
                            isCyber ? 'text-white' : 'text-[#0f172a]'
                          }`}
                        >
                          {bloom.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono-code text-slate-400 uppercase">
                        Cognitive Tier {bloom.code.slice(1)}
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed mb-3 ${
                        isCyber ? 'text-[#cfc2d6]' : 'text-[#475569]'
                      }`}
                    >
                      {bloom.description}
                    </p>

                    <div>
                      <span
                        className={`text-[10px] uppercase font-mono-code tracking-wider block mb-1.5 ${
                          isCyber ? 'text-[#a855f7]' : 'text-[#64748b]'
                        }`}
                      >
                        Accredited Action Verbs
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {bloom.actionVerbs.map((verb) => (
                          <span
                            key={verb}
                            className={`px-2 py-0.5 text-[11px] rounded font-mono-code ${
                              isCyber
                                ? 'bg-[#140c24] text-[#e5e1e7] border border-[#a855f7]/20'
                                : 'bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0]'
                            }`}
                          >
                            {verb}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div
          className={`px-6 py-3 border-t text-[11px] font-mono-code flex items-center justify-between ${
            isCyber
              ? 'border-[#a855f7]/20 bg-[#050508] text-[#94a3b8]'
              : 'border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]'
          }`}
        >
          <span>Source: config/po_pso.json</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Annexure A Verified
          </span>
        </div>
      </div>
    </div>
  );
};
