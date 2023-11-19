import { Component, OnInit } from '@angular/core';
import { VerzamelingService } from '../verzameling.service';
import { IVerzameling } from '@cswf/shared/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cswf-verzameling-detail',
  templateUrl: './verzameling-detail.component.html',
  styleUrls: ['./verzameling-detail.component.css'],
})
export class VerzamelingDetailComponent implements OnInit {
  verzameling: IVerzameling | null = null;

  constructor(
    private route: ActivatedRoute,
    private VerzamelingService: VerzamelingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.VerzamelingService.read(id).subscribe((verzameling) => {
          this.verzameling = verzameling;
        });
      }
    });
  }

  verwijderVerzameling(id: number): void {
    this.VerzamelingService.verwijderVerzameling(id);
}
}
