import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { AuthService } from "@auth0/auth0-angular";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  profile_json = null;
  settingsSections = [
    {
      'header': 'Profile',
      'id': 'profile',
      'items': [
        {
          'item_name': 'Name',
          'item_key': 'name',
          'item_description': 'Your name appears on your Profile page, and in your stories. It is a required field, all stories will be updated instantly.',
        },
        {
          'item_name': 'Nickname',
          'item_key': 'nickname',
          'item_description': 'Your name appears on your Profile page, as your byline, and in your responses. It is a required field.'
        },
        {
          'item_name': 'Picture',
          'item_key': 'picture',
          'item_description': 'Your picture appears on your Profile page and with your stories.'
        },
      ]
    },
    {
      'header': 'Email settings',
      'id': 'email-settings',
      'items': [
        {
          'item_name': 'Your email',
          'item_key': 'email',
        },
      ],
    },
    {
      'header': 'Security',
      'id': 'security',
      'items': [],
    }
  ];

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
    this.auth.user$.pipe(takeUntil(this.unsub$)).subscribe(
      profile => this.profile_json = JSON.parse(JSON.stringify(profile, null, 2)),
      error => console.error(error),
      () => {},
    );
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
