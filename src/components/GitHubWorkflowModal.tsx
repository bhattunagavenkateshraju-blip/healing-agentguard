import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  ExternalLink,
  GitBranch,
  Terminal,
  Zap
} from 'lucide-react';

interface GitHubWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const GitHubWorkflowModal: React.FC<GitHubWorkflowModalProps> = ({
  isOpen,
  onClose,
  appUrl
}) => {
  const [copied, setCopied] = useState(false);
  const [autoMerge, setAutoMerge] = useState(false);

  if (!isOpen) return null;

  const endpointUrl = appUrl 
    ? `${appUrl.replace(/\/$/, '')}/api/webhooks/github` 
    : 'https://ais-dev-oqazclc4yu6cufb25dd5w7-775318907285.asia-southeast1.run.app/api/webhooks/github';

  const workflowYaml = `name: Agent-CI Self-Healing Watcher

# Triggered whenever any build, lint, or test pipeline fails
on:
  workflow_run:
    workflows: ["CI", "Test", "Build", "Lint Gate", "Docker Container Build"]
    types: [completed]
  check_run:
    types: [completed]

jobs:
  autonomous-self-heal:
    # Autonomous trigger on pipeline failure
    if: \${{ github.event.workflow_run.conclusion == 'failure' || github.event.check_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      checks: read

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 5

      - name: Extract Failure Artifacts & Logs
        id: log-extractor
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          echo "Ingesting failing run details..."
          RUN_ID="\${{ github.event.workflow_run.id || github.event.check_run.id }}"
          gh run view "$RUN_ID" --log-failed > failed_run_log.txt || echo "CI Failure detected" > failed_run_log.txt
          echo "Lines extracted: $(wc -l < failed_run_log.txt)"

      - name: Spin up Agent-CI on Nebius (Nemotron-70B)
        env:
          AGENT_CI_WEBHOOK: "${endpointUrl}"
          AGENT_CI_SECRET: \${{ secrets.AGENT_CI_SECRET }}
        run: |
          echo "🚀 Dispatching self-healing payload to Nebius Cloud cluster..."
          
          curl -s -X POST "$AGENT_CI_WEBHOOK" \\
            -H "Content-Type: application/json" \\
            -H "X-GitHub-Event: workflow_run" \\
            -H "Authorization: Bearer $AGENT_CI_SECRET" \\
            -d @- <<EOF
          {
            "repository": {
              "full_name": "\${{ github.repository }}"
            },
            "check_run": {
              "head_sha": "\${{ github.sha }}",
              "name": "\${{ github.workflow }}",
              "check_suite": {
                "head_branch": "\${{ github.ref_name }}"
              }
            },
            "logs": "$(cat failed_run_log.txt | head -n 120 | sed 's/"/\\\\"/g')",
            "autoMerge": ${autoMerge}
          }
          EOF
          
          echo "Self-healing dispatched. Agent will test and open PR automatically."
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(workflowYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                GitHub Action Self-Healing Integration
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Add .github/workflows/agent-ci.yml to any repo for 100% autonomous pipeline recovery
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
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">STEP 1</span>
              <p className="text-slate-300">Save this file to <code className="text-indigo-300">.github/workflows/agent-ci.yml</code></p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">STEP 2</span>
              <p className="text-slate-300">Grant GitHub token <code className="text-indigo-300">pull-requests: write</code> permission</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">STEP 3</span>
              <p className="text-slate-300">When any CI run fails, Agent-CI opens a Self-Healed PR in &lt;10s</p>
            </div>
          </div>

          {/* Toggle Auto Merge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Autonomous Auto-Merge</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Automatically merge PR if sandbox unit and static checks achieve 100% pass score
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoMerge}
              onChange={(e) => setAutoMerge(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
          </div>

          {/* Code View */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
            <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <span className="text-[11px]">.github/workflows/agent-ci.yml</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied YAML' : 'Copy Configuration'}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-300 max-h-[300px] leading-relaxed select-all">
              {workflowYaml}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
