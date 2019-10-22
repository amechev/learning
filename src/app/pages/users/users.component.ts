import {Component, OnDestroy, OnInit} from '@angular/core';
import {Statistics, StatisticsByUser, StatisticsByUserByTheme} from '../../models/statistics';
import {Subject} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {NotifierService} from 'angular-notifier';
import {takeUntil} from 'rxjs/operators';
import {JSON} from 'ta-json';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  // Массив статистики
  public statistics: Statistics[] = null;
  // Массив статистики
  public statisticsByUser: StatisticsByUser[] = null;
  // Массив статистики
  public statisticsByUserByTheme: StatisticsByUserByTheme[] = null;
  // Выбранный пользователь
  public userSelectedId = null;
  // Выбранная тема
  public themeSelectedId = null;
  // Флаг загрузки тем
  public isThemesLoading = true;
  // Флаг загрузки вопросов
  public isQuestionsLoading = true;
  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private api: ApiService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.getStatistic();
  }

  onUserSelect(userId) {
    this.userSelectedId = userId;
    this.getStatisticByUserId(userId);
  }

  onThemeSelect(themeId) {
    this.themeSelectedId = themeId;
    this.getStatisticByUserIdByThemeId(this.userSelectedId, themeId);
  }

  getStatistic() {
    this.api.getStatistic()
      .pipe(takeUntil(this.destroyed))
      .subscribe(params => {
        this.statistics = JSON.deserialize<Statistics[]>(params, Statistics);
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  getStatisticByUserId(userId) {
    this.isThemesLoading = true;
    this.api.getStatisticByUserId(userId)
      .pipe(takeUntil(this.destroyed))
      .subscribe(params => {
        this.statisticsByUser = JSON.deserialize<StatisticsByUser[]>(params, StatisticsByUser);

        if (this.themeSelectedId) {
          this.getStatisticByUserIdByThemeId(this.userSelectedId, this.themeSelectedId);
        }
        this.isThemesLoading = false;
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  getStatisticByUserIdByThemeId(userId, themeId) {
    this.isQuestionsLoading = true;
    this.api.getStatisticByUserIdByThemeId(userId, themeId)
      .pipe(takeUntil(this.destroyed))
      .subscribe(params => {
        this.statisticsByUserByTheme = JSON.deserialize<StatisticsByUserByTheme[]>(params, StatisticsByUserByTheme);
        this.isQuestionsLoading = false;
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  handleError(errMsg) {
    if (errMsg) {
      this.notifierService.notify('error', errMsg);
    }
  }

}
