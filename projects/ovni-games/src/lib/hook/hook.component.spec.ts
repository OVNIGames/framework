import { async, TestBed } from '@angular/core/testing';
import { Component, ComponentFactoryResolver, TemplateRef, ViewChild } from '@angular/core';
import { HookComponent } from './hook.component';
import { HookChildComponent } from './hook-child.component';
import { By } from '@angular/platform-browser';
import { HookableComponent } from './hookable.component';
import { HookService } from './hook.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
  template: `
    <ng-template>
      <p>Bonus</p>
    </ng-template>
  `,
})
export class BonusComponent extends HookableComponent {
}

@Component({
  selector: 'og-hook-mock-component',
  template: `
    <header>
      <og-hook element="header"></og-hook>
    </header>
    <article>
      <og-hook element="article"></og-hook>
    </article>
    <og-hook
      #fooHeader
      element="header"
      child="foo"
      [priority]="2"
    >
      <ng-template>
        World!
      </ng-template>
    </og-hook>
    <og-hook
      element="header"
      child="bar"
      [priority]="barHeaderPriority"
    >
      <ng-template>
        Hello
      </ng-template>
    </og-hook>
  `,
})
export class AppHookComponent {
  barHeaderPriority = 1;

  @ViewChild('fooHeader') fooHeader;

  constructor(public resolver: ComponentFactoryResolver) {
  }
}

describe('HookComponent', () => {
  let component;
  let fixture;
  let hookService;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        providers: [
          HookService,
        ],
        declarations: [
          HookComponent,
          HookChildComponent,
          AppHookComponent,
          BonusComponent,
        ],
      })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [BonusComponent],
        },
      })
      .compileComponents();
    hookService = TestBed.get(HookService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHookComponent);
    fixture.detectChanges();
    component = <AppHookComponent> fixture.componentInstance;
  });

  it('should place templates in hooks', () => {
    const article = <HTMLElement> fixture.debugElement.query(By.css('article')).nativeElement;
    expect(article.textContent.trim()).toBe('');
    const header = <HTMLElement> fixture.debugElement.query(By.css('header')).nativeElement;
    expect(header.textContent.trim().replace(/\s+/g, ' ')).toBe('Hello World!');
    const template = <TemplateRef<Component>> component.fooHeader.template;
    expect(template).toBeTruthy();
    component.barHeaderPriority = 3;
    fixture.detectChanges();
    expect(header.textContent.trim().replace(/\s+/g, ' ')).toBe('World! Hello');
    hookService.storeComponent('header', 'bonus', 9, component.resolver, BonusComponent);
    fixture.detectChanges();
    expect(hookService.getTemplates('header').length).toBe(2);
    expect(header.textContent.trim().replace(/\s+/g, ' ')).toBe('World! Hello Bonus');
  });
});
