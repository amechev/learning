import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Frequency, Settings} from '../../models/settings';
import {NotifierService} from 'angular-notifier';
import {takeUntil} from 'rxjs/operators';
import {JSON} from 'ta-json';
import {Subject} from 'rxjs';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  // Флаг открыты ли настройки
  public isSettingsOpen = false;
  // Модель формы редактирования вопроса
  public formGroup: FormGroup;
  // Данные формы
  @Input()
  public readonly data: Settings = null;
  // Диапазоны рассылки
  @Input()
  public readonly frequencyOptions: Frequency[] = null;
  // Триггер сохранения
  @Output()
  public readonly update = new EventEmitter();
  // Триггер открытия
  @Output()
  public readonly open = new EventEmitter();
  // Триггер Закрытия
  @Output()
  public readonly close = new EventEmitter();
  // Триггер смерти компонента
  private destroyed = new Subject<void>();
  // Подтверждение закрытия диалог
  public confirmClose = false;
  // Дни недели
  public DAYSINWEEK = [
    'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'
  ];


  constructor(
    private notifierService: NotifierService,
    private api: ApiService,
  ) {
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.handleError('Заполните все поля');
      return;
    }

    const week = this.formGroup.controls['days'].value;
    for (let i = 0; i < week.length; i++) {
      week[i] = week[i] ? 1 : 0;
    }

    const params = {
      repeat_counter: this.formGroup.controls['inputCounts'].value,
      points_correct: this.formGroup.controls['inputCorrect'].value,
      points_empty: this.formGroup.controls['inputLost'].value,
      points_fail: this.formGroup.controls['inputWrong'].value,
      frequency: this.formGroup.controls['selectFrequency'].value,
      start_time: this.formGroup.controls['inputFromTime'].value,
      end_time: this.formGroup.controls['inputTillTime'].value,
      week: week.join('')
    };

    this.udateSettings(params);
  }

  udateSettings(params) {
    this.api.updateSettings(params)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        const settings = JSON.deserialize<Settings>(res, Settings);
        this.update.emit(settings);
        this.closeForm();
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  onOpenSettings() {
    this.isSettingsOpen = true;
    this.open.emit(true);

    const week = [];
    for (let i = 0; i < this.data.week.length; i++) {
      week.push(new FormControl(+(this.data.week.charAt(i))));
    }

    this.formGroup = new FormGroup({
      inputCounts: new FormControl(this.data.repeatCounter),
      inputCorrect: new FormControl(this.data.pointsCorrect),
      inputWrong: new FormControl(this.data.pointsFail),
      inputLost: new FormControl(this.data.pointsEmpty),
      inputFromTime: new FormControl(this.data.startTime),
      inputTillTime: new FormControl(this.data.endTime),
      selectFrequency: new FormControl(this.data.idFrequency),
      days: new FormArray(week)
    });
  }

  onCloseSettings() {
    if (this.formGroup.dirty && this.formGroup.touched) {
      this.confirmClose = true;
      return false;
    }

    this.closeForm();
  }

  closeForm() {
    this.isSettingsOpen = false;
    this.close.emit(true);
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
