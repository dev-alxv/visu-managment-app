import { Order } from "src/app/domain/models/Order/order.model";
import { IOrderCollectionRequestCurrentPageData, IOrderCollectionRequestFilterData } from "src/app/domain/interfaces/order/order.interfaces";

export class OrderState {

  constructor(
    public order?: Order,
    public list?: Order[],
    public pageData?: IOrderCollectionRequestCurrentPageData,
    public filterData?: IOrderCollectionRequestFilterData
  ) {
    this.list = [];
  }
}
