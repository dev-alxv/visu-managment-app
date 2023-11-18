import {TestBed} from '@angular/core/testing';
import {UserService} from './user.service';
import {UserManager} from "src/app/domain/usecase-managers/user-manager";
import {of, throwError} from "rxjs";
import {LoggerService} from "src/app/utils/logger.service";


describe('UserService', () => {

  let service: UserService
  let userManager: UserManager
  let loggerService: LoggerService

  const fakeUserManager = jasmine.createSpyObj(['authorizedUserRequest'])
  const fakeLoggerService = jasmine.createSpyObj(['error'])

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        {provide: UserManager, useValue: fakeUserManager},
        {provide: LoggerService, useValue: fakeLoggerService}
      ],
    })

    service = TestBed.inject(UserService)
    userManager = TestBed.inject(UserManager)
    loggerService = TestBed.inject(LoggerService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('method userManager.authorizedUserRequest() should be called', done => {
    fakeUserManager.authorizedUserRequest.and.returnValue(of({}))
    service.getAuthorizedUserProfileData()
    expect(fakeUserManager.authorizedUserRequest).toHaveBeenCalled()
    done()
  });

  it('method userManager.authorizedUserRequest() should throw an error', done => {
    fakeUserManager.authorizedUserRequest.and.returnValue(throwError('some error'))
    fakeUserManager.authorizedUserRequest().subscribe(undefined, error => {
      expect(error).toBe('some error')
      done()
    })
  });


  it('method userManager.authorizedUserRequest() should call the logger method in the error block', done => {
    fakeUserManager.authorizedUserRequest.and.returnValue(throwError('some error'))
    service.getAuthorizedUserProfileData()
    expect(fakeLoggerService.error).toHaveBeenCalled()
    done()
  })


});
