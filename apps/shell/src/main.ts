import { initFederation } from '@angular-architects/native-federation';

// 1) Read this deployment's files. "no-store": never a stale manifest from the browser cache.
Promise.all([
  fetch('federation.manifest.json', { cache: 'no-store' }).then((r) => r.json()),
  fetch('app-config.json', { cache: 'no-store' }).then((r) => r.json()),
])
  .then(async ([manifest, config]) => {
    // 2) Only federated remotes (remoteEntry.json) go to the import map.
    //    Script remotes, like the analytics Web Component, are loaded on demand by the route.
    const federated = Object.fromEntries(
      Object.entries(manifest as Record<string, string>).filter(([, url]) =>
        url.endsWith('remoteEntry.json'),
      ),
    );

    // A remote that is down must not stop the shell from starting: log and move on.
    // A friendly "area unavailable" screen comes later, from the design.
    const federation = await initFederation(federated, {
      hostRemoteEntry: { url: './remoteEntry.json' },
    }).catch((err) => {
      console.error(err);
      return undefined;
    });

    // 3) Only now load Angular, and hand it the configuration it must inject,
    //    plus the loadRemoteModule that belongs to this federation instance.
    const { bootstrap } = await import('./bootstrap');
    await bootstrap(
      manifest,
      config,
      federation?.loadRemoteModule ??
        (() => Promise.reject(new Error('Native federation did not start'))),
    );
  })
  .catch((err) => console.error(err));
