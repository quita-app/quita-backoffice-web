import { useEffect, useState } from 'react';

type ApiStatus = 'loading' | 'up' | 'waking';

const LABELS: Record<ApiStatus, string> = {
  loading: 'API: verificando…',
  up: 'API: no ar',
  waking: 'API: acordando',
};

export function App() {
  const [status, setStatus] = useState<ApiStatus>('loading');

  useEffect(() => {
    const controller = new AbortController();

    // relative path: inside the shell it goes through the shell's proxy
    fetch('/api/actuator/health', { signal: controller.signal })
      .then((response) => response.json())
      .then((health) => setStatus(health.status === 'UP' ? 'up' : 'waking'))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          setStatus('waking');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="demo-card">
      <h1>Analytics</h1>
      <p role="status">{LABELS[status]}</p>
    </main>
  );
}

export default App;
