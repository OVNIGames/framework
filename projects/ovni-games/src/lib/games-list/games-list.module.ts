import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { GameCreatorModule } from '../game-creator/game-creator.module';
import { GamesListComponent } from './games-list.component';

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
