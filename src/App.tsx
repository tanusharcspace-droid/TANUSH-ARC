import React, { useState, useEffect, useRef } from 'react';
import { CourseSpecification, UserRole, ThemeMode } from './types';
import { fetchCourseSpecification, saveCourseSpecification, clearAllCourseData } from './api';
import { StitchDashboard } from './screens/StitchDashboard';
import { AnnexureDrawer } from './components/AnnexureDrawer';
import { Settings } from './Settings';
import { ExportModal } from './components/ExportModal';
import { soundEffects } from './audio';
import './styles.css';

export default function App() {
  const [spec, setSpec] = useState<CourseSpecification>(fetchCourseSpecification());
  const [role, setRole] = useState<UserRole>('hod');
  const [theme, setTheme] = useState<ThemeMode>('cyber');
  const [activeNav, setActiveNav] = useState<string>('specification-editor');
  const [activeTab, setActiveTab] = useState<'spec' | 'matrix' | 'audit'>('spec');
  const [isAnnexureOpen, setIsAnnexureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(soundEffects.enabled);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ringPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    // 1. Mouse move tracking for custom cursor and dynamic spotlight
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(168, 85, 247, 0.16), rgba(0, 255, 102, 0.08) 45%, transparent 75%)`;
      }
    };

    // 2. Smooth trailing lerp animation loop for the outer cursor ring
    let animId: number;
    const lerp = 0.16;
    const renderCursorLoop = () => {
      ringPosRef.current.x += (mousePosRef.current.x - ringPosRef.current.x) * lerp;
      ringPosRef.current.y += (mousePosRef.current.y - ringPosRef.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(renderCursorLoop);
    };
    animId = requestAnimationFrame(renderCursorLoop);

    // 3. Hover detection for interactive items
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        'button, a, select, input, textarea, [role="button"], [role="tab"], .interactive-card, .cursor-pointer, .code-pill'
      );
      if (target) {
        document.body.classList.add('cursor-hover');
        soundEffects.hoverTick();
      } else {
        document.body.classList.remove('cursor-hover');
      }
    };

    // 4. Unlock AudioContext on first user gesture
    const handleFirstGesture = () => {
      soundEffects.init();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleUpdateSpec = (updated: CourseSpecification) => {
    setSpec(updated);
    saveCourseSpecification(updated);
  };

  const handleTabChange = (tab: 'spec' | 'matrix' | 'audit') => {
    soundEffects.tabSwitch();
    setActiveTab(tab);
    if (tab === 'spec') setActiveNav('specification-editor');
    if (tab === 'matrix') setActiveNav('curriculum-review-board');
    if (tab === 'audit') setActiveNav('ai-audit-stream');
  };

  const handleSidebarNavClick = (navPath: string) => {
    soundEffects.tabSwitch();
    setActiveNav(navPath);
    if (navPath === 'specification-editor') {
      setActiveTab('spec');
    } else if (navPath === 'curriculum-review-board') {
      setActiveTab('matrix');
    } else if (navPath === 'learning-outcomes-taxonomy') {
      setIsAnnexureOpen(true);
    } else if (navPath === 'ai-audit-stream') {
      setActiveTab('audit');
    } else if (navPath === 'accreditation-compliance') {
      setIsExportOpen(true);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    soundEffects.tabSwitch();
    setRole(newRole);
  };

  const handleToggleSFX = () => {
    const newState = soundEffects.toggle();
    setSfxEnabled(newState);
  };

  const isCyber = theme === 'cyber';

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden transition-colors duration-200 ${
        isCyber ? 'bg-[#030206] text-slate-100' : 'bg-[#f8fafc] text-[#0b1c30]'
      }`}
    >
      {/* SPOTLIGHT TORCH BACKGROUND (Smooth Dual-Orbit Follower) */}
      {isCyber && (
        <div
          ref={spotlightRef}
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-90"
          style={{
            background: `radial-gradient(650px circle at 50% 50%, rgba(168, 85, 247, 0.16), rgba(0, 255, 102, 0.08) 45%, transparent 75%)`,
          }}
        />
      )}

      {/* Dynamic Ambient Flowing Neon Aurora */}
      {isCyber && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#201639_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
          <div className="ambient-orb-1 absolute -top-32 left-[18%] w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-purple-950 via-purple-700 to-purple-500 opacity-35 blur-[130px]" />
          <div className="ambient-orb-2 absolute top-[28%] -right-24 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-[#00ff66]/25 via-[#052e16]/40 to-[#10b981]/20 opacity-30 blur-[135px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030206]/40 to-[#030206]/85 pointer-events-none" />
        </div>
      )}

      {/* CUSTOM ROUND TRAILING DUAL-GLOW CURSOR SYSTEM */}
      <div id="custom-cursor-dot" ref={dotRef} />
      <div id="custom-cursor-ring" ref={ringRef} />

      {/* FIXED END CORNER BADGE: CREATED BY TANUSH M D */}
      <div className="fixed bottom-3 right-4 z-50 pointer-events-none select-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#041d0e]/95 border border-[#00ff66]/60 shadow-[0_0_20px_rgba(0,255,102,0.45)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse shadow-[0_0_8px_#00ff66]" />
          <span className="font-mono text-[11px] font-bold tracking-widest text-[#00ff66] uppercase">
            CREATED BY TANUSH M D
          </span>
        </div>
      </div>

      {/* TOP HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b transition-colors shadow-lg ${
          isCyber
            ? 'bg-[#06030c]/90 border-purple-900/40 text-white shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
            : 'bg-white/95 border-slate-200 text-slate-900'
        }`}
      >
        <div className="h-16 w-full px-6 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-4 min-w-max">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center p-0.5 shadow-md ${
                  isCyber
                    ? 'bg-gradient-to-tr from-purple-900 via-purple-600 to-purple-400 text-white shadow-[0_0_18px_rgba(168,85,247,0.6)] animate-pulse'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">deployed_code</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
                  SpecForge
                  <span className="font-mono text-[10px] tracking-widest text-[#00ff66] bg-[#041d0e] px-2 py-0.5 rounded-full border border-[#00ff66]/40 shadow-[0_0_10px_rgba(0,255,102,0.3)] uppercase font-semibold">
                    CURRICULUM AI v2.4
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Department Context Badge */}
          <div className="hidden xl:flex items-center">
            <div
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs shadow-inner ${
                isCyber
                  ? 'bg-[#0d0918] border-purple-800/40 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-purple-400 text-base">domain</span>
              <span className="font-semibold">{spec.department || 'Curriculum Governance Studio'}</span>
              <span className="text-purple-400 font-mono">•</span>
              <span className="font-mono text-[#00ff66] font-bold">
                {spec.academicYear ? `AY ${spec.academicYear}` : 'Continuous Accreditation'}
              </span>
            </div>
          </div>

          {/* Header Action Bar, Role Switcher & Audio Controls */}
          <div className="flex items-center gap-3">
            {/* Interactive 3-Way Segmented Role Selector */}
            <div
              className={`flex items-center p-1 rounded-lg border shadow-inner ${
                isCyber ? 'bg-[#0c0819] border-purple-700/50' : 'bg-slate-100 border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => handleRoleChange('hod')}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all cursor-pointer ${
                  role === 'hod'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👑 HOD
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('reviewer')}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all cursor-pointer ${
                  role === 'reviewer'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔍 Reviewer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('author')}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all cursor-pointer ${
                  role === 'author'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✍️ Author
              </button>
            </div>

            {/* Clear / Reset Spec Data Button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                const clean = clearAllCourseData();
                setSpec(clean);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-all cursor-pointer ${
                isCyber
                  ? 'bg-[#0d0917] hover:bg-[#18112b] text-purple-300 hover:text-white border-purple-800/40 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300'
              }`}
              title="Clear all course data"
            >
              <span className="material-symbols-outlined text-sm text-purple-400">restart_alt</span>
              <span className="hidden sm:inline">Reset Spec</span>
            </button>

            {/* Audio SFX Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSFX}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all cursor-pointer group ${
                isCyber
                  ? 'bg-[#0d0917] hover:bg-[#18112b] text-slate-200 hover:text-white border-purple-500/30 hover:border-purple-400 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300'
              }`}
              title="Toggle UI Procedural Sound Effects"
            >
              <span className="material-symbols-outlined text-base text-[#00ff66] group-hover:scale-110 transition-transform">
                {sfxEnabled ? 'volume_up' : 'volume_off'}
              </span>
              <span className="font-mono text-xs text-[#00ff66] font-semibold">
                {sfxEnabled ? 'SFX: ON' : 'SFX: OFF'}
              </span>
            </button>

            {/* API & Synthesis Engine Settings Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                soundEffects.tabSwitch();
                setIsSettingsOpen(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all border shadow-sm cursor-pointer ${
                isCyber
                  ? 'bg-[#0d0917] hover:bg-[#18112b] text-slate-200 hover:text-white border-purple-500/30 hover:border-purple-400'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300'
              }`}
              title="API & Synthesis Engine Settings"
            >
              <span className="material-symbols-outlined text-base text-purple-400">terminal</span>
              <span className="text-xs font-medium">API &amp; Engine</span>
            </button>

            {/* Annexure A Drawer Trigger */}
            <button
              type="button"
              onClick={() => {
                soundEffects.tabSwitch();
                setIsAnnexureOpen(true);
              }}
              className="p-2 rounded-md hover:bg-purple-950/40 text-slate-400 hover:text-purple-300 transition-colors flex items-center justify-center border border-transparent hover:border-purple-800/40 cursor-pointer"
              title="Statutory Annexure A Reference Drawer (POs, PSOs & Blooms)"
            >
              <span className="material-symbols-outlined text-lg">help_outline</span>
            </button>

            {/* Notifications */}
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setIsAnnexureOpen(true);
              }}
              className="relative p-2 rounded-md hover:bg-purple-950/40 text-slate-400 hover:text-purple-300 transition-colors flex items-center justify-center cursor-pointer"
              title="Governance Notifications"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
            </button>

            {/* Theme Toggle (Cyber Dark / Academic Light) */}
            <button
              type="button"
              onClick={() => {
                soundEffects.click();
                setTheme(isCyber ? 'academic' : 'cyber');
              }}
              className={`p-2 rounded-md border transition-colors flex items-center justify-center cursor-pointer ${
                isCyber
                  ? 'border-purple-800/40 text-amber-300 hover:bg-purple-950/40'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title={isCyber ? 'Switch to Academic Governance Light' : 'Switch to Cyber Governance Dark'}
            >
              <span className="material-symbols-outlined text-lg">
                {isCyber ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-purple-900/50">
              <div className="w-8 h-8 rounded-md bg-purple-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-purple-500/50 shadow-md">
                {role === 'hod' ? 'HD' : role === 'reviewer' ? 'PR' : 'CA'}
              </div>
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="text-xs leading-none text-white font-semibold">
                  {role === 'hod'
                    ? (spec.faculty.name ? `HOD (${spec.faculty.name})` : 'Head of Department')
                    : role === 'reviewer'
                    ? 'Academic Peer Reviewer'
                    : (spec.faculty.name || 'Course Author')}
                </span>
                <span className="font-mono text-[10px] leading-tight text-purple-300/80">
                  {role === 'hod' ? 'Dean / BoS Chair' : role === 'reviewer' ? 'Review Board Member' : 'Faculty Author'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* LEFT NAVIGATION SIDEBAR (FULLY RESPONSIVE & CLICKABLE) */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-72 z-30 flex flex-col justify-between pt-5 pb-6 overflow-y-auto border-r transition-colors ${
          isCyber
            ? 'bg-[#05030a]/90 backdrop-blur-md border-purple-900/40 text-slate-300'
            : 'bg-white border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex flex-col gap-6 px-4">
          <div className="px-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-purple-400 uppercase">
              Governance Navigation
            </span>
          </div>
          <nav className="flex flex-col gap-1.5">
            {/* Specification Editor */}
            <button
              type="button"
              onClick={() => handleSidebarNavClick('specification-editor')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-sm font-semibold transition-all cursor-pointer ${
                activeNav === 'specification-editor'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]'
                  : 'hover:bg-purple-950/20 text-slate-300 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">edit_document</span>
              <span>Specification Editor</span>
            </button>

            {/* Review Board Matrix */}
            <button
              type="button"
              onClick={() => handleSidebarNavClick('curriculum-review-board')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-sm font-medium transition-all cursor-pointer ${
                activeNav === 'curriculum-review-board'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] font-semibold'
                  : 'hover:bg-purple-950/20 text-slate-300 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-purple-400">rate_review</span>
              <span>Review Board Matrix</span>
            </button>

            {/* Outcomes & Taxonomy (Opens Annexure A Reference Drawer) */}
            <button
              type="button"
              onClick={() => handleSidebarNavClick('learning-outcomes-taxonomy')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-sm font-medium transition-all cursor-pointer ${
                activeNav === 'learning-outcomes-taxonomy' && isAnnexureOpen
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-600/40'
                  : 'hover:bg-purple-950/20 text-slate-300 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-purple-400">account_tree</span>
              <span>Outcomes &amp; Taxonomy</span>
            </button>

            {/* AI Audit Stream */}
            <button
              type="button"
              onClick={() => handleSidebarNavClick('ai-audit-stream')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-sm font-medium transition-all cursor-pointer ${
                activeNav === 'ai-audit-stream'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] font-semibold'
                  : 'hover:bg-purple-950/20 text-slate-300 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-purple-400">history_edu</span>
              <span>AI Audit Stream</span>
            </button>

            {/* Accreditation & ABET (Opens Export & Certification modal) */}
            <button
              type="button"
              onClick={() => handleSidebarNavClick('accreditation-compliance')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-sm font-medium transition-all cursor-pointer ${
                activeNav === 'accreditation-compliance' && isExportOpen
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-600/40'
                  : 'hover:bg-purple-950/20 text-slate-300 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-purple-400">fact_check</span>
              <span>Accreditation &amp; ABET</span>
            </button>
          </nav>
        </div>

        {/* Engine Status Capsule & End Corner Credit */}
        <div className="px-4 flex flex-col gap-3">
          <div
            className={`p-3.5 rounded-lg border flex flex-col gap-1.5 shadow-inner ${
              isCyber
                ? 'bg-[#0a0713]/80 backdrop-blur-sm border-purple-800/40'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider font-semibold">
                Engine Status
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#00ff66] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
                ONLINE
              </span>
            </div>
            <div className="font-mono text-xs font-medium flex items-center gap-1">
              <span className="text-[#00ff66]">⚡</span> gemini-1.5-pro-academic
            </div>
            <div className="text-[11px] text-slate-400">Continuous syllabus alignment</div>
          </div>
          <div className="px-1 flex items-center justify-between text-slate-400 font-mono text-[11px]">
            <span className="text-[#00ff66]">SpecForge Core</span>
            <span className="text-purple-400">v2.4.1</span>
          </div>

          {/* Sidebar Footer Credit */}
          <div className="pt-2 border-t border-purple-900/40 flex items-center justify-center">
            <span className="font-mono text-[10px] font-bold text-[#00ff66] tracking-wider uppercase">
              CREATED BY TANUSH M D
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE WRAPPER (Shifted by sidebar width 72) */}
      <div className="pl-72 relative z-10 pt-16">
        <StitchDashboard
          spec={spec}
          role={role}
          theme={theme}
          activeNav={activeNav}
          activeTab={activeTab}
          onChangeTab={handleTabChange}
          onUpdateSpec={handleUpdateSpec}
          onOpenSettings={() => {
            soundEffects.tabSwitch();
            setIsSettingsOpen(true);
          }}
          onOpenAnnexure={() => {
            soundEffects.tabSwitch();
            setIsAnnexureOpen(true);
          }}
          onOpenExport={() => {
            soundEffects.tabSwitch();
            setIsExportOpen(true);
          }}
        />
      </div>

      {/* Annexure A Reference Drawer */}
      <AnnexureDrawer
        isOpen={isAnnexureOpen}
        onClose={() => setIsAnnexureOpen(false)}
        theme={theme}
      />

      {/* AI Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
      />

      {/* Export Official Syllabus Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        spec={spec}
        theme={theme}
      />
    </div>
  );
}
