import { inject, TestBed, waitForAsync } from '@angular/core/testing';

import { UserRoleFeaturesService } from './user-role-features.service';

const oldResetTestingModule = TestBed.resetTestingModule;

describe('UserRoleFeaturesService', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [

      ],
      imports: [

      ],
      providers: [
        UserRoleFeaturesService
      ],
      teardown: {
        destroyAfterEach: false
      }
    })
    .compileComponents();
  });

  it('should be created', inject([UserRoleFeaturesService], (service: UserRoleFeaturesService) => {
    expect(service).toBeTruthy();
  }));
});
