import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {routes} from 'src/app/app-routing.module';
import {TranslateModule} from '@ngx-translate/core';

import {AppComponent} from './app.component';
import {AuthService} from './presentation/+store/+services/auth/auth.service';
import {UserService} from './presentation/+store/+services/user/user.service';
import {OrderService} from './presentation/+store/+services/order/order.service';
import {UiStateService} from './presentation/+store/+services/ui-state/ui-state.service';
import {AuthStore} from './presentation/+store/global/auth/auth.store';
import {
  mockAuthService,
  mockAuthStore,
  mockOrderService,
  mockUiStateService,
  mockUserService
} from './utils/utils';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

const oldResetTestingModule = TestBed.resetTestingModule;

describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
   await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: UiStateService, useValue: mockUiStateService },
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: UserService, useValue: mockUserService },
      ],
      teardown: {
        destroyAfterEach: false
      },
     schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it(`should have as title 'ff-frontend-app'`, () => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const app = fixture.componentInstance;

    expect(app.title).toEqual('ff-frontend-app');
  });
});
