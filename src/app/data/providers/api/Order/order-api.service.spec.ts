import {HttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';

import {OrderApiService} from './order-api.service';


describe('OrderApiService', () => {

  let service: OrderApiService
  let http: HttpClient

  const fakeHttpClient = jasmine.createSpyObj(['get'])

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        OrderApiService,
        { provide: HttpClient, useValue: fakeHttpClient }
      ],
    })

    service = TestBed.inject(OrderApiService)
    http = TestBed.inject(HttpClient)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
