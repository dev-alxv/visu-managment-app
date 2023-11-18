import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';

import {NewOrderComponent} from './new-order.component';
import {routes} from 'src/app/app-routing.module';
import {OrderService} from '../../+store/+services/order/order.service';
import {UserStore} from '../../+store/global/user/user.store';
import {mockOrderService, mockUserStore} from 'src/app/utils/utils';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";


describe('NewOrderComponent', () => {
  let component: NewOrderComponent;
  let fixture: ComponentFixture<NewOrderComponent>;
  let arr: string[]
  let arr2: string[]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NewOrderComponent
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot(),
      ],
      providers: [
        DatePipe,
        { provide: OrderService, useValue: mockOrderService },
        { provide: UserStore, useValue: mockUserStore }

      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(NewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    arr = ['Furniture', 'Square Meter', 'North Arrow','Room Designation', 'Floor Plan Desig.', 'Align North',
      'Flat Designation', 'Dimensional Chains', 'Meter Bars', 'Isometric', 'Square Meter S.']

    arr2 = ['hasFurniture', 'hasSquareMeterSpecifications', 'hasNorthArrow', 'hasRoomDesignation', 'hasFloorplanDesignations',
      'hasAlignNorth', 'hasFlatDesignation', 'hasDimensionalChains', 'hasMeterBars', 'hasIsometric', 'hasSquareMeterSpecifications']
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('setOrderOptions method should work correctly',  () => {
    arr.forEach((el, index) => {
      component.setOrderOptions('true', el)
      expect(component.newOrder.options[arr2[index]]).toBe(true)
    })
  });

  it('setOrderOptions method should work correctly with params(value: \'true\', name: \'Scale Ratio\')',  () => {
    component.setOrderOptions('true', 'Scale Ratio')
    expect(component.selectedScaleRatioEnabled).toBe(true)
  });

  it('addNewFloor method should work correctly',  () => {
    const orderFloorListLength = component.orderFloorList.length
    component.addNewFloor()
    expect(orderFloorListLength === component.orderFloorList.length - 1).toBeTruthy()
  });

  it('deleteNewFloor method should work correctly',  () => {
    const orderFloorListLength = component.orderFloorList.length
    component.deleteNewFloor(0)
    expect(orderFloorListLength === component.orderFloorList.length + 1).toBeTruthy()
  });


});
