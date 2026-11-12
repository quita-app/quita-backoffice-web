import { InjectionToken } from '@angular/core';

/** Per-environment settings, read from public/app-config.json at startup. */
export interface AppConfig {
  /** Base path of the API, always same-origin ("/api"): the dev server and Vercel proxy it. */
  apiBaseUrl: string;
}

/** Remote name → address in this environment (federation.manifest.json). */
export type RemotesManifest = Record<string, string>;

/** The loadRemoteModule that initFederation returns, bound to this host's federation instance. */
export type LoadRemoteModule = <T = unknown>(
  remoteName: string,
  exposedModule: string,
) => Promise<T>;

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
export const LOAD_REMOTE_MODULE = new InjectionToken<LoadRemoteModule>('LOAD_REMOTE_MODULE');
export const REMOTES_MANIFEST = new InjectionToken<RemotesManifest>('REMOTES_MANIFEST');
