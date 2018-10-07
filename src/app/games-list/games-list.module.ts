import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './games-list.component';

@NgModule({
  imports: [
    CommonModule,
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
