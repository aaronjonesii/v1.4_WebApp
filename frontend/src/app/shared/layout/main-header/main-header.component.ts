import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NbMenuService } from '@nebular/theme';
import { Router } from "@angular/router";

@Component({
  selector: 'anon-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  context_items = [
    { title: 'Profile', link: '/profile' },
    { title: 'Write a story', link: '/new-story' },
    { title: 'Stories', link: '/me/stories' },
    { title: 'Log Out' }
  ];

  constructor(
    public auth: AuthService,
    private menuService: NbMenuService,
    public _router: Router,
    ) { }

  ngOnInit(): void {
    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Log Out') { this.auth.logout() }
    });
  }

}
