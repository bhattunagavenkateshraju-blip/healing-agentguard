import { CIScenario } from '../types/agent';

export const CI_SCENARIOS: CIScenario[] = [
  {
    id: 'peer-dep-eresolve',
    title: 'npm ERESOLVE Peer Dependency Conflict (React 19 Upgrade)',
    category: 'dependency',
    badge: 'npm ERESOLVE',
    repo: 'acme-corp/cloud-console',
    branch: 'feat/checkout-v2',
    commitSha: '8f4a19c',
    workflowName: 'CI / Deploy Staging',
    triggerEvent: 'push (check_run failed)',
    errorSummary: 'npm error code ERESOLVE: Could not resolve dependency peer react@"^18.2.0" from @radix-ui/react-dialog@1.0.5',
    brokenFile: 'package.json',
    rawFailureLogs: `[23:41:02] Run npm ci
[23:41:03] npm error code ERESOLVE
[23:41:03] npm error ERESOLVE could not resolve
[23:41:03] npm error 
[23:41:03] npm error While resolving: @radix-ui/react-dialog@1.0.5
[23:41:03] npm error Found: react@19.0.0
[23:41:03] npm error node_modules/react
[23:41:03] npm error   react@"^19.0.0" from the root project
[23:41:03] npm error 
[23:41:03] npm error Could not resolve dependency:
[23:41:03] npm error peer react@"^16.8 || ^17.0 || ^18.0" from @radix-ui/react-dialog@1.0.5
[23:41:03] npm error node_modules/@radix-ui/react-dialog
[23:41:03] npm error   @radix-ui/react-dialog@"^1.0.5" from the root project
[23:41:03] npm error 
[23:41:03] npm error Conflicting peer dependency: react@18.3.1
[23:41:03] npm error node_modules/react
[23:41:03] npm error   peer react@"^16.8 || ^17.0 || ^18.0" from @radix-ui/react-dialog@1.0.5
[23:41:03] npm error 
[23:41:03] npm error Fix the upstream dependency conflict, or retry
[23:41:03] npm error this command with --force or --legacy-peer-deps
[23:41:04] Error: Process completed with exit code 1.`,
    brokenCodeSnippet: `{
  "name": "cloud-console",
  "version": "1.4.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "lucide-react": "^0.460.0"
  }
}`,
    fixedFileName: 'package.json',
    fixedCodeSnippet: `{
  "name": "cloud-console",
  "version": "1.4.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "lucide-react": "^0.460.0"
  },
  "overrides": {
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2"
  }
}`,
    suggestedPRTitle: 'fix(deps): bump @radix-ui packages to support React 19 peer deps',
    rootCauseAnalysis: 'The repository upgraded to React 19, but retained @radix-ui/react-dialog@1.0.5 which restricts peer dependencies to React <=18. NPM 10 strict resolution rejects this tree mismatch under `npm ci`.',
    fixRationale: 'Upgraded @radix-ui/react-dialog to ^1.1.2 and added npm package overrides to guarantee strict peer compatibility without compromising production tree-shaking.',
    testCommand: 'npm install --dry-run && npm ls react'
  },
  {
    id: 'ts-strict-null',
    title: 'TypeScript 5.x Strict Null Pointer Exception in Auth Flow',
    category: 'type_error',
    badge: 'TS2532 / TS2339',
    repo: 'acme-corp/api-gateway',
    branch: 'feat/oauth-session',
    commitSha: '3d7b91e',
    workflowName: 'Test & Typecheck',
    triggerEvent: 'pull_request (check_suite failed)',
    errorSummary: "src/middleware/auth.ts(42,17): error TS2532: Object is possibly 'undefined'. error TS2339: Property 'roles' does not exist on type 'UserSession | undefined'.",
    brokenFile: 'src/middleware/auth.ts',
    rawFailureLogs: `[14:12:05] Running "tsc --noEmit" in /workspace/src
[14:12:08] src/middleware/auth.ts:42:17 - error TS2532: Object is possibly 'undefined'.
[14:12:08] 
[14:12:08] 42     const userRoles = session.user.roles;
[14:12:08]                          ~~~~~~~
[14:12:08] 
[14:12:08] src/middleware/auth.ts:47:11 - error TS2339: Property 'id' does not exist on type 'UserSession | undefined'.
[14:12:08] 
[14:12:08] 47     req.userId = session.id;
[14:12:08]                     ~~~~~~~
[14:12:08] 
[14:12:08] Found 2 errors in src/middleware/auth.ts
[14:12:08] npm error Lifecycle script \`lint:types\` failed with error: 2
[14:12:08] Error: Process completed with exit code 2.`,
    brokenCodeSnippet: `export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = getSessionFromToken(req.headers.authorization);
  
  // Unsafe access without null check
  const userRoles = session.user.roles;
  if (!userRoles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.userId = session.id;
  next();
}`,
    fixedFileName: 'src/middleware/auth.ts',
    fixedCodeSnippet: `export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = getSessionFromToken(req.headers.authorization);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing session' });
  }

  const userRoles = session.user.roles ?? [];
  if (!userRoles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
  }

  req.userId = session.id;
  next();
}`,
    suggestedPRTitle: 'fix(auth): guard against undefined session in requireAdmin middleware',
    rootCauseAnalysis: 'getSessionFromToken returns `UserSession | undefined`. Accessing `session.user.roles` directly triggers TS2532 and risks a runtime TypeError: Cannot read properties of undefined (reading "user").',
    fixRationale: 'Introduced early 401 Unauthorized return on null/undefined session and nullish coalescing default for userRoles array before evaluating role permissions.',
    testCommand: 'tsc --noEmit && npm run test:unit -- src/middleware/auth.test.ts'
  },
  {
    id: 'docker-alpine-drift',
    title: 'Docker Alpine Build Failure (Missing Node-Gyp Native Toolchain)',
    category: 'docker',
    badge: 'Docker Exit 1',
    repo: 'acme-corp/identity-svc',
    branch: 'chore/alpine-slim-migration',
    commitSha: '61a29f0',
    workflowName: 'Docker Container Build & Scan',
    triggerEvent: 'push to main',
    errorSummary: 'Dockerfile:14 g++: not found. node-gyp rebuild failed for bcrypt@5.1.1 on alpine:3.19',
    brokenFile: 'Dockerfile',
    rawFailureLogs: `[08:19:30] STEP 5/9: RUN npm ci --omit=dev
[08:19:35] > bcrypt@5.1.1 install /app/node_modules/bcrypt
[08:19:35] > node-pre-gyp install --fallback-to-build
[08:19:36] node-pre-gyp info it worked if it ends with ok
[08:19:36] gyp info it worked if it ends with ok
[08:19:36] gyp ERR! find Python 
[08:19:36] gyp ERR! find Python Python is not installed or not in PATH
[08:19:36] gyp ERR! build error 
[08:19:36] gyp ERR! stack Error: not found: make
[08:19:36] gyp ERR! stack     at getNotFoundError (/usr/local/lib/node_modules/npm/node_modules/which/which.js:10:17)
[08:19:37] gyp ERR! System Linux 6.6.12-linuxkit
[08:19:37] gyp ERR! command "/usr/local/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
[08:19:37] The command '/bin/sh -c npm ci --omit=dev' returned a non-zero code: 1
[08:19:38] Error: buildx failed with: ERROR: failed to solve: process "/bin/sh -c npm ci --omit=dev" did not complete successfully: exit code: 1`,
    brokenCodeSnippet: `FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Fails because alpine does not bundle python, make, g++ for native addons
RUN npm ci --omit=dev

COPY . .
RUN npm run build`,
    fixedFileName: 'Dockerfile',
    fixedCodeSnippet: `FROM node:20-alpine AS builder
WORKDIR /app

# Install native build tools required for node-gyp (bcrypt C++ bindings)
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# Multi-stage production runtime container (keeps final image tiny)
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]`,
    suggestedPRTitle: 'fix(docker): install python3 and build-base in builder stage for node-gyp',
    rootCauseAnalysis: 'Node:20-alpine lacks build essentials. The bcrypt npm package compiles C++ binaries during install, causing node-gyp to crash with exit code 1 due to missing Python and Make.',
    fixRationale: 'Added `apk add --no-cache python3 make g++ libc6-compat` in the builder stage while maintaining a clean multi-stage runner image to keep the output container under 90MB.',
    testCommand: 'docker build --target builder -t identity-svc:test .'
  },
  {
    id: 'eslint9-unused-import',
    title: 'ESLint Flat Config Crash (--max-warnings=0 in CI)',
    category: 'linter',
    badge: 'ESLint Exit 1',
    repo: 'acme-corp/billing-portal',
    branch: 'feat/stripe-elements',
    commitSha: '9e120da',
    workflowName: 'Code Quality & Lint Gate',
    triggerEvent: 'pull_request (automated check)',
    errorSummary: "src/services/stripe.ts:8:10 'StripeWebhookSecret' is defined but never used (@typescript-eslint/no-unused-vars)",
    brokenFile: 'src/services/stripe.ts',
    rawFailureLogs: `[19:04:10] $ eslint . --max-warnings=0
[19:04:12] /home/runner/work/billing/src/services/stripe.ts
[19:04:12]   8:10  error  'StripeWebhookSecret' is defined but never used    @typescript-eslint/no-unused-vars
[19:04:12]  24:5   error  Promise returned in function argument where a void return was expected  @typescript-eslint/no-misused-promises
[19:04:12] 
[19:04:12] ✖ 2 problems (2 errors, 0 warnings)
[19:04:12] 
[19:04:12] npm error Lifecycle script \`lint\` failed with error: 1
[19:04:13] Error: Process completed with exit code 1.`,
    brokenCodeSnippet: `import Stripe from 'stripe';
import { StripeWebhookSecret, LogClient } from '../config/stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export function setupStripeWebhooks(app: any) {
  app.post('/api/webhook', (req: any, res: any) => {
    // Missing async handler wrapper causing unhandled promise warning
    processWebhookPayload(req.body);
    res.json({ received: true });
  });
}`,
    fixedFileName: 'src/services/stripe.ts',
    fixedCodeSnippet: `import Stripe from 'stripe';
import { LogClient } from '../config/stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export function setupStripeWebhooks(app: any) {
  app.post('/api/webhook', async (req: any, res: any) => {
    try {
      await processWebhookPayload(req.body);
      res.json({ received: true });
    } catch (err) {
      LogClient.error('Stripe webhook handling failed', err);
      res.status(500).json({ error: 'Webhook processing error' });
    }
  });
}`,
    suggestedPRTitle: 'fix(stripe): prune unused import and wrap async webhook dispatch',
    rootCauseAnalysis: 'Unused import StripeWebhookSecret and missing `await` inside Express route handler triggered strict ESLint rules that cause CI to fail when `--max-warnings=0` is enforced.',
    fixRationale: 'Pruned dead import token, converted route callback to async/await with defensive try/catch error logging and proper HTTP 500 response.',
    testCommand: 'npx eslint src/services/stripe.ts --max-warnings=0'
  },
  {
    id: 'jest-tz-drift',
    title: 'Vitest Date/Timezone Assertion Failure Across CI Runners',
    category: 'test_assertion',
    badge: 'Vitest FAIL',
    repo: 'acme-corp/analytics-engine',
    branch: 'fix/daily-metrics-rollout',
    commitSha: '5c88b21',
    workflowName: 'Unit & Integration Tests',
    triggerEvent: 'push',
    errorSummary: "AssertionError: expected '2026-10-11T17:00:00-07:00' to be '2026-10-12T00:00:00.000Z'",
    brokenFile: 'src/utils/dateFormatter.ts',
    rawFailureLogs: `[02:15:33] RUN  v1.4.0 /workspace
[02:15:34]  ❯ src/utils/dateFormatter.test.ts (2 tests | 1 failed)
[02:15:34]    × formatMidnightUtc > formats timestamp to standard ISO midnight
[02:15:34]      → AssertionError: expected '2026-10-11T17:00:00.000Z' to be '2026-10-12T00:00:00.000Z'
[02:15:34]      
[02:15:34]      - Expected   "2026-10-12T00:00:00.000Z"
[02:15:34]      + Received   "2026-10-11T17:00:00.000Z"
[02:15:34] 
[02:15:34]       at /workspace/src/utils/dateFormatter.test.ts:18:31
[02:15:34]       at /workspace/src/utils/dateFormatter.ts:12:15
[02:15:34] 
[02:15:35] Tests: 1 failed | 1 passed | 2 total
[02:15:35] Snapshots: 0 total
[02:15:35] Duration: 1.12s
[02:15:35] Error: Process completed with exit code 1.`,
    brokenCodeSnippet: `export function formatMidnightUtc(dateString: string): string {
  // Uses local timezone constructors which shift hours depending on host runner
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}`,
    fixedFileName: 'src/utils/dateFormatter.ts',
    fixedCodeSnippet: `export function formatMidnightUtc(dateString: string): string {
  // Enforce deterministic UTC midnight regardless of host runner TZ
  const d = new Date(dateString);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const date = d.getUTCDate();
  
  return new Date(Date.UTC(year, month, date, 0, 0, 0, 0)).toISOString();
}`,
    suggestedPRTitle: 'fix(dates): use explicit Date.UTC constructor to avoid runner timezone drift',
    rootCauseAnalysis: '`date.setHours(0,0,0,0)` operates on the machine’s local timezone offset. In GitHub Actions ubuntu-latest (UTC) vs local development (PST/PDT), the resulting date rolled back 7 hours.',
    fixRationale: 'Replaced local hours mutation with `Date.UTC(year, month, date, 0, 0, 0, 0)`, guaranteeing deterministic behavior across all CI runners.',
    testCommand: 'TZ=America/New_York npm test && TZ=UTC npm test'
  },
  {
    id: 'security-cve-audit',
    title: 'npm audit Critical Advisory Gate Failure (CVE High Severity)',
    category: 'security',
    badge: 'Security Gate',
    repo: 'acme-corp/user-management',
    branch: 'release/v3.2.0',
    commitSha: '2b4c8d9',
    workflowName: 'Security Compliance Audit',
    triggerEvent: 'schedule (nightly cron)',
    errorSummary: 'npm error audit: 1 high severity vulnerability found in jsonwebtoken < 9.0.0 (CVE-2022-23529)',
    brokenFile: 'package.json',
    rawFailureLogs: `[11:00:22] Run npm audit --audit-level=high
[11:00:24] 
[11:00:24] jsonwebtoken  <9.0.0
[11:00:24] Severity: high
[11:00:24] jsonwebtoken Insecure Key Retrieval in jwt.verify - https://github.com/advisories/GHSA-27h2-hvpr-p74q
[11:00:24] fix available via \`npm audit fix\`
[11:00:24] node_modules/jsonwebtoken
[11:00:24] 
[11:00:24] 1 high severity vulnerability
[11:00:24] npm error audit: 1 high severity vulnerability found
[11:00:24] Error: Process completed with exit code 1.`,
    brokenCodeSnippet: `{
  "name": "user-management",
  "version": "3.2.0",
  "dependencies": {
    "jsonwebtoken": "^8.5.1",
    "bcrypt": "^5.1.1",
    "express": "^4.19.2"
  }
}`,
    fixedFileName: 'package.json',
    fixedCodeSnippet: `{
  "name": "user-management",
  "version": "3.2.0",
  "dependencies": {
    "jsonwebtoken": "^9.0.2",
    "@types/jsonwebtoken": "^9.0.6",
    "bcrypt": "^5.1.1",
    "express": "^4.19.2"
  }
}`,
    suggestedPRTitle: 'security(deps): patch jsonwebtoken to v9.0.2 addressing GHSA-27h2-hvpr-p74q',
    rootCauseAnalysis: 'jsonwebtoken v8.5.1 is vulnerable to arbitrary code execution during secret verification if an untrusted key object is supplied (GHSA-27h2-hvpr-p74q). CI security gate enforced --audit-level=high.',
    fixRationale: 'Upgraded jsonwebtoken to latest secure v9.0.2 release and synchronized @types/jsonwebtoken to maintain clean type definition checks.',
    testCommand: 'npm audit --audit-level=high && npm test'
  }
];
