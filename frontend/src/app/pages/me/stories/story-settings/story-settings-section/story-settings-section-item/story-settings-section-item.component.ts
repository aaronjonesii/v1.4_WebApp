import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, Subject } from "rxjs";
import { ProfileSettingsService } from "../../../../../../shared/utils/services/profile-settings.service";
import { AuthService } from "@auth0/auth0-angular";
import { ExtrasService } from "../../../../../../shared/utils/services/extras.service";
import { filter, take, takeUntil } from "rxjs/operators";
import { BlogService } from "../../../../../../shared/utils/services/blog.service";
import { NbTagComponent, NbTagInputAddEvent, NbTagInputDirective } from "@nebular/theme";
import { Post, Tag } from "../../../../../../shared/utils/models/post";

@Component({
  selector: 'anon-story-settings-section-item',
  templateUrl: './story-settings-section-item.component.html',
  styleUrls: ['./story-settings-section-item.component.scss']
})
export class StorySettingsSectionItemComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() story: any;
  @Input() fieldName: any;
  @Input() fieldDescription: any;
  @Input() item_key: string = '';
  @ViewChild('editButtonBtn') editButtonBtn: ElementRef = <ElementRef>{};
  @ViewChild('buttonsSpan') buttonsSpan: ElementRef = <ElementRef>{};
  @ViewChild('fieldInput') fieldInput: ElementRef = <ElementRef>{};
  @ViewChild(NbTagInputDirective, { read: ElementRef }) tagInput: any;
  canEdit: boolean = false;
  fieldSnapshot: any;
  storyTags: Set<any> = new Set<any>();
  allTags: any;
  storyCategory: any;
  categoryOptions: any;
  filteredCategoryOptions$: any;
  public statuses = [
    { name: 'Trash', number: 1 },
    { name: 'Draft', number: 2 },
    { name: 'Pending', number: 3 },
    { name: 'Review', number: 4 },
    { name: 'Publish', number: 5 },
    { name: 'Future', number: 6 },
    { name: 'Private', number: 7 },
  ]

  constructor(
    private settingsService: ProfileSettingsService,
    private auth: AuthService,
    private extras: ExtrasService,
    private blogService: BlogService,
  ) { }

  ngOnInit() {
    if (this.item_key === 'tags') {
      this.getAllTags();
      this.storyTags = new Set<any>(this.story[this.item_key]);
    }
    if (this.item_key === 'category') {
      this.getAllCategories();
      if (this.story.category) this.storyCategory = this.story.category.name;
      this.filteredCategoryOptions$ = of(this.categoryOptions);
    }
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  public editButton() {
    if (this.item_key === 'tags') {
      this.fieldSnapshot = Array.from(this.storyTags);
    } else {
      if (this.item_key === 'category') {
        this.fieldSnapshot = this.storyCategory;
      } else {
        this.fieldSnapshot = this.story[this.item_key]
      }
    }
    // Hide Edit Button
    this.editButtonBtn.nativeElement.classList.toggle('hide-element');
    // Show buttonSet
    this.buttonsSpan.nativeElement.classList.toggle('show-element');
    // Enable editing for field
    this.canEdit = true;
    // Put editing field in focus
    if (this.item_key != 'status') {
      setTimeout(() => this.fieldInput.nativeElement.focus(), 0);
    }
  };
  public saveButton() {
    if (this.item_key === 'tags') {
      const notEquals = (a:any, b:any) => JSON.stringify(a) != JSON.stringify(b);
      if (notEquals(Array.from(this.fieldSnapshot), Array.from(this.storyTags))) {
        this.story.tags = Array.from(this.storyTags)
        this.updateStory();
      }
    } else {
      if (this.item_key === 'category') {
        if (this.fieldSnapshot != this.storyCategory) {
          this.story.category = {name:this.storyCategory};
          this.updateStory();
        }
      } else {
        // Check if field was changed
        if (this.fieldSnapshot != this.story[this.item_key]) {
          // Send update to API if changed
          this.updateStory();
        }
      }
    }
    // ReHide buttonSet by removing show-element class
    this.buttonsSpan.nativeElement.classList.toggle('show-element');
    // Show Edit Button by removing hide-element class
    this.editButtonBtn.nativeElement.classList.toggle('hide-element');
    // Disable editing for field
    this.canEdit = false;
  };
  public cancelButton() {
    // Reset field
    this.resetField();
    // ReHide buttonSet by removing show-element class
    this.buttonsSpan.nativeElement.classList.toggle('show-element');
    // Show Edit Button by removing hide-element class
    this.editButtonBtn.nativeElement.classList.toggle('hide-element');
    // Disable editing for field
    this.canEdit = false;
  };

  getAllTags() {
    this.blogService.getAllTags().pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      allTags => this.removePostTagsFromAllTags(allTags),
      error => this.extras.showError(error, 'storySettingsSectionItem#getAllTags'),
      () => {},
    );
  }
  removePostTagsFromAllTags(allTags:Tag[]) {
    this.allTags = allTags
    for (let i in this.story.tags) {
      this.allTags = this.allTags.filter((tag:Tag) => tag.name !== this.story.tags[i].name)
    }
  }
  onTagRemove(tagToRemove: NbTagComponent): void {
    // console.log(`Removing ${tagToRemove.text} from => `,this.storyTags);
    this.storyTags.forEach((tag:Tag) => {
      if (tag.name == tagToRemove.text) {this.storyTags.delete(tag)}
    })
    if (this.allTags.some((tag:Tag) => tag.name == tagToRemove.text)) {
      return;
    } else { this.allTags.push({'name':tagToRemove.text}) }
  }
  onTagAdd(value: string): void {
    if (value) {
      this.storyTags.add({'name': value});
      // console.log('Added tag => ', Array.from(this.storyTags));
      // console.log('filter => ', this.allTags.filter((tag:Tag) => tag.name !== value));
      this.allTags = this.allTags.filter((tag:Tag) => tag.name !== value);
    }
    this.tagInput.nativeElement.value = '';
  }

  getAllCategories() {
    this.blogService.getAllCategories().pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      allCategories => this.categoryOptions = allCategories,
      error => this.extras.showError(error, 'storySettingsSectionItem#getAllTags'),
      () => {},
    );
  }
  private filterCategory(value: string) {
    const filterValue = value.toLowerCase();
    setTimeout(() => {
      return this.categoryOptions.filter((catOptionValue: any) => catOptionValue.name.toLowerCase().includes(filterValue))
    }, 100)
  }
  onCategoryChange(value: string) {
    this.filteredCategoryOptions$ = of(this.filterCategory(value));
  }

  resetField() {
    if (this.item_key === 'tags') {
      this.storyTags = new Set<any>(this.fieldSnapshot);
    } else {
      if (this.item_key === 'category') {
        this.fieldInput.nativeElement.value = this.fieldSnapshot;
      } else {
        this.story[this.item_key] = this.fieldSnapshot;
      }
    }
  }

  updateStory() {
    this.blogService.updatePost(this.story.id, this.story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => this.extras.showToast(`${this.fieldName} was successfully updated`, `Success`, 'success'),
      error => {
        this.extras.showError(error, 'storySettingsSectionItem#updateStory');
        this.resetField();
      },
      () => {},
    );
  }

}
