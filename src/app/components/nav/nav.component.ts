import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
