import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { CryptoService } from "../../../../../shared/utils/services/crypto.service";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";
import { CryptoWallet } from "../../../../../shared/utils/models/crypto";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { create_wallet_fields } from "../crypto-wallet-fields";

@Component({
  selector: 'anon-edit-crypto-wallet',
  templateUrl: './edit-crypto-wallet.component.html',
  styleUrls: ['./edit-crypto-wallet.component.scss']
})
export class EditCryptoWalletComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  crypto_wallet: any = {
    status: "PRIVATE",
    name: '',
    description: '',
    address: '',
  };
  crypto_wallet_loaded = false;
  edit_wallet_fields = create_wallet_fields;
  wallet_snapshot: CryptoWallet = this.crypto_wallet;


  constructor(
    private crypto: CryptoService,
    private extras: ExtrasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // Get Crypto Wallet Address from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.crypto_wallet.address = routeParams.wallet_address,
      console.error,
    );
  }

  ngOnInit(): void {
    this.get_crypto_wallet(this.crypto_wallet.address);
    this.wallet_snapshot = this.crypto_wallet;
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  get_crypto_wallet(crypto_wallet_address: string) {
    this.crypto.get_one_crypto_wallet(crypto_wallet_address).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      crypto_wallet => {
        this.crypto_wallet = crypto_wallet
      },
      console.error,
      () => {this.crypto_wallet_loaded = true;}
    );
  }

  go_back() {
    this.extras.goBack();
  }

  save_crypto_wallet(wallet_address: string, crypto_wallet: CryptoWallet) {
    this.crypto.update_crypto_wallet(wallet_address, crypto_wallet).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      updated_wallet => {},
      error => this.extras.showToast(
        `Sorry, we ran into a problem updating this wallet: ${JSON.stringify(error.error)}`,
        'Error Updating Wallet', 'danger', 0),
      () => {this.router.navigateByUrl('/admin/crypto/wallets');}
    );
  }

}
