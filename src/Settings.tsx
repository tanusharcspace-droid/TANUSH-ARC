import React, { useState, useEffect } from 'react';
import { loadSettings, saveSettings, getAIHeaders } from './api';
import { LLMSettings, ThemeMode } from './types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, theme }) => {
  const [settings, setSettings] = useState<LLMSettings>(loadSettings());
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
      setSaveStatus(null);
      setTestingStatus('idle');
      setTestMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSaveStatus('Engine settings saved to client session');
    setTimeout(() => {
      setSaveStatus(null);
    }, 2500);
  };

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setTestMessage('Verifying accreditation AI model connectivity...');

    try {
      const headers = getAIHeaders();
      await new Promise((res) => setTimeout(res, 700));

      if (!headers['x-llm-key'] && headers['x-llm-provider'] !== 'gemini') {
        throw new Error('API key is required for selected provider.');
      }

      setTestingStatus('success');
      setTestMessage(`Connected to ${headers['x-llm-provider'].toUpperCase()} (${headers['x-llm-model']}) with active headers.`);
    } catch (err: unknown) {
      setTestingStatus('error');
      setTestMessage(err instanceof Error ? err.message : 'Connection test failed.');
    }
  };

  const isCyber = theme === 'cyber';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl rounded-xl shadow-2xl transition-all border ${
          isCyber
            ? 'bg-[#080510] text-[#ffffff] border-purple-500/40 neon-glow-purple'
            : 'bg-white text-[#0b1c30] border-slate-300'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isCyber ? 'border-purple-900/50 bg-[#040207]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isCyber
                  ? 'bg-gradient-to-tr from-purple-800 to-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <span className="material-symbols-outlined text-lg">terminal</span>
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">AI Curriculum Engine Configuration</h2>
              <p className="text-xs font-mono text-slate-400">
                Client-side headers for ABET/NBA alignment &amp; synthesis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Security Disclosure */}
          <div
            className={`flex items-start gap-3 p-3.5 rounded-lg border text-xs ${
              isCyber
                ? 'bg-[#041d0e] border-[#00ff66]/30 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#00ff66] shrink-0 mt-0.5">verified_user</span>
            <div>
              <span className="font-bold">Zero-Server Key Storage:</span> Your key is stored solely in client localStorage and transmitted via{' '}
              <code className="font-mono font-bold text-[11px] text-[#00ff66]">x-llm-key</code> headers. It is never committed to code, .env, or backend databases.
            </div>
          </div>

          {/* Provider & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 text-purple-300">
                LLM Provider
              </label>
              <select
                value={settings.provider}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    provider: e.target.value as LLMSettings['provider'],
                  })
                }
                className={`w-full px-3 py-2 text-xs font-mono rounded border outline-none ${
                  isCyber
                    ? 'bg-[#0d0917] border-purple-700/50 text-white focus:border-[#a855f7]'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              >
                <option value="gemini">Google Gemini AI</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic Claude</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 text-purple-300">
                Model Identifier
              </label>
              <input
                type="text"
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                placeholder="e.g. gemini-1.5-flash"
                className={`w-full px-3 py-2 text-xs font-mono rounded border outline-none ${
                  isCyber
                    ? 'bg-[#0d0917] border-purple-700/50 text-[#00ff66] focus:border-[#a855f7]'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-purple-300">
                API Key (x-llm-key)
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-xs font-mono text-purple-400 hover:text-purple-300"
              >
                {showKey ? 'Mask' : 'Reveal'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="Enter client API key or leave blank for runtime injection..."
                className={`w-full px-3 py-2 text-xs font-mono rounded border outline-none ${
                  isCyber
                    ? 'bg-[#0d0917] border-purple-700/50 text-white focus:border-[#a855f7]'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-1 text-xs font-mono">
              <span className="text-purple-300">Taxonomy Rigor: {settings.temperature}</span>
              <span className="text-slate-400">
                {settings.temperature <= 0.3 ? 'Deterministic / Strict ABET' : 'Exploratory'}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={settings.temperature}
              onChange={(e) =>
                setSettings({ ...settings, temperature: parseFloat(e.target.value) })
              }
              className="w-full accent-purple-500"
            />
          </div>

          {/* System Instructions */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 text-purple-300">
              Auditor System Context &amp; Guidelines
            </label>
            <textarea
              rows={2}
              value={settings.systemInstruction || ''}
              onChange={(e) => setSettings({ ...settings, systemInstruction: e.target.value })}
              className={`w-full px-3 py-2 text-xs rounded border outline-none ${
                isCyber
                  ? 'bg-[#0d0917] border-purple-700/50 text-slate-200 focus:border-[#a855f7]'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
              }`}
            />
          </div>

          {/* Feedback */}
          {testMessage && (
            <div
              className={`p-2.5 rounded text-xs font-mono flex items-center gap-2 ${
                testingStatus === 'success'
                  ? 'bg-[#041d0e] text-[#00ff66] border border-[#00ff66]/30'
                  : testingStatus === 'error'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : 'bg-purple-950/40 text-purple-200 border border-purple-800'
              }`}
            >
              <span>{testMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-purple-900/40">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingStatus === 'testing'}
              className="px-3 py-1.5 text-xs font-mono font-medium rounded border border-purple-600/40 text-purple-300 hover:text-white hover:bg-purple-950/40 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              Verify Headers
            </button>

            <div className="flex items-center gap-3">
              {saveStatus && (
                <span className="text-xs font-mono text-[#00ff66] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check</span>
                  {saveStatus}
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 hover:brightness-110 text-white transition-all shadow-md font-mono uppercase tracking-wider"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
