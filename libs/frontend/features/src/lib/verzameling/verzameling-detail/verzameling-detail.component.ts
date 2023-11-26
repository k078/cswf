import { Component, OnInit } from '@angular/core';
import { VerzamelingService } from '../verzameling.service';
import { ILp, IVerzameling } from '@cswf/shared/api';
import { ActivatedRoute } from '@angular/router';
import { LpService } from '../../lp/lp.service';

@Component({
  selector: 'cswf-verzameling-detail',
  templateUrl: './verzameling-detail.component.html',
  styleUrls: ['./verzameling-detail.component.css'],
})
export class VerzamelingDetailComponent implements OnInit {
  verzameling: IVerzameling | null = null;
  lps: ILp[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private VerzamelingService: VerzamelingService,
    private LpService: LpService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.VerzamelingService.read(id).subscribe((verzameling) => {
          this.verzameling = verzameling;
          this.loadLps();
        });
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

  verwijderVerzameling(id: number): void {
    this.VerzamelingService.verwijderVerzameling(id);
}
}
