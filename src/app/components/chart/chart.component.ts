import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../models/user';
import {Statistics} from '../../models/statistics';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  // Моя позиция
  @Input() myPosition: number = null;
  // Массив статистики
  @Input() data: Statistics[] = null;
  public chart: Statistics[] = null;
  // Флаг админка ли это
  @Input() isAdminLocation = false;
  // Триггер выбор пользователя в таблице
  @Output()
  public readonly userSelect: EventEmitter<string> = new EventEmitter();
  // Колонки для отображения
  public displayedColumns: string[] = ['counter', 'name', 'correct', 'total', 'points'];
  // id выбранного пользователя
  public activeUserId: string = null;
  // Строка поиска
  public searchTerm: string = null;


  constructor() {
  }

  ngOnInit() {
    if (this.isAdminLocation) {
      this.displayedColumns = ['name', 'correct', 'total'];
    }

    this.chart = this.data;
    if (this.isAdminLocation) {
      this.openUser(this.data[0]);
    } else {
      this.openUser(this.data[this.myPosition - 1]);
    }
  }

  onUserClick(user) {
    if (this.isAdminLocation) {
      this.openUser(user);
    }
  }

  openUser(user) {
    if (user) {
      this.activeUserId = user.userId;
      this.userSelect.emit(this.activeUserId);
    }
  }

  onSearch(searchTxt) {
    this.searchTerm = searchTxt;
    this.filterValues();
  }

  filterValues() {
    const searchTerm = this.searchTerm;

    if (searchTerm) {
      const terms_str = searchTerm.toLowerCase()
        .split(' ')
        .map(i => i.trim())
        .filter(i => i);
      this.chart = this.data.filter(
        item => terms_str.every(
          term => this.testItem(item, term)
        )
      );
    } else {
      this.chart = this.data;
    }
  }

  testItem(item: Statistics, term: string) {
    return item && (this.testString(item.user.lastName, term))
      || this.testString(item.user.middleName, term)
      || this.testString(item.user.firstName, term);
  }

  testString(value: string, term: string) {
    if (!!value) {
      return value.toString().toLowerCase().includes(term);
    }
    return false;
  }


  getFullName(person: User) {
    return person.lastName + ' ' + person.firstName + ' ' + (person.middleName ? person.middleName : '');
  }
}
