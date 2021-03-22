import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from "../../../shared/utils/blog/models/post";
import * as BalloonEditor from "../../../shared/utils/blog/ckeditor";
import { AuthService } from "@auth0/auth0-angular";
import { BlogService } from "../../../shared/utils/blog/blog.service";
import { SlugifyPipe } from "../../../shared/utils/blog/slugify.pipe";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'anon-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.scss']
})
export class EditStoryComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  pageLoaded = false;
  post: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  public Editor = BalloonEditor;
  public domparser = new DOMParser();

  constructor(
    public auth: AuthService,
    private blogService: BlogService,
    private slugifyPipe: SlugifyPipe,
    private activatedRoute: ActivatedRoute,
  ) {
    this.blogService.sharedNewStory.pipe(
      takeUntil(this.unsub$)
    ).subscribe(post => this.post = post );
    // Get Story ID from URL
    this.activatedRoute.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => this.post.id = routeParams.post_id,
      error => console.error(error),
    );
  }

  ngOnInit() {
    console.log('Before updating story from backend: ', this.post);
    this.getPost(<string>this.post.id);
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  // TODO: Handle errors here
  getPost(postID: string) {
    this.blogService.getOnePost(postID).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      story => {
        if (this.post.author == '') {if (story.content != this.post.content) { story.content = this.post.content }}
        this.blogService.nextNewStory(story)
      },
      error => console.error(error),
      () => {this.pageLoaded = true;console.log('After updating story from backend: ', this.post);},
    )
  }

  onChange( { editor }: ChangeEvent ) {
    const htmlString = editor.getData();
    const domDoc = this.domparser.parseFromString(htmlString, 'text/html')
    this.post.content = htmlString;
    if(domDoc.getElementsByTagName("h1").length > 0) {
      this.post.title = domDoc.getElementsByTagName("h1")[0].innerHTML;
      this.post.slug = this.slugifyPipe.transform(domDoc.getElementsByTagName("h1")[0].innerText);
    }
    if(domDoc.getElementsByClassName('ck-subtitle').length > 0) {
      this.post.byline = domDoc.getElementsByClassName('ck-subtitle')[0].innerHTML;
    }
    // TODO: Calculate read time from word count
    // this.post.read_time = "0";
    // TODO: Build UI for statuses
    // this.post.status = 1;
  }

}
