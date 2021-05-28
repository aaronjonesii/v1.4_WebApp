import { Component, OnInit } from '@angular/core';
import { wallets_menu_items } from "../wallets_menu_items";

@Component({
  selector: 'anon-crypto-wallet',
  templateUrl: './crypto-wallet.component.html',
  styleUrls: ['./crypto-wallet.component.scss']
})
export class CryptoWalletComponent implements OnInit {
  hide_small_balances: boolean = false;
  menu_items = wallets_menu_items;


  constructor() { }

  ngOnInit(): void {}

  toggle_hide_small_balances(checked: boolean) { this.hide_small_balances = checked; }

}
