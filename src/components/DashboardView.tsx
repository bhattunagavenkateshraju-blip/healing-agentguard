import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Cpu, 
  GitPullRequest, 
  ShieldCheck, 
  Database,
  ArrowUpRight,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import { DashboardMetrics, UserProfile } from '../lib/firebase';
import { HealingRun } from '../types/agent';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  runs: HealingRun[];
  currentUser: UserProfile | null;
  onSelectRun: (runId: string) => void;
  onTriggerHeal: () => void;
  isHealing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  runs,
  currentUser,
  onSelectRun,
  onTriggerHeal,
  isHealing
}) => {
  // Category breakdown
  const categoryStats = [
    { name: 'Dependency Conflicts (npm ERESOLVE)', count: 46, percent: 32, color: 'bg-emerald-500' },
    { name: 'TypeScript & Strict Null Errors', count: 38, percent: 26, color: 'bg-cyan-500' },
    { name: 'Docker & Native Toolchain Drift', count: 24, percent: 17, color: 'bg-indigo-500' },
    { name: 'Linter & ESLint Flat Config Violations', count: 20, percent: 14, color: 'bg-amber-500' },
    { name: 'Test Assertion & Timezone Desync', count: 12, percent: 8, color: 'bg-purple-500' },
    { name: 'Security Advisory & CVE Patching', count: 4, percent: 3, color: 'bg-rose-500' },
  ];

  const recentHealedRuns = runs.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Database className="w-3 h-3" />
                <span>Firestore Realtime Sync</span>
              </span>
              <span className="text-slate-500 text-xs font-mono">·</span>
              <span className="text-xs font-mono text-slate-400">
                Project: <code className="text-slate-300">universal-resolver-3h7nb</code>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              DevOps Intelligence & Self-Healing Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Autonomous incident resolution rate across all connected CI/CD workflows and branches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerHeal}
              disabled={isHealing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isHealing ? 'Repairing Build...' : 'Simulate Failure & Heal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 4 Core Metrics Required by User */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Pipeline Runs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Total Pipeline Runs
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {metrics.totalPipelineRuns}
            </span>
            <span className="text-xs font-mono text-blue-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% this week
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Tracked workflows</span>
            <span className="text-slate-300 font-medium">GitHub Actions & Webhooks</span>
          </div>
        </div>

        {/* Metric 2: Success Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Pipeline Success Rate
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {metrics.successRate.toFixed(1)}%
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center">
              <ShieldCheck className="w-3 h-3 mr-0.5" /> High Reliability
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Pass rate post-healing</span>
            <span className="text-emerald-400 font-medium">98.6% first-pass PRs</span>
          </div>
        </div>

        {/* Metric 3: Pipeline Failures */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Pipeline Failures
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {metrics.pipelineFailures}
            </span>
            <span className="text-xs font-mono text-rose-400 font-semibold flex items-center">
              Intercepted
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Build breakages</span>
            <span className="text-rose-300 font-medium">Zero developer blocking</span>
          </div>
        </div>

        {/* Metric 4: Self-Healed Fixes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Self-Healed Fixes
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {metrics.selfHealedFixes}
            </span>
            <span className="text-xs font-mono text-purple-400 font-semibold flex items-center">
              Autonomous
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Fixes merged to main</span>
            <span className="text-purple-300 font-medium">
              {Math.round((metrics.selfHealedFixes / metrics.pipelineFailures) * 100)}% repair ratio
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Failure Root-Cause Distribution */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Root Cause Distribution</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">146 incidents</span>
          </div>

          <div className="space-y-3">
            {categoryStats.map((cat, idx) => (
              <div key={idx} className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 truncate max-w-[220px]">{cat.name}</span>
                  <span className="text-slate-400 font-semibold">{cat.count} ({cat.percent}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MTTR & Speed Comparison */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>MTTR Performance Benchmark</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">-92% reduction</span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Manual Engineering Triage:</span>
                <span className="text-rose-400 font-bold">~42.0 minutes</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500/70 h-full w-[85%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-500">
                Log discovery ➔ local repro ➔ fix authoring ➔ CI re-run wait
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-emerald-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agent-CI Autonomous Repair:</span>
                </span>
                <span className="text-emerald-400 font-bold font-mono">4.9 seconds</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[12%] rounded-full shadow-sm shadow-emerald-400/50"></div>
              </div>
              <p className="text-[10px] text-slate-400">
                Instant webhook ➔ Nebius H100 ➔ Nemotron-70B AST patch ➔ PR
              </p>
            </div>
          </div>
        </div>

        {/* Nebius Cluster Hardware Telemetry */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Nebius Hardware Health</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online</span>
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 flex justify-between">
              <span className="text-slate-400">GPU Model</span>
              <span className="text-slate-200 font-bold">8x NVIDIA H100 SXM5 80GB</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Inference Engine</span>
              <span className="text-indigo-300 font-bold">Llama-3-Nemotron-70B</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Cluster Region</span>
              <span className="text-slate-200">eu-north1-a (Finland)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Average Token Latency</span>
              <span className="text-emerald-400 font-bold">18.4 ms / token</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Autonomous Incident Fixes */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-emerald-400" />
              <span>Recent Self-Healed Incidents & Pull Requests</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any incident to open the visual pipeline, inspect the Git diff, or trigger a merge.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                <th className="pb-2.5 font-medium">COMMIT / REPO</th>
                <th className="pb-2.5 font-medium">INCIDENT SUMMARY</th>
                <th className="pb-2.5 font-medium">CATEGORY</th>
                <th className="pb-2.5 font-medium">STATUS</th>
                <th className="pb-2.5 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentHealedRuns.map((r) => {
                const isMerged = r.pullRequest?.status === 'merged';
                return (
                  <tr 
                    key={r.id}
                    onClick={() => onSelectRun(r.id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                          {r.commitSha.substring(0, 7)}
                        </span>
                        <span className="text-slate-200 font-medium">{r.repo}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 max-w-xs">
                      <span className="text-slate-300 truncate block">
                        {r.errorSummary}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {r.errorCategory}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-semibold ${
                          isMerged
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isMerged ? 'MERGED' : 'SELF-HEALED'}</span>
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-emerald-400 hover:text-emerald-300 text-xs inline-flex items-center gap-1">
                        Inspect Diff <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
