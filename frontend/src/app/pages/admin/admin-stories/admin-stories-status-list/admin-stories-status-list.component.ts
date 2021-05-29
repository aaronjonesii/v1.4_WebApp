import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../../shared/utils/models/post";
import { BlogService } from "../../../../shared/utils/services/blog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-admin-stories-status-list',
  templateUrl: './admin-stories-status-list.component.html',
  styleUrls: ['./admin-stories-status-list.component.scss']
})
export class AdminStoriesStatusListComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() stories: any;
  @Input() status_name: string = '';

  constructor(
    private extras: ExtrasService,
  ) { }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }


}
