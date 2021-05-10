import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { CryptoService } from "../../../../shared/utils/services/crypto.service";
import { NbWindowService } from "@nebular/theme";
import { CreateCryptotokenComponent } from "../create-cryptotoken/create-cryptotoken.component";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-admin-crypto-bsctokens',
  templateUrl: './admin-crypto-bsctokens.component.html',
  styleUrls: ['./admin-crypto-bsctokens.component.scss']
})
export class AdminCryptoBsctokensComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();

  constructor(
    private crypto: CryptoService,
    private windowService: NbWindowService,
  ) {}

  ngOnInit(): void {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  openCreateBSCTokenWindow() {
    this.windowService.open(CreateCryptotokenComponent,
      { windowClass: 'create-cryptotoken-window' })
  }

}
