import { Component, OnDestroy, OnInit } from '@angular/core';
import { wallets_menu_items } from "../wallets_menu_items";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { CryptoWallet } from "../../../../../shared/utils/models/crypto";
import { CryptoService } from "../../../../../shared/utils/services/crypto.service";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-crypto-wallet',
  templateUrl: './crypto-wallet.component.html',
  styleUrls: ['./crypto-wallet.component.scss']
})
export class CryptoWalletComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  hide_small_balances: boolean = false;
  menu_items = wallets_menu_items;
  crypto_wallets : CryptoWallet[] = [];
  crypto_wallet: any = {
    status: "PRIVATE",
    name: '',
    description: '',
    address: '',
  };
  crypto_wallet_tokens: any = [];
  wallet_tokens_loaded = false;
  net_worth = 0;
  total_assets = 0;
  total_debts = 0;



  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private crypto: CryptoService,
    private extras: ExtrasService,
  ) {
    if (this.router.url.startsWith('/admin/crypto/wallet/')) {
      // Get Crypto Wallet Address from URL
      this.activatedRoute.params.pipe(
        takeUntil(this.unsub$)
      ).subscribe(
        routeParams => this.crypto_wallet.address = routeParams.wallet_address,
        console.error,
      );
    }
    if (this.router.url === '/admin/crypto/wallets/dashboard') {
      this.crypto.get_crypto_wallets('all').pipe(
        takeUntil(this.unsub$)
      ).subscribe(
        crypto_wallets => this.crypto_wallets = crypto_wallets,
        console.error,
        () => {
          this.crypto_wallet = this.crypto_wallets[0]
        }
      );
    }
  }

  ngOnInit(): void {
    setTimeout(() => this.get_wallet_tokens(), 1000)
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  toggle_hide_small_balances(checked: boolean) { this.hide_small_balances = checked; }

  get_wallet_tokens() {
    if ((this.crypto_wallet) && (this.crypto_wallet.address != '')) {
      this.crypto.get_crypto_wallet_tokens(this.crypto_wallet.address).pipe(
        takeUntil(this.unsub$)
      ).subscribe(
        wallet_tokens => this.crypto_wallet_tokens = wallet_tokens,
        error => {
          console.error(error);
          this.extras.showToast(`We ran into a problem getting information for the requested waller: ${this.crypto_wallet.address}`, 'Failed to get wallet information', 'danger', 0);
          this.extras.goBack();
        },
        () => {
          this.wallet_tokens_loaded = true;
          for (let asset of this.crypto_wallet_tokens) {
            this.net_worth += asset.balance * asset.price
            this.total_assets += asset.balance * asset.price
          }
        }

      );
    }
  }

}
