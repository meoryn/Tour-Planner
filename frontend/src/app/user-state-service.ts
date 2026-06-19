import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AuthUser = {
  username: string;
  token: string;
};

const STORAGE_KEY = 'tourplanner.auth';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly _currentUser = signal<AuthUser | null>(this.restore());

  public currentUser = this._currentUser.asReadonly();

  isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }

  getToken(): string | null {
    return this._currentUser()?.token ?? null;
  }

  setSession(user: AuthUser) {
    this._currentUser.set(user);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }

  logout() {
    this._currentUser.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private restore(): AuthUser | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
