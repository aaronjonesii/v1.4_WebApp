import { Component, OnInit } from '@angular/core';
import { AuthService } from "@auth0/auth0-angular";
import { NbMenuService } from "@nebular/theme";
import { BlogService } from "../../utils/blog/blog.service";
import { Post } from "../../utils/blog/models/post";

@Component({
  selector: 'anon-new-story-header',
  templateUrl: './new-story-header.component.html',
  styleUrls: ['./new-story-header.component.scss'],
})
export class NewStoryHeaderComponent implements OnInit {
  user_context_items = [
    { title: 'Profile', link: '/profile' },
    { title: 'Write a story', link: '/new-story' },
    { title: 'Log Out' }
  ];
  story_context_items = [
    { title: 'Change featured image' },
    { title: 'Change display title / subtitle' },
    { title: 'Change tags', },
  ];
  post: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: '',
    created_on: '',
    status: 0,
  };
  public domparser = new DOMParser();

  constructor(
    public auth: AuthService,
    private menuService: NbMenuService,
    private blogService: BlogService,
  ) {
    blogService.sharedNewStory.subscribe(
      post => this.post = post
    );
  }

  ngOnInit(): void {
    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Log Out') { this.auth.logout() }
    });
  }

  publish(post: Post) {
    console.warn(post);
    this.blogService.createPost(post).subscribe(
      response => { console.log('Creation response: ', response) },
      error => {
        if (error.status === 400) { console.error('Bad Request: ', error.error);
          if (error.error.hasOwnProperty('title')) { console.error('Error', error.error.title);
          } else { alert(`Uncaught Exception: CreatePost#create\n${JSON.stringify(error.error)}`); }
          // console.error('Error occurred during post creation: ', error);
        }
        if (error.status === 500) { alert(`Internal Server Error: CreatePost#create\n${error.error}`); }
        // TODO: Create Appealing Error Page
      },
    )
  }

}
