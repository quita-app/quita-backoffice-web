// Starts the shell, the operations remote and the analytics web component together,
// and prints every local URL only once they are really answering.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const READY_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 1000;

// What must answer before we say "ready". The shell is the one you open.
const SERVICES = [
  { label: 'Shell (abra este)', url: 'http://localhost:4200', probe: 'http://localhost:4200' },
  {
    label: 'Operations (remote)',
    url: 'http://localhost:4201',
    probe: 'http://localhost:4201/remoteEntry.json',
  },
  {
    label: 'Analytics (usado pelo shell)',
    url: 'http://localhost:4302',
    probe: 'http://localhost:4302/quita-analytics.js',
  },
];

// Informational only: the API lives in another repo and is started separately.
const API = { label: 'API', url: 'http://localhost:8080', probe: 'http://localhost:8080/actuator/health' };

// Run Nx through node directly: no shell, so no escaping warning (DEP0190) and no .cmd lookup.
const root = fileURLToPath(new URL('..', import.meta.url));
const nxPackage = createRequire(import.meta.url)('nx/package.json');
const nxBin = join(dirname(createRequire(import.meta.url).resolve('nx/package.json')), nxPackage.bin.nx);
const runNx = (args) => spawn(process.execPath, [nxBin, ...args], { stdio: 'inherit', cwd: root });

// Two Nx processes start in parallel: the Angular dev servers, and the analytics preview
// (which builds the web component first; Nx caches that build for the next run).
const children = [
  runNx(['run-many', '-t', 'serve', '-p', 'shell', 'operations']),
  runNx(['run', 'analytics:preview']),
];
for (const child of children) {
  child.on('exit', (code) => {
    children.forEach((other) => other.kill());
    process.exit(code ?? 0);
  });
}

const isUp = async ({ probe }) => {
  try {
    const response = await fetch(probe, { signal: AbortSignal.timeout(1500) });
    return response.ok;
  } catch {
    return false;
  }
};

const printUrls = async (pending) => {
  const apiUp = await isUp(API);
  const width = Math.max(...SERVICES.map((s) => s.label.length), API.label.length);
  const line = (label, url, note = '') => `  ${label.padEnd(width)}  ${url}${note}`;

  console.log('\n──────────────────────────────────────────────');
  console.log(pending.length ? '  Backoffice no ar (faltou subir algo)' : '  Backoffice pronto');
  for (const service of SERVICES) {
    console.log(line(service.label, service.url, pending.includes(service) ? '  [fora do ar]' : ''));
  }
  console.log(
    line(API.label, API.url, apiUp ? '  [no ar]' : '  [fora do ar: suba o quita-backend-api]'),
  );
  console.log('──────────────────────────────────────────────\n');
};

const waitUntilReady = async () => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < READY_TIMEOUT_MS) {
    const up = await Promise.all(SERVICES.map(isUp));
    if (up.every(Boolean)) {
      return printUrls([]);
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  const up = await Promise.all(SERVICES.map(isUp));
  return printUrls(SERVICES.filter((_, index) => !up[index]));
};

waitUntilReady();
