import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbWindowRef } from "@nebular/theme";
import { BSCToken } from "../../../../../shared/utils/models/crypto";
import { CryptoService } from "../../../../../shared/utils/services/crypto.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-create-bsctoken',
  templateUrl: './create-bsctoken.component.html',
  styleUrls: ['./create-bsctoken.component.scss']
})
export class CreateBsctokenComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  bsctoken: BSCToken = {
    name: '',
    symbol: '',
    contract_address: '',
    socials: {},
  };
  bsctoken_sections = [
    { 'header': 'Create Binance Smart Chain Token Card',
      'id': 'bsctoken',
      'items': [
        { 'name': 'Name',
          'ngModel_key': 'name',
          'description': 'Project Name',
          'is_bsctoken_socials': false,
          'is_required': true,
          'field_type': 'text'
        },
        { 'name': 'Symbol',
          'ngModel_key': 'symbol',
          'description': 'Token Symbol',
          'is_bsctoken_socials': false,
          'is_required': true,
          'field_type': 'text'
        },
        { 'name': 'Contract Address',
          'ngModel_key': 'contract_address',
          'description': 'Token Contract Address',
          'is_bsctoken_socials': false,
          'is_required': true,
          'field_type': 'text'
        },
        { "name": "Launch Date",
          "ngModel_key": "launch_date",
          "description": "Project Launch Date",
          'is_bsctoken_socials': false,
          'is_required': false,
          'field_type': 'datetime-local'
        },
        { "name": "Website",
          "ngModel_key": "website",
          "description": "Project Website URL link",
          'is_bsctoken_socials': false,
          'is_required': false,
          'field_type': 'url'
        },
        { "name": "Description",
          "ngModel_key": "description",
          "description": "Projects purpose or future details",
          'is_bsctoken_socials': false,
          'is_required': false,
          'field_type': 'text'
        },
        { "name": "Whitepaper",
          "ngModel_key": "whitepaper",
          "description": "Project Whitepaper URL link",
          'is_bsctoken_socials': false,
          'is_required': false,
          'field_type': 'url'
        },
      ]
    },
    { 'header': 'BSC Token Socials',
      'id': 'bsctoken-socials',
      'items': [
        { 'name': 'Email',
          'ngModel_key': 'email',
          'description': 'Project Email Address',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'email'
        },
        { 'name': 'Blog',
          'ngModel_key': 'blog',
          'description': 'Project Blog URL link',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'url'
        },
        { 'name': 'Reddit',
          'ngModel_key': 'reddit',
          'description': 'Project Reddit URL link',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'url'
        },
        { 'name': 'Facebook',
          'ngModel_key': 'facebook',
          'description': 'Project Facebook URL link',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'url'
        },
        { 'name': 'Twitter',
          'ngModel_key': 'twitter',
          'description': 'Project Twitter URL link',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'url'
        },
        { 'name': 'Github',
          'ngModel_key': 'github',
          'description': 'Project Github URL link',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'url'
        },
        { 'name': 'Telegram',
          'ngModel_key': 'telegram',
          'description': 'Project Telegram URL link',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'url'
        },
        { 'name': 'LinkedIn',
          'ngModel_key': 'linkedin',
          'description': 'Project LinkedIn URL link',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'url'
        },
        { 'name': 'Discord',
          'ngModel_key': 'discord',
          'description': 'Project Discord URL link',
          'is_bsctoken_socials': true,
          'is_required': false,
          'field_type': 'url'
        },
      ],
    },
  ];

  constructor(
    protected windowRef: NbWindowRef,
    private crypto: CryptoService,
    private extras: ExtrasService,
  ) { }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  minimize() { this.windowRef.minimize(); }

  close() { this.windowRef.close(); }

  add_bsctoken(bsctoken: BSCToken) {
    this.crypto.create_bsc_token(bsctoken).subscribe(
      response => {
        this.extras.showToast('', `${this.bsctoken.symbol} Card Created`, 'success', 5000)
      },
      error => this.extras.showToast(
        `Sorry, we failed to create your Binance Smart Chain Token Card because: ${JSON.stringify(error.error)}`,
        `Failed to create token`,
        'danger',
        0),
      () => {
        this.close();
        this.get_bsctokens();
      }
    );
  }

  get_bsctokens() {
    this.crypto.get_bsc_tokens().pipe(takeUntil(this.unsub$))
      .subscribe(
        bsctokens => this.crypto.update_bsctokens(bsctokens),
        console.error,
        () => {}
      );
  }

}
