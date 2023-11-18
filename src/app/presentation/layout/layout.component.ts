import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, Subscription } from 'rxjs';

import { AuthStore } from '../+store/global/auth/auth.store';
import { AuthenticationState } from '../+store/global/auth/auth.state';
import { UiState } from '../+store/global/ui-state/ui.state';
import { UiStateStore } from '../+store/global/ui-state/ui-state.store';
import { OrderService } from '../+store/+services/order/order.service';
import { BaseHostModalDialogComponent } from '../shared/components/base-host-modal-dialog/base-host-modal-dialog.component';
import { WaitingResponseDialogComponent } from '../shared/components/modal-dialogs/waiting-response-dialog/waiting-response-dialog.component';
import { ModalTemplateInputData } from 'src/app/domain/interfaces/modal/modal.interfaces';
import { APIIntentType } from 'src/app/domain/enums/common/api.enum';
import {LoggerService} from "src/app/utils/logger.service";

@UntilDestroy()

@Component({
  selector: 'ff-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  public authenticationStoreStateStream$: Observable<AuthenticationState>;
  public uiStateStoreStream$: Observable<UiState>;

  constructor(
    private authStore: AuthStore,
    private uiStateStore: UiStateStore,
    private orderService: OrderService,
    private dialog: MatDialog,
    private loggerService: LoggerService
  ) { }

  public ngOnInit(): void {
    this.observeAuthenticationStateStream();
    this.observeUiStateStream();
  }

  private observeAuthenticationStateStream(): void {
    this.authenticationStoreStateStream$ = this.authStore.stateStream$;
  }

  private observeUiStateStream(): void {
    this.uiStateStoreStream$ = this.uiStateStore.stateStream$;
    this.handleUiStateStream();
  }

  private handleUiStateStream(): void {

    this.uiStateStoreStream$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (state: UiState) => {

          if (state.waitingForAPIIntent
            && state.apiIntentActionType !== 'NO_INTENT'
            && state.apiIntentActionType !== 'ADD_ORDER_FLOOR'
            && state.apiIntentActionType !== 'ADD_ORDER_COMMENT'
            && state.apiIntentActionType !== 'ADD_ORDER_ATTACHMENT'
            && state.apiIntentActionType !== 'ASSIGN_USER_TO_ORDER'
            && state.apiIntentActionType !== 'CHANGE_ORDER_PRIORITY'
            && state.apiIntentActionType !== 'DELETE_ORDER_FLOOR'
            && state.apiIntentActionType !== 'DELETE_ORDER_ATTACHMENT'
            && state.apiIntentActionType !== 'INITIATE_ORDER_ACTION'
            && state.apiIntentActionType !== 'INITIATE_ORDER_FLOOR_ACTION'
            && state.apiIntentActionType !== 'LOG_ORDER_WORK_TIME_AND_UNASSIGN'
            && state.apiIntentActionType !== 'LOG_ORDER_WORK_TIME') {
            this.waitingAPIResponse(state.apiIntentActionType);
          }
        }
      });
  }

  private waitingAPIResponse(type: APIIntentType, firstMessage?: string): void {

    this.loggerService.info('waitingAPIResponseType: ', this.constructor.name, type)
    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: '',
        controlActions: false,
        logo: false,
        component: WaitingResponseDialogComponent,
        inputs: {
          loading: true,
          message: firstMessage,
          type: type,
        },
        buttonsConfig: {
          closeButton: false
        }
      }),
      width: '600px',
      height: 'auto'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance['closeModalEvent' as keyof BaseHostModalDialogComponent]
              .subscribe({
                next: () => dialogRef.componentInstance.closeModal()
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => {
          this.waitingResponseModalCloseEvent(type);
          outputActionsSubs.unsubscribe();
        }
      });
  }

  private waitingResponseModalCloseEvent(APIIntentType: APIIntentType): void {

    switch (APIIntentType) {

      case 'CREATE_ORDER':
      case 'EDIT_ORDER':
      case 'DELETE_ORDER':
        this.orderService.handleOrderAPIIntentCompleted(APIIntentType);
        break;
    }
  }
}
