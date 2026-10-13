import React, { useState } from 'react';
import { GitBranch, UploadCloud, Check, AlertCircle, RefreshCw, X, Shield, Terminal, ArrowRight, ExternalLink } from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({
  isOpen,
  onClose
}) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/bhattunagavenkateshraju/agent-ci.git');
  const [token, setToken] = useState('');
  const [branch, setBranch] = useState('main');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    stdout?: string;
    stderr?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleDeploy = async () => {
    if (!repoUrl) return;
    setIsDeploying(true);
    setDeployResult(null);

    try {
      const res = await fetch('/api/git/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
          token,
          branch
        })
      });

      const data = await res.json();
      setDeployResult(data);
    } catch (err: any) {
      setDeployResult({
        success: false,
        error: err.message || 'Failed to connect to backend deployment runner.'
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
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Deploy Current Repository to GitHub
              </h3>
              <p className="text-xs text-slate-400">
                Push all code, components, Firebase rules, and workflows to your GitHub repo
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

        {/* Content */}
        <div className="p-5 space-y-4 font-mono text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              GITHUB REPOSITORY URL
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/agent-ci.git"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 font-mono text-xs"
            />
            <span className="text-[11px] text-slate-500 mt-1 block font-sans">
              Create a new repo on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 underline">github.com/new</a> and paste its clone URL.
            </span>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              GITHUB PERSONAL ACCESS TOKEN (PAT)
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 font-mono text-xs"
            />
            <span className="text-[11px] text-slate-500 mt-1 block font-sans">
              Required for private repos or HTTPS write authentication (scope: <code>repo</code>).
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                TARGET BRANCH
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                COMMITS READY
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-emerald-400 font-bold">
                2 Commits (Clean State)
              </div>
            </div>
          </div>

          {/* Result Feedback */}
          {deployResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono space-y-1.5 ${
                deployResult.success
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {deployResult.success ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{deployResult.message}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Deployment Failed</span>
                  </>
                )}
              </div>

              {deployResult.error && (
                <p className="text-[11px] text-rose-400 leading-relaxed font-sans">
                  {deployResult.error}
                </p>
              )}

              {(deployResult.stdout || deployResult.stderr) && (
                <pre className="p-2 rounded bg-slate-950 text-slate-300 overflow-x-auto text-[10px] max-h-24">
                  {deployResult.stdout || deployResult.stderr}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Direct Git CLI Remote Push
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDeploy}
              disabled={isDeploying || !repoUrl}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Pushing Code...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Deploy to GitHub</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
