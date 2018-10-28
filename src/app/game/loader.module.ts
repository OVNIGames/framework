import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game.component';
import { GameModule } from './game.module';

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
