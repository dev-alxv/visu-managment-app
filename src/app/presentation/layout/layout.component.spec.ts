import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';

import {
  MatDialogMock,
  mockAuthStore,
  mockOrderService,
  mockUiStateStore
} from 'src/app/utils/utils';
import {OrderService} from '../+store/+services/order/order.service';
import {AuthStore} from '../+store/global/auth/auth.store';
import {UiStateStore} from '../+store/global/ui-state/ui-state.store';
import {LayoutComponent} from './layout.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";


describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LayoutComponent,
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: UiStateStore, useValue: mockUiStateStore },
        { provide: OrderService, useValue: mockOrderService },
        { provide: MatDialog, useValue: MatDialogMock }
      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
