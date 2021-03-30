import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";

@Component({
  selector: 'anon-story-socials',
  templateUrl: './story-socials.component.html',
  styleUrls: ['./story-socials.component.scss']
})
export class StorySocialsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() contextMenuItems: any;

  constructor() { }

  ngOnInit(): void { }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
