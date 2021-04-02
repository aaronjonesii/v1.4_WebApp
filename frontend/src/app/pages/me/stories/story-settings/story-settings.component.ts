import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { ExtrasService } from "../../../../shared/utils/services/extras.service";
import { Post } from "../../../../shared/utils/models/post";
import { BlogService } from "../../../../shared/utils/services/blog.service";
import { NbTagComponent, NbTagInputAddEvent } from "@nebular/theme";

@Component({
  selector: 'anon-story-settings',
  templateUrl: './story-settings.component.html',
  styleUrls: ['./story-settings.component.scss']
})
export class StorySettingsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  storyLoaded = false;
  category_options = ['Angular', 'Django', 'Anonymous']; // TODO: Get categories from backend
  filteredCategoryOptions$ = of(this.category_options);
  storySettingsSections = [
    {
      'header': 'Featured image',
      'id': 'story-image',
      'items': [
        {
          'item_name': 'Featured story image',
          'item_key': 'background_image',
          'item_description': "Tip: add a high-quality image to your story to capture people's interest",
        },
      ],
    },
    {
      'header': 'Tags',
      'id': 'story-tags',
      'items': [
        {
          'item_name': 'Tags',
          'item_key': 'tags',
          'item_description': "Add tags so readers know what your story is about.",
        },
      ],
    },
    {
      'header': 'Category',
      'id': 'story-category',
      'items': [
        {
          'item_name': 'Category',
          'item_key': 'category',
          'item_description': "Categorize your story by selecting a topic this story should be displayed in.",
        },
      ],
    },
    {
      'header': 'Status',
      'id': 'story-status',
      'items': [
        {
          'item_name': 'Status',
          'item_key': 'status',
        },
      ],
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private extras: ExtrasService,
    private blogService: BlogService,
  ) {
    // Get Story ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.story.id = routeParams.post_id,
      error => this.extras.showToast(`${JSON.stringify(error)}`, 'Error', 'danger', 0),
    );
  }

  ngOnInit() { this.getPost(); }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getPost(): void {
    this.blogService.getOnePost(`${this.story.id}`).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => this.story = story,
      error => this.extras.showToast(`${JSON.stringify(error)}`, 'Error', 'danger', 0),
      () => {this.storyLoaded = true;}
    );
  }

  private categoryFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.category_options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }
  onCategoryChange(category: string) {
    this.filteredCategoryOptions$ = of(this.categoryFilter(category));
  }

}
