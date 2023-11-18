import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export interface ILoggedTimeData {
  time: string;
  comment?: string;
  completeOrder?: boolean;
  unassignOrder?: boolean;
}

@Component({
  selector: 'ff-log-time-and-finish-dialog',
  templateUrl: './log-time-and-finish-dialog.component.html',
  styleUrls: ['./log-time-and-finish-dialog.component.scss']
})
export class LogTimeAndFinishDialogComponent implements OnInit {

  public loggedTime: string;

  @Output() public logTimeEvent: EventEmitter<ILoggedTimeData> = new EventEmitter();

  constructor(
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public sendLoggedTime(): void {

    const loggedData: ILoggedTimeData = {
      time: this.loggedTime,
      completeOrder: true
    };

    this.logTimeEvent.emit(loggedData);
  }

  public closeModal(): void {
    this.matDialog.closeAll();
  }
}
