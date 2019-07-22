import { TemplateRef, ViewChild } from '@angular/core';

export abstract class HookableComponent {
  @ViewChild(TemplateRef, {static: false}) public template: TemplateRef<object>;
}
