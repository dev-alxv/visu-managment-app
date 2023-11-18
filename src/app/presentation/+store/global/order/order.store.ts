import { Injectable } from "@angular/core";

import { Store } from "../../base/base.store";
import { Order } from "src/app/domain/models/Order/order.model";
import { OrderState } from "./order.state";
import { IOrderStoreInteractAction } from "src/app/domain/interfaces/store/order/interact-actions";
import { IOrderCollectionRequestCurrentPageData } from "src/app/domain/interfaces/order/order.interfaces";

@Injectable({
  providedIn: 'root'
})
export class OrderStore extends Store<OrderState> {

  constructor() {
    super(new OrderState());
  }

  private updateOrderCollection(collection: Order[], pageData: IOrderCollectionRequestCurrentPageData): void {
    this.setState({
      ...this.state,
      order: undefined,
      list: collection,
      pageData: pageData
    });
  }

  private getSingleOrder(order: Order): void {
    this.setState({
      ...this.state,
      order
    });
  }

  /**
 *
 * @param data : { action }
 */
  public dispatchAction(data: IOrderStoreInteractAction): void {

    switch (data.action) {

      case 'UPDATE_ORDER_COLLECTION':
        this.updateOrderCollection(data.list, data.pageData);
        break;

      case 'GET_SINGLE_ORDER':
        this.getSingleOrder(data.order);
        break;
    }

  }
}
