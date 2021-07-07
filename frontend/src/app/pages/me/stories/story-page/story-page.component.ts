import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../../shared/utils/services/blog.service';
import { Location } from '@angular/common';
import { Post } from "../../../../shared/utils/models/post";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { StoriesService } from "../../../../shared/utils/services/stories.service";
import { NbDialogService, NbMenuService } from "@nebular/theme";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";
import { ConfirmationPopupComponent } from "../../../../shared/layout/confirmation-popup/confirmation-popup.component";

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
    read_time: 0,
    created_on: '',
    status: 0,
  };
  storyMarkup = '';
  storyLoaded = false;
  menu_items: any = [ { title: 'Edit Blog Post' } ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private storiesService: StoriesService,
    private location: Location,
    private menuService: NbMenuService,
    private extras: ExtrasService,
    private router: Router,
    private dialogService: NbDialogService,
  ) {
    // Get Story ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.story.id = routeParams.post_id,
      error => this.extras.showToast(`${JSON.stringify(error)}`, 'Error', 'danger', 0),
    );
  }

  ngOnInit() {
    // User Context Menu Subscriber
    this.menuService.onItemClick().pipe(
      takeUntil(this.unsub$)
    ).subscribe((event) => {
      if (event.item.title === 'Publish Story') { this.openPublishConfirmationPopUp(); }
    });
    this.getPost();
    this.menu_items = [
      { title: 'Edit Story', link: `me/${this.story.id}/edit`,  icon: 'edit-2-outline' },
      { title: 'Story settings', link: `/me/${this.story.id}/settings`, icon: 'settings-outline' },
      ]
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
        this.storyMarkup = this.storiesService.filterStoryContentMarkUp(story);
      },
      error => this.extras.showToast(`${JSON.stringify(error)}`, 'Error', 'danger', 0),
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

  openPublishConfirmationPopUp() {
    this.dialogService.open(
        ConfirmationPopupComponent,
        { context: {
          story: this.story
        } }
    )
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'e') {
      this.extras.showToast('You pressed E on your keyboard to quickly navigate to edit your story.', 'Edit story from keypress', 'info', 0);
      this.router.navigateByUrl(`/me/${this.story.id}/edit`);
    }
  }

}
