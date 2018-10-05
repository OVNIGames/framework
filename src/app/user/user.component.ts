import { Component, Input, OnInit } from '@angular/core';
import { UserInterface } from './user.interface';

@Component({
  selector: 'og-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @Input() user: UserInterface;

  constructor() {
  }

  ngOnInit() {
  }
}
