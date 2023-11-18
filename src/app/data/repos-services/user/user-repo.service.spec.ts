import {TestBed} from "@angular/core/testing";
import {UserRepoService} from "src/app/data/repos-services/user/user-repo.service";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {ApiService} from "src/app/data/providers/api/api.service";
import {of} from "rxjs";

describe('UserRepoService', () => {

  let service: UserRepoService
  let apiService: ApiService

  const fakeApiService = jasmine.createSpyObj(['getAuthorizedUserProfileRequest', 'getUserCollectionRequest'])

  beforeEach( () => {
    TestBed.configureTestingModule({
      providers: [UserRepoService, HttpClient, HttpHandler,
        {provide: ApiService, useValue: fakeApiService}
      ],
      teardown: {
        destroyAfterEach: false
      }
    })

    service = TestBed.inject(UserRepoService)
    apiService = TestBed.inject(ApiService)
  })

  it('should be created',() => {
    expect(service).toBeTruthy();
  });

  it('method apiService.getAuthorizedUserProfileRequest should be called in method authorizedProfile',  () => {
    fakeApiService.getAuthorizedUserProfileRequest.and.returnValue(of())
    service.authorizedProfile()
    expect(fakeApiService.getAuthorizedUserProfileRequest).toHaveBeenCalled()
  });

  it('method apiService.getAuthorizedUserProfileRequest should be called in method list',  () => {
    fakeApiService.getUserCollectionRequest.and.returnValue(of())
    service.list()
    expect(fakeApiService.getUserCollectionRequest).toHaveBeenCalled()
  });

});
