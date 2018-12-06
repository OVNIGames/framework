import { Compiler, Component, NgModule, NgModuleFactory, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { GameModule } from '../../../projects/ovni-games/src/lib/game/game.module';
import { GameCreatorModule } from '../../../projects/ovni-games/src/lib/game-creator/game-creator.module';
import { GamesListModule } from '../../../projects/ovni-games/src/lib/games-list/games-list.module';
import { LoginModule } from '../../../projects/ovni-games/src/lib/login/login.module';
import { RegisterModule } from '../../../projects/ovni-games/src/lib/register/register.module';
import { UserModule } from '../../../projects/ovni-games/src/lib/user/user.module';

interface ApiResponse {
  error: string;
  files: string[] | null;
}

interface TemplateResponse {
  template: string;
}

@Component({
  selector: 'og-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css'],
})
export class DocComponent implements OnInit {
  public error = '';
  public paths: string[] = [];
  public names: {
    [path: string]: string[],
  } = {};
  public files: {
    [path: string]: {
      [name: string]: string,
    },
  } = {};
  public currentFile: {
    path: string,
    name: string,
  } = null;
  public currentFilePath = '';
  public dynamicComponent: any;
  public dynamicModule: NgModuleFactory<any>;

  constructor(private http: HttpClient, private router: Router, private compiler: Compiler) {
  }

  ngOnInit() {
    this.refreshCurrentFile();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.refreshCurrentFile();
      }
    });
    this.http.get('/api').subscribe((response: ApiResponse) => {
      this.error = response.error;
      if (response.files) {
        this.files = {};
        this.paths = [];
        this.names = {};
        response.files.forEach(file => {
          const pieces = file.split(/\/examples\//);
          const name = pieces[1].replace(/\.html$/, '');
          const path = pieces[0].split(/\/lib\//)[1];

          if (!this.files[path]) {
            this.files[path] = {};
            this.names[path] = [];
            this.paths.push(path);
          }

          this.names[path].push(name);
          this.files[path][name] = file;
        });
        this.refreshCurrentFile();
      }
    });
  }

  refreshCurrentFile() {
    this.currentFile = /^\/?doc\/([^\/]*)\/([^\/]*)$/.test(this.router.url)
      ? {
        path: RegExp.$1,
        name: RegExp.$2,
      }
      : null;

    const file = this.currentFile || {
      path: null,
      name: null,
    };
    const currentFilePath = (this.files[file.path || ''] || {})[file.name || ''] || null;

    if (this.currentFilePath !== currentFilePath) {
      this.currentFilePath = currentFilePath || '';

      if (this.currentFilePath) {
        this.dynamicComponent = null;
        this.dynamicModule = null;

        this.http.get('/file/' + currentFilePath.replace(/\//g, '--')).subscribe((response: TemplateResponse) => {
          this.loadDynamicContent(response.template);
        });
      }
    }
  }

  private loadDynamicContent(template: string): void {
    this.dynamicComponent = this.createNewComponent(template);
    this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponent));
  }

  private createComponentModule(componentType: any): any {
    return NgModule({
      imports: [
        CommonModule,
        MatButtonModule,
        RouterModule,

        FormsModule,
        MatCheckboxModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,

        GameModule,
        GameCreatorModule,
        GamesListModule,
        LoginModule,
        RegisterModule,
        UserModule,
      ],
      declarations: [
        componentType,
      ],
      entryComponents: [componentType],
    })(class RuntimeComponentModule {
    });
  }

  private createNewComponent(template: string): any {
    const scripts = [];
    template = template.replace(/<script>([\S\s]+)<\/script>/g, (all, script) => {
      scripts.push(script);

      return '';
    });

    return Component({
      selector: 'app-dynamic-component',
      template: '<div>' + template + '</div>',
    })(class DynamicComponent implements OnInit {
      ngOnInit() {
        scripts.forEach(script => {
          (new Function(script)).call(this);
        });
      }
    });
  }
}
