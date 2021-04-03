import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from "../../../../../shared/utils/models/post";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NbContextMenuDirective, NbMenuService } from "@nebular/theme";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";
import { Router } from "@angular/router";
import { BlogService } from "../../../../../shared/utils/services/blog.service";
import { StoriesService } from "../../../../../shared/utils/services/stories.service";

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
    read_time: 0,
    created_on: '',
    status: 0,
  };
  @Input() statusNumber: number = 10000;
  unlistedPopover = "The story is only visible to those with the link." +
    "It won't be listed on public pages (e.g. homepage) and cannot be found using a search engine.";

  constructor(
    private menuService: NbMenuService,
    private extras: ExtrasService,
    private router: Router,
    private blogService: BlogService,
    private storiesService: StoriesService,
  ) { }

  ngOnInit() {

  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  editStory(story: Post) {
    this.router.navigateByUrl(`/me/${story.id}/edit`)
      .then(True => { if (!True) {
          this.extras.showToast('Sorry, something went wrong, redirecting you to previous page.', 'Error', 'danger');
        } }
      );
  }

  trashStory(story: Post) {
    // Update story status to trash
    story.status = 1;
    // Send update to backend
    this.blogService.updatePost(this.story.id!, story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {this.extras.showToast(`Successfully moved ${story.title} to the trash.`, 'Moved story to trash', 'success')},
      error => {this.extras.showToast(`Something went wrong while trying to move ${story.title} to the trash`, 'Error moving story', 'danger')},
      () => {this.updateFilteredStories()},
    )
  }

  moveStoryToDrafts(story: Post) {
    story.status = 2;
    // Send update to backend
    this.blogService.updatePost(this.story.id!, story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {this.extras.showToast(`Successfully moved ${story.title} to drafts.`, 'Moved story to drafts', 'success')},
      error => {this.extras.showToast(`Something went wrong while trying to move ${story.title} to drafts`, 'Error moving story', 'danger')},
      () => {this.updateFilteredStories()},
    )
  }

  updateFilteredStories() {
    this.blogService.getPosts().pipe(takeUntil(this.unsub$)).subscribe(
      stories => this.storiesService.updateFilteredStories(this.storiesService.filterStoriesByStatus(this.statusNumber, stories)),
      error => this.extras.showToast(error, 'Error Getting Stories', 'danger'),
      () => {},
    );
  }

}
