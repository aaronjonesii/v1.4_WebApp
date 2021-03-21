import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
  NbFormFieldModule, NbPopoverModule
} from '@nebular/theme';
import { HeaderComponent } from './layout/header/header.component';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { PostsHeroComponent } from '../pages/blog/posts-hero/posts-hero.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { HomeComponent } from '../pages/home/home.component';
import { BlogPostComponent } from '../pages/blog/blog-post/blog-post.component';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SlugifyPipe } from "./utils/blog/slugify.pipe";

const BASE_MODULES = [ CommonModule, RouterModule, HighlightModule, CKEditorModule, ];
const NB_MODULES = [
  NbLayoutModule, NbButtonModule, NbCardModule, NbSelectModule, NbIconModule,
  NbUserModule, NbContextMenuModule, NbInputModule, FormsModule, NbFormFieldModule,
  NbPopoverModule,
];
const MAT_MODULES = []!;
const COMPONENTS = []!;
const ENTRY_COMPONENTS = []!;
const PIPES = [SlugifyPipe];

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
    return { ngModule: SharedModule, providers: [...NB_THEME_PROVIDERS, SlugifyPipe] };
  }
}
