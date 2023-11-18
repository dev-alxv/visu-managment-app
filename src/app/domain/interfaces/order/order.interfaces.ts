import { OrderActionType, OrderFloorActionType, OrderStyleType } from "../../enums/order/order.enum";
import { CloudFile } from "../../models/Common/common.models";
import { Order, OrderFloor } from "../../models/Order/order.model";
import { IUserProfile } from "../user/user.interfaces";

export interface IOrderCollectionRequest {
  pageData?: {
    pageNumber?: number,
    ordersPerPage?: number
  };
  searchData?: {
    input: string;
  };
  filterData?: IOrderCollectionRequestFilterData
  // requestScope?: Partial<Record<RequestScopeEnum, boolean>>
}

export interface IOrderRequest {
  orderId: string;
  idType: 'int' | 'ext';
}

export interface IOrderCollectionRequestFilterData {
  users?: string[];
  statuses?: string[];
  customers?: string[];
  services?: string[];
  sortBy?: string;
}

export interface IOrderCollectionRequestCurrentPageData {
  readonly pageTotal: number;
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  assignees?: string[];
  customers?: string[];
  statuses?: string[];
  services?: string[];
  searchData?: {
    input: string;
  };
}

export interface ICreateOrderIntent {
  customerId?: string,
  newOrder: Partial<Order>;
  newFloors?: Partial<OrderFloor>[];
  newAttachments?: File[];
  newLogoWatermark?: {
    logo: File;
    watermark: File;
  }
}

export interface IEditOrderIntent {
  orderId: string;
  changedOrderData: Partial<Order>;
  customerId: string;
  newFloors?: Partial<OrderFloor>[];
  newAttachments?: File[];
  newLogo?: File;
  newWatermark?: File;
}

export interface IDeleteOrderIntent {
  orderToDeleteId: string;
}

export interface IDeleteOrderFloorIntent {
  orderId: string;
  floorToDeleteId: string;
}

export interface IDeleteOrderAttachmentIntent {
  orderId: string;
  attachmentToDeleteId: string;
  attachmentType: 'Data' | 'Logo' | 'Watermark';
}

export interface IAddOrderFloorIntent {
  orderId: string;
  floorList?: Partial<OrderFloor>[];
}

export interface IAddOrderCommentIntent {
  orderId: string;
  commentText: string;
}

export interface IAssignUserToOrderIntent {
  orderId: string;
  userId: string;
}

export interface IChangeToPriorityOrderIntent {
  orderId: string;
  priority: any;
}

export interface ISendOrderActionIntent {
  orderId: string;
  actionType: OrderActionType;
}

export interface ISendOrderFloorActionIntent {
  orderId: string;
  floorId?: string;
  floorNumber?: string;
  actionType: OrderFloorActionType;
  sourceFile?: File;
}

export interface ISendOrderAttachmentIntent {
  orderId: string;
  attachments?: File[];
  logo?: File;
  watermark?: File;
}

export interface ILogOrderWorkTimeIntent {
  orderId: string;
  timeLogged: string;
  completeOrder?: boolean;
  unassignOrder?: boolean;
  comment?: string;
}

export interface IOrderIDs {
  readonly main: string;
  readonly internal: string;
  external: string;
}

export interface IOrderDates {
  enquiry?: string;
  deadline: string;
  delivery: string;
}

export interface IOrderUserData {
  creator?: IUserProfile;
  supervisor?: IUserProfile;
  assignee?: IUserProfile;
  customer?: IUserProfile;
}

export interface IOrderOptions {
  drawingType: string;
  hasAlignNorth: boolean;
  hasDimensionalChains: boolean;
  hasFlatDesignation: boolean;
  hasFloorplanDesignations: boolean;
  hasFurniture: boolean;
  hasIndividualFloor: boolean;
  hasIsometric: boolean;
  hasMeterBars: boolean;
  hasNorthArrow: boolean;
  hasRoomDesignation: boolean;
  hasSquareMeterSpecifications: boolean;
  hasTrueScaleOnA4: boolean;
  squareMeterSpecificationsType: string;
  style: OrderStyleType;
  trueToScaleRatioType: string;
  units: number;
  logo: Partial<CloudFile>;
  waterMark: Partial<CloudFile>;
}

export interface IOrderComment {
  ids: {
    readonly main: string
    readonly userID: string;
  };
  creator?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  content: string;
  date: string;
}

export interface IOrderCommentIds {
  readonly main: string
  readonly userID?: string;
}

export interface IOrderFloor {
  readonly id: string;
  floorNumber: number;
  name: string;
  sourceFile: ICloudFile;
}

export interface ICloudFile {
  readonly id: string;
  name: string;
  url: string;
  description: string;
  urlPath: string;
  externalLink: string;
  // Temp filed
  dateCreated?: string;
}

export interface IExternalFile {
  name?: string;
  description?: string;
  externalLink?: string;
  dateCreated?: string;
}

export interface IOrderHistoryEventChangeData {
  eventType: 'ORDER_STATUS_CHANGED' | 'ENQUIRY_DATE' | 'ASSIGNEE_USER_ID' | 'LOG_TIME_MINUTES' | 'LOG_TIME_COMMENT';
  newValue: string;
  oldValue?: string;
  newUserInfo?: IUserProfile;
  oldUserInfo?: IUserProfile;
}

export interface IOrderHistoryLogTimeEventData {
  time: string;
  comment: string;
}
