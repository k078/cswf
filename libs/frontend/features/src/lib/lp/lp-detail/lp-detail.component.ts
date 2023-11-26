import { Component, OnInit } from '@angular/core';
import { LpService } from '../lp.service';
import { ILp } from '@cswf/shared/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cswf-lp-detail',
  templateUrl: './lp-detail.component.html',
  styleUrls: ['./lp-detail.component.css'],
})
export class LpDetailComponent implements OnInit {
  lp: ILp | null = null;

  constructor(
    private route: ActivatedRoute,
    private LpService: LpService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.LpService.read(id).subscribe((lp) => {
          this.lp = lp;
        });
      }
    });
  }
}
