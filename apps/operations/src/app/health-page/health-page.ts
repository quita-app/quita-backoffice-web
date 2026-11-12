import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { HealthApi } from '@quita/shared-angular-data-access';

@Component({
  selector: 'quita-health-page',
  template: `
    <section class="card">
      <h2>Operações</h2>
      <p role="status">
        @switch (status()) {
          @case ('up') {
            API: no ar
          }
          @case ('waking') {
            API: acordando
          }
          @default {
            API: verificando…
          }
        }
      </p>
    </section>
  `,
  styles: `
    .card {
      padding: 24px;
      background: var(--card);
      color: var(--card-foreground);
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
    }
  `,
})
export class HealthPage {
  // Observable → signal: the template re-renders when the answer arrives (zoneless).
  // undefined means "still waiting for the first answer".
  protected readonly status = toSignal(inject(HealthApi).status());
}
