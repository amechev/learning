import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {LOCALE_ID} from '@angular/core';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {ConfirmComponent} from './components/confirm/confirm.component';
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatDialogModule, MatDividerModule, MatExpansionModule,
  MatIconModule,
  MatInputModule, MatProgressSpinnerModule,
  MatSelectModule, MatSortModule,
  MatTableModule, MatTabsModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TrainingComponent} from './pages/training/training.component';
import {QuestionComponent} from './components/question/question.component';
import {AutoFocusDirective} from './utils/auto-focus.directive';
import {ChartComponent} from './components/chart/chart.component';
import {NavComponent} from './components/nav/nav.component';
import {UsersComponent} from './pages/users/users.component';
import {ThemesComponent} from './pages/themes/themes.component';
import {SettingsComponent} from './components/settings/settings.component';
import {ReactiveFormsModule} from '@angular/forms';
import {QuestionSetupComponent} from './components/question-setup/question-setup.component';
import {HttpClientModule} from '@angular/common/http';
import {ThemeAddFormComponent} from './components/theme-add-form/theme-add-form.component';
import {ThemeEditFormComponent} from './components/theme-edit-form/theme-edit-form.component';
import {ChartByUserComponent} from './components/chart-by-user/chart-by-user.component';
import {ChartByUserByThemeComponent} from './components/chart-by-user-by-theme/chart-by-user-by-theme.component';
import { SearchComponent } from './components/search/search.component';
import { HighlightPipe } from './utils/highlight.pipe';

registerLocaleData(localeRu, 'ru');
/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    }
  }
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    ConfirmComponent,
    SpinnerComponent,
    ChartComponent,
    TrainingComponent,
    QuestionComponent,
    AutoFocusDirective,
    NavComponent,
    UsersComponent,
    ThemesComponent,
    SettingsComponent,
    QuestionSetupComponent,
    ThemeAddFormComponent,
    ThemeEditFormComponent,
    ChartByUserComponent,
    ChartByUserByThemeComponent,
    SearchComponent,
    HighlightPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NotifierModule.withConfig(customNotifierOptions),
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
