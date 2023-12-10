import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { FeaturesModule } from '@cswf/frontend/features';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'libs/frontend/features/src/lib/auth/auth.service';


@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, FeaturesModule, CommonModule],
  selector: 'cswf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  gebruiker = this.authService.currentUser$;
  title = 'frontend';
  constructor(private authService: AuthService) {}
  isAuth(): boolean {
    return this.authService.isAuthenticated();
  }
  logout(): void {
    this.authService.logout();
  }
}
