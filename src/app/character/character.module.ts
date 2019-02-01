import { NgModule } from '@angular/core';
import { CharacterComponent } from './character.component';

@NgModule({
  declarations: [
    CharacterComponent,
  ],
  exports: [
    CharacterComponent,
  ],
})
export class CharacterModule {
}
