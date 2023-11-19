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

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  declarations: [
    VerzamelingListComponent,
    VerzamelingDetailComponent,
    AboutComponent,
    VerzamelingAddComponent,
    VerzamelingUpdateComponent,
    VerzamelingUpdateComponent,
  ],
  providers: [VerzamelingService],
  exports: [
    VerzamelingListComponent,
    VerzamelingDetailComponent,
    AboutComponent,
    VerzamelingAddComponent,
  ],
})
export class FeaturesModule {}
