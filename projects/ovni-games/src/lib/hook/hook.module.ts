import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HookChildComponent } from './hook-child.component';
import { HookComponent } from './hook.component';

@NgModule({
  declarations: [
    HookChildComponent,
    HookComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    HookChildComponent,
    HookComponent,
  ],
})
export class HookModule {
}
