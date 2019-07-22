import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'og-hook-child',
  template: `
    <ng-template
      *ngIf="templateRef"
      [ngTemplateOutlet]="templateRef"
    ></ng-template>
  `,
})
export class HookChildComponent {
  @Input() public templateRef: TemplateRef<Component>;
}
