import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CryptoWallet } from "../../../../../../shared/utils/models/crypto";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CryptoService } from "../../../../../../shared/utils/services/crypto.service";
import { ExtrasService } from "../../../../../../shared/utils/services/extras.service";
import { Router } from "@angular/router";

@Component({
  selector: 'anon-crypto-wallet-card',
  templateUrl: './crypto-wallet-card.component.html',
  styleUrls: ['./crypto-wallet-card.component.scss']
})
export class CryptoWalletCardComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() crypto_wallet: CryptoWallet = {
    status: "PRIVATE",
    name: '',
    description: '',
    address: '',
  };

  constructor(
    private crypto: CryptoService,
    private extras: ExtrasService,
    private router: Router,
  ) { }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  trash_crypto_wallet(crypto_wallet: CryptoWallet) {
    this.crypto.delete_crypto_wallet(<string>crypto_wallet.address).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      response => {
        this.extras.showToast(
          `Successfully trashed your requested wallet address: ${crypto_wallet.address}`,
          `Trashed ${crypto_wallet.name}`,
          'success', 5000)
      },
      error => this.extras.showToast(
        `Sorry, we ran into a problem while trying to trash this wallet: ${crypto_wallet.address}`,
        `Failed to trash ${crypto_wallet.name}`,
        'danger', 0),
      () => {
        let page_url = this.router.url;
        this.router.navigateByUrl('/').then(() => this.router.navigateByUrl(page_url));
      }
    );
  }
  edit_crypto_wallet() {}

}
