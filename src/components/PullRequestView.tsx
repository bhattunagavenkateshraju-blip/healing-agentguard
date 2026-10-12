import React, { useState } from 'react';
import { 
  GitPullRequest, 
  GitMerge, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  FileCode, 
  ArrowRight,
  GitCommit,
  Check,
  RefreshCw
} from 'lucide-react';
import { SelfHealedPR } from '../types/agent';

interface PullRequestViewProps {
  pr?: SelfHealedPR;
  onMerge: () => Promise<void>;
  isMerging: boolean;
}

export const PullRequestView: React.FC<PullRequestViewProps> = ({
  pr,
  onMerge,
  isMerging
}) => {
  const [mergeOption, setMergeOption] = useState<'squash' | 'merge'>('squash');

  if (!pr) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <GitPullRequest className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm">No Pull Request generated yet. Trigger healing to generate an autonomous PR.</p>
      </div>
    );
  }

  const isMerged = pr.status === 'merged';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col font-sans">
      {/* PR Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isMerged
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isMerged ? <GitMerge className="w-3.5 h-3.5" /> : <GitPullRequest className="w-3.5 h-3.5" />}
              <span>{isMerged ? 'Merged' : 'Open'}</span>
            </span>

            <span className="text-slate-400 font-mono text-xs">#{pr.number}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Branch:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
              {pr.branch}
            </span>
            <span>➔</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
              {pr.baseBranch}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight">
          {pr.title}
        </h2>

        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400 font-mono font-bold">
              AI
            </span>
            <span className="font-semibold text-slate-200">{pr.author}</span>
          </div>
          <span>opened this autonomous PR</span>
          <span>·</span>
          <span>Diff: +{pr.diffStat.additions} -{pr.diffStat.deletions} lines</span>
        </div>
      </div>

      {/* PR Content Body */}
      <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[500px]">
        {/* Executive Summary */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Triage Summary</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {pr.summary}
          </p>
        </div>

        {/* Root Cause & Strategy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-rose-300 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Diagnosed Root Cause</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {pr.rootCause}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-emerald-300 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Applied Fix Strategy</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {pr.fixStrategy}
            </p>
          </div>
        </div>

        {/* Verification Report Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Isolated Sandbox Verification Matrix
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Exit Code: {pr.verificationReport.exitCode} (PASS)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">CONTAINER RUNTIME</span>
              <span className="text-slate-300 font-medium">{pr.verificationReport.sandboxEnv}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">VERIFICATION COMMAND</span>
              <span className="text-slate-300 font-medium truncate block">{pr.verificationReport.testCommand}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">EXECUTION LATENCY</span>
              <span className="text-emerald-400 font-medium">{(pr.verificationReport.durationMs / 1000).toFixed(2)}s</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            {pr.verificationReport.checks.map((check, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-950/40 font-mono">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300">{check.name}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{check.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Merge Action Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">
                  {isMerged ? 'Merged into main branch' : 'All CI checks passed — Ready to merge'}
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {isMerged
                  ? 'Changes are in production. The self-healing loop succeeded with zero developer intervention.'
                  : 'Automated verification confirmed zero regressions. Maintainers can merge with 1 click.'}
              </p>
            </div>

            {!isMerged && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={mergeOption}
                  onChange={(e) => setMergeOption(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 font-mono outline-none cursor-pointer"
                >
                  <option value="squash">Squash and merge</option>
                  <option value="merge">Create a merge commit</option>
                </select>

                <button
                  onClick={onMerge}
                  disabled={isMerging}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isMerging ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Merging...</span>
                    </>
                  ) : (
                    <>
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Merge Pull Request</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
