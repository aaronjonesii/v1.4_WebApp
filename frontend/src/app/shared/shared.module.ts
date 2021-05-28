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
  NbTagModule,
  NbAutocompleteModule,
  NbToggleModule,
  NbAccordionModule,
  NbAlertModule,
  NbTooltipModule,
  NbStepperModule,
  NbDatepickerModule, NbTimepickerModule, NbButtonGroupModule, NbCheckboxModule
} from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SlugifyPipe } from "./utils/pipes/slugify.pipe";
import { UrlService } from "./utils/services/url.service";
import { StoriesService } from "./utils/services/stories.service";
import { PendingChangesGuard } from "./utils/pending-changes.guard";
import { DateAgoPipe } from "./utils/pipes/date-ago.pipe";
import { ProfileSettingsService } from "./utils/services/profile-settings.service";
import { ExtrasService } from "./utils/services/extras.service";
import { FrontendAdminGuard } from "./utils/frontend-admin.guard";
import { FilmImagePipe } from "./utils/pipes/film-image.pipe";
import { FilmMovieLinkPipe } from "./utils/pipes/film-movie-link.pipe";
import { BSCTokenSocialsPipe } from "./utils/pipes/bsctoken-socials.pipe";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { CryptoTokenPricePipe } from "./utils/pipes/cryptotokenprice.pipe";


const BASE_MODULES = [ CommonModule, RouterModule, HighlightModule, CKEditorModule ];
const NB_MODULES = [
  NbLayoutModule, NbButtonModule, NbCardModule, NbSelectModule, NbIconModule,
  NbUserModule, NbContextMenuModule, NbInputModule, FormsModule, NbFormFieldModule,
  NbPopoverModule, NbTabsetModule, NbRouteTabsetModule, NbListModule, NbActionsModule,
  NbSearchModule, NbTagModule, NbAutocompleteModule, NbSidebarModule, NbToggleModule,
  NbAccordionModule, NbAlertModule, NbTooltipModule, NbStepperModule, NbDatepickerModule,
  NbTimepickerModule, NbButtonGroupModule, NbCheckboxModule,
];
const MAT_MODULES = [ClipboardModule];
const COMPONENTS = []!;
const ENTRY_COMPONENTS = []!;
const PIPES = [SlugifyPipe, DateAgoPipe, FilmImagePipe, FilmMovieLinkPipe, BSCTokenSocialsPipe, CryptoTokenPricePipe,];
const SERVICES = [
  UrlService, StoriesService, ProfileSettingsService,
  ExtrasService,
];
const GUARDS = [
  PendingChangesGuard, FrontendAdminGuard,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'default',
    },
    [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
  ).providers!,
  ...NbSidebarModule.forRoot().providers!,
  ...NbDialogModule.forRoot().providers!,
  ...NbWindowModule.forRoot().providers!,
];

const PROVIDERS = [
  ...NB_THEME_PROVIDERS, ...SERVICES, ...PIPES, ...GUARDS,
];

@NgModule({
  imports: [ ...BASE_MODULES, ...NB_MODULES, ...MAT_MODULES ],
  exports: [...BASE_MODULES, ...NB_MODULES, ...MAT_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [ ...PIPES, ...COMPONENTS ],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return { ngModule: SharedModule, providers: [...PROVIDERS] };
  }
}
