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
  Zap,
  BarChart3,
  LogIn,
  LogOut,
  User,
  Database,
  UploadCloud
} from 'lucide-react';
import { NebiusClusterMetrics } from '../types/agent';
import { UserProfile } from '../lib/firebase';

interface HeaderProps {
  metrics: NebiusClusterMetrics;
  onOpenWorkflow: () => void;
  onOpenDeploy: () => void;
  onOpenVercel: () => void;
  onOpenSettings: () => void;
  onOpenFailureLab: () => void;
  onTriggerHeal: () => void;
  isHealing: boolean;
  activeRepo: string;
  activeView: 'dashboard' | 'console';
  onChangeView: (view: 'dashboard' | 'console') => void;
  currentUser: UserProfile | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  onOpenWorkflow,
  onOpenDeploy,
  onOpenVercel,
  onOpenSettings,
  onOpenFailureLab,
  onTriggerHeal,
  isHealing,
  activeRepo,
  activeView,
  onChangeView,
  currentUser,
  onSignIn,
  onSignOut
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-4">
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
              </p>
            </div>
          </div>

          {/* View Nav Toggles: Dashboard vs Pipeline Console */}
          <div className="hidden md:flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 ml-2">
            <button
              onClick={() => onChangeView('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Metrics Dashboard</span>
            </button>

            <button
              onClick={() => onChangeView('console')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'console'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Pipeline Console</span>
            </button>
          </div>
        </div>

        {/* Live Cluster Pill */}
        <div className="hidden lg:flex items-center gap-3 text-xs bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-slate-400">Cluster:</span>
            <span className="font-mono font-semibold text-emerald-400">{metrics.gpuModel}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-slate-400">Firestore:</span>
            <span className="font-mono text-cyan-300">Connected</span>
          </div>
        </div>

        {/* Action Controls & Google Auth */}
        <div className="flex items-center gap-2">
          {/* Mobile view switcher */}
          <div className="flex md:hidden items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => onChangeView('dashboard')}
              className={`p-1.5 rounded text-xs ${activeView === 'dashboard' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
              title="Dashboard"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeView('console')}
              className={`p-1.5 rounded text-xs ${activeView === 'console' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
              title="Console"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenFailureLab}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
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
            <span>Action YAML</span>
          </button>

          <button
            onClick={onOpenDeploy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg transition-all cursor-pointer"
            title="Deploy current repository directly to GitHub"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">GitHub</span>
          </button>

          <button
            onClick={onOpenVercel}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-all cursor-pointer"
            title="Deploy to Vercel Cloud"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M12 2L2 19.7778H22L12 2Z" />
            </svg>
            <span className="hidden sm:inline">Vercel</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
            title="Nebius Cloud & Nemotron Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile / Google Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-500/40"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <span className="text-slate-200 font-medium truncate max-w-[100px] hidden sm:inline">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={onSignOut}
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                  title="Sign out of Firebase"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg transition-all cursor-pointer"
              title="Sign in with Google to persist DevOps telemetry"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Sign-In</span>
            </button>
          )}

          <button
            onClick={onTriggerHeal}
            disabled={isHealing}
            className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              isHealing
                ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
            }`}
          >
            {isHealing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Healer Active</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Heal Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
