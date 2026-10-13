import React, { useState } from 'react';
import { ExternalLink, X, Check, AlertCircle, RefreshCw, Terminal, Sparkles, Key, Zap, ShieldCheck } from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({
  isOpen,
  onClose
}) => {
  const [token, setToken] = useState('');
  const [projectName, setProjectName] = useState('agent-ci');
  const [isDeploying, setIsDeploying] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    output?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCliDeploy = async () => {
    if (!token) return;
    setIsDeploying(true);
    setResult(null);

    try {
      const res = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, projectName })
      });

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message || 'Failed to dispatch Vercel deployment request'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-white border border-white/20">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2L2 19.7778H22L12 2Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Deploy Agent-CI on Vercel
              </h3>
              <p className="text-xs text-slate-400">
                Deploy with zero-config edge routing, serverless API functions, and global CDN
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

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Method 1: Instant 1-Click Vercel Web Importer */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Option 1: Recommended
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  Instant Web Import
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Deploy in 30 seconds by importing from your GitHub repository or creating a new Vercel project with pre-configured <code className="text-emerald-400 font-mono">vercel.json</code>.
            </p>

            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2L2 19.7778H22L12 2Z" />
              </svg>
              <span>Open Vercel New Project Importer</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            </a>
          </div>

          {/* Method 2: Vercel Token Automated Deployer */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 uppercase tracking-wider">
                Option 2: Direct Vercel CLI Token Deploy
              </span>
              <span className="text-[10px] text-slate-500">Automated</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                VERCEL API ACCESS TOKEN
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Get from vercel.com/account/tokens"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-white font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-1 block font-sans">
                Create token in <a href="https://vercel.com/account/tokens" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Vercel Account Settings ➔ Tokens</a>
              </span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                PROJECT NAME
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white outline-none focus:border-white font-mono text-xs"
              />
            </div>

            <button
              onClick={handleCliDeploy}
              disabled={isDeploying || !token}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Deploying to Vercel Cloud...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Vercel Production Deploy</span>
                </>
              )}
            </button>

            {/* Deploy Feedback */}
            {result && (
              <div
                className={`p-3 rounded-lg border text-xs font-mono space-y-1.5 mt-2 ${
                  result.success
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {result.success ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{result.message}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>Deploy Error</span>
                    </>
                  )}
                </div>
                {result.error && <p className="text-[11px] text-rose-300">{result.error}</p>}
                {result.output && (
                  <pre className="p-2 rounded bg-slate-950 text-slate-300 overflow-x-auto text-[10px] max-h-24">
                    {result.output}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Vercel Environment Configuration Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-200 block text-[11px] font-mono">
              PRE-CONFIGURED VERCEL ASSETS INCLUDED:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>vercel.json config</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>api/index.ts serverless</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vite SPA rewrites</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Firestore persistence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
