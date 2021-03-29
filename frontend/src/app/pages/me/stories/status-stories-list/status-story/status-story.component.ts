import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from "../../../../../shared/utils/blog/models/post";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NbContextMenuDirective, NbMenuService } from "@nebular/theme";
import { ExtrasService } from "../../../../../shared/utils/extras.service";

@Component({
  selector: 'anon-status-story',
  templateUrl: './status-story.component.html',
  styleUrls: ['./status-story.component.scss']
})
export class StatusStoryComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };

  constructor(
    private menuService: NbMenuService,
    private extras: ExtrasService,
  ) { }

  ngOnInit() {

  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
