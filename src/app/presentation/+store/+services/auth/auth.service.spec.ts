import {AuthService} from "src/app/presentation/+store/+services/auth/auth.service";
import {TestBed} from "@angular/core/testing";
import {AuthenticationManager} from "src/app/domain/usecase-managers/auth-manager";
import {UserService} from "src/app/presentation/+store/+services/user/user.service";
import {RouterModule} from "@angular/router";
import {routes} from "src/app/app-routing.module";
import {AuthStore} from "src/app/presentation/+store/global/auth/auth.store";
import {LoggerService} from "src/app/utils/logger.service";
import {of} from "rxjs";

describe('AuthService', () => {
  let service: AuthService
  let authManager: AuthenticationManager
  let userService: UserService
  let authStore: AuthStore
  let loggerService: LoggerService

  const fakeAuthStore = jasmine.createSpyObj(['dispatch'])
  const fakeLoggerService = jasmine.createSpyObj(['info', 'error'])
  const fakeAuthenticationManager = jasmine.createSpyObj(['authenticationRequest'])

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes)],
      providers: [AuthService,
        {provide: AuthenticationManager, useValue: fakeAuthenticationManager},
        {provide: UserService, useValue: userService},
        {provide: AuthStore, useValue: fakeAuthStore},
        {provide: LoggerService, useValue: fakeLoggerService},
      ]
    })

    service = TestBed.inject(AuthService)
    authManager = TestBed.inject(AuthenticationManager)
    userService = TestBed.inject(UserService)
    authStore = TestBed.inject(AuthStore)
    loggerService = TestBed.inject(LoggerService)
  })

  it('should be created',  () => {
    expect(service).toBeTruthy()
  });


  it('methods authStore.dispatch() and loggerService.info should be called in method requestAuthentication',  () => {
    fakeAuthenticationManager.authenticationRequest.and.returnValue(of({}))
    service.requestAuthentication({username: '123', password: '321'})
    expect(fakeLoggerService.info).toHaveBeenCalled()
    expect(fakeAuthStore.dispatch).toHaveBeenCalled()
    expect(fakeAuthStore.dispatch).toHaveBeenCalledWith({ action: 'AUTHENTICATION_REQUEST_SENT' })
  });

  it('method authStore.dispatch() should be called in requestLogout method',  () => {
    service.requestLogout()
    expect(fakeAuthStore.dispatch).toHaveBeenCalled()
    expect(fakeAuthStore.dispatch).toHaveBeenCalledWith({action: 'DEAUTHORIZE'})
  });

  it('method loggerService.info() should be called in requestLogout method',  () => {
    service.requestLogout()
    expect(fakeLoggerService.info).toHaveBeenCalled()
  });


})
