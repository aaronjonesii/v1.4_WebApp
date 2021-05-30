import { Component, OnDestroy, OnInit } from '@angular/core';
import { CryptoWallet } from "../../../../../shared/utils/models/crypto";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";
import { CryptoService } from "../../../../../shared/utils/services/crypto.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { create_wallet_fields } from "../crypto-wallet-fields";

@Component({
  selector: 'anon-create-crypto-wallet',
  templateUrl: './create-crypto-wallet.component.html',
  styleUrls: ['./create-crypto-wallet.component.scss']
})
export class CreateCryptoWalletComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  crypto_wallet: any = {
    status: "PRIVATE",
    name: '',
    description: '',
    address: '',
  };
  create_wallet_fields = create_wallet_fields;

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

  create_crypto_wallet(crypto_wallet: CryptoWallet) {
    this.crypto.create_crypto_wallet(crypto_wallet).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      created_wallet => {
        this.extras.showToast(
          `Successfully created your crypto wallet: ${created_wallet.address}`,
          `Successfully created ${created_wallet.name}`, 'success', 5000)
      },
      error => this.extras.showToast(
        `Sorry, we ran into a problem while trying to create this crypto wallet: ${error}`,
        `Failed to create ${crypto_wallet.name}`, 'danger', 0),
      () => {
        this.router.navigateByUrl(`/admin/crypto/wallet/${crypto_wallet.address}`);
      }
    );
  }

  go_back() {
    this.extras.goBack();
  }

}
