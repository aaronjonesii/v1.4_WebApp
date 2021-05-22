import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { CryptoToken, Tag } from "../../../../shared/utils/models/crypto";
import { Subject } from "rxjs";
import { CryptoService } from "../../../../shared/utils/services/crypto.service";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-admin-crypto-token-cards',
  templateUrl: './admin-crypto-token-cards.component.html',
  styleUrls: ['./admin-crypto-token-cards.component.scss']
})
export class AdminCryptoTokenCardsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() type_of_tokens: string = 'all';
  tokens: CryptoToken[] = [];
  tokens_loaded = false;
  all_tags_from_tokens = [];
  tags_selected: any = [];
  filtered_tokens: any = [];

  constructor(
    private crypto: CryptoService,
    private extras: ExtrasService,
  ) {
    // BSCToken Cards Subscriber
    this.crypto.shared_cryptotokens.pipe(takeUntil(this.unsub$))
      .subscribe(tokens => this.tokens = tokens );
  }

  ngOnInit(): void {
    this.get_tokens(this.type_of_tokens);
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  get_tokens(type_of_token: string) {
    this.crypto.get_crypto_tokens(type_of_token).pipe(takeUntil(this.unsub$))
      .subscribe(
        tokens => this.crypto.update_cryptotokens(tokens),
        error => this.extras.showToast(
          'Sorry, we are having problems getting your Binance Smart Chain Tokens at the moment.',
          'Error retrieving Binance Smart Chain Tokens', 'danger', 8000),
        () => this.complete_get_tokens()
      );
  }
  complete_get_tokens() {
    this.tokens_loaded = true;
    this.all_tags_from_tokens = this.get_tags_from_tokens(this.tokens);
  }

  get_tags_from_tokens(tokens: CryptoToken[]) {
    let all_tags: any = []
    for (let token of tokens) {
      for (let tag of <any>token.tags) {
        if (!all_tags.includes(tag.name)) all_tags.push(tag.name)
      }
    }
    return all_tags
  }

  select_tag(tag_selected: string, isSelected: boolean) {
    if (isSelected) {
      if (!this.tags_selected.includes(tag_selected)) this.tags_selected.push(tag_selected)
      if (this.tags_selected.length > 0) {
        this.add_tokens_to_filtered(this.tokens, this.tags_selected);
      }
    } else {
      if (this.tags_selected.includes(tag_selected)) {
        this.tags_selected.forEach((tag: string, index: number) => {
          if (tag == tag_selected) this.tags_selected.splice(index, 1);
          // this.remove_tokens_from_filtered(this.filtered_tokens, this.tags_selected);
          this.filtered_tokens = [];
          this.add_tokens_to_filtered(this.tokens, this.tags_selected);
        });
      }
    }
  }

  add_tokens_to_filtered(tokens: any, tags_selected: any) {
    tokens.forEach((token: CryptoToken, index: number) => {
      token.tags?.forEach((tag: Tag, index: number) => {
        if (tags_selected.includes(tag.name)) {
          if (!(this.filtered_tokens.filter((token_a: any) => token_a == token).length > 0)) this.filtered_tokens.push(token)
        }
      })
    })
  }

}
