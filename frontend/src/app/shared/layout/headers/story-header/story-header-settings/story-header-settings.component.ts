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
    read_time: '',
    created_on: '',
    status: 0,
    tags: [],
  };
  tags: Set<any> = new Set(this.story.tags);
  category_options = ['Angular', 'Django', 'Anonymous']; // TODO: Get categories from backend
  filteredNgModelOptions$ = of(this.category_options);
  inputFormControl = new FormControl();

  constructor() {}

  ngOnInit() {}

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.tags.delete(tagToRemove.text);
  }

  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) { this.tags.add(value) }
    input.nativeElement.value = '';
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.category_options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  onModelChange(value: string) {
    this.filteredNgModelOptions$ = of(this.filter(value));
  }

}
