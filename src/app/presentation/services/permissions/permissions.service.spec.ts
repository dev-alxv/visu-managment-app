import {TestBed} from '@angular/core/testing';

import {PermissionsService} from './permissions.service';


describe('PermissionsService', () => {

  let service: PermissionsService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        PermissionsService
      ],
    })
    service = TestBed.inject(PermissionsService)
  });

  it('should be created',() => {
    expect(service).toBeTruthy();
  });

});
