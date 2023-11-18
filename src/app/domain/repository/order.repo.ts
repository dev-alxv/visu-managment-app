import { Observable } from 'rxjs';

import { IOrderRequestResponseData } from '../interfaces/request-response/order.response';
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
} from '../interfaces/order/order.interfaces';
import { IOrderIntentResponseData } from '../interfaces/intent-response/order.response';

export abstract class OrderRepo {

  public abstract list(reqParams: IOrderCollectionRequest): Observable<IOrderRequestResponseData>;
  public abstract get(reqParams: IOrderRequest): Observable<IOrderRequestResponseData>;
  public abstract create(intentData: ICreateOrderIntent): Observable<IOrderIntentResponseData>;
  public abstract edit(intentData: IEditOrderIntent): Observable<IOrderIntentResponseData>;
  public abstract delete(intentData: IDeleteOrderIntent): Observable<IOrderIntentResponseData>;
  public abstract comment(intentData: IAddOrderCommentIntent): Observable<IOrderIntentResponseData>;
  public abstract attach(intentData: ISendOrderAttachmentIntent): Observable<IOrderIntentResponseData>;
  public abstract assign(intentData: IAssignUserToOrderIntent): Observable<IOrderIntentResponseData>;
  public abstract action(intentData: ISendOrderActionIntent): Observable<IOrderIntentResponseData>;
  public abstract logTime(intentData: ILogOrderWorkTimeIntent): Observable<IOrderIntentResponseData>;
  public abstract addFloor(intentData: IAddOrderFloorIntent): Observable<IOrderIntentResponseData>;
  public abstract floorAction(intentData: ISendOrderFloorActionIntent): Observable<IOrderIntentResponseData>;
  public abstract deleteAttachment(intentData: IDeleteOrderAttachmentIntent): Observable<IOrderIntentResponseData>;
  public abstract deleteFloor(intentData: IDeleteOrderFloorIntent): Observable<IOrderIntentResponseData>;
}
