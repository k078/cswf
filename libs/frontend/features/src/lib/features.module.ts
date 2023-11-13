import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerzamelingListComponent } from './verzameling/verzameling-list/verzameling-list.component';
import { VerzamelingDetailComponent } from './verzameling/verzameling-detail/verzameling-detail.component';
import { VerzamelingService } from './verzameling/verzameling.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [VerzamelingListComponent, VerzamelingDetailComponent],
  providers: [VerzamelingService],
  exports: [VerzamelingListComponent, VerzamelingDetailComponent],
})
export class FeaturesModule {}
