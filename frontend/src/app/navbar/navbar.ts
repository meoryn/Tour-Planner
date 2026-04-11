import { Component, signal } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";
import { Drawer } from 'primeng/drawer';

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.html",
    styleUrl: "./navbar.css",
    imports: [ButtonModule, RouterLink, Drawer],
    standalone: true
})
export class NavbarComponent {
    drawerVisible = signal(false);
}
