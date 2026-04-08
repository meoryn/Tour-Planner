import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.html",
    styleUrl: "./navbar.css",
    imports: [ButtonModule, RouterLink],
    standalone: true
})
export class NavbarComponent {
}