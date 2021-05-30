import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { CryptoService } from "../../../../shared/utils/services/crypto.service";
import { CryptoWallet } from "../../../../shared/utils/models/crypto";
import { takeUntil } from "rxjs/operators";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-crypto-wallets',
  templateUrl: './crypto-wallets.component.html',
  styleUrls: ['./crypto-wallets.component.scss']
})
export class CryptoWalletsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  all_wallets: CryptoWallet[] = []
  wallets_loaded = false;

  constructor(
    private crypto: CryptoService,
    private extras: ExtrasService,
  ) { }

  ngOnInit(): void {
    this.crypto.get_crypto_wallets('all').pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      wallets => this.all_wallets = wallets,
      console.error,
      () => {this.wallets_loaded = true;}
    );
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
