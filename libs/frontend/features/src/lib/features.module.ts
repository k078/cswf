import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerzamelingListComponent } from './verzameling/verzameling-list/verzameling-list.component';
import { VerzamelingDetailComponent } from './verzameling/verzameling-detail/verzameling-detail.component';
import { VerzamelingService } from './verzameling/verzameling.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { VerzamelingAddComponent } from './verzameling/verzameling-add/verzameling-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VerzamelingUpdateComponent } from './verzameling/verzameling-update/verzameling-update.component';
import { LpDetailComponent } from './lp/lp-detail/lp-detail.component';
import { LpListComponent } from './lp/lp-list/lp-list.component';
import { LpService } from './lp/lp.service';
import { LpAddComponent } from './lp/lp-add/lp-add.component';
import { LpUpdateComponent } from './lp/lp-update/lp-update.component';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  declarations: [
    VerzamelingListComponent,
    VerzamelingDetailComponent,
    AboutComponent,
    VerzamelingAddComponent,
    VerzamelingUpdateComponent,
    VerzamelingUpdateComponent,
    LpDetailComponent,
    LpListComponent,
    LpAddComponent,
    LpUpdateComponent,
  ],
  providers: [VerzamelingService, LpService],
  exports: [
    VerzamelingListComponent,
    VerzamelingDetailComponent,
    AboutComponent,
    VerzamelingAddComponent,
    VerzamelingUpdateComponent,
    LpDetailComponent,
    LpListComponent,
    LpAddComponent,
    LpUpdateComponent,
  ],
})
export class FeaturesModule {}
