export interface uiOngoingActions {
  pageNavigationInProgress: boolean;
  apiRequest?: {
    fetchingOrderListPageSlice?: boolean,
    updatingSingleOrder?: {
      isTrue: boolean;
      orderId: string;
    }
  };
  apiIntent?: {

  };
};
