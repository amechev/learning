import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {takeUntil} from 'rxjs/operators';
import {ApiService} from './services/api.service';
import {NotifierService} from 'angular-notifier';
import {combineLatest, Subject, Subscription} from 'rxjs';
import {WebSocketConfig, WebsocketService} from './services/websocket.service';
import {ConfigService} from './services/config.service';
import {environment} from '../environments/environment';
import {Frequency, Settings} from './models/settings';
import {JSON} from 'ta-json';

/** Конфигурация веб сокета */
export const messageConfig: WebSocketConfig = {
  url: environment.wsUrl,
  reconnectInterval: 5000,
  reconnectAttempts: 3,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    WebsocketService,
    {provide: 'config', useValue: messageConfig}
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  // Состояние админ ли это
  public isAdmin = false;
  // Триггер загрузки
  public isLoaded = false;
  // Триггер открытия настроек админа
  public isSettingsOpen = false;
  // Триггер смерти компонента
  private destroyed = new Subject<void>();
  // Подписки в сокетах
  private wsSubscriptions: Subscription[] = [];
  // Модель настроект для админа
  public settings: Settings = null;
  public frequencyOptions: Frequency[] = null;

  constructor(
    private api: ApiService,
    private notifierService: NotifierService,
    private configService: ConfigService,
    private wsService: WebsocketService,
  ) {
  }

  ngOnInit() {
    moment.lang('ru');

    this.getPermissions();

    combineLatest(this.api.isAdmin$, this.wsService.status)
      .pipe(takeUntil(this.destroyed))
      .subscribe(([curUser, status]) => {
        if (status) {
          this.subscribeWsChanges();
        } else {
          this.wsSubscriptions.forEach(s => s.unsubscribe());
          this.wsSubscriptions.splice(0, this.wsSubscriptions.length);
        }
      });
  }

  subscribeWsChanges() {
    this.wsSubscriptions.push(
      this.wsService.on<any>('learning_statistic_update')
        .pipe(takeUntil(this.destroyed))
        .subscribe((res) => {
          this.api.userStatisticsUpdate$.next(true);
        }));

    this.wsSubscriptions.push(
      this.wsService.on<any>('learning_question_update')
        .pipe(takeUntil(this.destroyed))
        .subscribe((res) => {
          this.api.learningUpdate$.next(true);
        }));
  }

  getPermissions() {
    this.api.getPermissions()
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        this.isAdmin = res.is_admin;
        this.api.isAdmin$.next(this.isAdmin);
        if (this.isAdmin) {
          this.getSettings();
        }
        this.isLoaded = true;
      }, (err) => {
        this.handleError(err.error.message)
      });
  }

  getSettings() {
    this.api.getSettings()
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        this.settings = JSON.deserialize<Settings>(res, Settings);
      }, (err) => {
        this.handleError(err.error.message)
      });

    this.api.getsettingsFrequency()
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        this.frequencyOptions = JSON.deserialize<Frequency[]>(res, Frequency);
      }, (err) => {
        this.handleError(err.error.message)
      });
  }

  onSettingsUpdate(params) {
    this.settings = params;
  }

  onSettingsOpen() {
    this.isSettingsOpen = true;
  }

  onSettingsClose() {
    this.isSettingsOpen = false;
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
