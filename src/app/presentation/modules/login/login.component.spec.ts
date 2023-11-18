import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {routes} from 'src/app/app-routing.module';
import {mockAuthStore} from 'src/app/utils/utils';
import {AuthService} from '../../+store/+services/auth/auth.service';
import {AuthStore} from '../../+store/global/auth/auth.store';
import {LoginComponent} from './login.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const fakeAuthService = jasmine.createSpyObj(['requestAuthentication'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot(),
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: AuthStore, useValue: mockAuthStore }
      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('authRequestSent must change',  () => {
    component.signIn()
    expect(component.authRequestSent).toBeTruthy()
  });

  it('method authService.requestAuthentication should be called in method signIn',  () => {
    component.signIn()
    expect(fakeAuthService.requestAuthentication).toHaveBeenCalled()
  });
});
