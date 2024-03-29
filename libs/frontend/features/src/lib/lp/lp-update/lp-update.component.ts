import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LpService } from '../lp.service';
import { Genre, ILp } from '@cswf/shared/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'cswf-lp-update',
  templateUrl: './lp-update.component.html',
  styleUrls: ['./lp-update.component.css'],
})
export class LpUpdateComponent implements OnInit {
  lpForm: FormGroup;
  lp: ILp | null = null;
  genres: Genre[] = Object.values(Genre).map(value => value as Genre);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private lpService: LpService,
    private datePipe: DatePipe
  ) {
    this.lpForm = this.formBuilder.group({
      titel: ['', Validators.required],
      artiest: ['', Validators.required],
      release: ['', Validators.required],
      land: ['', Validators.required],
      label: ['', Validators.required],
      genre: ['', Validators.required],
      img: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.lpService.read(id).subscribe((lp) => {
          this.lp = lp;
          const formattedRelease = this.datePipe.transform(lp.release, 'yyyy-MM-dd');
          // Set de formulierwaarden met de bestaande gegevens
          this.lpForm.patchValue({
            titel: lp.titel,
            artiest: lp.artiest,
            release: formattedRelease,
            land: lp.land,
            label: lp.label,
            genre: lp.genre,
            img: lp.img,
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.lpForm.valid && this.lp) {
      const updatedLp: ILp = this.lpForm.value as ILp;
      updatedLp.id = this.lp.id;
      this.lpService.updateLp(updatedLp).subscribe(
        (editedLp: ILp) => {
          console.log('Bijgewerkte LP:', editedLp);
          this.router.navigate(['/lp/', updatedLp.id]);
        },
        (error: any) => {
          console.error('Fout bij het updaten van de LP:', error);
        }
      );
    }
  }
}
