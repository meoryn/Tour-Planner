import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';

@Component({
    selector: "app-login",
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [ButtonModule],
})
export class LoginComponent {
}