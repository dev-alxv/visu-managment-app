import { IUserSettings } from "src/app/domain/interfaces/store/ui-state/user-settings";
import { uiOngoingActions } from "src/app/domain/interfaces/store/ui-state/ongoing-actions";
import { User } from "src/app/domain/models/User/user.model";
import { APIIntentType } from "src/app/domain/enums/common/api.enum";

export class UiState {

  constructor(
    public initialized?: boolean,
    public authorizedUser?: User,
    public userSettings?: IUserSettings,
    public uiOngoingActions?: uiOngoingActions,
    public waitingForAPIIntent?: boolean,
    public apiIntentActionType?: APIIntentType,
    public waitingMessage?: string
  ) {
    this.initialized = false;
    this.waitingForAPIIntent = false;
    this.apiIntentActionType = 'NO_INTENT';
    this.waitingMessage = undefined;


    //
    this.authorizedUser = undefined;

    //
    this.userSettings = {
      defaultDisplayLanguage: undefined,
      currentDisplayLanguage: undefined
    }

    // Initiate uiOngoingActions
    this.uiOngoingActions = {
      pageNavigationInProgress: false,
      apiRequest: {
        fetchingOrderListPageSlice: false,
        updatingSingleOrder: {
          isTrue: false,
          orderId: undefined
        }
      },
      apiIntent: {

      }
    }
  }

}
