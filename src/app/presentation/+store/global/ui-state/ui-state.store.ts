import { Injectable } from '@angular/core';

import { Store } from '../../base/base.store';
import { IUiStateStoreInteractAction } from 'src/app/domain/interfaces/store/ui-state/interact-actions';
import { UiState } from './ui.state';
import { LanguageString } from 'src/app/domain/enums/locales/locales.enum';
import { User } from 'src/app/domain/models/User/user.model';
import { APIIntentType } from 'src/app/domain/enums/common/api.enum';
import {LoggerService} from "src/app/utils/logger.service";


@Injectable({
  providedIn: 'root'
})
export class UiStateStore extends Store<UiState> {

  private constructor(private loggerService: LoggerService) {
    super(new UiState());
  }

  private uiInitialized(): void {
    this.setState({
      ...this.state,
      initialized: true
    });
    this.loggerService.info('initialized: ', 'true', this.constructor.name)
  }

  private setApiOngoingActionState(state: boolean, action?: APIIntentType): void {
    this.setState({
      ...this.state,
      waitingForAPIIntent: state,
      apiIntentActionType: state ? action : 'NO_INTENT'
    });
  }

  private setDefaultLanguage(language: LanguageString): void {
    this.setState({
      ...this.state,
      userSettings: {
        ...this.state.userSettings,
        defaultDisplayLanguage: language,
        currentDisplayLanguage: language
      }
    });
    this.loggerService.info('New default language: ', language, this.constructor.name)
  }

  private setAuthorizedUser(user: User) {
    this.setState({
      ...this.state,
      authorizedUser: user
    });
    this.loggerService.info('Authorized user: ', user, this.constructor.name)
  }

  private changeDisplayLanguage(language: LanguageString): void {
    this.setState({
      ...this.state,
      userSettings: {
        ...this.state.userSettings,
        currentDisplayLanguage: language
      }
    });
    this.loggerService.info('New display language: ', language, this.constructor.name)
  }

  private orderListPageSliceRequestSent(updateListOnly: boolean, orderUpdateId: string): void {
    this.setState({
      ...this.state,
      uiOngoingActions: {
        ...this.state.uiOngoingActions,
        apiRequest: {
          ...this.state.uiOngoingActions.apiRequest,
          fetchingOrderListPageSlice: true,
          updatingSingleOrder: {
            isTrue: updateListOnly,
            orderId: orderUpdateId
          }
        }
      }
    });
  }

  private orderListPageSliceRequestReceived(): void {
    this.setState({
      ...this.state,
      uiOngoingActions: {
        ...this.state.uiOngoingActions,
        apiRequest: {
          ...this.state.uiOngoingActions.apiRequest,
          fetchingOrderListPageSlice: false,
          updatingSingleOrder: {
            isTrue: false,
            orderId: undefined
          }
        }
      }
    });
  }

  /**
   *
   * @param data : { action }
   */
  public dispatchAction(data: IUiStateStoreInteractAction): void {
    switch (data.action) {

      case 'UI_INITIALIZED':
        this.uiInitialized();
        break;

      case 'API_ACTION_IN_PROGRESS':
        this.setApiOngoingActionState(true, data.apiIntentActionType);
        break;

      case 'API_ACTION_FINISHED':
        this.setApiOngoingActionState(false);
        break;

      case 'SET_AUTHORIZED_USER':
        this.setAuthorizedUser(data.authUser);
        break;

      case 'SET_DEFAULT_DISPLAY_LANGUAGE':
        this.setDefaultLanguage(data.language);
        break;

      case 'CHANGE_DISPLAY_LANGUAGE':
        if (data.language) {
          this.changeDisplayLanguage(data.language);
        }
        break;

      case 'ORDER_LIST_PAGE_SLICE_REQUEST_SENT':
        this.orderListPageSliceRequestSent(data.updateListOnly, data.updateOrderInfo.id);
        break;

      case 'ORDER_LIST_PAGE_SLICE_REQUEST_RECEIVED':
        this.orderListPageSliceRequestReceived();
        break;
    }
  }

}
