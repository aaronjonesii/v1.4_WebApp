import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbStepperOrientation, NbThemeService, NbWindowRef } from "@nebular/theme";
import { CryptoToken } from "../../../../shared/utils/models/crypto";
import { CryptoService } from "../../../../shared/utils/services/crypto.service";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";
import {
  required_token_fields,
  token_info_fields,
  token_social_fields
} from "../../../../shared/utils/cryptotoken-field-sections";
import { Router } from "@angular/router";

@Component({
  selector: 'anon-create-bsctoken',
  templateUrl: './create-cryptotoken.component.html',
  styleUrls: ['./create-cryptotoken.component.scss']
})
export class CreateCryptotokenComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  token: CryptoToken = {
    blockchain: 'UNKNOWN',
    status: 'PRIVATE',
    name: '',
    symbol: '',
    contract_address: '',
    socials: {},
  };
  required_token_fields = required_token_fields;
  token_info_fields = token_info_fields;
  token_social_fields = token_social_fields;
  stepper_orientation: NbStepperOrientation = 'vertical'

  constructor(
    protected windowRef: NbWindowRef,
    private crypto: CryptoService,
    private extras: ExtrasService,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const { lg } = this.breakpointService.getBreakpointsMap();
    // Subscribe to Theme Observable for Media Queries
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width),
        takeUntil(this.unsub$),
      )
      .subscribe((currentBreakpoint) => {
        if (currentBreakpoint < lg) {
          this.stepper_orientation = 'horizontal'
        } else { this.stepper_orientation = 'vertical' }
      });
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  minimize() { this.windowRef.minimize(); }

  close() { this.windowRef.close(); }

  add_bsctoken(bsctoken: CryptoToken) {
    this.crypto.create_bsc_token(bsctoken).subscribe(
      response => {
        this.extras.showToast('', `${this.token.symbol} Card Created`, 'success', 5000)
      },
      error => this.extras.showToast(
        `Sorry, we failed to create your Crypto Token card because: ${JSON.stringify(error.error)}`,
        `Token creation failed`,
        'danger',
        0),
      () => {
        this.close();
        let page_url = this.router.url
        this.router.navigateByUrl('/').then(() => this.router.navigateByUrl(page_url))
      }
    );
  }

  get_bsctokens() {
    this.crypto.get_bsc_tokens().pipe(takeUntil(this.unsub$))
      .subscribe(
        bsctokens => this.crypto.update_cryptotokens(bsctokens),
        console.error,
        () => {}
      );
  }

}
