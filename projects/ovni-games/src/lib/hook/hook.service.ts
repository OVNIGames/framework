import { ComponentFactory, ComponentFactoryResolver, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { HookableComponent } from 'nwa-uikit-web';

@Injectable({
  providedIn: 'root',
})
export class HookService {
  private hooks: {
    [element: string]: {
      [priority: number]: {
        [child: string]: TemplateRef<any> | ComponentFactory<HookableComponent>;
      };
    };
  } = {};

  storeComponent(element: string, child: string, priority: number, resolver: ComponentFactoryResolver, componentDeclaration) {
    this.store(element, child, priority,
      <ComponentFactory<HookableComponent>> resolver.resolveComponentFactory(componentDeclaration),
    );
  }

  store(element: string, child: string, priority: number, template: TemplateRef<any> | ComponentFactory<HookableComponent>) {
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

  getTemplates(element: string, viewContainerRef: ViewContainerRef): TemplateRef<any>[] {
    const templates = [];
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
