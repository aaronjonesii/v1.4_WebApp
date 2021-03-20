import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'anon-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  context_items = [
    { title: 'Profile', link: '/profile' },
    { title: 'Log Out' }
  ];

  constructor(
    public auth: AuthService,
    private menuService: NbMenuService
    ) { }

  ngOnInit(): void {
    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Log Out') { this.auth.logout() }
    });
  }

}
