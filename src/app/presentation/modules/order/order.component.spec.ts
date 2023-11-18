import {HttpClient} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {routes} from 'src/app/app-routing.module';
import {mockHttpClient} from 'src/app/utils/utils';
import {OrderService} from '../../+store/+services/order/order.service';
import {OrderComponent} from './order.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {OrderApiService} from "src/app/data/providers/api/Order/order-api.service";
import {OrderFloor} from "src/app/domain/models/Order/order.model";

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let setOrderPriorityData
  let orderFloor: OrderFloor

  const fakeOrderService = jasmine.createSpyObj(['deleteOrder', 'deleteOrderFloor', 'sendOrderFloorAction',
   'deleteOrderAttachment', 'sendOrderAction', 'logOrderWorkTime', 'getOrderCollectionSlice', 'addOrderComment',
    'sendAttachment', 'changeOrderPriority'])

  const fakeMatDialog = jasmine.createSpyObj(['open'])
  const fakeOrderApiService = jasmine.createSpyObj(['useEmergencyUnassign'])


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrderComponent,
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: HttpClient, useValue: mockHttpClient},
        {provide: OrderService, useValue: fakeOrderService},
        {provide: OrderApiService, useValue: fakeOrderApiService},
        {provide: OrderFloor, useValue: orderFloor},
        {provide: MatDialog, useValue: fakeMatDialog}
      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.order = {ids: {main: '', external: '', internal: ''}}
    component.currentAssigneeRoles = [{name: 'Customer'}]
    fakeMatDialog.open.and.returnValue({
      afterOpened() {
        return of()
      },
      afterClosed() {
        return of()
      },
      componentInstance: {
        logTimeEvent: of(),
        onlyLogTimeEvent: of(),
        logTimeAndAssignEvent: of(),
        logTimeAndUnassignEvent: of(),
        closeModal() {}
      }
    })
    orderFloor = {id: '321', name: '123', floorNumber: 222}
    setOrderPriorityData = ['Highest priority', 'High priority', 'Medium priority', 'Low priority', 'Lowest priority']
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method orderService.deleteOrder should be called in method deleteOrder', () => {
    component.deleteOrder()
    expect(fakeOrderService.deleteOrder).toHaveBeenCalled()
  });

  it('method orderService.deleteOrderFloor should be called in method deleteFloor', () => {
    component.deleteFloor('1')
    expect(fakeOrderService.deleteOrderFloor).toHaveBeenCalled()
  });

  it('method orderService.sendOrderFloorAction should be called in method deleteFloorData',  () => {
    component.deleteFloorData(1, '1')
    expect(fakeOrderService.sendOrderFloorAction).toHaveBeenCalled()
  });

  it('method orderService.deleteOrderAttachment should be called in method deleteAttachment',  () => {
    component.deleteAttachment('1', 'Data')
    expect(fakeOrderService.deleteOrderAttachment).toHaveBeenCalled()
  });

  it('method orderService.sendOrderAction should be called in method invokeOrderAction',  () => {
    component.invokeOrderAction('DELIVER')
    expect(fakeOrderService.sendOrderAction).toHaveBeenCalled()
  });

  it('method orderService.logOrderWorkTime should be called in method sendLoggedOrderWorkTime',  () => {
    component.sendLoggedOrderWorkTime({time: ''})
    expect(fakeOrderService.logOrderWorkTime).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method openLogTimeAndFinish',  () => {
    component.openLogTimeAndFinish()
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method openLogTimeWithoutFinish',  () => {
    component.openLogTimeWithoutFinish()
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method emergencyUnassignConfirm',  () => {
    component.emergencyUnassignConfirm()
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('methods api.useEmergencyUnassign() and orderService.getOrderCollectionSlice() should be called in method emergencyUnassign',  () => {
    fakeOrderApiService.useEmergencyUnassign.and.returnValue(of({}))
    component.emergencyUnassign()
    expect(fakeOrderApiService.useEmergencyUnassign).toHaveBeenCalled()
    expect(fakeOrderService.getOrderCollectionSlice).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method openUploadDialog',  () => {
    component.openUploadDialog()
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method deleteOrderConfirm',  () => {
    component.deleteOrderConfirm()
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method deleteOrderFloorConfirm',  () => {
    component.deleteOrderFloorConfirm('1', '1')
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method deleteOrderFloorDataConfirm',  () => {
    component.deleteOrderFloorDataConfirm(1, '1')
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method deleteOrderAttachmentConfirm should work correctly',  () => {
    component.deleteOrderAttachmentConfirm('1')
    expect(component.deleteAttachmentConfirmation).toBe(true)
    expect(component.attachmentToDeleteId).toBe('1')
  });

  it('method cancelDeleteOrderAttachment should work correctly',  () => {
    component.cancelDeleteOrderAttachment()
    expect(component.deleteAttachmentConfirmation).toBe(false)
    expect(component.attachmentToDeleteId).toBe(undefined)
  });

  it('method dialog.open should be called in method addFloor',  () => {
    component.addFloor()
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method assign',  () => {
    component.assign()
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method sendComment should work correctly',  () => {
    component.orderCommentInput = 'Hi'
    component.sendComment()
    expect(component.orderCommentIntentInProgress).toBe(true)
    expect(fakeOrderService.addOrderComment).toHaveBeenCalled()
    expect(component.orderCommentInput).toBe('')
  });

  it('method sendAttachment should work correctly',  () => {
    component.sendAttachment({attachments: []})
    expect(component.orderAddAttachmentIntentInProgress).toBe(true)
    expect(fakeOrderService.sendAttachment).toHaveBeenCalled()
  });

  it('method setOrderPriority should work correctly',  () => {
    setOrderPriorityData.forEach(el => {
      component.setOrderPriority(el)
      expect(component.orderChangePriorityIntentInProgress).toBe(true)
      expect(fakeOrderService.changeOrderPriority).toHaveBeenCalled()
    })
  });

  it('method dialog.open should be called in method waitingResponse',  () => {
    component.waitingResponse('delete-order', '1')
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method floorsTrackFn should work correctly',  () => {
    const result = component.floorsTrackFn(1, orderFloor)
    expect(result).toBe('321')
  });
});
