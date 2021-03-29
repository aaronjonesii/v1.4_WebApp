import { Injectable } from '@angular/core';
import { Post } from "./blog/models/post";
import { SlugifyPipe } from "./blog/slugify.pipe";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class StoriesService {
  private domparser = new DOMParser();

  private filteredStories = new BehaviorSubject<any>([]);
  sharedFilteredStories = this.filteredStories.asObservable();

  constructor( private slugifyPipe: SlugifyPipe ) { }

  updateFilteredStories(stories: Post[]) { this.filteredStories.next(stories); };

  public parseEditorContent(editor: any, story: Post) {
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
      story.byline = domDoc.getElementsByClassName('ck-subtitle')[0].innerHTML;
    }
    // TODO: Caculate read time from word count
    story.read_time = "0";
    // TODO: Provide options to user for statuses
    story.status = 2; // TODO: Draft status
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
    return filteredStories;
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

}
