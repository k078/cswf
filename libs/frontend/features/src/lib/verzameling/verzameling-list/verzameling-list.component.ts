import { Component, OnInit, OnDestroy } from '@angular/core';
import { VerzamelingService } from '../verzameling.service';
import { IVerzameling } from '@cswf/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'cswf-verzameling-list',
    templateUrl: './verzameling-list.component.html',
    styleUrls: ['./verzameling-list.component.css'],
})
export class VerzamelingListComponent implements OnInit, OnDestroy {
    verzamelingen: IVerzameling[] | null = null;
    subscription: Subscription | undefined = undefined;
    sortAscending = true;
    sortAscendingId = true;

    constructor(private VerzamelingService: VerzamelingService, private router:Router, private authService: AuthService) {}


    ngOnInit(): void {
      if (!this.authService.isAuthenticated()) this.router.navigate(['/login']); {
        this.subscription = this.VerzamelingService.list().subscribe((results) => {
            console.log(`results: ${results}`);
            this.verzamelingen = results;
        });
      }
    }

    verwijderVerzameling(id: number): void {
        this.VerzamelingService.verwijderVerzameling(id).subscribe(() => {
            this.VerzamelingService.list().subscribe((results) => {
                this.verzamelingen = results;
            });
        });
    }

    sortOpEigenaar(): void {
      if (this.verzamelingen !== null) {
        this.verzamelingen = [...this.verzamelingen].sort((a, b) => {
          const sortOrder = this.sortAscending ? 1 : -1;
          return sortOrder * a.eigenaar.localeCompare(b.eigenaar);
        });

        // Toggle the sorting order for the next click
        this.sortAscending = !this.sortAscending;
        this.sortAscendingId = true;
      }
    }

    sortOpId(): void {
      if (this.verzamelingen !== null) {
        this.verzamelingen = [...this.verzamelingen].sort((a, b) => {
          const sortOrder = this.sortAscendingId ? 1 : -1;
          return sortOrder * (a.id - b.id);
        });

        // Toggle the sorting order for the next click
        this.sortAscendingId = !this.sortAscendingId;
      }
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
  }

