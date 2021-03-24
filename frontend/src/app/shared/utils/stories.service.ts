import { Injectable } from '@angular/core';
import { Post } from "./blog/models/post";
import { SlugifyPipe } from "./blog/slugify.pipe";

@Injectable()
export class StoriesService {
  private domparser = new DOMParser();

  constructor( private slugifyPipe: SlugifyPipe ) { }

  parseEditorContent(editor: any, story: Post) {
    const htmlString = editor.getData();
    const domDoc = this.domparser.parseFromString(htmlString, 'text/html')
    story.content = htmlString;
    // Set Title
    if(domDoc.getElementsByTagName("h1").length > 0) {
      // TODO: try innerText for title
      story.title = domDoc.getElementsByTagName("h1")[0].innerHTML;
      story.slug = this.slugifyPipe.transform(domDoc.getElementsByTagName("h1")[0].innerText);
    }
    // Set Subtitle(Byline)
    if(domDoc.getElementsByClassName('ck-subtitle').length > 0) {
      story.byline = domDoc.getElementsByClassName('ck-subtitle')[0].innerHTML;
    }
    return story;
  }

}
