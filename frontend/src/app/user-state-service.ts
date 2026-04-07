import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type User = {
  id: number;
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly _users = signal<User[]>([]);
  private readonly _currentUser = signal<User | null>(null);

  public users = this._users.asReadonly();
  public currentUser = this._currentUser.asReadonly();

  registerUser(user: User) {
    this._users.set([...this._users(), user]);
  }

  removeUser(email: string) {
    this._users.set(this._users().filter(u => u.email !== email));
  }

  loginUser(email: string, password: string) {
    const user = this._users().find(u => u.email === email && u.password === password);
    if (user) {
      this._currentUser.set(user);
    } else {
      //TODO: Handle login failure (e.g., show error message)
    }
  }
}
