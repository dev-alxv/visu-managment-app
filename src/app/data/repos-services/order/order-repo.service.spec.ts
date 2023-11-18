import {TestBed} from "@angular/core/testing";
import {OrderRepoService} from "src/app/data/repos-services/order/order-repo.service";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {
  IOrderCollectionRequest,
  IOrderRequest
} from "src/app/domain/interfaces/order/order.interfaces";
import {ApiService} from "src/app/data/providers/api/api.service";
import {of} from "rxjs";

describe('OrderRepoService', () => {

  let service: OrderRepoService
  let apiService: ApiService

  const fakeApiService = jasmine.createSpyObj(['getOrderRequest', 'getOrderCollectionBySearchRequest'])

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [OrderRepoService, HttpClient, HttpHandler,
        {provide: ApiService, useValue: fakeApiService}
      ],
      teardown: {
        destroyAfterEach: false
      }
    })
    service = TestBed.inject(OrderRepoService)
    apiService = TestBed.inject(ApiService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('method list should work', () => {
    fakeApiService.getOrderCollectionBySearchRequest.and.returnValue(of())
    const reqParams = {
      pageData: {pageNumber: 1, ordersPerPage: 2},
      searchData: {input: '1'},
      filterData: {
        users: [''],
        statuses: [''],
        customers: [''],
        services: [''],
        sortBy: '',
      }
    } as IOrderCollectionRequest
    service.list(reqParams)
  });

  it('method apiService.getOrderRequest should be called in get method',  () => {
    fakeApiService.getOrderRequest.and.returnValue(of())
    service.get({} as IOrderRequest)
    expect(fakeApiService.getOrderRequest).toHaveBeenCalled()
  });

  it('should ',  () => {

  });

});
