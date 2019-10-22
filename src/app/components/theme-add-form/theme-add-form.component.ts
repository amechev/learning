import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-theme-add-form',
  templateUrl: './theme-add-form.component.html',
  styleUrls: ['./theme-add-form.component.scss']
})
export class ThemeAddFormComponent implements OnInit, OnDestroy {

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
  // Модель формы добавления темы
  public formGroupAdd: FormGroup;

  constructor(
  ) { }

  ngOnInit() {
    this.formGroupAdd = new FormGroup({
      isActiveTheme: new FormControl(false),
      themeName: new FormControl('')
    });
  }

  onSubmit() {
    if (this.formGroupAdd.valid) {
      const params = {
        org_id: this.DEFAULT_ORG_ID,
        name: this.formGroupAdd.controls['themeName'].value,
        is_active: this.formGroupAdd.controls['isActiveTheme'].value
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
