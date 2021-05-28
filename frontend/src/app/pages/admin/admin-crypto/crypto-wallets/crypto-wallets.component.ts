import { Component, OnInit } from '@angular/core';
import { wallets_menu_items } from "./wallets_menu_items";

@Component({
  selector: 'anon-crypto-wallets',
  templateUrl: './crypto-wallets.component.html',
  styleUrls: ['./crypto-wallets.component.scss']
})
export class CryptoWalletsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

}
