import { Component, OnInit } from '@angular/core';
import { NbWindowService } from "@nebular/theme";
import { CreateCryptotokenComponent } from "../create-cryptotoken/create-cryptotoken.component";

@Component({
  selector: 'anon-crypto-archived-tokens',
  templateUrl: './crypto-archived-tokens.component.html',
  styleUrls: ['./crypto-archived-tokens.component.scss']
})
export class CryptoArchivedTokensComponent implements OnInit {
  page_title: string = 'Archived Tokens';
  page_subtitle: string = 'Crypto tokens you have archived to be later found if needed.';

  constructor(private windowService: NbWindowService,) { }

  ngOnInit(): void {}

  openCreateBSCTokenWindow() {
    this.windowService.open(CreateCryptotokenComponent,
      { windowClass: 'create-cryptotoken-window' })
  }

}
