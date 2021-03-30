import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbLayoutModule,
  CORPORATE_THEME,
  COSMIC_THEME,
  DEFAULT_THEME,
  NbThemeModule,
  NbSidebarModule,
  NbMenuModule,
  NbDialogModule,
  NbWindowModule,
  NbToastrModule,
  DARK_THEME,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbCardModule,
  NbUserModule,
  NbContextMenuModule,
  NbInputModule,
  NbFormFieldModule,
  NbPopoverModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbListModule,
  NbActionsModule,
  NbSearchModule,
  NbTagModule
} from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SlugifyPipe } from "./utils/blog/slugify.pipe";
import { UrlService } from "./utils/url.service";
import { StoriesService } from "./utils/stories.service";
import { PendingChangesGuard } from "./utils/pending-changes.guard";
import { DateAgoPipe } from "./utils/blog/date-ago.pipe";
import { SettingsService } from "./utils/blog/settings.service";
import { ExtrasService } from "./utils/extras.service";

const BASE_MODULES = [ CommonModule, RouterModule, HighlightModule, CKEditorModule, ];
const NB_MODULES = [
  NbLayoutModule, NbButtonModule, NbCardModule, NbSelectModule, NbIconModule,
  NbUserModule, NbContextMenuModule, NbInputModule, FormsModule, NbFormFieldModule,
  NbPopoverModule, NbTabsetModule, NbRouteTabsetModule, NbListModule, NbActionsModule,
  NbSearchModule, NbTagModule,
];
const MAT_MODULES = []!;
const COMPONENTS = []!;
const ENTRY_COMPONENTS = []!;
const PIPES = [SlugifyPipe, DateAgoPipe];
const PROVIDERS = [
  SlugifyPipe, UrlService, StoriesService,
  PendingChangesGuard, DateAgoPipe, SettingsService,
  ExtrasService,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'default',
    },
    [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
  ).providers!,
  ...NbSidebarModule.forRoot().providers!,
  ...NbMenuModule.forRoot().providers!,
  ...NbDialogModule.forRoot().providers!,
  ...NbWindowModule.forRoot().providers!,
  ...NbToastrModule.forRoot().providers!,
];

@NgModule({
  imports: [ ...BASE_MODULES, ...NB_MODULES, ...MAT_MODULES ],
  exports: [ ...BASE_MODULES, ...NB_MODULES, ...MAT_MODULES, ...COMPONENTS, ...PIPES ],
  declarations: [ ...PIPES, ...COMPONENTS ],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return { ngModule: SharedModule, providers: [...NB_THEME_PROVIDERS, ...PROVIDERS] };
  }
}
