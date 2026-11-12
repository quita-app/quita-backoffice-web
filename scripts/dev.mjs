// Starts the shell, the operations remote and the analytics web component together,
// and prints every local URL only once they are really answering.
import { spawn } from 'node:child_process';

const READY_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 1500;

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
  { label: 'Analytics (página isolada)', url: 'http://localhost:4202', probe: 'http://localhost:4202' },
];

// Informational only: the API lives in another repo and is started separately.
const API = { label: 'API', url: 'http://localhost:8080', probe: 'http://localhost:8080/actuator/health' };

const nx = spawn(
  'npx',
  ['nx', 'run-many', '-t', 'serve', 'preview', '-p', 'shell', 'operations', 'analytics', '--parallel=5'],
  { stdio: 'inherit', shell: true },
);
nx.on('exit', (code) => process.exit(code ?? 0));

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
