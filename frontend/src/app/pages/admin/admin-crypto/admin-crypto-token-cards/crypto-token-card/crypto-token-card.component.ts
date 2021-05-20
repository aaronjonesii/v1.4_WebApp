import { Component, Input, OnInit } from '@angular/core';
import { CryptoToken } from "../../../../../shared/utils/models/crypto";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
  selector: 'anon-crypto-token-card',
  templateUrl: './crypto-token-card.component.html',
  styleUrls: ['./crypto-token-card.component.scss']
})
export class CryptoTokenCardComponent implements OnInit {
  @Input() token: CryptoToken = {
    blockchain: 'UNKNOWN',
    status: 'PRIVATE',
    name: '',
    symbol: '',
    contract_address: '',
  };

  constructor(
    private extras: ExtrasService,
    private clipboard: Clipboard,
  ) { }

  ngOnInit(): void {}

  copy_to_clipboard(text: string) {
    this.clipboard.copy(text);
    this.extras.showToast(
      '',
      'Address copied to clipboard', 'success', 2000);
  }

}
