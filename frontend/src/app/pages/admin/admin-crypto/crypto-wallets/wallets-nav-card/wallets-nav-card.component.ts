import { Component, OnInit } from '@angular/core';
import { wallets_menu_items } from "../wallets_menu_items";

@Component({
  selector: 'anon-wallets-nav-card',
  templateUrl: './wallets-nav-card.component.html',
  styleUrls: ['./wallets-nav-card.component.scss']
})
export class WalletsNavCardComponent implements OnInit {
  menu_items = wallets_menu_items;

  constructor() { }

  ngOnInit(): void {}

}
