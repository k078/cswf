import { Component, OnInit, OnDestroy } from '@angular/core';
import { IArtiest } from '@cswf/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Rol } from '@cswf/shared/api';
import { ArtiestService } from '../artiest.service';

@Component({
  selector: 'cswf-artiest-list',
  templateUrl: './artiest-list.component.html',
  styleUrls: ['./artiest-list.component.css'],
})
export class ArtiestListComponent implements OnInit, OnDestroy {
  artiesten: IArtiest[] | null = null;
  subscription: Subscription | undefined = undefined;
  sortAscending = true;
  sortAscendingId = true;
  gebruiker = this.authService.currentUser$.value?.gebruikersnaam;
  gebruikerRol = this.authService.currentUser$.value?.rol;

  constructor(
    private artiestService: ArtiestService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) this.router.navigate(['/login']); {
      this.subscription = this.artiestService.list().subscribe((results) => {
        console.log(`results: ${results}`);
        this.artiesten = results;
      });
    }
  }

  isAdmin(): boolean {
    return this.gebruikerRol === Rol.ADMIN;
  }

  verwijderArtiest(id: number): void {
    this.artiestService.deleteArtiest(id).subscribe(() => {
      this.artiestService.list().subscribe((results) => {
        this.artiesten = results;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
