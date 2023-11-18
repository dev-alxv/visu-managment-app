import { HttpClient } from '@angular/common/http';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';

import { UserApiService } from './user-api.service';
import { mockHttpClient } from 'src/app/utils/utils';

const oldResetTestingModule = TestBed.resetTestingModule;

describe('UserApiService', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [

      ],
      providers: [
        UserApiService,
        { provide: HttpClient, useValue: mockHttpClient }
      ],
      teardown: {
        destroyAfterEach: false
      }
    })
    .compileComponents();
  });

  it('should be created', inject([UserApiService], (service: UserApiService) => {
    expect(service).toBeTruthy();
  }));
});
