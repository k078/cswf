import { Component } from '@angular/core';
import { ArtiestService } from '../artiest.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Genre, IArtiest} from '@cswf/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'cswf-artiest-add',
  templateUrl: './artiest-add.component.html',
  styleUrls: ['./artiest-add.component.css'],
})
export class ArtiestAddComponent {
  artiestForm: FormGroup;
  gebruiker = this.authService.currentUser$.value?.gebruikersnaam;

  // Create an array with enum values
  genres: Genre[] = Object.values(Genre).map(value => value as Genre);

  constructor(private artiestService: ArtiestService, private router: Router, private formBuilder: FormBuilder, private authService: AuthService) {
      this.artiestForm = this.formBuilder.group({
        naam: ['', Validators.required],
        land: ['', Validators.required],
        leeftijd: ['', Validators.required],
        bio: ['', Validators.required],
        img: ['', Validators.required],
      });
    }

  onSubmit(): void {
    if (this.artiestForm.valid) {
      const newArtiest: IArtiest = {
        ...this.artiestForm.value,
        gebruiker: this.gebruiker,
      };
      this.artiestService.createArtiest(newArtiest).subscribe(
        (addedArtiest: IArtiest) => {
          console.log('Toegevoegde artiest:', addedArtiest);
          this.router.navigate(['/artiest']); // Navigeer naar de gewenste pagina na toevoegen
        },
        (error: any) => {
          console.error('Fout bij het toevoegen van de artiest:', error);
        }
      );
    }
  }
}
