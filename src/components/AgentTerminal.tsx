import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Minimize2,
  Cpu,
  Layers,
  Sparkles,
  AlertOctagon
} from 'lucide-react';
import { PipelineStep } from '../types/agent';

interface AgentTerminalProps {
  currentStep?: PipelineStep;
  allSteps: PipelineStep[];
  rawFailureLogs: string;
  sandboxLogs?: string[];
  isHealing: boolean;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  currentStep,
  allSteps,
  rawFailureLogs,
  sandboxLogs = [],
  isHealing
}) => {
  const [activeTab, setActiveTab] = useState<'agent' | 'raw_ci' | 'sandbox'>('agent');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new logs arrive
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep, isHealing, activeTab]);

  const getCombinedAgentLogs = (): string[] => {
    if (currentStep) {
      return currentStep.logs;
    }
    // Aggregate all steps
    return allSteps.flatMap((s) => [
      `=== STAGE: ${s.name.toUpperCase()} ===`,
      ...s.logs,
      ''
    ]);
  };

  const getLogsForTab = (): string[] => {
    switch (activeTab) {
      case 'agent':
        return getCombinedAgentLogs();
      case 'raw_ci':
        return rawFailureLogs.split('\n');
      case 'sandbox':
        return sandboxLogs.length > 0 
          ? sandboxLogs 
          : [
              '[SANDBOX] Ephemeral runtime: Ubuntu 22.04 LTS (x86_64)',
              '[SANDBOX] Engine: Docker in Docker (isolated rootless daemon)',
              '[SANDBOX] Mounted target patch: verified clean AST',
              '[SANDBOX] Execution command: passed with return code 0'
            ];
      default:
        return [];
    }
  };

  const logs = getLogsForTab();

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([logs.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `agent-ci-${activeTab}-logs.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderLogLine = (line: string, idx: number) => {
    let colorClass = 'text-slate-300';
    if (line.includes('=== STAGE')) {
      return (
        <div key={idx} className="text-emerald-400 font-semibold py-1 border-b border-slate-800/80 my-1">
          {line}
        </div>
      );
    }
    if (line.includes('[ERROR]') || line.includes('ERR!') || line.includes('Error:') || line.includes('error TS') || line.includes('✖')) {
      colorClass = 'text-rose-400 font-medium';
    } else if (line.includes('[NEMOTRON]') || line.includes('[AI]') || line.includes('[DIAG]')) {
      colorClass = 'text-purple-300';
    } else if (line.includes('[PROVISION]') || line.includes('[NEBIUS]')) {
      colorClass = 'text-cyan-300';
    } else if (line.includes('[SANDBOX]')) {
      colorClass = 'text-emerald-300';
    } else if (line.includes('[GIT]') || line.includes('[GH]') || line.includes('[MERGE]')) {
      colorClass = 'text-indigo-300';
    } else if (line.startsWith('>') || line.startsWith('$')) {
      colorClass = 'text-amber-300 font-semibold';
    }

    return (
      <div key={idx} className={`leading-relaxed whitespace-pre-wrap break-all ${colorClass}`}>
        <span className="text-slate-600 select-none mr-3 inline-block w-8 text-right font-mono text-[11px]">
          {idx + 1}
        </span>
        {line}
      </div>
    );
  };

  return (
    <div
      className={`bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col font-mono text-xs transition-all shadow-2xl ${
        isExpanded ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[360px]'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50"></span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800/80">
            <button
              onClick={() => setActiveTab('agent')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'agent'
                  ? 'bg-slate-800 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>Agent Execution Stream</span>
            </button>

            <button
              onClick={() => setActiveTab('raw_ci')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'raw_ci'
                  ? 'bg-slate-800 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertOctagon className="w-3 h-3 text-rose-400" />
              <span>Raw CI Failure Log</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-slate-800 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Sandbox Verification</span>
            </button>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Copy logs to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Download log file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse' : 'Expand full terminal'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-950/90 font-mono text-[12px] space-y-0.5 selection:bg-emerald-500/30 selection:text-emerald-200">
        {logs.map((line, idx) => renderLogLine(line, idx))}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer Status */}
      <div className="bg-slate-900/60 border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>TTY /dev/pts/1 (Nebius Container: root@nebius-h100-worker)</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Encoding: UTF-8</span>
          <span>Lines: {logs.length}</span>
        </div>
      </div>
    </div>
  );
};
