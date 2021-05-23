import { Component, OnInit } from '@angular/core';
import { NbWindowService } from "@nebular/theme";
import { CreateCryptotokenComponent } from "../create-cryptotoken/create-cryptotoken.component";

@Component({
  selector: 'anon-crypto-trashed-tokens',
  templateUrl: './crypto-trashed-tokens.component.html',
  styleUrls: ['./crypto-trashed-tokens.component.scss']
})
export class CryptoTrashedTokensComponent implements OnInit {
  page_title: string = 'Trashed Tokens';
  page_subtitle: string = 'Crypto tokens you have thrown away in the trash.';

  constructor(private windowService: NbWindowService,) { }

  ngOnInit(): void {}

  openCreateBSCTokenWindow() {
    this.windowService.open(CreateCryptotokenComponent,
      { windowClass: 'create-cryptotoken-window' })
  }

}
