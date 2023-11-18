import {AuthApiService} from "src/app/data/providers/auth/auth-api.service";
import {TestBed} from "@angular/core/testing";
import {HttpClient} from "@angular/common/http";

describe('AuthApiService', () => {

  let service: AuthApiService
  let http: HttpClient

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [AuthApiService,
        {provide: HttpClient, useValue: http}
      ],
    })

    service = TestBed.inject(AuthApiService)
    http = TestBed.inject(HttpClient)
  });

  it('should be created',  () => {
    expect(service).toBeTruthy();
  });

})
