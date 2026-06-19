import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SKIP_AUTH } from './auth-interceptor';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080';

  login(username: string, password: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/auth/login`,
      { username, password },
      {
        responseType: 'text',
        context: new HttpContext().set(SKIP_AUTH, true),
      },
    );
  }

  register(username: string, password: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/auth/register`,
      { username, password },
      {
        responseType: 'text',
        context: new HttpContext().set(SKIP_AUTH, true),
      },
    );
  }
}
