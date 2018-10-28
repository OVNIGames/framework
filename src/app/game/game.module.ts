import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    GameComponent,
  ],
  declarations: [
    GameComponent,
  ],
})
export class GameModule {
}
