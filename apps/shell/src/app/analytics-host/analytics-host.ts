import { CUSTOM_ELEMENTS_SCHEMA, Component, inject, signal } from '@angular/core';
import { REMOTES_MANIFEST } from '@quita/shared-angular-data-access';
import { ScriptLoader } from './script-loader';

@Component({
  selector: 'quita-analytics-host',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (state() === 'ready') {
      <quita-analytics></quita-analytics>
    }
  `,
})
export class AnalyticsHost {
  protected readonly state = signal<'loading' | 'ready' | 'failed'>('loading');

  constructor() {
    inject(ScriptLoader)
      .load(inject(REMOTES_MANIFEST)['analytics'])
      .then(() => this.state.set('ready'))
      .catch((error) => {
        // the visual error screen comes later, from the design
        console.error(error);
        this.state.set('failed');
      });
  }
}
