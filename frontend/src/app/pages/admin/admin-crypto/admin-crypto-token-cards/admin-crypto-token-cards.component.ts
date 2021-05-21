import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CryptoToken } from "../../../../shared/utils/models/crypto";
import { Subject } from "rxjs";
import { CryptoService } from "../../../../shared/utils/services/crypto.service";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-admin-crypto-token-cards',
  templateUrl: './admin-crypto-token-cards.component.html',
  styleUrls: ['./admin-crypto-token-cards.component.scss']
})
export class AdminCryptoTokenCardsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() type_of_tokens: string = 'all';
  tokens: CryptoToken[] = [];
  tokens_loaded = false;

  constructor(
    private crypto: CryptoService,
    private extras: ExtrasService,
  ) {
    // BSCToken Cards Subscriber
    this.crypto.shared_cryptotokens.pipe(takeUntil(this.unsub$))
      .subscribe(tokens => this.tokens = tokens );
  }

  ngOnInit(): void {
    this.get_tokens(this.type_of_tokens);
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  get_tokens(type_of_token: string) {
    this.crypto.get_crypto_tokens(type_of_token).pipe(takeUntil(this.unsub$))
      .subscribe(
        tokens => this.crypto.update_cryptotokens(tokens),
        error => this.extras.showToast(
          'Sorry, we are having problems getting your Binance Smart Chain Tokens at the moment.',
          'Error retrieving Binance Smart Chain Tokens', 'danger', 8000),
        () => this.complete_get_tokens()
      );
  }
  complete_get_tokens() {
    this.tokens_loaded = true;
  }

}
