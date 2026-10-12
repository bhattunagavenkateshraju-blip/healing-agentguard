import React from 'react';
import { 
  AlertTriangle, 
  Cpu, 
  BrainCircuit, 
  ShieldCheck, 
  GitPullRequest, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { PipelineStep } from '../types/agent';

interface PipelineVisualizerProps {
  steps: PipelineStep[];
  selectedStepId: string;
  onSelectStep: (stepId: string) => void;
  isHealing: boolean;
  onOpenPR?: () => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  selectedStepId,
  onSelectStep,
  isHealing,
  onOpenPR
}) => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return AlertTriangle;
      case 1:
        return Cpu;
      case 2:
        return BrainCircuit;
      case 3:
        return ShieldCheck;
      case 4:
        return GitPullRequest;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Autonomous Pipeline Topology
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            (GitHub ➔ Nebius Cloud ➔ Nemotron-70B ➔ PR)
          </span>
        </div>
        {isHealing && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Agent Active in Sandbox</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 relative">
        {steps.map((step, idx) => {
          const Icon = getStepIcon(idx);
          const isSelected = selectedStepId === step.id;
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';

          return (
            <div
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`relative rounded-lg p-3 border transition-all cursor-pointer select-none text-left ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500/80 ring-1 ring-emerald-500/30 shadow-lg'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-medium text-slate-500">
                  STAGE 0{idx + 1}
                </span>
                
                {isCompleted && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{step.durationMs ? `${(step.durationMs / 1000).toFixed(1)}s` : 'DONE'}</span>
                  </span>
                )}
                {isRunning && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>RUNNING</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`p-1.5 rounded-md ${
                    idx === 0
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : idx === 1
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : idx === 2
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : idx === 3
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                  {step.name}
                </h4>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {step.description}
              </p>

              {idx === 4 && isCompleted && onOpenPR && (
                <div className="mt-2 pt-2 border-t border-slate-800 flex justify-end">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPR();
                    }}
                    className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                  >
                    View PR <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
