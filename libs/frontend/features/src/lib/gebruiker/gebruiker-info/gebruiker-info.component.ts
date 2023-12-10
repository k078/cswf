import { Component, OnInit } from '@angular/core';
import { GebruikerService } from '../gebruiker.service';
import { ILp, IGebruiker } from '@cswf/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'cswf-gebruiker-info',
  templateUrl: './gebruiker-info.component.html',
  styleUrls: ['./gebruiker-info.component.css'],
})
export class GebruikerInfoComponent implements OnInit {
  Gebruiker: IGebruiker | null = null;
  lps: ILp[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private GebruikerService: GebruikerService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.GebruikerService.read(id).subscribe((Gebruiker) => {
          this.Gebruiker = Gebruiker;
        });
      }
    });
  }

  verwijderGebruiker(id: number): void {
    this.authService.logout();
    this.GebruikerService.delete(id).subscribe(
      () => {
        console.log('Gebruiker successfully deleted');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error deleting gebruiker:', error);
      }
    );
  }

}
