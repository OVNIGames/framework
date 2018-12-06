import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocModule } from './doc.module';
import { DocComponent } from './doc.component';

@NgModule({
  imports: [
    CommonModule,
    DocModule,
    RouterModule.forChild([
      {
        path: '',
        component: DocComponent,
      },
    ]),
  ],
})
export class DocLoaderModule {
}
