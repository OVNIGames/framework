import { Component, ComponentFactoryResolver, TemplateRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HookChildComponent } from './hook-child.component';
import { HookComponent } from './hook.component';
import { HookService } from './hook.service';
import { HookableComponent } from './hookable.component';

@Component({
  template: `
    <ng-template>
      <p>Bonus</p>
    </ng-template>
  `,
})
export class BonusComponent extends HookableComponent {
  @ViewChild(TemplateRef, {static: false}) public template: TemplateRef<object>;
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
  public barHeaderPriority = 1;

  @ViewChild('fooHeader', {static: true}) public fooHeader: HookComponent;

  constructor(public resolver: ComponentFactoryResolver) {
  }
}

describe('HookComponent', () => {
  let component: AppHookComponent;
  let fixture: ComponentFixture<AppHookComponent>;
  let hookService: HookService;

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
    hookService = TestBed.inject(HookService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHookComponent);
    fixture.detectChanges();
    component = fixture.componentInstance as AppHookComponent;
  });

  it('should place templates in hooks', () => {
    const article = fixture.debugElement.query(By.css('article')).nativeElement as HTMLElement;
    expect((article.textContent as string).trim()).toBe('');
    const header = fixture.debugElement.query(By.css('header')).nativeElement as HTMLElement;
    expect((header.textContent as string).trim().replace(/\s+/g, ' ')).toBe('Hello World!');
    const template = component.fooHeader.template as TemplateRef<Component>;
    expect(template).toBeTruthy();
    component.barHeaderPriority = 3;
    fixture.detectChanges();
    expect((header.textContent as string).trim().replace(/\s+/g, ' ')).toBe('World! Hello');
    hookService.storeComponent('header', 'bonus', 9, component.resolver, BonusComponent);
    fixture.detectChanges();
    expect(hookService.getTemplates('header').length).toBe(2);
    expect((header.textContent as string).trim().replace(/\s+/g, ' ')).toBe('World! Hello Bonus');
  });
});
