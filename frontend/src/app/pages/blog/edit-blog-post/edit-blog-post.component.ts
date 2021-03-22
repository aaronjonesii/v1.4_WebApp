import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../shared/utils/blog/blog.service';
import { Location } from '@angular/common';
import { Blog } from '../../../shared/utils/blog/models/blog';
// import * as BalloonEditor from '@ckeditor/ckeditor5-build-balloon-block';
import * as BalloonEditor from '../../../shared/utils/blog/ckeditor';

@Component({
  selector: 'anon-edit-blog-post',
  templateUrl: './edit-blog-post.component.html',
  styleUrls: ['./edit-blog-post.component.scss']
})
export class EditBlogPostComponent implements OnInit {
  @Input() post: Blog = {};
  public Editor = BalloonEditor;
  editorConfig = {
    toolbar: [ 'heading', '|','bold', 'italic' ]
  };

    constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id')!.valueOf();
    this.blogService.getPost(id)
      .subscribe(post => this.post = post);
  }

  goBack(): void {
    this.location.back();
  }

}
