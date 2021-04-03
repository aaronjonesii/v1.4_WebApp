import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProfileSettingsService } from "../../../../../shared/utils/services/profile-settings.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthService } from "@auth0/auth0-angular";
import { ExtrasService } from "../../../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-profile-settings-section-item',
  templateUrl: './profile-settings-section-item.component.html',
  styleUrls: ['./profile-settings-section-item.component.scss']
})
export class ProfileSettingsSectionItemComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() user: any;
  @Input() fieldName: any;
  @Input() fieldDescription: any;
  @Input() item_key: string = '';
  @ViewChild('editButtonBtn') editButtonBtn: ElementRef = <ElementRef>{};
  @ViewChild('buttonsSpan') buttonsSpan: ElementRef = <ElementRef>{};
  @ViewChild('fieldInput') fieldInput: ElementRef = <ElementRef>{};
  canEdit: boolean = false;
  fieldSnapshot = '';

  constructor(
    private settingsService: ProfileSettingsService,
    private auth: AuthService,
    private extras: ExtrasService,
  ) { }

  ngOnInit() { }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  public editButton() {
    this.fieldSnapshot = this.user[this.item_key]
    // Hide Edit Button
    this.editButtonBtn.nativeElement.classList.toggle('hide-element');
    // Show buttonSet
    this.buttonsSpan.nativeElement.classList.toggle('show-element');
    // Enable editing for field
    this.canEdit = true;
    // Put editing field in focus
    setTimeout(() => this.fieldInput.nativeElement.focus(), 0);
  };
  public saveButton() {
    // Check is field was changed
    if (this.fieldSnapshot != this.user[this.item_key]) {
      // Send update to API if changed
      let user_update = { [this.item_key]: this.user[this.item_key] };
      this.updateUser(user_update);
    }
    // ReHide buttonSet by removing show-element class
    this.buttonsSpan.nativeElement.classList.toggle('show-element');
    // Show Edit Button by removing hide-element class
    this.editButtonBtn.nativeElement.classList.toggle('hide-element');
    // Disable editing for field
    this.canEdit = false;
  };
  public cancelButton() {
    // Reset field
    this.user[this.item_key] = this.fieldSnapshot;
    // ReHide buttonSet by removing show-element class
    this.buttonsSpan.nativeElement.classList.toggle('show-element');
    // Show Edit Button by removing hide-element class
    this.editButtonBtn.nativeElement.classList.toggle('hide-element');
    // Disable editing for field
    this.canEdit = false;
  };

  updateUser(user_update: any) {
    this.settingsService.updateAuth0User(user_update).pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      user => this.extras.showToast(`${this.fieldName} was successfully updated.`, 'Success', 'success'), // TODO: Need to update user infor with new user dictionary
      error => {
        this.extras.showToast(JSON.stringify(error.error), '[!] Error [!]', 'danger');
        // Reset field
        this.user[this.item_key] = this.fieldSnapshot;
      },
      () => {},
    );
  }

}
