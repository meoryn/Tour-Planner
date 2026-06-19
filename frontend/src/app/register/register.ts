import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { AuthApiService } from '../auth-api-service';
import { UserStateService } from '../user-state-service';
import * as v from 'valibot';

const RegisterSchema = v.pipe(
  v.object({
    username: v.pipe(v.string(), v.minLength(1, 'Username is required.'), v.maxLength(20)),
    password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters.')),
    repeatPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['repeatPassword']],
      (input) => input.password === input.repeatPassword,
      'Passwords do not match.',
    ),
    ['repeatPassword'],
  ),
);

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [ButtonModule, InputText, FormsModule],
})
export class RegisterComponent {
  private authApi = inject(AuthApiService);
  private userState = inject(UserStateService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  username = signal<string>('');
  password = signal<string>('');
  repeatPassword = signal<string>('');
  errorMessage = signal<string>('');

  registerUser() {
    this.errorMessage.set('');
    const formResult = v.safeParse(RegisterSchema, {
      username: this.username(),
      password: this.password(),
      repeatPassword: this.repeatPassword(),
    });

    if (!formResult.success) {
      this.errorMessage.set(formResult.issues[0]?.message ?? 'Invalid input');
      return;
    }

    this.authApi.register(formResult.output.username, formResult.output.password).subscribe({
      next: (token) => {
        this.userState.setSession({ username: formResult.output.username, token });
        this.messageService.add({
          severity: 'success',
          summary: 'Account created',
          detail: `Welcome, ${formResult.output.username}`,
        });
        this.router.navigate(['/tourlist']);
      },
      error: () => {
        this.errorMessage.set('Registration failed');
        this.messageService.add({
          severity: 'error',
          summary: 'Registration failed',
          detail: 'Please try a different username',
        });
      },
    });
  }
}