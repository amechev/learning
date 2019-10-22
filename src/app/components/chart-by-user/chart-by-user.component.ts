import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StatisticsByUserByTheme} from '../../models/statistics';

@Component({
  selector: 'app-chart-by-user',
  templateUrl: './chart-by-user.component.html',
  styleUrls: ['./chart-by-user.component.scss']
})
export class ChartByUserComponent implements OnInit {

  // Массив статистики
  @Input() data: StatisticsByUserByTheme[] = null;
  @Output()
  public readonly themeSelect: EventEmitter<string> = new EventEmitter();
  // Колонки для отображения
  public displayedColumns: string[] = ['name', 'correct', 'total'];
  // id выбранного пользователя
  public activeThemeId: string = null;

  constructor() { }

  ngOnInit() {
    this.onOpenTheme(this.data[0]);
  }


  onOpenTheme(theme) {
    this.activeThemeId = theme.id;
    this.themeSelect.emit(this.activeThemeId);
  }

}
