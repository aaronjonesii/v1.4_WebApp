import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { take, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CryptoToken } from "../../../../shared/utils/models/crypto";
import { CryptoService } from "../../../../shared/utils/services/crypto.service";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-crypto-token-page',
  templateUrl: './crypto-token-page.component.html',
  styleUrls: ['./crypto-token-page.component.scss']
})
export class CryptoTokenPageComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  token: CryptoToken = {
    blockchain: 'UNKNOWN',
    status: 'PRIVATE',
    name: '',
    symbol: '',
    contract_address: '',
  };
  token_loaded = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private crypto: CryptoService,
    private extras: ExtrasService,
  ) {
    // Get Token ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.token.id = routeParams.token_id,
      error => console.error(error),
    );
  }

  ngOnInit(): void {
    this.get_token(<string>this.token.id)
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  get_token(token_id: string) {
    this.crypto.get_one_token(token_id).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      token => {this.token = token},
      error => this.extras.goBack(),
      () => {this.token_loaded = true;}
    );
  }

}
