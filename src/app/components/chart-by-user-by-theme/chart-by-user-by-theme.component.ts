import {Component, Input, OnInit} from '@angular/core';
import {StatisticsByUserByTheme} from '../../models/statistics';

@Component({
  selector: 'app-chart-by-user-by-theme',
  templateUrl: './chart-by-user-by-theme.component.html',
  styleUrls: ['./chart-by-user-by-theme.component.scss']
})
export class ChartByUserByThemeComponent implements OnInit {

  // Массив статистики
  @Input() data: StatisticsByUserByTheme[] = null;
  // Колонки для отображения
  public displayedColumns: string[] = ['name', 'correct', 'total'];

  constructor() { }

  ngOnInit() {
  }

}
