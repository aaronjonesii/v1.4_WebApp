import { Component, Input, OnInit } from '@angular/core';
import { Post } from "../../../../utils/models/post";
import { NbTagComponent, NbTagInputAddEvent } from "@nebular/theme";
import { of } from 'rxjs';
import { filter, map, startWith } from "rxjs/operators";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'anon-story-header-settings',
  templateUrl: './story-header-settings.component.html',
  styleUrls: ['./story-header-settings.component.scss']
})
export class StoryHeaderSettingsComponent implements OnInit {
  @Input() story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: 0,
    created_on: '',
    status: 0,
    tags: [],
  };
  tags: Set<any> = new Set(this.story.tags);
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

  constructor() {}

  ngOnInit() {}

  onTagRemove(tagToRemove: NbTagComponent): void { this.tags.delete(tagToRemove.text); }
  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) { this.tags.add(value) }
    input.nativeElement.value = '';
  }

  private categoryFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.category_options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }
  onCategoryChange(category: string) {
    this.filteredCategoryOptions$ = of(this.categoryFilter(category));
  }

}
