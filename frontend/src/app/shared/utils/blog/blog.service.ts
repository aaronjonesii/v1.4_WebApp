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

  private newStory = new BehaviorSubject<any>(this.post); // Subject Observer
  sharedNewStory = this.newStory.asObservable();
  // newStory$ = this.newStorySubject.asObservable(); // Observable stream


  constructor( private http: HttpClient ) { }

  nextNewStory(post: any) { // Feed new value to Subject
    // console.log('blogService to Subject...', post);
    this.newStory.next(post);
  }

  getBlogSubject(): Observable<any> {
    return this.subject.asObservable();
  };

  updateBlogSubject() {
    this.subject.next(BLOGS);
    // console.log('UPDATE Blog Subject was called!');
  };

  getPost(id: number): Observable<Blog> {
    return of(BLOGS.find(blog => blog.id === id)!);
  }

  getOnePost(postID: number): Observable<Post> {
    return this.http.get<Post>(`${environment.apiURL}/${postID}/`, {headers: this.httpHeaders});
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.apiURL}/blog/` , post, {headers: this.httpHeaders});
  }


}
