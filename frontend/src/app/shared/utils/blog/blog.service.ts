import { Injectable } from '@angular/core';
import { BLOGS } from './mock-blogs';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Blog } from './models/blog';
import { Post } from "./models/post";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  post: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private subject = new Subject<any>(); // Observable source

  private liveStory = new BehaviorSubject<any>(this.post);
  private lastSavedStory = new BehaviorSubject<any>(this.post);
  private autoSaveStatus = new BehaviorSubject<any>('');
  private storyLoaded = new BehaviorSubject<any>('');
  private storyLastSavedTimestamp = new BehaviorSubject<any>('');

  sharedLiveStory = this.liveStory.asObservable();
  sharedLastSavedStory = this.lastSavedStory.asObservable();
  sharedAutoSaveStatus = this.autoSaveStatus.asObservable();
  sharedStoryLoaded = this.storyLoaded.asObservable();
  sharedStoryLastSavedTimestamp = this.storyLastSavedTimestamp.asObservable();


  constructor(
    private http: HttpClient,
  ) { }

  updateLiveStory(story: any) { this.liveStory.next(story); };
  updateLastSavedStory(story: any) { this.lastSavedStory.next(story); };
  updateAutoSaveStatus(status: string) { this.autoSaveStatus.next(status); };
  updateStoryLoaded(isStoryLoaded: boolean) { this.storyLoaded.next(isStoryLoaded); };
  updateStoryLastSavedTimestamp(storyLastSavedTimestamp: number) {
    this.storyLastSavedTimestamp.next(storyLastSavedTimestamp);
  };

  getBlogSubject(): Observable<any> {
    return this.subject.asObservable();
  };

  updateBlogSubject() {
    this.subject.next(BLOGS);
  };

  getPost(id: number): Observable<Blog> {
    return of(BLOGS.find(blog => blog.id === id)!);
  }
  // API Methods
  getOnePost(postID: string): Observable<Post> {
    return this.http.get<Post>(`${environment.apiURL}/blog/${postID}/`, {headers: this.httpHeaders});
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.apiURL}/blog/` , post, {headers: this.httpHeaders});
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiURL}/blog/`, {headers: this.httpHeaders});
  }

  updatePost(postID: string, post: Post): Observable<Post> {
    return this.http.put<Post>(`${environment.apiURL}/blog/${postID}/`, post, {headers: this.httpHeaders});
  }

}
