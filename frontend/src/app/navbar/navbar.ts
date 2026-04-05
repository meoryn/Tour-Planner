import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.html",
    styleUrl: "./navbar.css",
    imports: [ButtonModule],
    standalone: true
})
export class NavbarComponent {
}