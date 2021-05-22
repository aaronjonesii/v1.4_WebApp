import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import { NbTagComponent, NbTagInputDirective } from "@nebular/theme";
import { Tag } from "../../../../../../../shared/utils/models/crypto";
import { takeUntil } from "rxjs/operators";
import { CryptoService } from "../../../../../../../shared/utils/services/crypto.service";
import { ExtrasService } from "../../../../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-bsctoken-section-item',
  templateUrl: './cryptotoken-section-item.component.html',
  styleUrls: ['./cryptotoken-section-item.component.scss']
})
export class CryptotokenSectionItemComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() bsctoken: any;
  @Input() fieldName: any;
  @Input() fieldDescription: any;
  @Input() ngModel_key: string = '';
  @Input() is_bsctoken_socials: any;
  @Input() is_required: boolean = false;
  @Input() field_type: string = 'text';
  @Input() select_options: any;
  @ViewChild(NbTagInputDirective, { read: ElementRef }) tagInput: any;
  token_tags: Set<any> = new Set<any>();
  allTags: any;

  constructor(
    private crypto: CryptoService,
    private extras: ExtrasService,
  ) {}

  ngOnInit(): void {
    if (this.ngModel_key === 'tags') {
      this.getAllTags();
      this.token_tags = new Set<any>(this.bsctoken[this.ngModel_key]);
    }
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getAllTags() {
    this.crypto.get_all_token_tags().pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      all_tags => this.removePostTagsFromAllTags(all_tags),
      error => this.extras.showError(error, 'Gathering token tags'),
      () => {},
    );
  }
  removePostTagsFromAllTags(allTags:Tag[]) {
    this.allTags = allTags
    for (let i in this.bsctoken.tags) {
      this.allTags = this.allTags.filter((tag:Tag) => tag.name !== this.bsctoken.tags[i].name)
    }
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.token_tags.forEach((tag:Tag) => {
      if (tag.name == tagToRemove.text) {this.token_tags.delete(tag)}
    })
    if (this.allTags.some((tag:Tag) => tag.name == tagToRemove.text)) {
      return;
    } else { this.allTags.push({'name':tagToRemove.text}) }
    this.bsctoken.tags = Array.from(this.token_tags);
  }

  onTagAdd(value: string): void {
    if (value) {
      this.token_tags.add({'name': value});
      this.allTags = this.allTags.filter((tag:Tag) => tag.name !== value);
      this.bsctoken.tags = Array.from(this.token_tags);
    }
    this.tagInput.nativeElement.value = '';
  }

}
