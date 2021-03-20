import { Injectable } from '@angular/core';
import { BLOGS } from './mock-blogs';
import { Observable, of, Subject } from 'rxjs';
import { Blog } from './blog';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private subject = new Subject<any>();

  constructor() { }

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

}
