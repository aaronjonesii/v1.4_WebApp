import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CryptoToken } from "../../../../../shared/utils/models/crypto";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";
import { Clipboard } from "@angular/cdk/clipboard";
import { CryptoService } from "../../../../../shared/utils/services/crypto.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'anon-crypto-token-card',
  templateUrl: './crypto-token-card.component.html',
  styleUrls: ['./crypto-token-card.component.scss']
})
export class CryptoTokenCardComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
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
    private crypto: CryptoService,
    private router: Router,
  ) { }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  copy_to_clipboard(text: string) {
    this.clipboard.copy(text);
    this.extras.showToast(
      '',
      'Address copied to clipboard', 'success', 2000);
  }

  trash_token(crypto_token_id: string|undefined) {
    this.crypto.delete_one_token(<string>crypto_token_id).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      response => {
        this.extras.showToast(`Successfully trashed ${this.token.name}`, 'Token trashed', 'success', 5000);
      },
      error => {
        console.error(error);
        this.extras.showToast(`Sorry, we ran into an error while trying to delete ${this.token.name}`,
          `Failed to delete token`, 'danger', 0);
      },
      () => {window.location.reload();}
    );
  }

}
