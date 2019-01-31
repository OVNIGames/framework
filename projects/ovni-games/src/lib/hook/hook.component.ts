import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { HookService } from './hook.service';

/**
 * <og-hook> is a hook system similar to `block` in Pug or hooks in CMS platforms.
 *
 * Put a slot anywhere, let's call this slot the "menu" place:
 * <og-hook element="menu"></og-hook>
 *
 * Then anywhere else in the code you can add children to that place:
 * <og-hook element="menu" child="home-button">
 *   <ng-template>
 *     <button>Home</button>
 *   </ng-template>
 * </og-hook>
 */
@Component({
  selector: 'og-hook',
  templateUrl: './hook.component.html',
})
export class HookComponent {
  private _template: TemplateRef<any>;
  private _element: string;
  private _child: string;
  private _priority: number;

  @Input() set element(element: string) {
    this._element = element;
    this.store();
  }

  @Input() set child(child: string) {
    this._child = child;
    this.store();
  }

  @Input() set priority(priority: number) {
    this._priority = priority;
    this.store();
  }

  @ContentChild(TemplateRef) set content(template: TemplateRef<any>) {
    this._template = template;
    this.store();
  }

  constructor(private hookService: HookService, private viewContainerRef: ViewContainerRef) {
  }

  get template(): TemplateRef<any> {
    return this._template;
  }

  store() {
    if (this._element && this._child) {
      this.hookService.store(this._element, this._child, this._priority, this._template);
    }
  }

  get children(): TemplateRef<any>[] {
    if (this._element && !this._child) {
      return this.hookService.getTemplates(this._element, this.viewContainerRef);
    }

    return [];
  }
}
