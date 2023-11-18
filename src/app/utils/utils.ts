import {HttpClient} from '@angular/common/http';
import {Component, Directive} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Order} from '../domain/models/Order/order.model';
import {User} from '../domain/models/User/user.model';
import {AuthService} from '../presentation/+store/+services/auth/auth.service';
import {OrderService} from '../presentation/+store/+services/order/order.service';
import {UiStateService} from '../presentation/+store/+services/ui-state/ui-state.service';
import {UserService} from '../presentation/+store/+services/user/user.service';
import {AuthenticationState} from '../presentation/+store/global/auth/auth.state';
import {AuthStore} from '../presentation/+store/global/auth/auth.store';
import {OrderState} from '../presentation/+store/global/order/order.state';
import {OrderStore} from '../presentation/+store/global/order/order.store';
import {UiStateStore} from '../presentation/+store/global/ui-state/ui-state.store';
import {UiState} from '../presentation/+store/global/ui-state/ui.state';
import {UserState} from '../presentation/+store/global/user/user.state';
import {UserStore} from '../presentation/+store/global/user/user.store';
import {
  IAddOrderCommentIntent,
  IAddOrderFloorIntent,
  IAssignUserToOrderIntent,
  ICreateOrderIntent,
  IDeleteOrderAttachmentIntent,
  IDeleteOrderFloorIntent,
  IDeleteOrderIntent,
  IEditOrderIntent,
  ILogOrderWorkTimeIntent,
  IOrderRequest,
  ISendOrderActionIntent,
  ISendOrderAttachmentIntent,
  ISendOrderFloorActionIntent
} from "src/app/domain/interfaces/order/order.interfaces";

// Check for object property
export function isDefined(item: unknown): boolean {
  return item !== undefined && item !== null;
}

// Observable timeout
export function doAsyncTask(time: number): Observable<string> {
  return of('done').pipe(
    delay(time)
  );
}

// Parse a date to specific view
export function parseDate(dateToParse: string, dateView?: string): string {

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  const date: string = new Date(dateToParse).toLocaleString('de-DE', dateOptions);

  return date;
}

export function compareArraysIgnoreOrder(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;
  const uniqueValues = new Set([...a, ...b]);
  for (const v of uniqueValues) {
    const aCount = a.filter(e => e === v).length;
    const bCount = b.filter(e => e === v).length;
    if (aCount !== bCount) return false;
  }
  return true;
}

// Deep copy an object to break the reference
export function deepCopy<T>(obj: unknown): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

// *********************
// Unit tests helpers
// *********************
export function MockDirective(options: Component): Directive {
  const metadata: Directive = {
    selector: options.selector,
    inputs: options.inputs,
    outputs: options.outputs
  };
  return Directive(metadata)(class {
  }) as unknown;
}

export function MockComponent(options: Component): Component {
  const metadata: Component = {
    selector: options.selector,
    template: options.template || '<div></div>',
    inputs: options.inputs,
    outputs: options.outputs
  };
  return Component(metadata)(class {
  }) as unknown;
}

// MOCKS

export const mockOrder: Order = <Order>{
  ids: {
    main: '1',
    internal: '2',
    external: '3'
  },
  state: 'ACTIVE',
  orderDates: {
    deadline: "23.02.2023, 15:00",
    delivery: "-",
    enquiry: "26.10.2022, 13:42"
  },
  userData: {
    assignee: {
      id: "61828f4078646e1207b737ea"
    },
    creator: {
      id: "61828f4078646e1207b737ea"
    },
    customer: {
      id: "61828f4078646e1207b737ea"
    }
  }
};

export const mockUser: User = <User>{
  id: '1',
  role: [{name: 'Supervisor', id: '1'}],
  state: 'ACTIVE'
};

const mockAuthState: AuthenticationState = <AuthenticationState>{
  authorizedUserData: {},
  haveToken: true,
  authorized: true,
  authRequestSent: true,
  authResponse: {
    authDenied: false
  }
};

const mockUiState: UiState = <UiState>{
  initialized: true,
  authorizedUser: {},
  uiOngoingActions: {
    apiIntent: {},
    apiRequest: {
      fetchingOrderListPageSlice: true,
      updatingSingleOrder: {
        isTrue: false
      }
    }
  }
};

const mockOrderState: OrderState = <OrderState>{
  list: [mockOrder, mockOrder, mockOrder],
  order: mockOrder,
  pageData: {},
  filterData: {}
};

const mockUserState: UserState = <UserState>{
  authorizedUser: mockUser,
  list: [mockUser, mockUser, mockUser]
};

export const mockHttpClient: HttpClient = <HttpClient>{};

export const mockAuthService: AuthService = <AuthService>{
  init: (): void => {
  }
};

export const mockUiStateService: UiStateService = <UiStateService>{
  init: (): void => {
  }
};

export const mockOrderService: OrderService = <OrderService>{
  init: (): void => {
  },
  getOrderCollectionSlice: ({}): void => {
  },
  getOrder: ({}): void => {
  },
  assignUser: ({}): void => {
}
};

export const mockAuthStore: AuthStore = <AuthStore>{
  stateStream$: of(mockAuthState),
  state: mockAuthState
  // dispatch: (data: any): void => { }
};

export const mockUiStateStore: UiStateStore = <UiStateStore>{
  stateStream$: of(mockUiState),
  state: mockUiState,
  // dispatch: (data: any): void => { }
};

export const mockOrderStore: OrderStore = <OrderStore>{
  // state$: new BehaviorSubject<OrderState>({}),
  stateStream$: of(mockOrderState),
  initialState: mockOrderState,
  state: {
    list: [
      {
        ids:
          {
            internal: '123'
          }
      }]
  }
  // dispatch: (data: any): void => { }
};

export const mockActivatedRoute = {
  snapshot: {
    params: {
      id: '123'
    }
  }
}

export const mockUserStore: UserStore = <UserStore>{
  stateStream$: of(mockUserState),
  // dispatch: (data: any): void => { }
};

export const mockUserService: UserService = <UserService>{
  getAuthorizedUserProfileData: (): Observable<boolean> => of(true)
};

export const MatDialogMock = {
  open(): Record<string, unknown> {
    return {
      afterClosed: () => of(true)
    };
  },
  closeAll() {}
};

/*-------------------------------------*/
/*mocks for order.service.spec.ts*/

export const mockGetData: IOrderRequest = {
  orderId: '123', idType: 'int'
}

export const mockNewOrderData: ICreateOrderIntent = {
  newOrder: {state: "ACTIVE"}
}

export const mockEditOrderData: IEditOrderIntent = {
  orderId: '123',
  changedOrderData: {state: "ACTIVE", ids: {internal: '', main: '', external: ''}},
  customerId: '321'
}

export const mockDeleteDataOrder: IDeleteOrderIntent = {
  orderToDeleteId: '123'
}

export const mockDeleteDataOrderFloor: IDeleteOrderFloorIntent = {
  floorToDeleteId: '123', orderId: '1'
}

export const mockDeleteDataOrderAttachment: IDeleteOrderAttachmentIntent = {
  attachmentToDeleteId: '1',
  orderId: '2',
  attachmentType: 'Logo'
}

export const mockCommentData: IAddOrderCommentIntent = {
  orderId: '1', commentText: '2'
}

export const mockFloorData: IAddOrderFloorIntent = {
  orderId: '1'
}

export const mockAssignData: IAssignUserToOrderIntent = {
  userId: '1', orderId: '2'
}

export const mockTimeData: ILogOrderWorkTimeIntent = {
  orderId: '1',
  timeLogged: '123',
  completeOrder: false,
  unassignOrder: true
}

export const mockAttachData: ISendOrderAttachmentIntent = {
  orderId: '123'
}

export const mockActionData: ISendOrderActionIntent = {
  orderId: '123', actionType: 'DELIVER'
}

export const mockActionDataFloor: ISendOrderFloorActionIntent = {
  orderId: '123', actionType: 'UPLOAD_JSON_FILE'
}
// *********************
// *********************
