import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AnswerOption, Question} from '../../models/question';
import {ApiService} from '../../services/api.service';
import {NotifierService} from 'angular-notifier';
import {takeUntil} from 'rxjs/operators';
import {JSON} from 'ta-json';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-question-setup',
  templateUrl: './question-setup.component.html',
  styleUrls: ['./question-setup.component.scss']
})
export class QuestionSetupComponent implements OnInit, OnDestroy {

  // Данные вопроса
  @Input() question: Question = null;
  // Флаг режима редактирования
  @Input() isEdit = false;
  // Триггер закрытия режима редактирования
  @Output()
  public readonly closeForm = new EventEmitter();
  // Триггер сохранения редактирования вопроса
  @Output()
  public readonly update: EventEmitter<Question> = new EventEmitter();
  // Триггер сохранения создания вопроса
  @Output()
  public readonly create: EventEmitter<Question> = new EventEmitter();
  // Триггер удаления вопроса
  @Output()
  public readonly delete: EventEmitter<string> = new EventEmitter();
  // Флаг новый ли это вопрос или редактирование
  public isNewQuestion = false;
  // Состояниие - развернута ли карточка вопроса
  public panelOpenState = false;
  // Флаг - диалог удаления вопроса
  public confirmDeleteQuestion = false;
  // Модель формы редактирования вопроса
  public formGroup: FormGroup;
  // константы плэйсхолдеров
  public INPUT_PLACEHOLDER_CORRECT = 'Введите правильный ответ';
  public INPUT_PLACEHOLDER_WRONG = 'Введите неправильный ответ';
  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private notifierService: NotifierService
  ) {
  }

  get formControl() {
    return this.formGroup.controls;
  }

  get formAnswers() {
    return this.formControl.answers as FormArray;
  }

  ngOnInit() {
    this.question.answerOptions = this.question.answerOptions.sort((a, b) => {
      return (+(b.correctAnswer) - +(a.correctAnswer));
    });

    if (this.isEdit) {
      this.isNewQuestion = true;
      this.initForms();
    }
  }

  initForms() {
    this.formGroup = this.formBuilder.group({
      isActiveQuestion: new FormControl(this.question.isActive),
      themeName: new FormControl(this.question.themeName),
      questionTitle: new FormControl(this.question.name),
      answers: new FormArray([]),
      description: new FormControl(this.question.description)
    });

    for (let i = 0; i < this.question.answerOptions.length; i++) {
      this.formAnswers.push(this.formBuilder.group({
        answer: new FormControl(this.question.answerOptions[i].name)
      }));
    }
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.handleError('Заполните все поля');
      return;
    }

    if (this.isNewQuestion) {
      const params = {
        theme: this.question.theme,
        name: this.formGroup.controls['questionTitle'].value,
        description: this.formGroup.controls['description'].value,
        is_active: this.formGroup.controls['isActiveQuestion'].value || false,
        answers_options: this.prepareOptions()
      };
      this.createQuestion(params);
    } else {
      const params = {
        id: this.question.id,
        theme: this.question.theme,
        name: this.formGroup.controls['questionTitle'].value,
        description: this.formGroup.controls['description'].value,
        is_active: this.formGroup.controls['isActiveQuestion'].value,
        answers_options: this.prepareOptions()
      };
      this.updateQuestion(params);
    }
  }

  createQuestion(params) {
    this.api.createQuestion(params)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        if (res) {
          const newItem = JSON.deserialize<Question>(res, Question);
          this.create.emit(newItem);
        }
      }, (err) => {
        this.handleError(err.error.message)
      });
  }

  updateQuestion(params) {
    this.api.editQuestion(params, this.question.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        if (res) {
          const newItem = JSON.deserialize<Question>(res, Question);
          this.isEdit = false;
          this.update.emit(newItem);
        }
      }, (err) => {
        this.handleError(err.error.message)
      });
  }

  deleteQuestion() {
    this.api.deleteQuestion(this.question.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(params => {
        this.delete.emit(this.question.id);
      }, (err) => {
        this.handleError(err.error.message)
      });
    this.confirmDeleteQuestion = false;
  }

  prepareOptions() {
    const options = [];
    for (let i = 0; i < this.formGroup.controls['answers'].value.length; i++) {
      options.push(new AnswerOption(
        (this.question.answerOptions[i] && this.question.answerOptions[i].id) ? this.question.answerOptions[i].id : null,
        this.formGroup.controls['answers'].value[i].answer,
        i === 0
      ));
    }
    return JSON.serialize(options);
  }

  removeAnswer(index: number) {
    this.question.answerOptions = this.question.answerOptions.slice(index, 1);
    this.formAnswers.removeAt(index);
  }

  addAnswer() {
    this.question.answerOptions.push(new AnswerOption());
    this.formAnswers.push(this.formBuilder.group({
      answer: new FormControl('')
    }));
  }

  onClickEditQuestion(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isEdit = true;
    this.initForms();
  }

  onClickRemoveQuestion(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.confirmDeleteQuestion = true;
  }

  onQuestonStatusChange(evt) {
    this.question.isActive = evt.checked;
    this.updateQuestion(JSON.serialize(this.question));
  }

  answerPlaceholder(index: number) {
    return index === 0 ? this.INPUT_PLACEHOLDER_CORRECT : this.INPUT_PLACEHOLDER_WRONG;
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
