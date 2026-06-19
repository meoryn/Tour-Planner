import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { AuthApiService } from '../auth-api-service';
import { UserStateService } from '../user-state-service';
import * as v from 'valibot';

const LoginSchema = v.object({
  username: v.pipe(v.string(), v.minLength(1, 'Username is required.'), v.maxLength(20)),
  password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters.')),
});

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [ButtonModule, InputText, FormsModule],
})
export class LoginComponent {
  private authApi = inject(AuthApiService);
  private userState = inject(UserStateService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  username = signal<string>('');
  password = signal<string>('');
  errorMessage = signal<string>('');

  loginUser() {
    this.errorMessage.set('');
    const formResult = v.safeParse(LoginSchema, {
      username: this.username(),
      password: this.password(),
    });

    if (!formResult.success) {
      this.errorMessage.set(formResult.issues[0]?.message ?? 'Invalid input');
      return;
    }

    this.authApi.login(formResult.output.username, formResult.output.password).subscribe({
      next: (token) => {
        this.userState.setSession({ username: formResult.output.username, token });
        this.messageService.add({
          severity: 'success',
          summary: 'Welcome back',
          detail: formResult.output.username,
        });
        this.router.navigate(['/tourlist']);
      },
      error: () => {
        this.errorMessage.set('Invalid credentials');
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed',
          detail: 'Invalid credentials',
        });
      },
    });
  }
}
