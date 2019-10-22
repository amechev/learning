import {Component, OnDestroy, OnInit} from '@angular/core';
import {Theme} from '../../models/theme';
import {AnswerOption, Question} from '../../models/question';
import {ApiService} from '../../services/api.service';
import {takeUntil} from 'rxjs/operators';
import {JSON} from 'ta-json';
import {Subject} from 'rxjs';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit, OnDestroy {

  // Индикатор загрузки компонента
  public isLoaded = false;
  // Индикатор загрузки детализации/ списка вопросов темы
  public themeDetailsLoaded = true;
  // Индикатор диалога для удаления темы
  public confirmDeleteTheme = false;
  // Массив всех тем
  public themes: Theme[] = [];
  // Массив всех вопросов в теме
  public questions: Question[] = [];
  // Флаг открытия формы добавления темы
  public isNewThemeFormActive = false;
  // Флаг открытия формы для нового вопроса
  public isNewQuestionFormActive = false;
  // Флаг открытия формы редактирования темы
  public isEditThemeFormActive = false;
  // Текущая открытая тема
  public activeThemeOpened: Theme = null;
  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private api: ApiService,
    private notifierService: NotifierService,
  ) {
  }

  ngOnInit() {
    this.getThemes();
  }

  generateNewQuestion() {
    const question = new Question();
    question.theme = this.activeThemeOpened.id;
    question.answerOptions = [
      new AnswerOption(null, '', true),
      new AnswerOption(null, '', false)
    ];
    return question;
  }

  openThemeDetails(item: Theme) {
    this.onCloseEditThemeForm();
    this.onCloseNewThemeForm();
    this.onCloseQuestionForm();
    this.activeThemeOpened = item;
    this.getQuestions();
  }

  onThemeStatusChange(theme: Theme, evt) {
    theme.isActive = evt.checked;

    this.updateTheme(theme);
  }

  onOpenEditThemeForm() {
    this.isEditThemeFormActive = true;
  }

  onOpenDeleteTHeme() {
    this.confirmDeleteTheme = true;
  }

  onOpenQuestionForm() {
    this.isNewQuestionFormActive = true;
  }

  onCloseQuestionForm() {
    this.isNewQuestionFormActive = false;
  }

  onCloseEditThemeForm() {
    this.isEditThemeFormActive = false;
  }

  onOpenNewThemeForm() {
    this.isNewThemeFormActive = true;
  }

  onCloseNewThemeForm() {
    this.isNewThemeFormActive = false;
  }

  getThemes() {
    this.api.getThemes()
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        this.themes = JSON.deserialize<Theme[]>(res, Theme);
        if (this.themes.length) {
          this.openThemeDetails(this.themes[0]);
        }
        this.isLoaded = true;
      }, (err) => {
        this.handleError(err.error.message);
        this.isLoaded = true;
      });
  }

  getQuestions() {
    this.themeDetailsLoaded = false;
    this.api.getQuestionsByThemeId(this.activeThemeOpened.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        if (res) {
          this.questions = JSON.deserialize<Question[]>(res, Question);
          this.themeDetailsLoaded = true;
        }
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  addNewTheme(theme: Theme) {
    this.api.createTheme(theme)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        if (res) {
          const newTheme = JSON.deserialize<Theme>(res, Theme);
          this.themes.push(newTheme);
          this.isNewThemeFormActive = false;
        }
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  deleteTheme(theme: Theme) {
    this.api.deleteTheme(theme.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(params => {
        this.themes = this.themes.filter(el => el.id !== this.activeThemeOpened.id);
        this.activeThemeOpened = null;
        this.questions = null;
        this.confirmDeleteTheme = false;
      }, (err) => {
        this.handleError(err.error.message);
        this.confirmDeleteTheme = false;
      });
  }

  updateTheme(theme: Theme) {
    this.api.editTheme(JSON.serialize(theme), theme.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(params => {
        const updated = JSON.deserialize<Theme>(params, Theme);
        const index = this.themes.findIndex(el => el.id === updated.id);
        if (this.activeThemeOpened && updated.id === this.activeThemeOpened.id) {
          this.themes[index] = updated;
          this.activeThemeOpened = updated;
          this.isEditThemeFormActive = false;
        }
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  deleteQuestion(deletedId: string) {
    this.questions = this.questions.filter(el => el.id !== deletedId);
  }

  updateQuestion(editedQuestion: Question) {
    const index = this.questions.indexOf(this.questions.find(el => el.id === editedQuestion.id));
    this.questions[index] = editedQuestion;
  }

  createQuestion(newQuestion: Question) {
    this.isNewQuestionFormActive = false;
    this.questions.push(newQuestion);
  }

  isToolbarVisible() {
    return !this.isNewThemeFormActive;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  handleError(errMsg: string) {
    if (errMsg) {
      this.notifierService.notify('error', errMsg);
    }
  }
}
