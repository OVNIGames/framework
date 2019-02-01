import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent, GameModule } from '@ovnigames/framework';
import { MatButtonModule } from '@angular/material';
import { HolowarComponent } from './holowar.component';
import { CharacterModule } from '../character/character.module';
import { CharacterComponent } from '../character/character.component';

@NgModule({
  declarations: [
    HolowarComponent,
  ],
  imports: [
    CommonModule,
    GameModule,
    CharacterModule,
    MatButtonModule,
    RouterModule,
    RouterModule.forChild([
      {
        path: 'character',
        pathMatch: 'full',
        component: CharacterComponent,
        outlet: 'holowar',
      },
      {
        path: '',
        pathMatch: 'full',
        component: GameComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: HolowarComponent,
            outlet: 'game',
          },
        ],
      },
    ]),
  ],
})
export class GameLoaderModule {
}
