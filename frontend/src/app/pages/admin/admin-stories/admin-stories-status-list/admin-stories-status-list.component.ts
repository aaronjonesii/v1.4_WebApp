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

  constructor(
    private blogService: BlogService,
    private extras: ExtrasService,
  ) { }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  update_story(story: Post, field_name: string) {
    console.log(`Update requested: ${story}`);
    this.blogService.adminUpdateStory(story.id!, story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      response => {
        this.extras.showToast(`Updated the ${field_name} field on ${story.title}`, 'Story updated', 'success', 7000);
        console.log(response);
      }
    );
  }


}
