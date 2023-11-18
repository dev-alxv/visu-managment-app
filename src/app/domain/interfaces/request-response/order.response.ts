import { IRequestResponse } from "../common/request.response";
import { Order } from "../../models/Order/order.model";
import { IOrderCollectionRequestCurrentPageData } from "../order/order.interfaces";

export interface IOrderRequestResponseData extends IRequestResponse {
  order?: Order;
  orderCollection?: Order[];
  pageData?: IOrderCollectionRequestCurrentPageData;
}
