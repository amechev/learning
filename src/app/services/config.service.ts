import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  /** API URL для получения списка вопросов **/
  readonly questionsUrl = environment.questionsUrl;
  /** API URL одного вопроса для админа **/
  readonly questionUrl = environment.questionUrl;
  /** API URL для получения вопросов для пользователя **/
  readonly userQuestions = environment.userQuestionsUrl;
  /** API URL для получения статистики **/
  readonly statisticUrl = environment.statisticUrl;
  /** API URL для получения статистики для пользователей**/
  readonly userStatisticUrl = environment.userStatisticUrl;
  /** API URL для получения списка тем **/
  readonly themesUrl = environment.themesUrl;
  /** API URL для получения прав **/
  readonly permissionsUrl = environment.permissionsUrl;
  /** API URL для получения настроек рассылки **/
  readonly settingsURL = environment.settingsUrl;
  /** API URL для получения настроек рассылки **/
  readonly settingsFrequencyURL = environment.settingsFrequencyURL;


  private key: string;

  constructor() {
  }

  /**
   * Возвращает ApiKey
   * @return key string
   */
  get platformApiKey() {
    if (this.key) {
      return this.key;
    } else {
      let apiKey = '';
      if (window.location.search) {
        const queryParams = new URLSearchParams(window.location.search);
        apiKey = queryParams.get('api_key');
      }
      this.setApiKey(apiKey);
      return apiKey;
    }
  }

  /**
   * Задать ApiKey
   * @params string key
   */
  setApiKey(key) {
    this.key = key;
  }
}
