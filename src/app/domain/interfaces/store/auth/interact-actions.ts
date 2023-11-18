import { IAuthenticationIntentResponseData } from '../../intent-response/auth.response';
import { IStoreInteractAction } from '../base/interact-actions';

enum InteractActions {
  'AUTHENTICATION_REQUEST_SENT',
  'AUTHENTICATION_REQUEST_RECEIVED',
  'HAVE_TOKEN',
  'SET_USER_ACCESS_TOKEN',
  'SET_AUTHORIZED_USER_PROFILE',
  'AUTHORIZE',
  'DEAUTHORIZE',
  'SET_AUTH_RESPONSE'
}

type ActionType = keyof typeof InteractActions;

export interface IAuthStoreInteractAction extends IStoreInteractAction {
  action: ActionType;
  authResponse?: IAuthenticationIntentResponseData;
}
