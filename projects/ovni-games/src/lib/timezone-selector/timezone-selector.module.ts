import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material';
import { TimezoneSelectorComponent } from './timezone-selector.component';

@NgModule({
  declarations: [
    TimezoneSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
  ],
  exports: [
    TimezoneSelectorComponent,
  ],
})
export class TimezoneSelectorModule {
}
