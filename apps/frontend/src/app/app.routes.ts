import { Routes } from '@angular/router';
import { VerzamelingListComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-list/verzameling-list.component';
import { VerzamelingDetailComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-detail/verzameling-detail.component';
export const appRoutes: Routes = [
  { path: '', component: VerzamelingListComponent },
  { path: 'verzameling/:id', component: VerzamelingDetailComponent },
  // Voeg hier andere routes toe
];
