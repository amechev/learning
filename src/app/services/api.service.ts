import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Права
  isAdmin$ = new BehaviorSubject(false);
  // Обновление статистика пользователя
  userStatisticsUpdate$ = new BehaviorSubject(null);
  // Обновление вопросов для пользователя
  learningUpdate$ = new BehaviorSubject(null);

  constructor(
    readonly http: HttpClient,
    public config: ConfigService
  ) {
  }

  authorize(options: {
    headers?: HttpHeaders,
    params?: HttpParams
  } = {}) {
    if (!options.headers) {
      options.headers = new HttpHeaders();
    }
    const auth = this.config.platformApiKey;
    if (auth) {
      options.headers = options.headers.set('Authorization', auth);
    }
    return options;
  }

  getThemes() {
    return this.http.get(
      `${this.config.themesUrl}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  createTheme(params) {
    return this.http.post(
      `${this.config.themesUrl}`,
      params,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  editTheme(params, themeId) {
    return this.http.put(
      `${this.config.themesUrl}${themeId}`,
      params,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  deleteTheme(themeId) {
    return this.http.delete(
      `${this.config.themesUrl}${themeId}`,
      this.authorize()
    ).pipe(
      map(res => res)
    );
  }

  getQuestions() {
    return this.http.get(
      `${this.config.questionsUrl}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  sendAnswer(questionId, answerId) {
    return this.http.put(
      `${this.config.userQuestions}${questionId}`,
      {answer_option: answerId},
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getUserQuestions(startTime, endTime) {
    return this.http.get(
      `${this.config.userQuestions}?date_from=${startTime}&date_to=${endTime}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  createQuestion(params) {
    return this.http.post(
      `${this.config.questionUrl}`,
      params,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  editQuestion(params, questionId) {
    return this.http.put(
      `${this.config.questionUrl}${questionId}`,
      params,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  deleteQuestion(questionId) {
    return this.http.delete(
      `${this.config.questionUrl}${questionId}`,
      this.authorize()
    ).pipe(
      map(res => res)
    );
  }

  getQuestionsByThemeId(themeId) {
    return this.http.get(
      `${this.config.questionsUrl}${themeId}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getUsersStatistic(dateFrom, dateTo) {
    return this.http.get(
      `${this.config.userStatisticUrl}?date_from=${dateFrom}&date_to=${dateTo}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getStatistic() {
    return this.http.get(
      `${this.config.statisticUrl}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getStatisticByUserId(userId) {
    return this.http.get(
      `${this.config.statisticUrl}?user_id=${userId}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getStatisticByUserIdByThemeId(userId, themeId) {
    return this.http.get(
      `${this.config.statisticUrl}?user_id=${userId}&theme_id=${themeId}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getPermissions() {
    return this.http.get(
      `${this.config.permissionsUrl}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getSettings() {
    return this.http.get(
      `${this.config.settingsURL}0000000-0000000-000000000-0000000001`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  updateSettings(settings) {
    return this.http.put(
      `${this.config.settingsURL}`,
      settings,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getsettingsFrequency() {
    return this.http.get(
      `${this.config.settingsFrequencyURL}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }
}
