import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { doAsyncTask } from 'src/app/utils/utils';

@Component({
  selector: 'scout24-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  private initialCD = false;
  private closeTimeDelay: number;

  @Input() public message: string;
  @Input() public onlyInfoModal: boolean;
  @Input() public set closeTimeDelayInput(data: number) {
    this.closeTimeDelay = data;
    this.startCloseDelay(data);
  }

  public get closeTimeDelayInput(): number {
    return this.closeTimeDelay
  }

  @Output() public closeModalEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public ngOnInit(): void {

  }

  private startCloseDelay(time: number): void {
    doAsyncTask(time)
      .subscribe({
        complete: () => this.closeModalEvent.emit()
      });
  }

}
