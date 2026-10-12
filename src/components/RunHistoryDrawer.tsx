import React from 'react';
import { History, CheckCircle2, AlertOctagon, GitPullRequest, ArrowRight, X } from 'lucide-react';
import { HealingRun } from '../types/agent';

interface RunHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  runs: HealingRun[];
  activeRunId: string;
  onSelectRun: (runId: string) => void;
}

export const RunHistoryDrawer: React.FC<RunHistoryDrawerProps> = ({
  isOpen,
  onClose,
  runs,
  activeRunId,
  onSelectRun
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl font-sans">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Self-Healing Execution History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {runs.map((r) => {
            const isSelected = r.id === activeRunId;
            const isHealed = r.status === 'healed';
            const isMerged = r.pullRequest?.status === 'merged';

            return (
              <div
                key={r.id}
                onClick={() => {
                  onSelectRun(r.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500/80 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {r.commitSha.substring(0, 7)}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                      isMerged
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                        : isHealed
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isMerged ? 'PR MERGED' : isHealed ? 'PR READY' : 'ANALYZING'}</span>
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-white mb-1 line-clamp-1">
                  {r.errorSummary}
                </h4>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>{r.repo}</span>
                  <span className="text-slate-400">
                    {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
