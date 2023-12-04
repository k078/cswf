import { Component, Input, OnInit, Output } from '@angular/core';
import { LpService } from '../lp.service';
import { ILp, IVerzameling } from '@cswf/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { VerzamelingService } from '../../verzameling/verzameling.service';

@Component({
  selector: 'cswf-lp-detail',
  templateUrl: './lp-detail.component.html',
  styleUrls: ['./lp-detail.component.css'],
})
export class LpDetailComponent implements OnInit {
  lp: ILp | null = null;
  verzamelingen: IVerzameling[] = []; // Voeg deze lijn toe
  @Input() selectedLp: number | null = null;
  @Output() selectedVerzameling : IVerzameling | null = null; // Voeg deze lijn toe
  errorMessage: string | null = null;

  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private lpService: LpService,
    private verzamelingService: VerzamelingService, // Voeg deze lijn toe
    private router : Router
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.lpService.read(id).subscribe((lp) => {
          this.lp = lp;

          // Haal de lijst met verzamelingen op
          this.verzamelingService.list().subscribe((verzamelingen) => {
            this.verzamelingen = verzamelingen || [];
          });
        });
      }
    });
  }

  // Voeg deze methode toe om een lp aan een verzameling toe te voegen
  addToVerzameling(): void {
    const isAlreadyInVerzameling = this.selectedVerzameling?.lps.includes(this.lp?.id as number);
    if (!isAlreadyInVerzameling) {

      this.selectedVerzameling?.lps.push(this.lp?.id as number);
      this.verzamelingService.updateVerzameling(this.selectedVerzameling as IVerzameling).subscribe(
        (verzameling) => {
          this.selectedVerzameling = verzameling;
          this.router.navigate(['/verzameling', this.selectedVerzameling.id]);
        },
        (error) => {
          console.error(error);
          this.errorMessage='Er is iets misgegaan bij het toevoegen van de lp aan de verzameling';
        }
        );
      }else{
        this.errorMessage='Er is iets misgegaan bij het toevoegen van de lp aan de verzameling';
      }
  }
  }
