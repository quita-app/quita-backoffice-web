import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoader {
  private loading = new Map<string, Promise<void>>();

  /** Loads an ES module script once; the same Promise is shared by every caller. */
  load(url: string): Promise<void> {
    const existing = this.loading.get(url);
    if (existing) {
      return existing;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => {
        this.loading.delete(url); // failed: allow a new attempt later
        script.remove();
        reject(new Error(`Could not load ${url}`));
      };
      document.head.append(script);
    });

    this.loading.set(url, promise);
    return promise;
  }
}
