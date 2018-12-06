import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './games-list.component';
import { MatButtonModule, MatCardModule, MatProgressSpinnerModule } from '@angular/material';
import { GameCreatorModule } from '../game-creator/game-creator.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    GameCreatorModule,
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
