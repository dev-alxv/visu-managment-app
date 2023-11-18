import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {OrderManager} from 'src/app/domain/usecase-managers/order-manager';
import {OrdersComponent} from './orders.component';
import {routes} from 'src/app/app-routing.module';
import {mockHttpClient, mockOrderStore, mockUiStateStore} from 'src/app/utils/utils';
import {HttpClient} from '@angular/common/http';
import {UiStateStore} from '../../+store/global/ui-state/ui-state.store';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {OrderStore} from "src/app/presentation/+store/global/order/order.store";
import {OrderService} from "src/app/presentation/+store/+services/order/order.service";
import {of} from "rxjs";
import {Order} from "src/app/domain/models/Order/order.model";


describe('OrdersComponent', () => {
  let comp: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let applyFiltersTypes
  let applySortFilterData
  let order: Order

  const fakeOrderService = jasmine.createSpyObj(['getOrderCollectionSlice'])
  const fakeMatDialog = jasmine.createSpyObj(['open'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrdersComponent,
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: HttpClient, useValue: mockHttpClient},
        {provide: OrderManager, useValue: {}},
        {provide: UiStateStore, useValue: mockUiStateStore},
        {provide: OrderStore, useValue: mockOrderStore},
        {provide: OrderService, useValue: fakeOrderService},
        {provide: Order, useValue: order},
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

    fixture = TestBed.createComponent(OrdersComponent);
    comp = fixture.componentInstance;

    comp.uiState = mockUiStateStore.state;

    fixture.detectChanges();

    applyFiltersTypes = ['user', 'status', 'customer', 'service', '']
    applySortFilterData = ['Created Date (From new to old)', 'Created Date (From old to new)',
      'Deadline Date (From new to old)', 'Deadline Date (From old to new)', '']
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
        closeModal() {
        }
      }
    })
    order = {
      ids:
        {
          main: '2',
          internal: '1',
          external: '1'
        }
    } as Order

  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('method onPageBoundsCorrection should work correctly', () => {
    comp.onPageBoundsCorrection(1)
    expect(comp.paginateConfig.currentPage).toBe(1)
  });

  it('method orderService.getOrderCollectionSlice should be called in method changeToursPerPage', () => {
    comp.changeToursPerPage('1')
    expect(fakeOrderService.getOrderCollectionSlice).toHaveBeenCalled()
  });

  it('method orderService.getOrderCollectionSlice should be called in method applyFilters', () => {
    applyFiltersTypes.forEach(el => {
      comp.applyFilters([], el)
      expect(fakeOrderService.getOrderCollectionSlice).toHaveBeenCalled()
    })

  });

  it('method resetFilters should work correctly', () => {
    comp.resetFilters()
    expect(comp.selectedUsers.length).toBe(0)
    expect(comp.selectedStatus.length).toBe(0)
    expect(comp.selectedCustomer.length).toBe(0)
    expect(comp.selectedServiceType.length).toBe(0)
    expect(fakeOrderService.getOrderCollectionSlice).toHaveBeenCalled()
  });

  it('method orderService.getOrderCollectionSlice should be called in method applySortFilter with correct settings', () => {
    applySortFilterData.forEach(el => {
      comp.applySortFilter(el, 'sort_by')
      expect(fakeOrderService.getOrderCollectionSlice).toHaveBeenCalled()
    })

  });

  it('method orderService.getOrderCollectionSlice should be called in method applyTextFilter with correct settings', function () {
    comp.searchInputText = 'Hi'
    comp.applyTextFilter({key: 'Enter'} as KeyboardEvent)
    expect(fakeOrderService.getOrderCollectionSlice).toHaveBeenCalled()
  });

  it('method orderService.getOrderCollectionSlice should be called in method clearTextFilter', () => {
    comp.clearTextFilter()
    expect(fakeOrderService.getOrderCollectionSlice).toHaveBeenCalled()
  });

  it('method dialog.open should be called in method assign', () => {
    comp.assign('1', '1')
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });

  it('method ordersTrackFn should work correctly', () => {
    const result = comp.ordersTrackFn(1, order)
    expect(result).toBe('2')
  });
});
