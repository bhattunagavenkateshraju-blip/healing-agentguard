import React from 'react';
import { 
  Cpu, 
  GitPullRequest, 
  Settings, 
  FileCode, 
  Play, 
  RefreshCw,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';
import { NebiusClusterMetrics } from '../types/agent';

interface HeaderProps {
  metrics: NebiusClusterMetrics;
  onOpenWorkflow: () => void;
  onOpenSettings: () => void;
  onOpenFailureLab: () => void;
  onTriggerHeal: () => void;
  isHealing: boolean;
  activeRepo: string;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  onOpenWorkflow,
  onOpenSettings,
  onOpenFailureLab,
  onTriggerHeal,
  isHealing,
  activeRepo,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Zap className="w-5 h-5 fill-emerald-400/20 text-emerald-400" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Agent-CI
                <span className="text-xs px-2 py-0.5 font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded">
                  Self-Healing DevOps
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="text-slate-500">Autonomous Pipeline Agent</span>
              <span>·</span>
              <span className="text-emerald-400/90 font-medium">Nebius Cloud</span>
              <span>·</span>
              <span className="text-slate-400">NVIDIA Nemotron-70B</span>
            </p>
          </div>
        </div>

        {/* Live Cluster Pill */}
        <div className="hidden md:flex items-center gap-3 text-xs bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-slate-400">Cluster:</span>
            <span className="font-mono font-semibold text-emerald-400">{metrics.gpuModel}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-slate-400">VRAM:</span>
            <span className="font-mono text-cyan-300">{metrics.vramUsedGb.toFixed(1)} / {metrics.vramTotalGb} GB</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400">Live Webhook Active</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFailureLab}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
            title="Inspect CI Failure Scenarios or paste custom log"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Failure Lab</span>
          </button>

          <button
            onClick={onOpenWorkflow}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
            title="Get .github/workflows/agent-ci.yml integration"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>GitHub Action</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
            title="Nebius Cloud & Nemotron Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onTriggerHeal}
            disabled={isHealing}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer ${
              isHealing
                ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
            }`}
          >
            {isHealing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Healer Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Heal Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
