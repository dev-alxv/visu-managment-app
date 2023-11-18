import { LanguageString } from 'src/app/domain/enums/locales/locales.enum';
import { User } from 'src/app/domain/models/User/user.model';
import { IStoreInteractAction } from '../base/interact-actions';
import { APIIntentType } from 'src/app/domain/enums/common/api.enum';

enum InteractActions {
  'UI_INITIALIZED',
  'API_ACTION_IN_PROGRESS',
  'API_ACTION_FINISHED',
  'SET_DEFAULT_DISPLAY_LANGUAGE',
  'SET_AUTHORIZED_USER',
  'CHANGE_DISPLAY_LANGUAGE',
  'ORDER_LIST_PAGE_SLICE_REQUEST_SENT',
  'ORDER_LIST_PAGE_SLICE_REQUEST_RECEIVED',
  'GET_ORDER_REQUEST_SENT',
  'GET_ORDER_REQUEST_RECEIVED'
}

type ActionType = keyof typeof InteractActions;

export interface IUiStateStoreInteractAction extends IStoreInteractAction {
  action: ActionType;
  language?: LanguageString;
  authUser?: User;
  updateListOnly?: boolean;
  updateOrderInfo?: {
    id: string;
  };
  apiIntentActionType?: APIIntentType;
  apiActionMessage?: string;
}
