import {TestBed} from "@angular/core/testing";
import {ApiService} from "src/app/data/providers/api/api.service";
import {AuthApiService} from "src/app/data/providers/auth/auth-api.service";
import {UserApiService} from "src/app/data/providers/api/User/user-api.service";
import {OrderApiService} from "src/app/data/providers/api/Order/order-api.service";
import {CloudApiService} from "src/app/data/providers/api/Cloud/cloud-api.service";
import {
  IAddOrderCommentIntentDescription,
  IAddOrderFloorIntentDescription, IAddOrderLogoWatermarkIntentDescription,
  IAssignUserToOrderIntentDescription,
  ICreateOrderIntentDescription, IDeleteOrderIntentDescription,
  IDeliverOrderIntentDescription,
  IEditOrderIntentDescription,
  IGetOrderRequestData, ILogOrderWorkTimeData,
  ILogOrderWorkTimeIntentDescription,
  ISearchOrderRequestData, ISendOrderActionIntentDescription
} from "src/app/data/interfaces/descriptions/api/order/description";
import {IAuthenticationRequest} from "src/app/domain/interfaces/auth/auth.interfaces";

describe('ApiService', () => {

  let service: ApiService
  let authApiService: AuthApiService
  let userApiService: UserApiService
  let orderApiService: OrderApiService
  let cloudApiService: CloudApiService

  const fakeAuthApiService = jasmine.createSpyObj(['obtainAccessToken', 'obtainRefreshAccessToken'])
  const fakeUserApiService = jasmine.createSpyObj(['getAuthorizedUserProfile', 'getUserCollection'])
  const fakeOrderApiService = jasmine.createSpyObj(['getOrderCollectionSlice', 'getOrderCollectionBySearch',
   'getOrder', 'createOrder', 'editOrder', 'assignUser', 'deliverOrder', 'logOrderWorkTime', 'deleteOrder', 'deleteFloor',
    'deleteAttachment', 'deleteLogoAttachment', 'deleteWatermarkAttachment', 'deleteFloorProjectFiles', 'sendAction',
   'createFloor', 'addOrderFloorAttachment', 'addOrderLogoWatermark', 'addAttachment', 'addComment'])
  const fakeCloudApiService = jasmine.createSpyObj(['upload'])


  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [ApiService,
        {provide: AuthApiService, useValue: fakeAuthApiService},
        {provide: UserApiService, useValue: fakeUserApiService},
        {provide: OrderApiService, useValue: fakeOrderApiService},
        {provide: CloudApiService, useValue: fakeCloudApiService},
      ],
    })

    service = TestBed.inject(ApiService)
    authApiService = TestBed.inject(AuthApiService)
    userApiService = TestBed.inject(UserApiService)
    orderApiService = TestBed.inject(OrderApiService)
    cloudApiService = TestBed.inject(CloudApiService)
  });

  it('should be created',  () => {
    expect(service).toBeTruthy();
  });

  it('method getAuthenticationTokenRequest should work',  () => {
    fakeAuthApiService.obtainAccessToken.and.returnValue(1)
    const result = service.getAuthenticationTokenRequest({} as IAuthenticationRequest)
    expect(result).toBeDefined()
  });

  it('method getRefreshedAuthenticationTokenRequest should work',  () => {
    fakeAuthApiService.obtainRefreshAccessToken.and.returnValue(1)
    const result = service.getRefreshedAuthenticationTokenRequest('1')
    expect(result).toBeDefined()
  });

  it('method getAuthorizedUserProfileRequest should work',  () => {
    fakeUserApiService.getAuthorizedUserProfile.and.returnValue(1)
    const result = service.getAuthorizedUserProfileRequest()
    expect(result).toBeDefined()
  });

  it('method getOrderCollectionSliceRequest should work',  () => {
    fakeOrderApiService.getOrderCollectionSlice.and.returnValue(1)
    const result = service.getOrderCollectionSliceRequest({})
    expect(result).toBeDefined()
  });

  it('method getOrderCollectionBySearchRequest should work',  () => {
    fakeOrderApiService.getOrderCollectionBySearch.and.returnValue(1)
    const result = service.getOrderCollectionBySearchRequest({} as ISearchOrderRequestData)
    expect(result).toBeDefined()
  });

  it('method getOrderRequest should work',  () => {
    fakeOrderApiService.getOrder.and.returnValue(1)
    const result = service.getOrderRequest({} as IGetOrderRequestData)
    expect(result).toBeDefined()
  });

  it('method getUserCollectionRequest should work',  () => {
    fakeUserApiService.getUserCollection.and.returnValue(1)
    const result = service.getUserCollectionRequest()
    expect(result).toBeDefined()
  });

  it('method createOrderIntent should work',  () => {
    fakeOrderApiService.createOrder.and.returnValue(1)
    const result = service.createOrderIntent({} as ICreateOrderIntentDescription)
    expect(result).toBeDefined()
  });

  it('method editOrderIntent should work',  () => {
    fakeOrderApiService.editOrder.and.returnValue(1)
    const result = service.editOrderIntent({} as IEditOrderIntentDescription, '1')
    expect(result).toBeDefined()
  });

  it('method assignUserToOrderIntent should work',  () => {
    fakeOrderApiService.assignUser.and.returnValue(1)
    const result = service.assignUserToOrderIntent({} as IAssignUserToOrderIntentDescription, '1')
    expect(result).toBeDefined()
  })

  it('method deliverOrderIntent should work',  () => {
    fakeOrderApiService.deliverOrder.and.returnValue(1)
    const result = service.deliverOrderIntent({} as IDeliverOrderIntentDescription)
    expect(result).toBeDefined()
  })

  it('method logOrderWorkTimeIntent should work',  () => {
    fakeOrderApiService.logOrderWorkTime.and.returnValue(1)
    const result = service.logOrderWorkTimeIntent({} as ILogOrderWorkTimeIntentDescription, {} as ILogOrderWorkTimeData)
    expect(result).toBeDefined()
  })

  it('method deleteOrderIntent should work',  () => {
    fakeOrderApiService.deleteOrder.and.returnValue(1)
    const result = service.deleteOrderIntent({} as IDeleteOrderIntentDescription)
    expect(result).toBeDefined()
  })

  it('method deleteOrderFloorIntent should work',  () => {
    fakeOrderApiService.deleteFloor.and.returnValue(1)
    const result = service.deleteOrderFloorIntent('1', '1')
    expect(result).toBeDefined()
  })

  it('method deleteOrderAttachmentIntent should work',  () => {
    fakeOrderApiService.deleteAttachment.and.returnValue(1)
    const result = service.deleteOrderAttachmentIntent('1', '1')
    expect(result).toBeDefined()
  })

  it('method deleteOrderLogoAttachment should work',  () => {
    fakeOrderApiService.deleteLogoAttachment.and.returnValue(1)
    const result = service.deleteOrderLogoAttachment('1')
    expect(result).toBeDefined()
  })

  it('method deleteOrderWatermarkAttachment should work',  () => {
    fakeOrderApiService.deleteWatermarkAttachment.and.returnValue(1)
    const result = service.deleteOrderWatermarkAttachment('1')
    expect(result).toBeDefined()
  })

  it('method deleteOrderFloorProjectDataIntent should work',  () => {
    fakeOrderApiService.deleteFloorProjectFiles.and.returnValue(1)
    const result = service.deleteOrderFloorProjectDataIntent('1', '1')
    expect(result).toBeDefined()
  })

  it('method sendOrderActionIntent should work',  () => {
    fakeOrderApiService.sendAction.and.returnValue(1)
    const result = service.sendOrderActionIntent({} as ISendOrderActionIntentDescription, '1')
    expect(result).toBeDefined()
  })

  it('method addOrderFloorIntent should work',  () => {
    fakeOrderApiService.createFloor.and.returnValue(1)
    const result = service.addOrderFloorIntent({} as IAddOrderFloorIntentDescription, '1')
    expect(result).toBeDefined()
  })

  it('method addOrderFloorAttachmentIntent should work',  () => {
    fakeOrderApiService.addOrderFloorAttachment.and.returnValue(1)
    const result = service.addOrderFloorAttachmentIntent({} as File, 'source-file', '1')
    expect(result).toBeDefined()
  })

  it('method addOrderLogoWatermarkIntent should work',  () => {
    fakeOrderApiService.addOrderLogoWatermark.and.returnValue(1)
    const result = service.addOrderLogoWatermarkIntent({} as IAddOrderLogoWatermarkIntentDescription,'1')
    expect(result).toBeDefined()
  })

  it('method addOrderAttachmentIntent should work',  () => {
    fakeOrderApiService.addAttachment.and.returnValue(1)
    const result = service.addOrderAttachmentIntent([] as File[],'1')
    expect(result).toBeDefined()
  })

  it('method addOrderCommentIntent should work',  () => {
    fakeOrderApiService.addComment.and.returnValue(1)
    const result = service.addOrderCommentIntent({} as IAddOrderCommentIntentDescription,'1')
    expect(result).toBeDefined()
  })

  it('method uploadFilesToCloudIntent should work',  () => {
    fakeCloudApiService.upload.and.returnValue(1)
    const result = service.uploadFilesToCloudIntent([] as File[])
    expect(result).toBeDefined()
  })

})
