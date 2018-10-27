import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './games-list.component';
import { MatButtonModule, MatCardModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    GamesListComponent,
  ],
  exports: [
    GamesListComponent,
  ],
})
export class GamesListModule {
}
