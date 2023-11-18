import { ApiIntentResponseType } from "../../enums/api/api.enum";
import { IOrderDescription } from "../descriptions/api/order/description";

export interface IApiIntentResponse {
  type: ApiIntentResponseType;
}

export interface ICreateOrderIntentResponse extends IApiIntentResponse {
  createdOrder: IOrderDescription;
}
