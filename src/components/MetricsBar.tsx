import React from 'react';
import { Clock, CheckCircle2, TrendingDown, Cpu, Sparkles, ShieldCheck } from 'lucide-react';

interface MetricsBarProps {
  stats: {
    totalRuns: number;
    healedCount: number;
    successRate: number;
    avgMttrReductionMinutes: number;
    computeHoursSaved: number;
    activeNebiusNodes: number;
    gpuVramAllocatedGb: number;
    gpuTotalVramGb: number;
  };
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* MTTR Reduction */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Mean Time to Repair</span>
          <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <TrendingDown className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-white">4.9s</span>
          <span className="text-xs font-mono text-emerald-400 font-medium">
            -{stats.avgMttrReductionMinutes}m triage
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <span>Manual: ~45 mins</span>
          <span>→</span>
          <span className="text-emerald-300">Agent-CI: 4.9 secs</span>
        </div>
      </div>

      {/* Self-Healed Builds */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Self-Healed Pipelines</span>
          <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-white">{stats.healedCount}</span>
          <span className="text-xs font-mono text-cyan-400 font-medium">100% autonomous</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <span className="text-slate-300">{stats.successRate}%</span>
          <span>first-pass PR acceptance rate</span>
        </div>
      </div>

      {/* Nebius Cloud Acceleration */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Nebius GPU Cluster</span>
          <span className="p-1 rounded bg-indigo-500/10 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-white">{stats.activeNebiusNodes}x H100</span>
          <span className="text-xs font-mono text-indigo-400 font-medium">80GB SXM5</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <span>Nemotron-70B</span>
          <span>·</span>
          <span className="text-indigo-300">eu-north1-a</span>
        </div>
      </div>

      {/* Engineering Hours Saved */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Dev Time Saved</span>
          <span className="p-1 rounded bg-amber-500/10 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-white">{stats.computeHoursSaved}h</span>
          <span className="text-xs font-mono text-amber-400 font-medium">~$14.2k ROI</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
          <span>Zero broken build blockage</span>
        </div>
      </div>
    </div>
  );
};
