import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { OrderRepo } from "../repository/order.repo";
import {
  IAddOrderCommentIntent,
  IAddOrderFloorIntent,
  IAssignUserToOrderIntent,
  ICreateOrderIntent,
  IDeleteOrderAttachmentIntent,
  IDeleteOrderFloorIntent,
  IDeleteOrderIntent,
  IEditOrderIntent,
  ILogOrderWorkTimeIntent,
  IOrderCollectionRequest,
  IOrderRequest,
  ISendOrderActionIntent,
  ISendOrderAttachmentIntent,
  ISendOrderFloorActionIntent
} from "../interfaces/order/order.interfaces";
import { IOrderRequestResponseData } from "../interfaces/request-response/order.response";
import { IOrderIntentResponseData } from "../interfaces/intent-response/order.response";
import { IGetOrderRequestData } from "src/app/data/interfaces/descriptions/api/order/description";

@Injectable()
export class OrderManager {

  constructor(
    private orderRepo: OrderRepo
  ) { }

  public list(reqParams: IOrderCollectionRequest): Observable<IOrderRequestResponseData> {
    return this.orderRepo.list(reqParams);
  }

  public get(getData: IOrderRequest): Observable<IOrderRequestResponseData> {
    return this.orderRepo.get(getData);
  }

  public create(newOrderData: ICreateOrderIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.create(newOrderData);
  }

  public edit(editData: IEditOrderIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.edit(editData);
  }

  public delete(deleteData: IDeleteOrderIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.delete(deleteData);
  }

  public comment(commentData: IAddOrderCommentIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.comment(commentData);
  }

  public attach(attachData: ISendOrderAttachmentIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.attach(attachData);
  }

  public assign(assignData: IAssignUserToOrderIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.assign(assignData);
  }

  public addFloor(floorData: IAddOrderFloorIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.addFloor(floorData);
  }

  public action(actionData: ISendOrderActionIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.action(actionData);
  }

  public floorAction(actionData: ISendOrderFloorActionIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.floorAction(actionData);
  }

  public deleteFloor(deleteData: IDeleteOrderFloorIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.deleteFloor(deleteData);
  }

  public deleteAttachment(deleteData: IDeleteOrderAttachmentIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.deleteAttachment(deleteData);
  }

  public logOrderWorkTime(logData: ILogOrderWorkTimeIntent): Observable<IOrderIntentResponseData> {
    return this.orderRepo.logTime(logData);
  }
}
