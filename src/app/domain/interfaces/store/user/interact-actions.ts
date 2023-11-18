import { User } from 'src/app/domain/models/User/user.model';
import { IStoreInteractAction } from '../base/interact-actions';

enum InteractActions {
  'SET_AUTHORIZED_USER',
  'SET_USER_COLLECTION'
}

type ActionType = keyof typeof InteractActions;

export interface IUserInteractAction extends IStoreInteractAction {
  action: ActionType;
  authUser?: User;
  userCollection?: User[];
}
