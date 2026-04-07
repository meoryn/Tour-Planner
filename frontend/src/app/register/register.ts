import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { InputText } from "primeng/inputtext";

@Component({
    selector: "app-register",
    templateUrl: "./register.html",
    styleUrl: "./register.css",
    imports: [ButtonModule, InputText],
})
export class RegisterComponent {
}