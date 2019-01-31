import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent, GameModule } from 'ovni-games';

@NgModule({
  imports: [
    CommonModule,
    GameModule,
    RouterModule.forChild([
      {
        path: '',
        component: GameComponent,
      },
    ]),
  ],
})
export class GameLoaderModule {
}
