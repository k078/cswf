import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VerzamelingService } from '../verzameling.service';
import { IVerzameling } from '@cswf/shared/api';

@Component({
  selector: 'cswf-verzameling-update',
  templateUrl: './verzameling-update.component.html',
  styleUrls: ['./verzameling-update.component.css'],
})
export class VerzamelingUpdateComponent implements OnInit {
    verzamelingForm: FormGroup;
    verzameling: IVerzameling | null = null;

    constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private verzamelingService: VerzamelingService // Update with the correct service
    ) {
      this.verzamelingForm = this.formBuilder.group({
        naam: ['', Validators.required],
        eigenaar: ['', Validators.required],
        info: ['', Validators.required]
      });
    }

    ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.verzamelingService.read(id).subscribe((verzameling) => {
            this.verzameling = verzameling;

            // Set the form values with the existing data
            this.verzamelingForm.patchValue({
              naam: verzameling.naam,
              eigenaar: verzameling.eigenaar,
              info: verzameling.info
            });
          });
        }
      });
    }

    onSubmit(): void {
      if (this.verzamelingForm.valid && this.verzameling) {
        const newVerzameling: IVerzameling = this.verzamelingForm.value as IVerzameling;
        newVerzameling.id = this.verzameling.id;
        this.verzamelingService.updateVerzameling(newVerzameling).subscribe(
          (editedVerzameling: IVerzameling) => {
            console.log('Toegevoegd Verzameling:', editedVerzameling);
            this.router.navigate(['']);
          },
          (error: any) => {
            console.error('Fout bij het updaten van het Verzameling:', error);
          }
        );
      }
    }
  }

