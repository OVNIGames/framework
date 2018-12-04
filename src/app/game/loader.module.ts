import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent } from '../../../projects/ngx-mat-ovni-games/src/lib/game/game.component';
import { GameModule } from '../../../projects/ngx-mat-ovni-games/src/lib/game/game.module';

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
