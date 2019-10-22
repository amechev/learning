import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AnswerOption} from '../../models/question';
import {Testing} from '../../models/testing';
import {takeUntil} from 'rxjs/operators';
import {JSON} from 'ta-json';
import {Subject} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {

  // Данные задачи тестирования
  @Input() data: Testing = null;
  // Флаг первый ли это элемент в списке задач
  @Input() isFirst = false;
  // Состояниие - развернута ли карточка вопроса
  public panelOpenState = false;
  // @Input() question = new EventEmitter<Question>();
  @Output() sendAnswer = new EventEmitter<Testing>();
  // Индикатор заблокированного вопроса
  public isDisabled = false;
  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private api: ApiService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit() {
  }

  isCorrect(item: AnswerOption) {
    return item.id === this.data.correctAnswer && !this.data.current;
  }

  isWrong(item: AnswerOption) {
    return item.id === this.data.answerOption && this.data.answerOption !== this.data.correctAnswer && !this.data.current;
  }

  select(item) {
    this.isDisabled = true;
    this.api.sendAnswer(this.data.id, item.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        const updated = JSON.deserialize<Testing>(res, Testing);
        this.sendAnswer.emit(updated);
        this.isDisabled = false;
      }, (err) => {
        this.handleError(err.error.message);
        this.isDisabled = false;
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
