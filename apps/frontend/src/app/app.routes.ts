/* eslint-disable @nx/enforce-module-boundaries */
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from 'libs/frontend/features/src/lib/about/about.component';
import { VerzamelingListComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-list/verzameling-list.component';
import { VerzamelingDetailComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-detail/verzameling-detail.component';
import { VerzamelingAddComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-add/verzameling-add.component';
import { VerzamelingUpdateComponent } from 'libs/frontend/features/src/lib/verzameling/verzameling-update/verzameling-update.component';
import { NgModule } from '@angular/core';
import { LpDetailComponent } from 'libs/frontend/features/src/lib/lp/lp-detail/lp-detail.component';
import { LpListComponent } from 'libs/frontend/features/src/lib/lp/lp-list/lp-list.component';
import { LpAddComponent } from 'libs/frontend/features/src/lib/lp/lp-add/lp-add.component';
import { LpUpdateComponent } from 'libs/frontend/features/src/lib/lp/lp-update/lp-update.component';
import { LoginComponent } from 'libs/frontend/features/src/lib/auth/login/login.component';
import { RegisterComponent } from 'libs/frontend/features/src/lib/auth/register/register.component';



export const appRoutes: Routes = [
  { path: '', component: VerzamelingListComponent },
  { path: 'verzameling/:id', component: VerzamelingDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'verzameling', component: VerzamelingAddComponent },
  { path: 'updateverzameling/:id', component: VerzamelingUpdateComponent },
  { path: 'lp/:id', component: LpDetailComponent },
  { path: 'lp', component: LpListComponent },
  { path: 'lp-add', component: LpAddComponent },
  { path: 'lp-update/:id', component: LpUpdateComponent },
  { path: 'add-to-verzameling/:lpId/:verzamelingId', component: LpDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({

  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
