import {TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {
  UiStateService
} from "src/app/presentation/+store/+services/ui-state/ui-state.service";
import {UiStateStore} from "src/app/presentation/+store/global/ui-state/ui-state.store";


describe('UiStateService', () => {
  let service: UiStateService
  let uiStateStore: UiStateStore

  const fakeUiStateStore = jasmine.createSpyObj(['dispatchAction'])

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [UiStateService,
        {provide: UiStateStore, useValue: fakeUiStateStore}
      ]
    })
    service = TestBed.inject(UiStateService)
    uiStateStore = TestBed.inject(UiStateStore)
  })

  it('should be created ',  () => {
    expect(service).toBeTruthy()
  });

  it('method uiStateStore.dispatchAction() should be called in init method',  () => {
     service.init()
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

  it('method uiStateStore.dispatchAction() should be called in changeDisplayLanguageRequest method',  () => {
    service.changeDisplayLanguageRequest('de')
    expect(fakeUiStateStore.dispatchAction).toHaveBeenCalled()
  });

})
