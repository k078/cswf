/* eslint-disable @nx/enforce-module-boundaries */
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from 'libs/frontend/features/src/lib/about/about.component';
import { VerzamelingListComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-list/verzameling-list.component';
import { VerzamelingDetailComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-detail/verzameling-detail.component';
import { VerzamelingAddComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-add/verzameling-add.component';
import { VerzamelingUpdateComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-update/verzameling-update.component';
import { NgModule } from '@angular/core';


export const appRoutes: Routes = [
  { path: '', component: VerzamelingListComponent },
  { path: 'verzameling/:id', component: VerzamelingDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'verzameling', component: VerzamelingAddComponent },
  { path: 'updateverzameling/:id', component: VerzamelingUpdateComponent },
];

@NgModule({

  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
