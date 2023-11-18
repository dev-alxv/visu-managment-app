import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { IApiURLConfig } from "../../interfaces/api-config/api-config.interfaces";
import { IOrderCollectionSliceRequestDescription } from "../../interfaces/descriptions/api/order/description";

@Injectable({
  providedIn: 'root'
})
export class ApiConfig {

  constructor(

  ) { }

  public buildApiURL(urlConfig: IApiURLConfig): URL {

    let buildedUrl: URL;

    switch (urlConfig.urlType) {

      case 'Get_Authentication_Token':
        buildedUrl = new URL(`${environment.iv_main_api_v3}/user/me/token`);
        break;

      case 'Order_List':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders`);
        break;

      case 'Order_By_Search_List':
        buildedUrl = new URL(`${environment.visu_api_v1}/floorPlanOrders/search/internalIdIn/${urlConfig.urlData.searchInput}`);
        break;

      case 'Order_By_Int_Id':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/search/internalID/${urlConfig.urlData.orderId}`);
        break;

      case 'Order_By_Ext_Id':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}`);
        break;

      case 'Create_Order':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders`);
        break;

      case 'Edit_Order':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}`);
        break;

      case 'Delete_Order':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}`);
        break;

      case 'User_List':
        buildedUrl = new URL(`${environment.iv_main_api_v3}/user`);
        break;

      case 'User_List_FF':
        buildedUrl = new URL(`${environment.visu_api_v1}/user/findAll`);
        break;

      case 'Get_Authorized_User_Profile':
        buildedUrl = new URL(`${environment.iv_main_api_v3}/user/me`);
        break;

      case 'Add_Order_Attachment':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/attachments`);
        break;

      case 'Add_Order_Floor_Attachment':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/floors/${urlConfig.urlData.floorId}/source`);
        break;

      case 'Add_Order_Floor_Data':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/floor/${urlConfig.urlData.floorNumber}/projectFiles`);
        break;

      case 'Add_Order_Floor':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/floors`);
        break;

      case 'Add_Order_Comment':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/comments`);
        break;

      case 'Add_Order_Logo_Watermark':
        buildedUrl = new URL(`${environment.visu_api_v1}/floorPlanOrders/${urlConfig.urlData.orderId}/uploadWatermarkAndLogo`);
        break;

      case 'Send_Order_Action':
        buildedUrl = new URL(`${environment.visu_api_v1}/floorPlanOrders/${urlConfig.urlData.orderId}/action`);
        break;

      case 'Deliver_Order':
        buildedUrl = new URL(`${environment.visu_api_v1}/floorPlanOrders/${urlConfig.urlData.orderId}/delivery`);
        break;

      case 'Assign_User_To_Order':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/assignee`);
        break;

      case 'Delete_Order_Floor':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/floors/${urlConfig.urlData.floorId}`);
        break;

      case 'Delete_Order_Floor_Data':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/floor/${urlConfig.urlData.floorNumber}/projectFiles`);
        break;

      case 'Delete_Order_Attachment':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/attachments/${urlConfig.urlData.attachmentId}`);
        break;

      case 'Delete_Order_Logo_Attachment':
        buildedUrl = new URL(`${environment.visu_api_v1}/floorPlanOrders/${urlConfig.urlData.orderId}/logo`);
        break;

      case 'Delete_Order_Watermark_Attachment':
        buildedUrl = new URL(`${environment.visu_api_v1}/floorPlanOrders/${urlConfig.urlData.orderId}/watermark`);
        break;

      case 'Upload_Files_To_Cloud':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/attachments`);
        break;

      case 'Change_Order_Priority':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/priority`);
        break;

      case 'Log_Order_Work_Time':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/logTime`);
        break;

      case 'Emergency_Unassign_User':
        buildedUrl = new URL(`${environment.visu_api_v1}/visuOrders/${urlConfig.urlData.orderId}/emergencyAssign`);
        break;
    }

    return buildedUrl;
  }

  public parseRequestParams(
    requestParams?: IOrderCollectionSliceRequestDescription,
    type?: 'order' | 'user-collection'): HttpParams {

    let apiReqParams = new HttpParams();

    switch (type) {
      case 'order':
        // sortBy: 'id_asc'
        const defaultTourPageDataRequest: IOrderCollectionSliceRequestDescription = { page: 0, pageSize: 10 };

        apiReqParams = this.handleScopeParams(apiReqParams, Object.assign({}, defaultTourPageDataRequest, requestParams));
        break;

      case 'user-collection':
        apiReqParams = this.handleUserCollectionParams(apiReqParams);
        break;
    }

    return apiReqParams;
  }

  private handleScopeParams(baseParams: HttpParams, reqParams: IOrderCollectionSliceRequestDescription): HttpParams {

    for (const [key, value] of Object.entries(reqParams).sort((a, b) => a[0].localeCompare(b[0]))) {

      if (value instanceof Object && !Array.isArray(value)) {

        const innerObj: { [index: string]: any } = value;
        const keepTrueKeys = Object.keys(innerObj).filter((key) => innerObj[key] === true);

        baseParams = baseParams.append(`${key}`, keepTrueKeys.join(','));

      } else if (value instanceof Object && Array.isArray(value)) {

        baseParams = baseParams.append(`${key}`, value.join(','));

      } else {

        baseParams = baseParams.append(`${key}`, value);
      }

    };

    return baseParams;
  }

  private handleUserCollectionParams(baseParams: HttpParams): HttpParams {

    const FFProjectRelatedRoles: string[] = [
      // 'ADMIN',
      'VISUALIZATION_SUPERVISOR',
      'VISUALIZATION_DRAFTER',
      'VISUALIZATION_CUSTOMER'
      // 'FLOORPLAN_ADMIN',
      // 'FLOORPLAN_CUSTOMER_EDITOR',
    ];

    // Get all users with FF role
    baseParams = baseParams.append(`roles`, FFProjectRelatedRoles.join(','));

    return baseParams;
  }
}
