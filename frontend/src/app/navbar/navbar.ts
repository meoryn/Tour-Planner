import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { Drawer } from 'primeng/drawer';
import { UserStateService } from '../user-state-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  imports: [ButtonModule, RouterLink, Drawer],
  standalone: true,
})
export class NavbarComponent {
  private userState = inject(UserStateService);
  private router = inject(Router);

  drawerVisible = signal(false);

  currentUser = this.userState.currentUser;

  logout() {
    this.userState.logout();
    this.drawerVisible.set(false);
    this.router.navigate(['/login']);
  }
}
