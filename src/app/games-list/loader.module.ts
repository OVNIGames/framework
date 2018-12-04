import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamesListComponent } from '../../../projects/ngx-mat-ovni-games/src/lib/games-list/games-list.component';
import { GamesListModule } from '../../../projects/ngx-mat-ovni-games/src/lib/games-list/games-list.module';

@NgModule({
  imports: [
    CommonModule,
    GamesListModule,
    RouterModule.forChild([
      {
        path: '',
        component: GamesListComponent,
      },
    ]),
  ],
})
export class GamesListLoaderModule {
}
