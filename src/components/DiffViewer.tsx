import React, { useState } from 'react';
import { 
  FileCode, 
  Columns, 
  AlignJustify, 
  Check, 
  Copy, 
  GitBranch, 
  Sparkles, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { GitDiffFile } from '../types/agent';

interface DiffViewerProps {
  files: GitDiffFile[];
  rootCause?: string;
  fixRationale?: string;
  branchName?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  files,
  rootCause,
  fixRationale,
  branchName = 'fix/agent-ci-patch'
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copied, setCopied] = useState(false);

  if (!files || files.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <FileCode className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm">No modified files to display yet.</p>
      </div>
    );
  }

  const currentFile = files[activeFileIndex] || files[0];
  const oldLines = currentFile.oldContent.split('\n');
  const newLines = currentFile.newContent.split('\n');

  const handleCopyNewCode = () => {
    navigator.clipboard.writeText(currentFile.newContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col font-mono text-xs">
      {/* Rationale Banner */}
      {(rootCause || fixRationale) && (
        <div className="bg-indigo-950/40 border-b border-indigo-900/50 p-3 flex items-start gap-3">
          <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1 font-sans">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-200">
                NVIDIA Llama-3-Nemotron-70B AST Patch Rationale
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-900/60 px-1.5 py-0.5 rounded border border-indigo-700/50">
                Verified Clean
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {fixRationale || rootCause}
            </p>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* File tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFileIndex(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeFileIndex === idx
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>{file.filename}</span>
              <span className="flex items-center gap-1 text-[10px] font-mono">
                <span className="text-emerald-400">+{file.additions}</span>
                <span className="text-rose-400">-{file.deletions}</span>
              </span>
            </button>
          ))}
        </div>

        {/* View mode toggle & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'split' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split Side-by-Side Diff"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'unified' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Unified Diff"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopyNewCode}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
            title="Copy corrected code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-sans">Copy Patched</span>
          </button>
        </div>
      </div>

      {/* Diff Rendering Body */}
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-2 divide-x divide-slate-800 text-xs font-mono">
            {/* Left: Original (Failing) */}
            <div className="bg-slate-950">
              <div className="px-3 py-1.5 bg-rose-950/20 text-rose-300 font-semibold border-b border-slate-800/80 flex items-center justify-between text-[11px]">
                <span>Original Code (Failing)</span>
                <span className="text-slate-500">{oldLines.length} lines</span>
              </div>
              <div className="p-2 space-y-0.5">
                {oldLines.map((line, idx) => {
                  const isModified = !newLines.includes(line);
                  return (
                    <div
                      key={idx}
                      className={`flex leading-relaxed ${
                        isModified ? 'bg-rose-950/40 text-rose-300' : 'text-slate-400'
                      }`}
                    >
                      <span className="w-8 shrink-0 text-right pr-3 select-none text-slate-600 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="w-4 shrink-0 select-none text-rose-400 font-bold">
                        {isModified ? '-' : ' '}
                      </span>
                      <span className="whitespace-pre overflow-x-auto pr-2">{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Healed (Self-Corrected) */}
            <div className="bg-slate-950">
              <div className="px-3 py-1.5 bg-emerald-950/20 text-emerald-300 font-semibold border-b border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agent-CI Healed Patch</span>
                </span>
                <span className="text-emerald-400 font-bold">+{currentFile.additions} lines</span>
              </div>
              <div className="p-2 space-y-0.5">
                {newLines.map((line, idx) => {
                  const isAdded = !oldLines.includes(line);
                  return (
                    <div
                      key={idx}
                      className={`flex leading-relaxed ${
                        isAdded ? 'bg-emerald-950/40 text-emerald-200' : 'text-slate-300'
                      }`}
                    >
                      <span className="w-8 shrink-0 text-right pr-3 select-none text-slate-600 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="w-4 shrink-0 select-none text-emerald-400 font-bold">
                        {isAdded ? '+' : ' '}
                      </span>
                      <span className="whitespace-pre overflow-x-auto pr-2">{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Unified View */
          <div className="p-2 space-y-0.5 text-xs font-mono bg-slate-950">
            <div className="px-3 py-1 text-slate-500 border-b border-slate-800 mb-2">
              @@ -1,{oldLines.length} +1,{newLines.length} @@ {currentFile.filename}
            </div>
            {oldLines.map((line, idx) => {
              const isRemoved = !newLines.includes(line);
              if (!isRemoved) return null;
              return (
                <div key={`old-${idx}`} className="flex leading-relaxed bg-rose-950/40 text-rose-300">
                  <span className="w-8 shrink-0 text-right pr-3 select-none text-slate-600">{idx + 1}</span>
                  <span className="w-4 shrink-0 select-none text-rose-400 font-bold">-</span>
                  <span className="whitespace-pre overflow-x-auto">{line}</span>
                </div>
              );
            })}
            {newLines.map((line, idx) => {
              const isAdded = !oldLines.includes(line);
              return (
                <div
                  key={`new-${idx}`}
                  className={`flex leading-relaxed ${
                    isAdded ? 'bg-emerald-950/40 text-emerald-300' : 'text-slate-400'
                  }`}
                >
                  <span className="w-8 shrink-0 text-right pr-3 select-none text-slate-600">{idx + 1}</span>
                  <span className="w-4 shrink-0 select-none text-emerald-400 font-bold">
                    {isAdded ? '+' : ' '}
                  </span>
                  <span className="whitespace-pre overflow-x-auto">{line}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Diff Footer Status */}
      <div className="bg-slate-900/60 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
          <span>Branch target: <code className="text-indigo-300 font-mono">{branchName}</code></span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span>Target AST: Pure JavaScript / TypeScript Engine</span>
        </div>
      </div>
    </div>
  );
};
