import { Component, OnInit, OnDestroy } from '@angular/core';
import { LpService } from '../lp.service';
import { ILp } from '@cswf/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'cswf-lp-list',
  templateUrl: './lp-list.component.html',
  styleUrls: ['./lp-list.component.css'],
})
export class LpListComponent implements OnInit, OnDestroy {
  lps: ILp[] | null = null;
  subscription: Subscription | undefined = undefined;
  sortAscending = true;
  sortAscendingId = true;

  constructor(
    private lpService: LpService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) this.router.navigate(['/login']); {
      this.subscription = this.lpService.list().subscribe((results) => {
        console.log(`results: ${results}`);
        this.lps = results;
      });
    }
  }

  verwijderLp(id: number): void {
    this.lpService.deleteLp(id).subscribe(() => {
      this.lpService.list().subscribe((results) => {
        this.lps = results;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
