import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../../../shared/utils/models/post";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { BlogService } from "../../../../../shared/utils/services/blog.service";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-admin-story-list-item',
  templateUrl: './admin-story-list-item.component.html',
  styleUrls: ['./admin-story-list-item.component.scss']
})
export class AdminStoryListItemComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() story: any;

  constructor(
    private blogService: BlogService,
    private extras: ExtrasService,
  ) { }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  update_story(story: Post, field_name: string) {
    this.blogService.adminUpdateStory(story.id!, story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      response => {
        this.extras.showToast(`Updated the ${field_name} field on ${story.title}`, 'Story updated', 'success', 7000);
      }
    );
  }

}
