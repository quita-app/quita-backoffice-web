// Starts the shell, the operations remote and the analytics web component together.
// Nx output is hidden: you see a Quita-styled loading screen, then the local URLs.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const READY_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 1000;
const LOG_LINES_KEPT = 40;

// Quita palette (design/DESIGN.md): sky is the signature, mint celebrates, the rest is neutral.
const SKY = '#8DB0F7';
const MINT = '#91E6BE';
const MUTED = '#9AA8BD';
const TEXT = '#EEF3FA';
const ERROR = '#EB827B';

const SERVICES = [
  {
    name: 'Shell',
    note: 'abra este',
    hint: 'carregando o Angular',
    url: 'http://localhost:4200',
    probe: 'http://localhost:4200',
  },
  {
    name: 'Operations',
    note: 'remote Angular',
    hint: 'carregando o remote',
    url: 'http://localhost:4201',
    probe: 'http://localhost:4201/remoteEntry.json',
  },
  {
    name: 'Analytics',
    note: 'painel React',
    hint: 'construindo o painel',
    url: 'http://localhost:4302',
    probe: 'http://localhost:4302/quita-analytics.js',
  },
];

// Informational only: the API lives in another repo and is started separately.
const API = { name: 'API', url: 'http://localhost:8080', probe: 'http://localhost:8080/actuator/health' };

// ── terminal helpers ────────────────────────────────────────────────────────
const out = process.stdout;
const fancy = out.isTTY && !process.env.NO_COLOR;

const paint = (hex, text, { bold = false, underline = false } = {}) => {
  if (!fancy) return text;
  const n = parseInt(hex.slice(1), 16);
  const style = `${bold ? '1;' : ''}${underline ? '4;' : ''}`;
  return `\x1b[${style}38;2;${n >> 16};${(n >> 8) & 255};${n & 255}m${text}\x1b[0m`;
};

const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const WIDTH = Math.max(...SERVICES.map((s) => s.name.length), API.name.length);
const header = (suffix = '') =>
  `  ${paint(SKY, 'quita', { bold: true })} ${paint(MINT, '✓')}  ${paint(MUTED, `backoffice${suffix}`)}`;
const rule = `  ${paint(MUTED, '─'.repeat(40))}`;

let drawn = 0;
const draw = (lines) => {
  if (!fancy) return;
  if (drawn) out.write(`\x1b[${drawn}A`);
  for (const line of lines) out.write(`\x1b[2K${line}\n`);
  drawn = lines.length;
};
const clearDrawn = () => {
  if (fancy && drawn) out.write(`\x1b[${drawn}A\x1b[0J`);
  drawn = 0;
};
const showCursor = (visible) => fancy && out.write(visible ? '\x1b[?25h' : '\x1b[?25l');

// ── start Nx (hidden) ───────────────────────────────────────────────────────
// Node runs the Nx binary directly: no shell, so no escaping warning (DEP0190).
const root = fileURLToPath(new URL('..', import.meta.url));
const nxRequire = createRequire(import.meta.url);
const nxBin = join(dirname(nxRequire.resolve('nx/package.json')), nxRequire('nx/package.json').bin.nx);

const logTail = [];
const capture = (chunk) => {
  for (const line of chunk.toString().split(/\r?\n/)) {
    if (line.trim()) logTail.push(line);
  }
  logTail.splice(0, Math.max(0, logTail.length - LOG_LINES_KEPT));
};

// NX_TUI=false: Nx's full-screen UI is off. The output is piped, so we show our own screen.
const runNx = (args) => {
  const child = spawn(process.execPath, [nxBin, ...args], {
    cwd: root,
    env: { ...process.env, NX_TUI: 'false', FORCE_COLOR: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', capture);
  child.stderr.on('data', capture);
  return child;
};

// Two Nx processes in parallel: the Angular dev servers, and the analytics preview
// (which builds the web component first; Nx caches that build for the next run).
const children = [
  runNx(['run-many', '-t', 'serve', '-p', 'shell', 'operations']),
  runNx(['run', 'analytics:preview']),
];

const stopAll = () => {
  for (const child of children) {
    if (child.exitCode !== null) continue;
    // on Windows kill() does not reach the dev servers Nx started: end the whole tree
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      child.kill();
    }
  }
};

let finished = false;
let spinnerTimer;

const fail = (message) => {
  if (finished) return;
  finished = true;
  clearInterval(spinnerTimer);
  clearDrawn();
  showCursor(true);
  console.log(`\n${header()}\n${rule}`);
  console.log(`  ${paint(ERROR, '✗', { bold: true })} ${paint(TEXT, message)}\n`);
  console.log(paint(MUTED, '  Últimas linhas do Nx:'));
  for (const line of logTail.slice(-15)) console.log(paint(MUTED, `    ${line}`));
  console.log();
  stopAll();
  setTimeout(() => process.exit(1), 300);
};

for (const child of children) {
  child.on('exit', (code) => {
    if (!finished || code) fail(`Um processo do Nx encerrou (código ${code ?? '?'}).`);
  });
}

process.on('SIGINT', () => {
  showCursor(true);
  stopAll();
  process.exit(0);
});

// ── wait for the services, then print the URLs ──────────────────────────────
const isUp = async ({ probe }) => {
  try {
    const response = await fetch(probe, { signal: AbortSignal.timeout(1500) });
    return response.ok;
  } catch {
    return false;
  }
};

const printReady = async (startedAt) => {
  finished = true;
  clearInterval(spinnerTimer);
  clearDrawn();
  showCursor(true);

  const apiUp = await isUp(API);
  const seconds = Math.round((Date.now() - startedAt) / 1000);
  const link = (url, strong = false) => paint(SKY, url, { bold: strong, underline: true });

  console.log(`\n${header(`  ·  pronto em ${seconds}s`)}\n${rule}\n`);
  console.log(`  ${paint(MINT, '➜', { bold: true })} ${paint(TEXT, 'Abra', { bold: true })}  ${link(SERVICES[0].url, true)}\n`);
  for (const service of SERVICES.slice(1)) {
    console.log(`    ${paint(TEXT, service.name.padEnd(WIDTH))}  ${link(service.url)}  ${paint(MUTED, service.note)}`);
  }
  const apiStatus = apiUp
    ? paint(MINT, '● no ar')
    : paint(ERROR, '○ fora do ar') + paint(MUTED, '  (suba o quita-backend-api)');
  console.log(`    ${paint(TEXT, API.name.padEnd(WIDTH))}  ${paint(MUTED, API.url)}  ${apiStatus}`);
  console.log(`\n  ${paint(MUTED, 'Ctrl+C para parar tudo.')}\n`);
};

const startedAt = Date.now();
const upState = SERVICES.map(() => false);

showCursor(false);
console.log();
if (fancy) {
  spinnerTimer = setInterval(() => {
    const frame = SPINNER[Math.floor(Date.now() / 80) % SPINNER.length];
    draw([
      header(),
      rule,
      ...SERVICES.map((service, index) =>
        upState[index]
          ? `  ${paint(MINT, '✓')} ${paint(TEXT, service.name.padEnd(WIDTH))}  ${paint(MUTED, 'pronto')}`
          : `  ${paint(SKY, frame)} ${paint(TEXT, service.name.padEnd(WIDTH))}  ${paint(MUTED, service.hint)}`,
      ),
      '',
    ]);
  }, 80);
} else {
  console.log('quita ✓ backoffice: subindo, aguarde...');
}

while (!finished) {
  const results = await Promise.all(SERVICES.map(isUp));
  results.forEach((up, index) => (upState[index] = up));

  if (results.every(Boolean)) {
    await printReady(startedAt);
    break;
  }
  if (Date.now() - startedAt > READY_TIMEOUT_MS) {
    const waiting = SERVICES.filter((_, index) => !results[index]).map((s) => s.name);
    fail(`Demorou demais. Ainda sem resposta: ${waiting.join(', ')}.`);
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
}
