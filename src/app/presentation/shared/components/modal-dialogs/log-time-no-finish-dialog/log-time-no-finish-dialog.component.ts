import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ILoggedTimeData } from '../log-time-and-finish-dialog/log-time-and-finish-dialog.component';

@Component({
  selector: 'ff-log-time-no-finish-dialog',
  templateUrl: './log-time-no-finish-dialog.component.html',
  styleUrls: ['./log-time-no-finish-dialog.component.scss']
})
export class LogTimeNoFinishDialogComponent implements OnInit {

  public loggedTime: string;
  public comment: string;

  @Input() public isUserDrafter: boolean;

  @Output() public onlyLogTimeEvent: EventEmitter<ILoggedTimeData> = new EventEmitter();
  @Output() public logTimeAndAssignEvent: EventEmitter<ILoggedTimeData> = new EventEmitter();
  @Output() public logTimeAndUnassignEvent: EventEmitter<ILoggedTimeData> = new EventEmitter();

  constructor(
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public onlyLogTime(): void {

    const loggedData: ILoggedTimeData = {
      time: this.loggedTime,
      completeOrder: false,
      unassignOrder: false,
      comment: this.comment
    };

    this.onlyLogTimeEvent.emit(loggedData);
  }

  public logTimeAndAssign(): void {

    const loggedData: ILoggedTimeData = {
      time: this.loggedTime,
      completeOrder: false,
      unassignOrder: false,
      comment: this.comment
    };

    this.logTimeAndAssignEvent.emit(loggedData);
  }

  public logTimeAndUnassign(): void {

    const loggedData: ILoggedTimeData = {
      time: this.loggedTime,
      completeOrder: false,
      unassignOrder: true,
      comment: this.comment
    };

    this.logTimeAndUnassignEvent.emit(loggedData);
  }

  public closeModal(): void {
    this.matDialog.closeAll();
  }
}
