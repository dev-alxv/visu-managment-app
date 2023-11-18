import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {OrderManager} from 'src/app/domain/usecase-managers/order-manager';

import {OrderService} from './order.service';
import {routes} from 'src/app/app-routing.module';
import {UiStateStore} from "src/app/presentation/+store/global/ui-state/ui-state.store";
import {LoggerService} from "src/app/utils/logger.service";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {of, throwError} from "rxjs";
import {OrderApiService} from "src/app/data/providers/api/Order/order-api.service";
import {
  IOrderIntentResponseData
} from "src/app/domain/interfaces/intent-response/order.response";
import {
  mockActionData,
  mockActionDataFloor,
  mockAssignData,
  mockAttachData,
  mockCommentData,
  mockDeleteDataOrder,
  mockDeleteDataOrderAttachment,
  mockDeleteDataOrderFloor,
  mockEditOrderData,
  mockFloorData,
  mockGetData,
  mockNewOrderData,
  mockTimeData
} from "src/app/utils/utils";


describe('OrderService', () => {
  let service: OrderService
  let orderManager: OrderManager
  let uiStateStore: UiStateStore
  let loggerService: LoggerService
  let api: OrderApiService
  let orderWithResponseResultOk: IOrderIntentResponseData
  let orderWithResponseResultFail: IOrderIntentResponseData

  const fakeOrderManager = jasmine.createSpyObj(['get', 'create', 'edit', 'delete', 'deleteFloor', 'deleteAttachment', 'comment', 'addFloor', 'assign', 'attach', 'action', 'floorAction', 'list', 'logOrderWorkTime'])
  const fakeUiStateStore = jasmine.createSpyObj(['dispatchAction'])
  const fakeLoggerService = jasmine.createSpyObj(['info', 'error'])
  const fakeOrderApiService = jasmine.createSpyObj(['changeOrderPriority'])


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes)],
      providers: [OrderService, HttpClient, HttpHandler,
        {provide: OrderManager, useValue: fakeOrderManager},
        {provide: UiStateStore, useValue: fakeUiStateStore},
        {provide: LoggerService, useValue: fakeLoggerService},
        {provide: OrderApiService, useValue: fakeOrderApiService}
      ],
    })

    service = TestBed.inject(OrderService)
    orderManager = TestBed.inject(OrderManager)
    uiStateStore = TestBed.inject(UiStateStore)
    loggerService = TestBed.inject(LoggerService)
    api = TestBed.inject(OrderApiService)

    fakeLoggerService.info.calls.reset()
    fakeLoggerService.error.calls.reset()
    fakeUiStateStore.dispatchAction.calls.reset()

    orderWithResponseResultOk = {
      result: 'Ok'
    } as IOrderIntentResponseData

    orderWithResponseResultFail = {
      result: 'Fail'
    } as IOrderIntentResponseData
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('method uiStateStore.dispatchAction() should be called in getOrder method', () => {
    fakeOrderManager.get.and.returnValue(of())
    service.getOrder(mockGetData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('method uiStateStore.dispatchAction() should be called in getOrder method with the correct parameters', () => {
    fakeOrderManager.get.and.returnValue(of())
    service.getOrder(mockGetData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledWith({action: 'GET_ORDER_REQUEST_SENT'})
  });

  it('method loggerService.info() should be called in getOrder method', () => {
    fakeOrderManager.get.and.returnValue(of({}))
    service.getOrder(mockGetData)
    expect(fakeLoggerService.info).toHaveBeenCalled()
  });

  it('method loggerService.error() should be called in getOrder method in the error block', () => {
    fakeOrderManager.get.and.returnValue(throwError('some Error'))
    service.getOrder(mockGetData)
    expect(fakeLoggerService.error).toHaveBeenCalled()
  });

  it('method uiStateStore.dispatchAction() should be called in createOrder method', () => {
    fakeOrderManager.create.and.returnValue(of())
    service.createOrder(mockNewOrderData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });


  it('method uiStateStore.dispatchAction() should be called in createOrder method after orderManager.create() with response.result === \'Ok\'', fakeAsync(() => {
    fakeOrderManager.create.and.returnValue(of(orderWithResponseResultOk))
    service.createOrder(mockNewOrderData)
    tick(800)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)

  }));

  it('method uiStateStore.dispatchAction() should be called in createOrder method after orderManager.create() with response.result === \'Fail\'', fakeAsync(() => {
    fakeOrderManager.create.and.returnValue(of(orderWithResponseResultFail))
    service.createOrder(mockNewOrderData)
    tick(800)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
  }));


  it('method loggerService.error() should be called in createOrder method in the error block', () => {
    fakeOrderManager.create.and.returnValue(throwError('err'))
    service.createOrder(mockNewOrderData)
    expect(fakeLoggerService.error).toHaveBeenCalled()
  });


  it('method uiStateStore.dispatchAction() should be called in editOrder method', () => {
    fakeOrderManager.edit.and.returnValue(of())
    service.editOrder(mockEditOrderData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('methods uiStateStore.dispatchAction() and loggerService.info()  should be called in editOrder method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    fakeOrderManager.edit.and.returnValue(of(orderWithResponseResultOk))
    service.editOrder(mockEditOrderData)
    tick(600)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(fakeLoggerService.info).toHaveBeenCalled()
  }));

  it('method uiStateStore.dispatchAction() should be called in deleteOrder method', () => {
    fakeOrderManager.delete.and.returnValue(of())
    service.deleteOrder(mockDeleteDataOrder)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('methods uiStateStore.dispatchAction() and loggerService.info()  should be called in deleteOrder method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    fakeOrderManager.delete.and.returnValue(of(orderWithResponseResultOk))
    service.deleteOrder(mockDeleteDataOrder)
    tick(1200)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(fakeLoggerService.info).toHaveBeenCalled()
  }) );

  it('method uiStateStore.dispatchAction() should be called in deleteOrderFloor method', () => {
    fakeOrderManager.deleteFloor.and.returnValue(of())
    service.deleteOrderFloor(mockDeleteDataOrderFloor)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('methods uiStateStore.dispatchAction(), handleOrderAPIIntentCompleted() and loggerService.info()  should be called in deleteOrderFloor method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.deleteFloor.and.returnValue(of(orderWithResponseResultOk))
    service.deleteOrderFloor(mockDeleteDataOrderFloor)
    tick(0)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(fakeLoggerService.info).toHaveBeenCalled()
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
  }) );


  it('method uiStateStore.dispatchAction() should be called in deleteOrderAttachment method', () => {
    fakeOrderManager.deleteAttachment.and.returnValue(of())
    service.deleteOrderAttachment(mockDeleteDataOrderAttachment)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });


  it('methods uiStateStore.dispatchAction(), handleOrderAPIIntentCompleted() and loggerService.info()  should be called in deleteOrderAttachment method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.deleteAttachment.and.returnValue(of(orderWithResponseResultOk))
    service.deleteOrderAttachment(mockDeleteDataOrderAttachment)
    tick(100)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(fakeLoggerService.info).toHaveBeenCalled()
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
  }) );



  it('method uiStateStore.dispatchAction() should be called in addOrderComment method', () => {
    fakeOrderManager.comment.and.returnValue(of())
    service.addOrderComment(mockCommentData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('methods uiStateStore.dispatchAction(), handleOrderAPIIntentCompleted() and loggerService.info()  should be called in addOrderComment method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.comment.and.returnValue(of(orderWithResponseResultOk))
    service.addOrderComment(mockCommentData)
    tick(0)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(fakeLoggerService.info).toHaveBeenCalled()
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
  }) );


  it('method uiStateStore.dispatchAction() should be called in addOrderFloor method', () => {
    fakeOrderManager.addFloor.and.returnValue(of())
    service.addOrderFloor(mockFloorData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('methods uiStateStore.dispatchAction(), handleOrderAPIIntentCompleted() and loggerService.info()  should be called in addOrderFloor method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.addFloor.and.returnValue(of(orderWithResponseResultOk))
    service.addOrderFloor(mockFloorData)
    tick(500)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(fakeLoggerService.info).toHaveBeenCalled()
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
  }) );



  it('method uiStateStore.dispatchAction() should be called in assignUser method', () => {
    fakeOrderManager.assign.and.returnValue(of())
    service.assignUser(mockAssignData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('methods uiStateStore.dispatchAction(), handleOrderAPIIntentCompleted() and loggerService.info()  should be called in assignUser method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.assign.and.returnValue(of(orderWithResponseResultOk))
    service.assignUser(mockAssignData)
    tick(800)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(fakeLoggerService.info).toHaveBeenCalled()
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
  }) );


  it('method uiStateStore.dispatchAction() should be called in changeOrderPriority method', () => {
    fakeOrderApiService.changeOrderPriority.and.returnValue(of())
    service.changeOrderPriority(1, '123')
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('\'methods uiStateStore.dispatchAction() and handleOrderAPIIntentCompleted() should be called in changeOrderPriority method after orderManager.edit()', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderApiService.changeOrderPriority.and.returnValue(of({}))
    service.changeOrderPriority(1, '123')
    tick(500)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
  }) );



  it('method uiStateStore.dispatchAction() should be called in logOrderWorkTime method with the correct parameters( completeOrder: true )', () => {
    fakeOrderManager.logOrderWorkTime.and.returnValue(of())
    service.logOrderWorkTime({
      orderId: '1',
      timeLogged: '123',
      completeOrder: true,
      unassignOrder: false
    })
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledWith({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'LOG_ORDER_WORK_TIME_AND_FINISH'
    })
  });

  it('method uiStateStore.dispatchAction() should be called in logOrderWorkTime method with the correct parameters( unassignOrder: true )', () => {
    fakeOrderManager.logOrderWorkTime.and.returnValue(of())
    service.logOrderWorkTime(mockTimeData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledWith({
      action: 'API_ACTION_IN_PROGRESS',
      apiIntentActionType: 'LOG_ORDER_WORK_TIME_AND_UNASSIGN'
    })
  });

  it('\'methods uiStateStore.dispatchAction() and handleOrderAPIIntentCompleted() should be called in logOrderWorkTime method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.logOrderWorkTime.and.returnValue(of(orderWithResponseResultOk))
    service.logOrderWorkTime(mockTimeData)
    tick(100)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
  }) );



  it('method uiStateStore.dispatchAction() should be called in sendAttachment method', () => {
    fakeOrderManager.attach.and.returnValue(of())
    service.sendAttachment(mockAttachData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });


  it('\'methods uiStateStore.dispatchAction(), loggerService.info() and handleOrderAPIIntentCompleted() should be called in sendAttachment method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.attach.and.returnValue(of(orderWithResponseResultOk))
    service.sendAttachment(mockAttachData)
    tick(100)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
    expect(fakeLoggerService.info).toHaveBeenCalled()
  }) );

/*  ------------------*/


  it('method uiStateStore.dispatchAction() should be called in sendOrderAction method', () => {
    fakeOrderManager.action.and.returnValue(of())
    service.sendOrderAction(mockActionData)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('\'methods uiStateStore.dispatchAction(), loggerService.info() and handleOrderAPIIntentCompleted() should be called in sendOrderAction method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.action.and.returnValue(of(orderWithResponseResultOk))
    service.sendOrderAction(mockActionData)
    tick(100)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
    expect(fakeLoggerService.info).toHaveBeenCalled()
  }) );



  it('method uiStateStore.dispatchAction() should be called in sendOrderFloorAction method', () => {
    fakeOrderManager.floorAction.and.returnValue(of())
    service.sendOrderFloorAction(mockActionDataFloor)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });


  it('\'methods uiStateStore.dispatchAction(), loggerService.info() and handleOrderAPIIntentCompleted() should be called in sendOrderFloorAction method after orderManager.edit() with response.result === \'Ok\'', fakeAsync(() => {
    spyOn(service, 'handleOrderAPIIntentCompleted')
    fakeOrderManager.floorAction.and.returnValue(of(orderWithResponseResultOk))
    service.sendOrderFloorAction(mockActionDataFloor)
    tick(500)
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalledTimes(2)
    expect(service.handleOrderAPIIntentCompleted).toHaveBeenCalled()
    expect(fakeLoggerService.info).toHaveBeenCalled()
  }) );

  it('method uiStateStore.dispatchAction() should be called in sendOrderFloorAction method', () => {
    fakeOrderManager.floorAction.and.returnValue(of())
    service.sendOrderFloorAction({orderId: '123', actionType: 'UPLOAD_JSON_FILE'})
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  /* it('method getOrderCollectionSlice() should be called in handleOrderAPIIntentCompleted method with intentType === \'CREATE_ORDER\' ', () => {
    spyOn(service, 'getOrderCollectionSlice')
     service.handleOrderAPIIntentCompleted('CREATE_ORDER', '123')
     expect(service.getOrderCollectionSlice).toHaveBeenCalled()
   });

   it('method getOrderCollectionSlice() should be called in handleOrderAPIIntentCompleted method with intentType === \'DELETE_ORDER\' ', () => {
     spyOn(service, 'getOrderCollectionSlice')
     service.handleOrderAPIIntentCompleted('DELETE_ORDER', '123')
     expect(service.getOrderCollectionSlice).toHaveBeenCalled()
   });

   it('method getOrderCollectionSlice() should be called in handleOrderAPIIntentCompleted method with intentType === \'EDIT_ORDER\' ', () => {
     spyOn(service, 'getOrderCollectionSlice')
     service.handleOrderAPIIntentCompleted('EDIT_ORDER', '1523')
     expect(service.getOrderCollectionSlice).toHaveBeenCalled()
   });*/


});

