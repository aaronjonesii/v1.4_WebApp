import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from "../../../shared/utils/services/blog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Post } from "../../../shared/utils/models/post";

/**
 * Stories Statuses:
 * Trash = 1
 * Drafts = 2
 * Pending = 3
 * Review = 4
 * Publish = 5
 * Future = 6
 * Private = 7
 */

interface STATUS {
  name: string,
  past_name: string,
  plural_name: string,
  number: number,
  number_of_stories:number,
  default: boolean,
  stories: Post[],
}
interface ALL_STATUSES {
  trash: STATUS,
  drafts: STATUS,
  pending: STATUS,
  review: STATUS,
  publish: STATUS,
  future: STATUS,
  private: STATUS
}

@Component({
  selector: 'anon-admin-stories',
  templateUrl: './admin-stories.component.html',
  styleUrls: ['./admin-stories.component.scss']
})
export class AdminStoriesComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  stories_loaded = false;
  all_stories: Post[] = [];
  statuses: ALL_STATUSES = {
    trash: {
      name: 'trash', past_name: 'trashed', plural_name: 'Trashed', number: 1, number_of_stories: 0, default: false, stories: []
    },
    drafts: {
      name: 'drafts', past_name: 'drafted', plural_name: 'Drafts', number: 2, number_of_stories: 0, default: false, stories: []
    },
    pending: {
      name: 'pending', past_name: 'pending', plural_name: 'Pending', number: 3, number_of_stories: 0, default: false, stories: []
    },
    review: {
      name: 'review', past_name: 'reviewed', plural_name: 'Review', number: 4, number_of_stories: 0, default: false, stories: []
    },
    publish: {
      name: 'publish', past_name: 'published', plural_name: 'Published', number: 5, number_of_stories: 0, default: true, stories: []
    },
    future: {
      name: 'future', past_name: 'scheduled', plural_name: 'Scheduled', number: 6, number_of_stories: 0, default: false, stories: []
    },
    private: {
      name: 'private', past_name: 'unlisted', plural_name: 'Unlisted', number: 7, number_of_stories: 0, default: false, stories: []
    },
  };

  constructor(
    private blogService: BlogService,
  ) {
    this.get_all_stories();
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  get_all_stories() {
    this.blogService.adminGetAllStories().pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      (all_stories: Post[]) => this.filter_stories_by_status(all_stories),
      error => { this.stories_loaded = false; },
      () => { this.stories_loaded = true; }
    );
  }

  filter_stories_by_status(all_stories: Post[]) {
    this.all_stories = all_stories;
    for (let story of all_stories) {
      if (story.status == 1) this.statuses.trash.stories.push(story)&&this.statuses.trash.number_of_stories++
      if (story.status == 2) this.statuses.drafts.stories.push(story)&&this.statuses.drafts.number_of_stories++
      if (story.status == 3) this.statuses.pending.stories.push(story)&&this.statuses.pending.number_of_stories++
      if (story.status == 4) this.statuses.review.stories.push(story)&&this.statuses.review.number_of_stories++
      if (story.status == 5) this.statuses.publish.stories.push(story)&&this.statuses.publish.number_of_stories++
      if (story.status == 6) this.statuses.future.stories.push(story)&&this.statuses.future.number_of_stories++
      if (story.status == 7) this.statuses.private.stories.push(story)&&this.statuses.private.number_of_stories++
    }
  }

}
