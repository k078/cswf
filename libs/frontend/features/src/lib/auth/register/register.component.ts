import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GebruikerService } from '../../gebruiker/gebruiker.service';
import { Router } from '@angular/router';
import { Rol } from '@cswf/shared/api';


@Component({
  selector: 'cswf-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessageGebruikersnaam = '';
  errorMessageWachtwoord = '';
  errorMessageGeboortedatum = '';
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private gebruikerService: GebruikerService, private router:Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      gebruikersnaam: ['', Validators.required],
      wachtwoord: ['', Validators.required],
      geboortedatum: ['', Validators.required], // You may want to add a custom validator for date format
    });
  }

  register(): void {
    console.log(this.gebruikerService.isUser(this.registerForm.value.gebruikersnaam));
    if(this.gebruikerService.isUser(this.registerForm.value.gebruikersnaam)==false){
      if (this.registerForm.valid) {
        const formData = {
          ...this.registerForm.value,
          rol: Rol.USER
        };

        this.gebruikerService.register(formData).subscribe(
          (user) => {
            if (user) {
              console.log('Toegevoegd user:', user);
              this.router.navigate(['/login']);
            } else {
              console.error('Geen user gevonden of incorrecte gegevens');
            }
          },
          (error: any) => {
            console.error('Fout bij het toevoegen van user:', error);
            // Handel hier unieke controlefouten af
            if (error.message === 'Gebruikersnaam bestaat al.') {
              console.error('Gebruikersnaam bestaat al.');
              // Voeg hier de logica toe om de gebruiker op de hoogte te stellen van de fout
            }
          }
        );
      }
     } else {
      this.errorMessage = 'Gebruikersnaam bestaat al.';
      this.errorMessageGebruikersnaam = this.registerForm.get('gebruikersnaam')?.hasError('required') ? 'Gebruikersnaam is verplicht' : '';
      this.errorMessageWachtwoord = this.registerForm.get('wachtwoord')?.hasError('required') ? 'Wachtwoord is verplicht' : '';
      this.errorMessageGeboortedatum = this.registerForm.get('geboortedatum')?.hasError('required') ? 'Geboortedatum is verplicht' : '';
    }
  }
}
