import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

import { OrderManager } from 'src/app/domain/usecase-managers/order-manager';
import { OrderStore } from '../../global/order/order.store';
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
  IOrderCollectionRequest,
  IOrderCollectionRequestCurrentPageData,
  IOrderCollectionRequestFilterData,
  IOrderRequest,
  ISendOrderActionIntent,
  ISendOrderAttachmentIntent,
  ISendOrderFloorActionIntent
} from 'src/app/domain/interfaces/order/order.interfaces';
import { IOrderRequestResponseData } from 'src/app/domain/interfaces/request-response/order.response';
import { UiStateStore } from '../../global/ui-state/ui-state.store';
import { Order } from 'src/app/domain/models/Order/order.model';
import { IOrderStoreInteractAction } from 'src/app/domain/interfaces/store/order/interact-actions';
import { IOrderIntentResponseData } from 'src/app/domain/interfaces/intent-response/order.response';
import { APIIntentType } from 'src/app/domain/enums/common/api.enum';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { isDefined } from 'src/app/utils/utils';
import { OrderApiService } from 'src/app/data/providers/api/Order/order-api.service';
import { User } from 'src/app/domain/models/User/user.model';
import { Role } from 'src/app/domain/models/User/role.model';
import { TempOrderStatusEnum } from 'src/app/domain/enums/order/order.enum';
import { IUiStateStoreInteractAction } from 'src/app/domain/interfaces/store/ui-state/interact-actions';
import {LoggerService} from "src/app/utils/logger.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private serviceInitialized = false;
  private currentAuthorizedUser: User;

  private latestEditedOrderInternalId: string;
  private latestFilterData: IOrderCollectionRequestFilterData;
  private latestSearchData: Partial<IOrderCollectionRequestCurrentPageData>;

  constructor(
    private orderStore: OrderStore,
    private orderManager: OrderManager,
    private uiStateStore: UiStateStore,
    private localStorage: LocalStorageService,
    private router: Router,
    private loggerService: LoggerService,

    private api: OrderApiService
  ) { }

  public init(): void {
    if (!this.serviceInitialized) {
      this.serviceInitialized = true;

      // TODO: Update USER after new login
      this.currentAuthorizedUser = this.uiStateStore.state.authorizedUser;
      this.orderCollectionRequest({});
    }
  }

  public getOrderCollectionSlice(sliceParams: IOrderCollectionRequest, updateListOnly?: boolean, orderUpdateId?: string): void {

    const requestSliceParams: IOrderCollectionRequest = <IOrderCollectionRequest>{
      ...sliceParams
    };

    if (isDefined(sliceParams.filterData)) {
      this.latestFilterData = {
        ...this.latestFilterData,
        ...sliceParams.filterData
      };
    }

    if (isDefined(sliceParams.searchData)) {
      // this.latestSearchedPrase = sliceParams.searchData.input;
      this.latestSearchData = {
        ...this.latestSearchData,
        searchData: {
          input: sliceParams.searchData.input
        }
      };

      if (sliceParams.pageData === undefined) {
        requestSliceParams.pageData = {
          pageNumber: 0
        }
      }
    }

    if (sliceParams.pageData) {
      // this.localStorage.set('p', 3);
      // this.localStorage.set('s', 3);
      // this.localStorage.set('t', 3);
    }

    this.loggerService.info('Customers: ', this.latestFilterData, this.constructor.name);
    this.orderCollectionRequest(requestSliceParams, updateListOnly, orderUpdateId);
  }

  public getOrder(getData: IOrderRequest): void {
    this.uiStateStore.dispatchAction({
      action: 'GET_ORDER_REQUEST_SENT'
    });

    this.orderManager.get(getData)
      .subscribe({
        next: (response: IOrderRequestResponseData) => {
          this.loggerService.info('orderManager', response, this.constructor.name)
          this.parseOrderRequestResponse(response)
        },
        error: (err: any) => this.loggerService.error('Error', this.constructor.name, err)
      });
  }

  public createOrder(newOrderData: ICreateOrderIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'CREATE_ORDER'
    });
    this.orderManager.create(newOrderData)
      .pipe(delay(800))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {
          if (response.result === 'Ok') {
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });
          }

          if (response.result === 'Fail' || response.result === 'Error') {
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            alert('Order creation failed!');
          }
        },
        error: (err: any) => this.loggerService.error('Error', this.constructor.name, err)
      });
  }

  public editOrder(editOrderData: IEditOrderIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'EDIT_ORDER'
    });

    this.latestEditedOrderInternalId = editOrderData.changedOrderData.ids.internal;

    this.orderManager.edit(editOrderData)
      .pipe(delay(600))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('editOrder', editOrderData, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });
          }
        }
      });
  }

  public deleteOrder(deleteData: IDeleteOrderIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'DELETE_ORDER'
    });

    this.orderManager.delete(deleteData)
      .pipe(delay(1200))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('deleteOrder', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });
          }
        }
      });
  }

  public deleteOrderFloor(deleteData: IDeleteOrderFloorIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'DELETE_ORDER_FLOOR'
    });

    this.orderManager.deleteFloor(deleteData)
      .pipe(delay(0))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('deleteOrderFloor', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted('DELETE_ORDER_FLOOR');
          }
        }
      });
  }

  public deleteOrderAttachment(deleteData: IDeleteOrderAttachmentIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'DELETE_ORDER_ATTACHMENT'
    });

    this.orderManager.deleteAttachment(deleteData)
      .pipe(delay(100))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('deleteOrderAttachment', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted('DELETE_ORDER_ATTACHMENT');
          }
        }
      });
  }

  public addOrderComment(commentData: IAddOrderCommentIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'ADD_ORDER_COMMENT'
    });

    this.orderManager.comment(commentData)
      .pipe(delay(0))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('addOrderComment', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted('ADD_ORDER_COMMENT');
          }
        }
      });
  }

  public addOrderFloor(floorData: IAddOrderFloorIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'ADD_ORDER_FLOOR'
    });

    this.orderManager.addFloor(floorData)
      .pipe(delay(500))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('addOrderFloor', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted('ADD_ORDER_FLOOR');
          }
        }
      });
  }

  public assignUser(assignData: IAssignUserToOrderIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'ASSIGN_USER_TO_ORDER'
    });

    this.orderManager.assign(assignData)
      .pipe(delay(800))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('assignUser', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted('ASSIGN_USER_TO_ORDER', assignData.orderId);
          }
        }
      });
  }

  public changeOrderPriority(priorityData: any, id: string): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'CHANGE_ORDER_PRIORITY'
    });

    this.api.changeOrderPriority(priorityData, id)
      .pipe(delay(500))
      .subscribe({
        next: (resp: any) => {

          this.uiStateStore.dispatchAction({
            action: 'API_ACTION_FINISHED'
          });

          this.handleOrderAPIIntentCompleted('CHANGE_ORDER_PRIORITY');
        }
      });
  }

  public logOrderWorkTime(timeData: ILogOrderWorkTimeIntent): void {

    const uiAction: IUiStateStoreInteractAction = {
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'LOG_ORDER_WORK_TIME'
    };

    // COMPLETE ORDER
    if (timeData.completeOrder) {
      uiAction.apiIntentActionType = 'LOG_ORDER_WORK_TIME_AND_FINISH';
    }

    // UNASSIGN ORDER
    if (timeData.unassignOrder) {
      uiAction.apiIntentActionType = 'LOG_ORDER_WORK_TIME_AND_UNASSIGN';
    }

    this.uiStateStore.dispatchAction(uiAction);

    this.orderManager.logOrderWorkTime(timeData)
      .pipe(delay(100))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted(uiAction.apiIntentActionType);
          }
        }
      });
  }

  public emergency(): void {

  }

  public sendAttachment(attachData: ISendOrderAttachmentIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'ADD_ORDER_ATTACHMENT'
    });

    this.orderManager.attach(attachData)
      .pipe(delay(100))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('sendAttachment', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted('ADD_ORDER_ATTACHMENT');
          }
        }
      });
  }

  public sendOrderAction(actionData: ISendOrderActionIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'INITIATE_ORDER_ACTION'
    });

    this.orderManager.action(actionData)
      .pipe(delay(100))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('sendOrderAction', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted('INITIATE_ORDER_ACTION');
          }
        }
      });
  }

  public sendOrderFloorAction(actionData: ISendOrderFloorActionIntent): void {
    this.uiStateStore.dispatchAction({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'INITIATE_ORDER_FLOOR_ACTION'
    });

    this.orderManager.floorAction(actionData)
      .pipe(delay(500))
      .subscribe({
        next: (response: IOrderIntentResponseData) => {

          if (response.result === 'Ok') {
            this.loggerService.info('sendOrderFloorAction', response, this.constructor.name)
            this.uiStateStore.dispatchAction({
              action: 'API_ACTION_FINISHED'
            });

            this.handleOrderAPIIntentCompleted('INITIATE_ORDER_FLOOR_ACTION');
          }
        }
      });
  }

  public handleOrderAPIIntentCompleted(intentType: APIIntentType, orderId?: string): void {

    if (intentType === 'CREATE_ORDER' || intentType === 'DELETE_ORDER') {
      // Navigate to Order list page
      this.router.navigate(['orders']);

      // Refetch order collection
      this.getOrderCollectionSlice({});
    }

    if (intentType === 'EDIT_ORDER') {
      // Refetch order collection
      this.getOrderCollectionSlice({});

      // Navigate to Order
      this.router.navigate([`orders/order/${this.latestEditedOrderInternalId}`]);
    }

    if (
      intentType === 'ADD_ORDER_COMMENT'
      || intentType === 'ADD_ORDER_FLOOR'
      || intentType === 'ADD_ORDER_ATTACHMENT'
      || intentType === 'ASSIGN_USER_TO_ORDER'
      || intentType === 'CHANGE_ORDER_PRIORITY'
      || intentType === 'DELETE_ORDER_FLOOR'
      || intentType === 'DELETE_ORDER_ATTACHMENT'
      || intentType === 'INITIATE_ORDER_ACTION'
      || intentType === 'INITIATE_ORDER_FLOOR_ACTION'
      || intentType === 'LOG_ORDER_WORK_TIME'
      || intentType === 'LOG_ORDER_WORK_TIME_AND_UNASSIGN'
      || intentType === 'LOG_ORDER_WORK_TIME_AND_FINISH') {

      // Refetch order collection
      this.getOrderCollectionSlice({}, true, orderId);
    }
  }

  private orderCollectionRequest(sliceParams?: IOrderCollectionRequest, updateListOnly?: boolean, orderUpdateId?: string): void {
    this.uiStateStore.dispatchAction({
      action: 'ORDER_LIST_PAGE_SLICE_REQUEST_SENT',
      updateListOnly: updateListOnly ? updateListOnly : false,
      updateOrderInfo: {
        id: orderUpdateId ? orderUpdateId : undefined
      }
    });

    const requestParams: IOrderCollectionRequest = {
      ...sliceParams,
      pageData: this.setPageData(sliceParams.pageData),
      filterData: this.setFilterData(sliceParams.filterData)
    };

    this.orderManager.list(requestParams)
      .pipe(delay(500))
      .subscribe({
        next: (response: IOrderRequestResponseData) => {
          this.loggerService.info('parseOrderCollectionRequestResponse', response, this.constructor.name)
          this.parseOrderCollectionRequestResponse(response)
        } ,
        error: (err: any) => this.loggerService.error('Error', this.constructor.name, err)
      });
  }

  private setPageData(nextPageData?: Partial<{ pageNumber: number, ordersPerPage: number }>): Partial<{ pageNumber: number, ordersPerPage: number }> {

    const currentPageData = this.orderStore.state.pageData?.pageNumber;
    const latestPageSizeData = this.orderStore.state.pageData?.pageSize;

    const pageData: Partial<{ pageNumber: number, ordersPerPage: number }> = {
      pageNumber: nextPageData?.pageNumber !== undefined ? nextPageData.pageNumber : currentPageData,
      ordersPerPage: nextPageData?.ordersPerPage !== undefined ? nextPageData.ordersPerPage : latestPageSizeData,
    };

    if (currentPageData && nextPageData?.pageNumber && currentPageData > nextPageData?.pageNumber) {
      pageData.pageNumber = nextPageData?.pageNumber;
    }

    return pageData;
  }

  private setFilterData(nextFilterData?: Partial<IOrderCollectionRequestFilterData>): Partial<IOrderCollectionRequestFilterData> {

    const hasLatestFilters: boolean = isDefined(this.latestFilterData);

    const filterData: Partial<IOrderCollectionRequestFilterData> = {
      ...this.latestFilterData,
      ...nextFilterData
    }

    // ROLE BASED RESTRICTIONS
    // Drafter
    if (!this.currentAuthorizedUser.role.some((r: Role) => r.name === 'Supervisor' || r.name === 'Admin')) {

      // Don't show orders with 'NEW' status
      const orderStatuses: string[] = Object.values(TempOrderStatusEnum).filter((status: string) => status !== 'NEW');

      if (!isDefined(filterData.statuses)) {
        filterData.statuses = orderStatuses;
      } else if (!filterData.statuses.length) {
        filterData.statuses = orderStatuses;
      }
    }

    // TODO: ADD FILTER DATA TO ORDER STORE
    this.loggerService.info('setFilterData', filterData, this.constructor.name)
    return filterData;
  }

  private parseOrderCollectionRequestResponse(data: IOrderRequestResponseData): void {
    this.uiStateStore.dispatchAction({
      action: 'ORDER_LIST_PAGE_SLICE_REQUEST_RECEIVED'
    });

    const toOrderStoreData: IOrderStoreInteractAction = {
      action: 'UPDATE_ORDER_COLLECTION',
      list: data.orderCollection.map((order: Order) => this.parseOrderUiData(order)),
      pageData: {
        ...data.pageData,
        searchData: isDefined(this.latestSearchData) ? this.latestSearchData.searchData : undefined
      }
    };

    this.orderStore.dispatchAction(toOrderStoreData);
  }

  private parseOrderRequestResponse(data: IOrderRequestResponseData): void {
    this.uiStateStore.dispatchAction({
      action: 'GET_ORDER_REQUEST_RECEIVED'
    });

    const toOrderStoreData: IOrderStoreInteractAction = {
      action: 'GET_SINGLE_ORDER',
      order: data.order
    };

    this.orderStore.dispatchAction(toOrderStoreData);
  }

  private parseOrderUiData(order: Order): Order {

    return order;
  }

}
