import { Component, OnDestroy, OnInit } from '@angular/core';
import { BSCToken } from "../../../../shared/utils/models/crypto";
import { Subject } from "rxjs";
import { CryptoService } from "../../../../shared/utils/services/crypto.service";
import { takeUntil } from "rxjs/operators";
import { NbWindowService } from "@nebular/theme";
import { CreateBsctokenComponent } from "./create-bsctoken/create-bsctoken.component";

@Component({
  selector: 'anon-admin-crypto-bsctokens',
  templateUrl: './admin-crypto-bsctokens.component.html',
  styleUrls: ['./admin-crypto-bsctokens.component.scss']
})
export class AdminCryptoBsctokensComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  bsctokens: BSCToken[] = [];
  bsctokens_loaded = false;

  constructor(
    private crypto: CryptoService,
    private windowService: NbWindowService,
  ) {
    // BSCToken Cards Subscriber
    this.crypto.shared_bsctokens.pipe(takeUntil(this.unsub$))
      .subscribe(bsctokens => this.bsctokens = bsctokens );
    this.get_bsctokens();
  }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  openCreateBSCTokenWindow() {
    this.windowService.open(CreateBsctokenComponent,
      { windowClass: 'create-bsctoken-window' })
  }

  get_bsctokens() {
    this.crypto.get_bsc_tokens().pipe(takeUntil(this.unsub$))
      .subscribe(
        bsctokens => this.crypto.update_bsctokens(bsctokens),
        console.error,
        () => this.complete_get_bsctokens()
      );
  }
  complete_get_bsctokens() {
    this.bsctokens_loaded = true;
  }

}
