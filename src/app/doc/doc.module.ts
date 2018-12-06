import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocComponent } from './doc.component';
import { MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DocComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
  ],
})
export class DocModule {
}
