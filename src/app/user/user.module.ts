import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
  ],
  declarations: [
    UserComponent,
  ],
  exports: [
    UserComponent,
  ],
})
export class UserModule {
}
