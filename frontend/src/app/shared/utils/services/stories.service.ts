import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../models/post";
import { SlugifyPipe } from "../pipes/slugify.pipe";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BlogService } from "./blog.service";
import { Router } from "@angular/router";
import { ExtrasService } from "./extras.service";

@Injectable()
export class StoriesService implements OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  private domparser = new DOMParser();

  private filteredStories = new BehaviorSubject<any>([]);
  sharedFilteredStories = this.filteredStories.asObservable();

  constructor(
    private slugifyPipe: SlugifyPipe,
    private blogService: BlogService,
    private router: Router,
    private extras: ExtrasService,
  ) { }

  updateFilteredStories(stories: Post[]) { this.filteredStories.next(stories); };

  public parseEditorContent(editor: any, story: Post, storyWordCount: number) {
    const htmlString = editor.getData();
    const domDoc = this.domparser.parseFromString(htmlString, 'text/html')
    story.content = htmlString;
    // Set Title
    if(domDoc.getElementsByTagName("h1").length > 0) {
      story.title = domDoc.getElementsByTagName("h1")[0].innerText;
      story.slug = this.slugifyPipe.transform(domDoc.getElementsByTagName("h1")[0].innerText);
    }
    // Set Subtitle(Byline)
    if(domDoc.getElementsByClassName('ck-subtitle').length > 0) {
      let byline: any;
      byline = domDoc.getElementsByClassName('ck-subtitle')[0].textContent;
      story.byline = byline;
    }
    let actual_read_time = storyWordCount / 200;
    let whole_read_time = ~~(actual_read_time);
    if (whole_read_time<=0) whole_read_time = 1;
    story.read_time = whole_read_time;
    // TODO: Provide options to user for statuses
    // story.status = 2; // TODO: Draft status
    return story;
  }

  public filterStoriesByStatus(status: number, stories: Post[]) {
    // const statuses = [
    //   'Trash',
    //   'Draft',
    //   'Pending',
    //   'Review',
    //   'Publish',
    //   'Future',
    //   'Private',
    // ]
    let filteredStories = [];
    for (let story of stories) { if( story.status == status ) {filteredStories.push(story)} }
    filteredStories.sort(this.sortByDate);
    // filteredStories.sort(this.sortByTitle);
    return filteredStories;
  }
  sort_stories_by_date(
    stories_to_sort: Post[],
    sort_by: 'updated_on'|'created_on',
    direction: 'descending'|'ascending') {
    if ((sort_by === "updated_on")&&(direction === "descending")) stories_to_sort.sort(this.sort_by_updated_on_descending)
    if ((sort_by === "updated_on")&&(direction === "ascending")) stories_to_sort.sort(this.sort_by_updated_on_ascending)
    if ((sort_by === "created_on")&&(direction === "descending")) stories_to_sort.sort(this.sort_by_created_on_descending)
    if ((sort_by === "created_on")&&(direction === "ascending")) stories_to_sort.sort(this.sort_by_created_on_ascending)
  }
  sortByDate(a:any, b:any) {
    const c:any = new Date(a.updated_on).getTime();
    const d:any = new Date(b.updated_on).getTime();
    // return c > d ? 1 : -1; // Ascending
    return c > d ? -1 : 1; // Descending
  }
  sort_by_updated_on_descending(a:any, b:any) {
    const c:any = new Date(a.updated_on).getTime();
    const d:any = new Date(b.updated_on).getTime();
    return c > d ? -1 : 1;
  }
  sort_by_updated_on_ascending(a:any, b:any) {
    const c:any = new Date(a.updated_on).getTime();
    const d:any = new Date(b.updated_on).getTime();
    return c > d ? 1 : -1;
  }
  sort_by_created_on_descending(a:any, b:any) {
    const c:any = new Date(a.created_on).getTime();
    const d:any = new Date(b.created_on).getTime();
    return c > d ? -1 : 1;
  }
  sort_by_created_on_ascending(a:any, b:any) {
    const c:any = new Date(a.created_on).getTime();
    const d:any = new Date(b.created_on).getTime();
    return c > d ? 1 : -1;
  }
  sortByTitle(a:Post, b:Post) {
    const c:any = a.title;
    const d:any = b.title;
    return c > d ? 1 : -1; // Ascending
    // return c > d ? -1 : 1; // Descending
  }

  public filterStoryContentMarkUp(story: Post) {
    const htmlString = story.content;
    const domDoc = this.domparser.parseFromString(htmlString, 'text/html')
    let storyMarkUp = htmlString;
    // Remove Title
    if(domDoc.getElementsByTagName("h1").length > 0) {
      storyMarkUp = storyMarkUp.replace(domDoc.getElementsByTagName("h1")[0].outerHTML, '');
    }
    // Remove Subtitle(Byline)
    if(domDoc.getElementsByClassName('ck-subtitle').length > 0) {
      storyMarkUp = storyMarkUp.replace(domDoc.getElementsByClassName('ck-subtitle')[0].outerHTML, '');
    }
    return storyMarkUp
  }

  publishStory(story: Post, redirectRouterLink: string = '') {
    // Set status to Publish
    story.status = 5;
    // Send update to backend
    this.blogService.updatePost(story.id!, story).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {this.extras.showToast(`Successfully published ${story.title}`, 'Published story', 'success')},
      error => {this.extras.showToast(`Something went wrong while trying to publish ${story.title}`, 'Story not published', 'danger'), 0},
      () => {
        // Redirect to published stories, if requested
        if (redirectRouterLink != '') this.router.navigateByUrl(redirectRouterLink);
      },
    )
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
