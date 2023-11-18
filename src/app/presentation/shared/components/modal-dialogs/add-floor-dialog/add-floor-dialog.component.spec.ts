import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';

import {AddFloorDialogComponent} from './add-floor-dialog.component';
import {routes} from 'src/app/app-routing.module';
import {MatDialogMock, mockOrderService} from 'src/app/utils/utils';
import {OrderService} from 'src/app/presentation/+store/+services/order/order.service';
import {OrderManager} from 'src/app/domain/usecase-managers/order-manager';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('AddFloorDialogComponent', () => {
  let component: AddFloorDialogComponent;
  let fixture: ComponentFixture<AddFloorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddFloorDialogComponent
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot()
      ],
      providers: [
        DatePipe,
        { provide: MatDialog, useValue: MatDialogMock },
        { provide: OrderService, useValue: mockOrderService },
        OrderManager
      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(AddFloorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method addNewFloor should work correctly',  () => {
    const orderFloorListLength = component.orderFloorList.length
    component.addNewFloor()
    expect(component.orderFloorList.length === orderFloorListLength + 1).toBe(true)
  });

  it('method deleteNewFloor should work correctly',  () => {
    component.orderFloorList = [{}]
    component.deleteNewFloor(0)
    expect(component.orderFloorList.length).toBe(0)
  });

  it('method matDialog.closeAll should be called in method closeModal',  () => {
    spyOn(MatDialogMock, 'closeAll')
    component.closeModal()
    expect(MatDialogMock.closeAll).toHaveBeenCalled()
  });
});
