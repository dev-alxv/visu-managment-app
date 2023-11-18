import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ApiConfig } from '../api.config';
import {
  ICreateOrderIntentDescription,
  IOrderCollectionSliceRequestResponseDescription,
  IOrderCollectionSliceRequestDescription,
  IOrderDescription,
  OrderDescription,
  IDeleteOrderIntentDescription,
  IEditOrderIntentDescription,
  IAddOrderCommentIntentDescription,
  IOrderCommentDescription,
  IAddOrderFloorIntentDescription,
  IOrderFloorDescription,
  IAssignUserToOrderIntentDescription,
  ISendOrderActionIntentDescription,
  IOrderProjectFileDescription,
  IGetOrderRequestData,
  IAddOrderLogoWatermarkIntentDescription,
  ISearchOrderRequestData,
  IDeliverOrderIntentDescription,
  ILogOrderWorkTimeIntentDescription,
  ILogOrderWorkTimeData
} from 'src/app/data/interfaces/descriptions/api/order/description';
import { ICloudFileDescription } from 'src/app/data/interfaces/descriptions/api/common/description';
import { isDefined } from 'src/app/utils/utils';
import {LoggerService} from "src/app/utils/logger.service";

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig,
    private loggerService: LoggerService
  ) { }

  private parseOrderCollectionDescription(orderCollectionDescription: IOrderDescription[]): OrderDescription[] {
    return orderCollectionDescription.map((description: IOrderDescription) => new OrderDescription(description));
  }

  public getOrderCollectionSlice(sliceParams: IOrderCollectionSliceRequestDescription): Observable<IOrderCollectionSliceRequestResponseDescription> {

    const orderListReqUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Order_List' });
    const orderListReqParams: HttpParams = this.apiConfig.parseRequestParams(sliceParams, 'order');

    return this.http.get<IOrderCollectionSliceRequestResponseDescription>(orderListReqUrl.href, { params: orderListReqParams })
      .pipe(
        map((resp: IOrderCollectionSliceRequestResponseDescription) => {

          if (environment.forTestPurpose) {
            this.loggerService.info('Data layer >> Order Collection Slice: ', resp, this.constructor.name)
          }

          resp.content = this.parseOrderCollectionDescription(resp.content);
          return resp
        })
      );
  }

  public getOrderCollectionBySearch(searchData: ISearchOrderRequestData): Observable<OrderDescription[]> {

    const orderListReqUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Order_By_Search_List', urlData: { searchInput: searchData.input } });

    return this.http.get<IOrderDescription[]>(orderListReqUrl.href)
      .pipe(
        map((response: IOrderDescription[]) => this.parseOrderCollectionDescription(response))
      );
  }

  public getOrder(getData: IGetOrderRequestData): Observable<OrderDescription> {

    const orderByIdReqUrl: URL = this.apiConfig.buildApiURL({ urlType: getData.idType === 'int' ? 'Order_By_Int_Id' : 'Order_By_Ext_Id', urlData: { orderId: getData.orderId } });

    return this.http.get<IOrderDescription>(orderByIdReqUrl.href)
      .pipe(
        map((description: IOrderDescription) => new OrderDescription(description))
      );
  }

  public createOrder(createData: ICreateOrderIntentDescription): Observable<IOrderDescription> {

    const createOrderIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Create_Order' });

    return this.http.post<IOrderDescription>(createOrderIntentUrl.href, createData.newOrder);
  }

  public editOrder(editData: IEditOrderIntentDescription, orderId: string): Observable<IOrderDescription> {

    const editOrderIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Edit_Order', urlData: { orderId: orderId } });

    return this.http.put<IOrderDescription>(editOrderIntentUrl.href, editData.editedOrder);
  }

  public deleteOrder(deleteData: IDeleteOrderIntentDescription): Observable<null> {

    const deleteOrderIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Delete_Order', urlData: { orderId: deleteData.orderToDeleteId } });

    return this.http.delete<null>(deleteOrderIntentUrl.href);
  }

  public createFloor(floorData: IAddOrderFloorIntentDescription, orderId: string): Observable<Partial<IOrderFloorDescription>[]> {

    const createOrderFloorIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Add_Order_Floor', urlData: { orderId: orderId } });

    return this.http.post<Partial<IOrderFloorDescription>[]>(createOrderFloorIntentUrl.href, floorData.floors);
  }

  public sendAction(actionData: ISendOrderActionIntentDescription, orderId: string): Observable<IOrderDescription> {

    const actionOrderIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Send_Order_Action', urlData: { orderId: orderId } });

    return this.http.post<IOrderDescription>(actionOrderIntentUrl.href, actionData);
  }

  public deliverOrder(deliverData: IDeliverOrderIntentDescription): Observable<IOrderDescription> {

    const deliverOrderIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Deliver_Order', urlData: { orderId: deliverData.orderId } });
    const deliverOrderIntentParams: HttpParams = new HttpParams().append('sendAllFiles', deliverData.sendAllFiles);

    return this.http.post<IOrderDescription>(deliverOrderIntentUrl.href, null, { params: deliverOrderIntentParams });
  }

  public deleteFloor(floorId: string, orderId: string): Observable<null> {

    const deleteFloorIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Delete_Order_Floor', urlData: { orderId, floorId } });

    return this.http.delete<null>(deleteFloorIntentUrl.href);
  }

  public deleteFloorProjectFiles(floorNumber: string, orderId: string): Observable<null> {

    const deleteFloorDataIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Delete_Order_Floor_Data', urlData: { orderId, floorNumber } });

    return this.http.delete<null>(deleteFloorDataIntentUrl.href);
  }

  public addComment(commentData: IAddOrderCommentIntentDescription, orderId: string): Observable<IOrderCommentDescription> {

    const addOrderCommentIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Add_Order_Comment', urlData: { orderId: orderId } });

    return this.http.post<IOrderCommentDescription>(addOrderCommentIntentUrl.href, commentData);
  }

  public deleteComment(): void {

  }

  public addAttachment(attachData: File[], orderId: string): Observable<Partial<ICloudFileDescription>[]> {

    const formData = new FormData();

    const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });

    const addOrderAttachmentIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Add_Order_Attachment', urlData: { orderId: orderId } });

    for (const file of attachData) {
      formData.append('files', file);
    }

    return this.http.post<Partial<ICloudFileDescription>[]>(addOrderAttachmentIntentUrl.href, formData);
  }

  public deleteAttachment(attachmentId: string, orderId: string): Observable<null> {

    const deleteAttachmentIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Delete_Order_Attachment', urlData: { orderId, attachmentId } });

    return this.http.delete<null>(deleteAttachmentIntentUrl.href);
  }

  public deleteLogoAttachment(orderId: string): Observable<null> {

    const deleteLogoIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Delete_Order_Logo_Attachment', urlData: { orderId } });

    return this.http.delete<null>(deleteLogoIntentUrl.href);
  }

  public deleteWatermarkAttachment(orderId: string): Observable<null> {

    const deleteWatermarkIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Delete_Order_Watermark_Attachment', urlData: { orderId } });

    return this.http.delete<null>(deleteWatermarkIntentUrl.href);
  }

  public addOrderFloorAttachment(attachedFile: File, type: 'source-file' | 'json-file', orderId: string, floorId?: string, floorNumber?: string): Observable<Partial<ICloudFileDescription> | Partial<IOrderProjectFileDescription[]>> {

    const formData = new FormData();

    if (type === 'source-file') {
      const addAttachmentIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Add_Order_Floor_Attachment', urlData: { orderId, floorId } });

      formData.append('file', attachedFile);

      return this.http.post<Partial<ICloudFileDescription>>(addAttachmentIntentUrl.href, formData);
    } else {
      const addDataIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Add_Order_Floor_Data', urlData: { orderId, floorNumber } });

      formData.append('editorDataJson', attachedFile);

      return this.http.post<Partial<IOrderProjectFileDescription[]>>(addDataIntentUrl.href, formData);
    }
  }

  public addOrderLogoWatermark(addData: IAddOrderLogoWatermarkIntentDescription, orderId: string): Observable<null> {

    const addOrderLogoWatermarkIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Add_Order_Logo_Watermark', urlData: { orderId: orderId } });

    return this.http.put<null>(addOrderLogoWatermarkIntentUrl.href, addData);
  }

  public assignUser(assignData: IAssignUserToOrderIntentDescription, orderId: string): Observable<null> {

    const assignUserIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Assign_User_To_Order', urlData: { orderId: orderId } });

    return this.http.put<null>(assignUserIntentUrl.href, assignData);
  }

  public changeOrderPriority(priorityData: any, orderId: string): Observable<null> {

    const changeOrderPriorityIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Change_Order_Priority', urlData: { orderId: orderId } });

    return this.http.put<null>(changeOrderPriorityIntentUrl.href, priorityData);
  }

  public logOrderWorkTime(intentData: ILogOrderWorkTimeIntentDescription, logTimeData: ILogOrderWorkTimeData): Observable<IOrderDescription> {

    const logOrderWorkTimeIntentParams: HttpParams = new HttpParams(
      { fromObject: { 'finish': logTimeData.completeOrder, 'unassign': logTimeData.unassignOrder } }
    );

    const logOrderWorkTimeIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Log_Order_Work_Time', urlData: { orderId: logTimeData.orderId } });

    return this.http.post<IOrderDescription>(logOrderWorkTimeIntentUrl.href, intentData, { params: logOrderWorkTimeIntentParams });
  }

  public useEmergencyUnassign(orderId: string): Observable<IOrderDescription> {

    const unassignIntentUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Emergency_Unassign_User', urlData: { orderId: orderId } });

    return this.http.post<IOrderDescription>(unassignIntentUrl.href, null);
  }
}
