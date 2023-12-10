import { Component, OnInit } from '@angular/core';
import { VerzamelingService } from '../verzameling.service';
import { ILp, IVerzameling } from '@cswf/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { LpService } from '../../lp/lp.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'cswf-verzameling-detail',
  templateUrl: './verzameling-detail.component.html',
  styleUrls: ['./verzameling-detail.component.css'],
})
export class VerzamelingDetailComponent implements OnInit {
  verzameling: IVerzameling | null = null;
  lps: ILp[] | undefined;
  gebruiker = this.authService.currentUser$;

  constructor(
    private route: ActivatedRoute,
    private VerzamelingService: VerzamelingService,
    private LpService: LpService,
    private authService: AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.VerzamelingService.read(id).subscribe((verzameling) => {
            this.verzameling = verzameling;
            if(this.verzameling?.eigenaar!==this.gebruiker.value?.gebruikersnaam){
              this.router.navigate(['/']);
            }
            this.loadLps();
          });
        } else {
          this.router.navigate(['/']);
        }
      });
  }
  loadLps(): void {
    if (this.verzameling) {
      this.LpService.list().subscribe((lps) => {
        this.lps = lps?.filter((lp) => this.verzameling!.lps.includes(lp.id));
      });
    }
  }

  deleteFromVerzameling(lp: ILp): void {
    if (this.verzameling) {
      this.verzameling.lps = this.verzameling.lps.filter((id) => id !== lp.id);
      this.VerzamelingService.updateVerzameling(this.verzameling).subscribe(
        (verzameling) => {
          this.verzameling = verzameling;
          this.loadLps();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  verwijderVerzameling(id: number): void {
    this.VerzamelingService.verwijderVerzameling(id);
  }
}
