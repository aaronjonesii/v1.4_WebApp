import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../../shared/utils/blog/models/post";
import { Subject } from "rxjs";

@Component({
  selector: 'anon-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  stories: Post[] = [];

  constructor() { }

  ngOnInit() { }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
