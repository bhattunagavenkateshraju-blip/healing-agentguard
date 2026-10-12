import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  AlertTriangle, 
  Play, 
  FileCode, 
  Layers, 
  CheckCircle2, 
  X,
  Code2,
  Cpu
} from 'lucide-react';
import { CIScenario } from '../types/agent';
import { CI_SCENARIOS } from '../data/scenarios';

interface FailureLabProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: CIScenario) => void;
  onTriggerCustom: (payload: {
    repo: string;
    logs: string;
    filename: string;
    code: string;
  }) => void;
  isHealing: boolean;
  selectedScenarioId: string;
}

export const FailureLab: React.FC<FailureLabProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  onTriggerCustom,
  isHealing,
  selectedScenarioId,
}) => {
  const [tab, setTab] = useState<'benchmarks' | 'custom'>('benchmarks');
  const [customRepo, setCustomRepo] = useState('my-org/core-backend');
  const [customFilename, setCustomFilename] = useState('src/controllers/auth.ts');
  const [customLogs, setCustomLogs] = useState(`[10:42:01] Running "npm run test"
[10:42:03] FAIL src/controllers/auth.test.ts
[10:42:03]   ● AuthController › should authenticate valid token
[10:42:03]     TypeError: Cannot read properties of undefined (reading 'jwtSecret')
[10:42:03]       at Object.verifyToken (src/controllers/auth.ts:18:32)
[10:42:04] Tests: 1 failed, 4 passed, 5 total
[10:42:04] Error: Process completed with exit code 1.`);
  const [customCode, setCustomCode] = useState(`import jwt from 'jsonwebtoken';

export function verifyToken(token: string, config?: { jwtSecret?: string }) {
  // Bug: Direct access on optional config without default fallback
  const secret = config.jwtSecret;
  return jwt.verify(token, secret);
}`);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                CI/CD Failure Lab & Benchmark Suite
              </h3>
              <p className="text-xs text-slate-400">
                Select real-world broken pipelines or supply your own raw CI logs for Nebius Nemotron-70B repair.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-3">
          <button
            onClick={() => setTab('benchmarks')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              tab === 'benchmarks'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Curated Benchmarks (6 Real-World Failures)</span>
          </button>

          <button
            onClick={() => setTab('custom')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              tab === 'custom'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Custom Log Sandbox & Analyzer</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {tab === 'benchmarks' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CI_SCENARIOS.map((sc) => {
                const isSelected = selectedScenarioId === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      onSelectScenario(sc);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer select-none relative group ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500/40 shadow-lg'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {sc.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{sc.repo}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {sc.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {sc.errorSummary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800/80 text-slate-500">
                      <span>Target: {sc.brokenFile}</span>
                      <span className="text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Launch Agent ➔
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                    GITHUB REPOSITORY
                  </label>
                  <input
                    type="text"
                    value={customRepo}
                    onChange={(e) => setCustomRepo(e.target.value)}
                    placeholder="org/repo-name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                    FAILING SOURCE FILE
                  </label>
                  <input
                    type="text"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    placeholder="src/index.ts"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  RAW CI FAILURE LOG (PASTE FROM GITHUB ACTIONS / GITLAB)
                </label>
                <textarea
                  rows={6}
                  value={customLogs}
                  onChange={(e) => setCustomLogs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-rose-300 font-mono text-xs outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  CURRENT SOURCE CODE (BROKEN SNIPPET)
                </label>
                <textarea
                  rows={5}
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono text-xs outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    onTriggerCustom({
                      repo: customRepo,
                      logs: customLogs,
                      filename: customFilename,
                      code: customCode
                    });
                    onClose();
                  }}
                  disabled={isHealing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Synthesize Fix on Nebius H100 Cluster</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
