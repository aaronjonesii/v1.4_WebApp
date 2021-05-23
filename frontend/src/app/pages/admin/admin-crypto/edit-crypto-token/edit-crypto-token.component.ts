import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { CryptoService } from "../../../../shared/utils/services/crypto.service";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";
import { CryptoToken } from "../../../../shared/utils/models/crypto";
import { all_token_fields } from "../../../../shared/utils/cryptotoken-field-sections";

@Component({
  selector: 'anon-edit-crypto-token',
  templateUrl: './edit-crypto-token.component.html',
  styleUrls: ['./edit-crypto-token.component.scss']
})
export class EditCryptoTokenComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  header_title: string = 'Edit Crypto Token Page'
  header_subtitle: string = 'Edit crypto token to change title, status, or many other fields.'
  token: CryptoToken = {
    id: '',
    blockchain: 'UNKNOWN',
    status: 'PRIVATE',
    name: '',
    symbol: '',
    contract_address: '',
  };
  token_loaded = false;
  all_token_fields_section = all_token_fields;

  constructor(
    private activatedRoute: ActivatedRoute,
    private crypto: CryptoService,
    private extras: ExtrasService,
    private router: Router,
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
    this.get_token(<string>this.token.id);
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
      () => {
        this.token_loaded = true;
        if (this.token.launch_date) this.token.launch_date = new Date(<string>this.token.launch_date);
        this.header_title = `Edit ${this.token.name}`;
        if (this.token.symbol != '') this.header_title += ` (${this.token.symbol})`
      }
    );
  }

  go_back() { this.extras.goBack(); }
  update_token(token: CryptoToken) {
    this.crypto.update_token(token).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      token => {
        this.extras.showToast('Successfully updated the crypto token.', 'Token Updated', 'success', 5000);
      },
      error => {this.extras.showToast(
        `Sorry, we ran into an error while trying to update your token: ${JSON.stringify(error.error)}`,
        `Error Updating Token`, 'danger', 0)},
      () => {
        this.router.navigateByUrl(`/admin/crypto/token/${token.id}`);
        // if ((token.status != 'TRASH') && (token.status != 'ARCHIVE')) {
        //   this.router.navigateByUrl(`/admin/crypto/token/${token.id}`);
        // } else {this.go_back();}
      }
    );
  }

}
