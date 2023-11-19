import { Component, OnInit } from '@angular/core';
import { VerzamelingService } from '../verzameling.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IVerzameling } from '@cswf/shared/api';

@Component({
  selector: 'cswf-verzameling-add',
  templateUrl: './verzameling-add.component.html',
  styleUrls: ['./verzameling-add.component.css'],
})

export class VerzamelingAddComponent {
  verzamelingForm: FormGroup;

  constructor(private verzamelingService: VerzamelingService, private router:Router, private formBuilder:FormBuilder) {
    this.verzamelingForm = this.formBuilder.group({
      naam: ['', Validators.required],
      eigenaar: ['', Validators.required],
      info: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.verzamelingForm.valid) {
      const newVerzameling: IVerzameling = this.verzamelingForm.value as IVerzameling;
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


