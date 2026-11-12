import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { APP_CONFIG } from '../config';

export type ApiStatus = 'up' | 'waking';

@Injectable({ providedIn: 'root' })
export class HealthApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  /**
   * "up" only when the Actuator answers UP. A 503 (database down) or a network error
   * arrives as an HttpClient error, and both mean the API is still waking up.
   */
  status(): Observable<ApiStatus> {
    return this.http.get<{ status: string }>(`${this.config.apiBaseUrl}/actuator/health`).pipe(
      map((health): ApiStatus => (health.status === 'UP' ? 'up' : 'waking')),
      catchError(() => of<ApiStatus>('waking')),
    );
  }
}
