import { Component } from '@angular/core';
import { VerzamelingService } from '../verzameling.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGebruiker, IVerzameling } from '@cswf/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'cswf-verzameling-add',
  templateUrl: './verzameling-add.component.html',
  styleUrls: ['./verzameling-add.component.css'],
})
export class VerzamelingAddComponent {
  verzamelingForm!: FormGroup;
  gebruiker = this.authService.currentUser$.value?.gebruikersnaam;

  constructor(
    private verzamelingService: VerzamelingService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.verzamelingForm = this.formBuilder.group({
      naam: ['', Validators.required],
      info: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.verzamelingForm.valid) {
      const newVerzameling: IVerzameling = {
        ...this.verzamelingForm.value,
        eigenaar: this.gebruiker,  // Set gebruiker property here
      };
      this.verzamelingService.voegVerzamelingToe(newVerzameling).subscribe(
        (addedVerzameling: IVerzameling) => {
          console.log('Toegevoegd Verzameling:', addedVerzameling);
          this.router.navigate(['']);
        },
        (error: any) => {
          console.error('Fout bij het toevoegen van het Verzameling:', error);
        }
      );
    }
  }
}
