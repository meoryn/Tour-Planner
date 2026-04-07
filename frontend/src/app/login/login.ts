import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { UserStateService } from '../user-state-service';
import * as v from 'valibot';

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

type LoginData = v.InferOutput<typeof LoginSchema>;

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [ButtonModule, InputText],
})


export class LoginComponent {
  private userStateService = inject(UserStateService);

  userEmail = signal<string>('');
  userPassword = signal<string>('');

  loginUser() {
    const formResult = v.safeParse(LoginSchema, {
      email: this.userEmail(),
      password: this.userPassword(),
    });

    if (formResult.success) {
      this.userStateService.loginUser(formResult.output.email, formResult.output.password);
    } else {
      console.error('Validation failed', formResult.issues);
    }
  }
}
