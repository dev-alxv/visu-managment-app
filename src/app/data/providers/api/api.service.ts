import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthApiService } from "../auth/auth-api.service";
import { OrderApiService } from "./Order/order-api.service";
import { UserApiService } from "./User/user-api.service";
import { CloudApiService } from "./Cloud/cloud-api.service";
import { IAuthDescription } from "../../interfaces/descriptions/api/auth/description";
import {
  ICreateOrderIntentDescription,
  IOrderCollectionSliceRequestResponseDescription,
  IOrderCollectionSliceRequestDescription,
  IOrderDescription,
  IDeleteOrderIntentDescription,
  IAddOrderCommentIntentDescription,
  IOrderCommentDescription,
  IAddOrderFloorIntentDescription,
  IOrderFloorDescription,
  IAssignUserToOrderIntentDescription,
  IEditOrderIntentDescription,
  ISendOrderActionIntentDescription,
  IOrderProjectFileDescription,
  OrderDescription,
  IGetOrderRequestData,
  IAddOrderLogoWatermarkIntentDescription,
  ISearchOrderRequestData,
  IDeliverOrderIntentDescription,
  ILogOrderWorkTimeIntentDescription,
  ILogOrderWorkTimeData
} from "../../interfaces/descriptions/api/order/description";
import { IAuthenticationRequest } from "src/app/domain/interfaces/auth/auth.interfaces";
import { IUserCollectionRequestResponseDescription, IUserRequestResponseDescription, IVisuUserCollectionRequestResponseDescription } from "../../interfaces/descriptions/api/user/description";
import { ICloudFileDescription } from "../../interfaces/descriptions/api/common/description";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private authApiService: AuthApiService,
    private userApiService: UserApiService,
    private orderApiService: OrderApiService,
    private cloudApiService: CloudApiService
  ) { }

  public getAuthenticationTokenRequest(authData: IAuthenticationRequest): Observable<IAuthDescription> {
    return this.authApiService.obtainAccessToken(authData);
  }

  public getRefreshedAuthenticationTokenRequest(oldToken: string): Observable<IAuthDescription> {
    return this.authApiService.obtainRefreshAccessToken(oldToken);
  }

  public getAuthorizedUserProfileRequest(): Observable<IUserRequestResponseDescription> {
    return this.userApiService.getAuthorizedUserProfile();
  }

  public getOrderCollectionSliceRequest(sliceParams: IOrderCollectionSliceRequestDescription): Observable<IOrderCollectionSliceRequestResponseDescription> {
    return this.orderApiService.getOrderCollectionSlice(sliceParams);
  }

  public getOrderCollectionBySearchRequest(searchData: ISearchOrderRequestData): Observable<OrderDescription[]> {
    return this.orderApiService.getOrderCollectionBySearch(searchData);
  }

  public getOrderRequest(getData: IGetOrderRequestData): Observable<OrderDescription> {
    return this.orderApiService.getOrder(getData);
  }

  public getUserCollectionRequest(): Observable<IVisuUserCollectionRequestResponseDescription> {
    return this.userApiService.getUserCollection();
  }

  public createOrderIntent(newOrderData: ICreateOrderIntentDescription): Observable<IOrderDescription> {
    return this.orderApiService.createOrder(newOrderData);
  }

  public editOrderIntent(editData: IEditOrderIntentDescription, orderId: string): Observable<IOrderDescription> {
    return this.orderApiService.editOrder(editData, orderId)
  }

  public assignUserToOrderIntent(assignData: IAssignUserToOrderIntentDescription, orderId: string): Observable<null> {
    return this.orderApiService.assignUser(assignData, orderId);
  }

  public deliverOrderIntent(deliverData: IDeliverOrderIntentDescription): Observable<IOrderDescription> {
    return this.orderApiService.deliverOrder(deliverData);
  }

  public logOrderWorkTimeIntent(intentData: ILogOrderWorkTimeIntentDescription, logTimeData: ILogOrderWorkTimeData): Observable<IOrderDescription> {
    return this.orderApiService.logOrderWorkTime(intentData, logTimeData);
  }

  public deleteOrderIntent(deleteData: IDeleteOrderIntentDescription): Observable<null> {
    return this.orderApiService.deleteOrder(deleteData);
  }

  public deleteOrderFloorIntent(floorId: string, orderId: string): Observable<null> {
    return this.orderApiService.deleteFloor(floorId, orderId);
  }

  public deleteOrderAttachmentIntent(attachmentId: string, orderId: string): Observable<null> {
    return this.orderApiService.deleteAttachment(attachmentId, orderId);
  }

  public deleteOrderLogoAttachment(orderId: string): Observable<null> {
    return this.orderApiService.deleteLogoAttachment(orderId);
  }

  public deleteOrderWatermarkAttachment(orderId: string): Observable<null> {
    return this.orderApiService.deleteWatermarkAttachment(orderId);
  }

  public deleteOrderFloorProjectDataIntent(floorNumber: string, orderId: string): Observable<null> {
    return this.orderApiService.deleteFloorProjectFiles(floorNumber, orderId);
  }

  public sendOrderActionIntent(actionData: ISendOrderActionIntentDescription, orderId: string): Observable<IOrderDescription> {
    return this.orderApiService.sendAction(actionData, orderId);
  }

  public addOrderFloorIntent(floorData: IAddOrderFloorIntentDescription, orderId: string): Observable<Partial<IOrderFloorDescription>[]> {
    return this.orderApiService.createFloor(floorData, orderId);
  }

  public addOrderFloorAttachmentIntent(attachData: File, type: 'source-file' | 'json-file', orderId: string, floorId?: string, floorNumber?: string): Observable<Partial<ICloudFileDescription> | Partial<IOrderProjectFileDescription[]>> {
    return this.orderApiService.addOrderFloorAttachment(attachData, type, orderId, floorId, floorNumber);
  }

  public addOrderLogoWatermarkIntent(attachData: IAddOrderLogoWatermarkIntentDescription, orderId: string): Observable<null> {
    return this.orderApiService.addOrderLogoWatermark(attachData, orderId);
  }

  public addOrderAttachmentIntent(attachData: File[], orderId: string): Observable<Partial<ICloudFileDescription>[]> {
    return this.orderApiService.addAttachment(attachData, orderId);
  }

  public addOrderCommentIntent(commentData: IAddOrderCommentIntentDescription, orderId: string): Observable<IOrderCommentDescription> {
    return this.orderApiService.addComment(commentData, orderId);
  }

  public uploadFilesToCloudIntent(uploadData: File[]): Observable<ICloudFileDescription[]> {
    return this.cloudApiService.upload(uploadData);
  }
}
