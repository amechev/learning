import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {JSON} from 'ta-json';
import {Testing} from '../../models/testing';
import {MyResult, Statistics} from '../../models/statistics';
import * as moment from 'moment';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {

  // Массив списка задач
  public testing: Testing[] = null;
  // Мой результат
  public myStat: MyResult = null;
  // Массив статистики
  public statistics: Statistics[] = null;
  // Начальный день
  public startDay = null;
  // День на чала недели
  public dateFrom: string = null;
  // ЗАголовок начала недели
  public dateFromTxt: string = null;
  // День конца недели
  public dateTill: string = null;
  // Заголовок конца недели
  public dateTillTxt: string = null;
  // Вывод не всей статистики
  public isStatisticsShort = true;
  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private api: ApiService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.getQuestions();
    this.startDay = moment().utc();
    this.getDate(this.startDay);

    this.api.userStatisticsUpdate$
      .pipe(takeUntil(this.destroyed))
      .subscribe(item => {
        if (item) {
          this.getStatistic();
          this.api.userStatisticsUpdate$.next(false);
        }
      }, (err) => {
        this.handleError(err.error.message);
      });

    this.api.learningUpdate$
      .pipe(takeUntil(this.destroyed))
      .subscribe(item => {
        if (item) {
          this.getQuestions();
          this.api.learningUpdate$.next(false);
        }
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  getDate(day) {
    day.utc();
    this.dateFromTxt = day.startOf('week').format('DD');
    this.dateTillTxt = day.endOf('week').format('DD MMM YYYY');
    this.dateFrom = day.startOf('week').local().format('YYYY-MM-DD HH:mm');
    day.utc();
    this.dateTill = day.endOf('week').local().format('YYYY-MM-DD HH:mm');
    this.getStatistic();
  }

  nextWeek() {
    this.startDay = this.startDay.add(1, 'weeks');
    this.getDate(this.startDay);
  }

  prevWeek() {
    this.startDay = this.startDay.subtract(1, 'weeks');
    this.getDate(this.startDay);
  }

  getQuestions() {
    this.api.getUserQuestions(
      moment().startOf('day').utc().format('YYYY-MM-DD HH:mm'),
      moment().endOf('day').utc().format('YYYY-MM-DD HH:mm')
    )
      .pipe(takeUntil(this.destroyed))
      .subscribe(params => {
        this.testing = JSON.deserialize<Testing[]>(params, Testing).sort((a, b) => {
          return (+(b.current) - +(a.current));
        });

      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  getStatistic() {
    this.isStatisticsShort = true;
    this.api.getUsersStatistic(this.dateFrom, this.dateTill)
      .pipe(takeUntil(this.destroyed))
      .subscribe(params => {
        this.myStat = JSON.deserialize<MyResult>(params.my_data, MyResult);
        this.statistics = JSON.deserialize<Statistics[]>(params.data, Statistics);
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  updateTesting(updated: Testing) {
    const index = this.testing.findIndex(el => el.id === updated.id);
    this.testing[index].current = updated.current;
    this.testing[index].answerOption = updated.answerOption;
    this.testing[index].correctAnswer = updated.correctAnswer;
    this.testing[index].question.description = updated.question.description;
    this.testing[index].points = updated.points;
  }

  loadAllStatistics() {
    this.isStatisticsShort = false;
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
