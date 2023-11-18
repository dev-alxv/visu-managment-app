import {TestBed} from "@angular/core/testing";
import {CloudApiService} from "src/app/data/providers/api/Cloud/cloud-api.service";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {ApiConfig} from "src/app/data/providers/api/api.config";

describe('CloudApiService', () => {

  let service: CloudApiService
  let apiConfig: ApiConfig

  const fakeApiConfig = jasmine.createSpyObj(['buildApiURL'])

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler,
        CloudApiService,
        {provide: ApiConfig, useValue: fakeApiConfig}
      ],
    })

    service = TestBed.inject(CloudApiService)
    apiConfig = TestBed.inject(ApiConfig)
  });

  it('should be created',  () => {
    expect(service).toBeTruthy();
  });

  it('method upload should be work',  () => {
    fakeApiConfig.buildApiURL.and.returnValue({href: '1'})
    const result = service.upload([])
    expect(result).toBeDefined()
  });

})
