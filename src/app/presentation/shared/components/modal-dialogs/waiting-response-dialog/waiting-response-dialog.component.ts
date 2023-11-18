import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

import { UiStateStore } from 'src/app/presentation/+store/global/ui-state/ui-state.store';
import { UiState } from 'src/app/presentation/+store/global/ui-state/ui.state';
import { APIIntentType } from 'src/app/domain/enums/common/api.enum';
import { doAsyncTask } from 'src/app/utils/utils';

@UntilDestroy()

@Component({
  selector: 'scout24-waiting-response-dialog',
  templateUrl: './waiting-response-dialog.component.html',
  styleUrls: ['./waiting-response-dialog.component.scss']
})
export class WaitingResponseDialogComponent implements OnInit {

  public uiStateStream: UiState;
  public uiStateReceived = false;
  public done = false;

  @Input() public loading = false;
  @Input() public message: string;
  @Input() public type: APIIntentType;

  @Output() public closeModalEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private uiStateStore: UiStateStore
  ) {
    this.uiStateStore.stateStream$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (state: UiState) => this.parseUiState(state)
      });
  }

  public ngOnInit(): void {

  }

  private parseUiState(state?: UiState): void {
    if (state) {

      if (!state.waitingForAPIIntent) {
        this.uiStateReceived = true;
        this.responseReceived();
      }
    }
  }

  private responseReceived(): void {
    this.loading = false;
    this.done = true;

    doAsyncTask(2500)
      .subscribe({
        complete: () => this.closeModalEvent.emit()
      });
  }

}
