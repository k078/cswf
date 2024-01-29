import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtiestService } from '../artiest.service';
import { Genre, IArtiest, ILp } from '@cswf/shared/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'cswf-artiest-update',
  templateUrl: './artiest-update.component.html',
  styleUrls: ['./artiest-update.component.css'],
})
export class ArtiestUpdateComponent implements OnInit {
  artiestForm: FormGroup;
  artiest: IArtiest | null = null;
  genres: Genre[] = Object.values(Genre).map(value => value as Genre);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private artiestService: ArtiestService,
    private datePipe: DatePipe
  ) {
    this.artiestForm = this.formBuilder.group({
      naam: ['', Validators.required],
      land: ['', Validators.required],
      leeftijd: ['', Validators.required],
      bio: ['', Validators.required],
      img: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.artiestService.read(id).subscribe((artiest) => {
          this.artiest = artiest;
          // Set de formulierwaarden met de bestaande gegevens
          this.artiestForm.patchValue({
            naam: artiest.naam,
            land: artiest.land,
            leeftijd: artiest.leeftijd,
            bio: artiest.bio,
            img: artiest.img,
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.artiestForm.valid && this.artiest) {
      const updatedArtiest: IArtiest = this.artiestForm.value as IArtiest;
      updatedArtiest.id = this.artiest.id;
      this.artiestService.updateArtiest(updatedArtiest).subscribe(
        (editedArtiest: IArtiest) => {
          console.log('Bijgewerkte artiest:', editedArtiest);
          this.router.navigate(['/artiest/', updatedArtiest.id]);
        },
        (error: any) => {
          console.error('Fout bij het updaten van de artiest:', error);
        }
      );
    }
  }
}
