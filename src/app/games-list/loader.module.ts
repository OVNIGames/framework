import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamesListComponent } from './games-list.component';
import { GamesListModule } from './games-list.module';

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
