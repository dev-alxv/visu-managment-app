import {TestBed} from "@angular/core/testing";
import {
  AuthenticationRepoService
} from "src/app/data/repos-services/auth/auth-repo.service";
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('AuthRepoService', () => {

  let service: AuthenticationRepoService

  beforeEach( () => {
    TestBed.configureTestingModule({
      providers: [AuthenticationRepoService, HttpClient, HttpHandler],
      teardown: {
        destroyAfterEach: false
      }
    })

    service = TestBed.inject(AuthenticationRepoService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});

