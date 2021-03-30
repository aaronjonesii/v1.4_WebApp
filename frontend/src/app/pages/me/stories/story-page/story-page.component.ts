import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Blog } from '../../../../shared/utils/blog/models/blog';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../../shared/utils/blog/blog.service';
import { Location } from '@angular/common';
import { Post } from "../../../../shared/utils/blog/models/post";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import * as BalloonEditor from "../../../../shared/utils/blog/ckeditor";
import { StoriesService } from "../../../../shared/utils/stories.service";
import { NbMenuService } from "@nebular/theme";
import { ExtrasService } from "../../../../shared/utils/extras.service";

@Component({
  selector: 'anon-blog-post',
  templateUrl: './story-page.component.html',
  styleUrls: ['./story-page.component.scss']
})
export class StoryPageComponent implements OnInit, OnDestroy {
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
  storyMarkUp = '';
  storyLoaded = false;
  public Editor = BalloonEditor;
  menu_items: any = [{ title: 'Edit Blog Post' }];

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private storiesService: StoriesService,
    private location: Location,
    private menuService: NbMenuService,
    private extras: ExtrasService,
    private router: Router,
  ) {
    // Get Story ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.story.id = routeParams.post_id,
      error => console.error(error),
    );
  }

  ngOnInit() {
    // User Context Menu Subscriber
    this.menuService.onItemClick().pipe(
      takeUntil(this.unsub$)
    ).subscribe((event) => {
      if (event.item.title === 'Publish Story') { this.publishStory(); }
    });
    this.getPost();
    this.menu_items = [ { title: 'Edit Story', link: `me/${this.story.id}/edit`,  icon: 'edit-2-outline' } ]
    setTimeout(() => this.checkPublishStatus(this.story), 999);
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getPost(): void {
    this.blogService.getOnePost(`${this.story.id}`).pipe(
     takeUntil(this.unsub$)
    ).subscribe(
      story => {
        this.story = story;
        this.storyMarkUp = this.storiesService.filterStoryContentMarkUp(story);
      },
      error => console.error(error), // TODO: Handle errors and redirect if story is in trash
      () => {this.storyLoaded = true;}
    );
  }

  checkPublishStatus(story: Post) {
    if (story.status != 1) {
      if (story.status != 5) {
        // this.extras.showToast('Story is not in the trash and is not already published.', 'Publish eligible', 'success');
        // Add Publish Story button to bottom of context menu
        this.menu_items.push({ title: 'Publish Story', icon: 'done-all-outline' })
      }
    }
  }

  publishStory() {
    // Set status to Publish
    this.story.status = 5;
    // Send update to backend
    this.blogService.updatePost(this.story.id!, this.story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {this.extras.showToast(`Successfully published ${this.story.title}`, 'Published Story', 'success')},
      error => {this.extras.showToast(`Something went wrong while trying to publish ${this.story.title}`, 'Error publishing story', 'danger')},
      () => {
        // Redirect to published stories
        this.router.navigateByUrl(`/me/stories/published`);
      },
    )
  }

}
