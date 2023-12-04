import { Component } from '@angular/core';
import { LpService } from '../lp.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Genre, ILp } from '@cswf/shared/api';

@Component({
  selector: 'cswf-lp-add',
  templateUrl: './lp-add.component.html',
  styleUrls: ['./lp-add.component.css'],
})
export class LpAddComponent {
  lpForm: FormGroup;

  // Create an array with enum values
  genres: Genre[] = Object.values(Genre).map(value => value as Genre);

  constructor(private lpService: LpService, private router: Router, private formBuilder: FormBuilder) {
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

  onSubmit(): void {
    if (this.lpForm.valid) {
      const newLp: ILp = this.lpForm.value as ILp;
      this.lpService.createLp(newLp).subscribe(
        (addedLp: ILp) => {
          console.log('Toegevoegde LP:', addedLp);
          this.router.navigate(['/lp']); // Navigeer naar de gewenste pagina na toevoegen
        },
        (error: any) => {
          console.error('Fout bij het toevoegen van de LP:', error);
        }
      );
    }
  }
}
