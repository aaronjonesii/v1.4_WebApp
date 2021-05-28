import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-admin-crypto',
  templateUrl: './admin-crypto.component.html',
  styleUrls: ['./admin-crypto.component.scss']
})
export class AdminCryptoComponent implements OnInit {
  @Input() header_enabled: boolean = true;
  crypto_cards = [
    {
      title: "All Crypto Tokens",
      text: "Track existing and upcoming tokens while also tracking swap transactions.",
      icon: "bitcoin",
      icon_pack: "custom-icons",
      link: "/admin/crypto/bsc-tokens/",
    },
    {
      title: "Binance Smart Chain Tokens",
      text: "View all Binance Smart Chain Tokens also tracking their swap transactions.",
      icon: "bnb",
      icon_pack: "custom-icons",
      link: "/admin/crypto/bsc-tokens/",
    },
    {
      title: "Crypto Wallets",
      text: "Look at your wallets net worth with all assets inside.",
      icon: 'wallet',
      icon_pack: 'new-font-awesome',
      link: '/admin/crypto/wallets/',
    },
  ];

  constructor() { }

  ngOnInit(): void {}

}
