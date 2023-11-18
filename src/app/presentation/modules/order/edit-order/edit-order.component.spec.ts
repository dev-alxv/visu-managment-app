import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {routes} from 'src/app/app-routing.module';
import {OrderService} from 'src/app/presentation/+store/+services/order/order.service';
import {OrderStore} from 'src/app/presentation/+store/global/order/order.store';
import {UserStore} from 'src/app/presentation/+store/global/user/user.store';
import {
  MatDialogMock,
  mockHttpClient,
  mockOrder,
  mockOrderService,
  mockOrderStore,
  mockUserStore
} from 'src/app/utils/utils';
import {EditOrderComponent} from './edit-order.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

xdescribe('EditOrderComponent', () => {
  let component: EditOrderComponent;
  let fixture: ComponentFixture<EditOrderComponent>;
  let orderStore: OrderStore

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditOrderComponent
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot()
      ],
      providers: [
        DatePipe, ActivatedRoute,
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: MatDialog, useValue: MatDialogMock },
        { provide: OrderService, useValue: mockOrderService },
        { provide: OrderStore, useValue: mockOrderStore },
        { provide: UserStore, useValue: mockUserStore },
      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(EditOrderComponent);
    component = fixture.componentInstance;
    component.orderToEdit = mockOrder;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
