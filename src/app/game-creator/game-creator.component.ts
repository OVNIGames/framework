import { Component, OnInit } from '@angular/core';
import { LanguageInterface } from '../language.interface';
import { ApiService } from '../api.service';
import { ApolloQueryResult } from 'apollo-client';

interface LanguagesResultInterface {
  languages: {
    data: LanguageInterface[];
  };
}

const languages: LanguageInterface[] = [];

@Component({
  selector: 'og-game-creator',
  templateUrl: './game-creator.component.html',
  styleUrls: ['./game-creator.component.css'],
})
export class GameCreatorComponent implements OnInit {
  protected languages: LanguageInterface[] = languages;
  protected defaultLanguage: number = null;

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.query('languages', {
      page_size: 200,
    }, 'id,code,name,native_name').subscribe((result: ApolloQueryResult<LanguagesResultInterface>) => {
      console.log(result);
      this.languages.push.apply(this.languages, result.data.languages.data);
      console.log(this.languages);
    });
  }
}
