import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {Theme} from "../../models/theme";

@Component({
  selector: 'app-theme-edit-form',
  templateUrl: './theme-edit-form.component.html',
  styleUrls: ['./theme-edit-form.component.scss']
})
export class ThemeEditFormComponent implements OnInit, OnDestroy {

  // Выбранная тема
  @Input()
  public theme: Theme = null;
  // Триггер нажатия на сабмит
  @Output()
  public readonly success: EventEmitter<any> = new EventEmitter();
  // Триггер нажатия на отмену
  @Output()
  public readonly reset = new EventEmitter();
  // Дефолтное значение для org_id
  private DEFAULT_ORG_ID = '0000000-0000000-000000000-0000000000';
  // Триггер смерти компонента
  private destroyed = new Subject<void>();
  // Модель формы редактирования заголовка темы
  public formGroupEditTheme: FormGroup;


  constructor(
  ) { }

  ngOnInit() {
    this.formGroupEditTheme = new FormGroup({
      themeName: new FormControl(this.theme.name)
    });
  }

  onSubmit() {
    if (this.formGroupEditTheme.valid) {
      const params = {
        id: this.theme.id,
        org_id: this.DEFAULT_ORG_ID,
        name: this.formGroupEditTheme.controls['themeName'].value,
        active: this.theme.isActive
      };

      this.success.emit(params);
    }
  }

  onClose() {
    this.reset.emit();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
