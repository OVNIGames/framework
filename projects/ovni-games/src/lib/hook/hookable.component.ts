import { TemplateRef, ViewChild } from '@angular/core';

export abstract class HookableComponent {
  @ViewChild(TemplateRef) public template: TemplateRef<any>;
}
