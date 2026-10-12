export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  logs: string[];
  metadata?: Record<string, any>;
}

export interface GitDiffFile {
  filename: string;
  oldPath: string;
  newPath: string;
  status: 'modified' | 'added' | 'deleted';
  additions: number;
  deletions: number;
  oldContent: string;
  newContent: string;
  hunks?: {
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    content: string;
  }[];
}

export interface SelfHealedPR {
  id: string;
  number: number;
  title: string;
  branch: string;
  baseBranch: string;
  author: string;
  avatarUrl: string;
  createdAt: string;
  status: 'open' | 'merged' | 'closed';
  summary: string;
  rootCause: string;
  fixStrategy: string;
  verificationReport: {
    sandboxEnv: string;
    testCommand: string;
    exitCode: number;
    testPassed: boolean;
    durationMs: number;
    checks: {
      name: string;
      status: 'pass' | 'fail';
      detail: string;
    }[];
  };
  filesChanged: GitDiffFile[];
  diffStat: {
    files: number;
    additions: number;
    deletions: number;
  };
}

export interface NebiusClusterMetrics {
  instanceId: string;
  region: string;
  gpuModel: string;
  gpuUtilization: number; // percentage
  vramUsedGb: number;
  vramTotalGb: number;
  tokensProcessed: number;
  model: string;
  inferenceLatencyMs: number;
  status: 'active' | 'provisioning' | 'idle' | 'standby';
}

export type ErrorCategory = 'syntax' | 'dependency' | 'type_error' | 'docker' | 'linter' | 'test_assertion' | 'env_drift' | 'security';

export interface HealingRun {
  id: string;
  repo: string;
  commitSha: string;
  branch: string;
  workflowName: string;
  triggeredBy: string;
  createdAt: string;
  completedAt?: string;
  status: 'analyzing' | 'synthesizing' | 'verifying' | 'healed' | 'failed' | 'queued';
  scenarioId?: string;
  rawFailureLogs: string;
  errorCategory: ErrorCategory;
  errorSummary: string;
  diagnosticNotes: string[];
  steps: PipelineStep[];
  nebiusMetrics: NebiusClusterMetrics;
  pullRequest?: SelfHealedPR;
}

export interface CIScenario {
  id: string;
  title: string;
  category: ErrorCategory;
  badge: string;
  repo: string;
  branch: string;
  commitSha: string;
  workflowName: string;
  triggerEvent: string;
  errorSummary: string;
  brokenFile: string;
  rawFailureLogs: string;
  brokenCodeSnippet: string;
  fixedCodeSnippet: string;
  fixedFileName: string;
  suggestedPRTitle: string;
  rootCauseAnalysis: string;
  fixRationale: string;
  testCommand: string;
}
