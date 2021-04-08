import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from "@nebular/theme";

@Component({
  selector: 'anon-admin-dashboard-quick-links',
  templateUrl: './admin-dashboard-quick-links.component.html',
  styleUrls: ['./admin-dashboard-quick-links.component.scss']
})
export class AdminDashboardQuickLinksComponent implements OnInit {
  QUICK_LINKS: NbMenuItem[] = [
    { title: 'Write a story', link: '/new-story', icon: 'edit-outline' },
    { title: 'Manage stories', link: '/admin/stories', icon: 'grid-outline' },
    { title: 'Development Links', group: true },
    { title: 'Atlassian', url: 'https://anonsys.atlassian.net', icon: 'cube-outline', target: '_blank' },
    { title: 'Angular', url: 'https://angular.io', icon: 'layers-outline', target: '_blank' },
    { title: 'Auth0', url: 'https://manage.auth0.com', icon: 'shield-outline', target: '_blank' },
    { title: 'Backend', url: 'https://api.anonsys.tech/admin', icon: 'hard-drive-outline', target: '_blank' },
    { title: 'Bootstrap', url: 'https://getbootstrap.com/docs/4.4/layout/overview/', icon: 'browser-outline', target: '_blank' },
    { title: 'Github', url: 'https://github.com/aaronjonesii', icon: 'github-outline', target: '_blank' },
    { title: 'Nebular', url: 'https://akveo.github.io/nebular/docs/components/components-overview', icon: 'external-link-outline', target: '_blank' },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
