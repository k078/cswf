import { Component, OnInit } from '@angular/core';
import { GebruikerService } from '../gebruiker.service';
import { ILp, IGebruiker } from '@cswf/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'cswf-gebruiker-update',
  templateUrl: './gebruiker-update.component.html',
  styleUrls: ['./gebruiker-update.component.css'],
})
export class GebruikerUpdateComponent implements OnInit {
  Gebruiker: IGebruiker | null = null;
  lps: ILp[] | undefined;
  gebruikerForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private GebruikerService: GebruikerService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private router : Router
  ) {
    this.gebruikerForm = this.formBuilder.group({
      wachtwoord: ['', Validators.required],
      geboortedatum: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.GebruikerService.read(id).subscribe((Gebruiker) => {
          this.Gebruiker = Gebruiker;
          const formattedRelease = this.datePipe.transform(Gebruiker.geboortedatum, 'yyyy-MM-dd');
          this.gebruikerForm.patchValue({
            wachtwoord: Gebruiker.wachtwoord,
            geboortedatum: formattedRelease,
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.gebruikerForm.valid && this.Gebruiker) {
      const newGebruiker: IGebruiker = this.gebruikerForm.value as IGebruiker;
      newGebruiker.id = this.Gebruiker.id;
      this.GebruikerService.editUser(newGebruiker).subscribe(
        (editedGebruiker: IGebruiker) => {
          console.log('Updated Gebruiker:', editedGebruiker);
          this.router.navigate(['/profile/' + editedGebruiker.id]);
        },
        (error: any) => {
          console.error('Fout bij het updaten van het Gebruiker:', error);
        }
      );
    }
  }
}
