import { ComponentFactory, ComponentFactoryResolver, Injectable, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { HookableComponent } from './hookable.component';

@Injectable({
  providedIn: 'root',
})
export class HookService {
  private hooks: {
    [element: string]: {
      [priority: number]: {
        [child: string]: TemplateRef<object> | ComponentFactory<HookableComponent>;
      };
    };
  } = {};

  public storeComponent(
    element: string,
    child: string,
    priority: number,
    resolver: ComponentFactoryResolver,
    componentDeclaration: Type<HookableComponent>
  ): void {
    this.store(element, child, priority,
      resolver.resolveComponentFactory(componentDeclaration),
    );
  }

  public store(
    element: string,
    child: string,
    priority: number,
    template: TemplateRef<object> | ComponentFactory<HookableComponent>
  ): void {
    if (!this.hooks[element]) {
      this.hooks[element] = {};
    }

    priority = priority || 0;

    if (!this.hooks[element][priority]) {
      this.hooks[element][priority] = {};
    }

    Object.keys(this.hooks[element]).forEach(oldPriority => {
      if (this.hooks[element][oldPriority][child]) {
        delete this.hooks[element][oldPriority][child];
      }
    });

    this.hooks[element][priority][child] = template;
  }

  public getTemplates(element: string, viewContainerRef: ViewContainerRef): TemplateRef<object>[] {
    const templates: TemplateRef<object>[] = [];

    if (this.hooks[element]) {
      Object.keys(this.hooks[element]).sort().forEach(priority => {
        templates.push(...Object.values(this.hooks[element][priority]).map(component => {
          if (component instanceof ComponentFactory) {
            if (!viewContainerRef) {
              return null;
            }

            const ref = viewContainerRef.createComponent(component);
            ref.changeDetectorRef.detectChanges();

            return ref.instance.template;
          }

          return component;
        }).filter(template => template));
      });
    }

    return templates;
  }
}
