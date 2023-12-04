import { Component, OnInit } from '@angular/core';
import { LpService } from '../lp.service';
import { ILp, IVerzameling } from '@cswf/shared/api';
import { ActivatedRoute } from '@angular/router';
import { VerzamelingService } from '../../verzameling/verzameling.service';

@Component({
  selector: 'cswf-lp-detail',
  templateUrl: './lp-detail.component.html',
  styleUrls: ['./lp-detail.component.css'],
})
export class LpDetailComponent implements OnInit {
  lp: ILp | null = null;
  verzamelingen: IVerzameling[] = []; // Voeg deze lijn toe

  constructor(
    private route: ActivatedRoute,
    private lpService: LpService,
    private verzamelingService: VerzamelingService // Voeg deze lijn toe
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const lpId = params.get('lpId');
      const verzamelingId = params.get('verzamelingId');

      // Voer de logica uit om de lp aan de verzameling toe te voegen
      if (lpId && verzamelingId) {
        this.addToVerzameling(parseInt(lpId, 10), parseInt(verzamelingId, 10));
      }
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
  addToVerzameling(lpId: number, verzamelingId: number): void {
    this.verzamelingService.addToVerzameling(lpId, verzamelingId).subscribe(
      () => {
        console.log('LP toegevoegd aan verzameling');
        // Voeg hier eventueel logica toe voor gebruikersfeedback
      },
      (error) => {
        console.error('Fout bij toevoegen aan verzameling', error);
        // Voeg hier eventueel logica toe voor foutafhandeling en gebruikersfeedback
      }
    );
  }
}
