import { Component, OnInit } from '@angular/core';
import { GebruikerService } from '../gebruiker.service';
import { ILp, IGebruiker } from '@cswf/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { VerzamelingService } from '../../verzameling/verzameling.service';

@Component({
  selector: 'cswf-gebruiker-info',
  templateUrl: './gebruiker-info.component.html',
  styleUrls: ['./gebruiker-info.component.css'],
})
export class GebruikerInfoComponent implements OnInit {
  gebruiker: IGebruiker | null = null;
  lps: ILp[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private gebruikerService: GebruikerService,
    private router: Router,
    private authService: AuthService,
    private verzamelingService: VerzamelingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.gebruikerService.read(id).subscribe((gebruiker) => {
          this.gebruiker = gebruiker;
        });
      }
    });
  }

  verwijderGebruiker(id: number): void {
    this.authService.logout();
    this.verzamelingService.list().subscribe((results) => {
      results?.forEach((verzameling) => {
        if (verzameling.eigenaar === this.gebruiker?.gebruikersnaam) {
          this.verzamelingService.verwijderVerzameling(verzameling.id).subscribe();
        }
      });
    });
    this.gebruikerService.delete(id).subscribe(
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
