import { IStoreInteractAction } from "../base/interact-actions";
import { Order } from "src/app/domain/models/Order/order.model";
import { IOrderCollectionRequestCurrentPageData } from "../../order/order.interfaces";

enum InteractActions {
  'UPDATE_ORDER_COLLECTION',
  'GET_SINGLE_ORDER'
}

type ActionType = keyof typeof InteractActions;

export interface IOrderStoreInteractAction extends IStoreInteractAction {
  action: ActionType;
  order?: Order;
  list?: Order[];
  pageData?: IOrderCollectionRequestCurrentPageData;
}
