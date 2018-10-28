import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'og-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  protected id: number;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
  }
}
