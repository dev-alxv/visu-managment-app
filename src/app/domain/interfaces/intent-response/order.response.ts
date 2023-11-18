import { CloudFile } from "../../models/Common/common.models";
import { Order, OrderFloor } from "../../models/Order/order.model";
import { IIntentResponse } from "../common/intent.response";
import { IOrderComment } from "../order/order.interfaces";

export interface IOrderIntentResponseData extends IIntentResponse {
  createdOrder?: Order;
  changedOrder?: Order;
  cratedOrderFloorList?: OrderFloor[];
  createdOrderAttachmentsList?: CloudFile[];
  addedOrderComment?: IOrderComment;
}
