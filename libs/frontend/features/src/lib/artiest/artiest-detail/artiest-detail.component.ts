import { Component, Input, OnInit, Output } from '@angular/core';
import { ArtiestService } from '../artiest.service';
import { IArtiest, IVerzameling, Rol } from '@cswf/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { VerzamelingService } from '../../verzameling/verzameling.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cswf-artiest-detail',
  templateUrl: './artiest-detail.component.html',
  styleUrls: ['./artiest-detail.component.css'],
})
export class ArtiestDetailComponent implements OnInit {
  artiest: IArtiest | null = null;
  verzamelingen: IVerzameling[] = [];
  @Input() selectedArtiest: number | null = null;
  @Output() selectedVerzameling : IVerzameling | null = null;
  errorMessage: string | null = null;
  gebruiker = this.authService.currentUser$;
  subscription: Subscription | undefined = undefined;
  gebruikerRol = this.authService.currentUser$.value?.rol;

  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private ArtiestService: ArtiestService,
    private verzamelingService: VerzamelingService, // Voeg deze lijn toe
    private router : Router,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.ArtiestService.read(id).subscribe((Artiest) => {
          this.artiest = Artiest;

          this.subscription = this.verzamelingService.list().subscribe(
            (results) => {
              console.log(`results: ${results}`);
              this.verzamelingen = results!.filter(p=>p.eigenaar===this.gebruiker.value?.gebruikersnaam);
            }
          );
        });
      }
    });
  }

  isAdmin(): boolean {
    return this.gebruikerRol === Rol.ADMIN;
  }
  }
