import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'anon-admin-crypto',
  templateUrl: './admin-crypto.component.html',
  styleUrls: ['./admin-crypto.component.scss']
})
export class AdminCryptoComponent implements OnInit {
  crypto_cards = [
    {
      title: "Binance Smart Chain Tokens",
      text: "Track existing and upcoming tokens while also tracking swap transactions.",
      icon: "pricetags",
      link: "/admin/crypto/bsctokens/",
    },
    {
      title: "Wallet Watchlist",
      text: "Follow your favorite wallet's activities",
      icon: "book",
      link: "/admin/crypto/wallet-watchlist/",
    },
  ];

  constructor() { }

  ngOnInit(): void {}

}
