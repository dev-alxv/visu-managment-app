import { OrderProviderType, OrderServiceType, OrderStatusType, OrderLibraryType, OrderActionType, OrderStyleType, OrderHistoryItemEventType } from "src/app/data/enums/order/order.enum";
import { UserRoleType } from "src/app/data/enums/user/user.enum";
import { ICloudFileDescription, IExternalFileDescription } from "../common/description";

export interface IOrderCollectionSliceRequestDescription {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  // scope?: Partial<Record<RequestScopeEnum, boolean>>;
  query?: string;
  searchByIntId?: string;
  assigneeIDs?: string[];
  customerIDs?: string[];
  statuses?: string[];
  serviceTypes?: string[];
}

export interface IOrderCollectionRequestPageData {
  readonly pageTotal: number;
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  isOverdue?: string;
  assigneeID?: string;
  supervisorID?: string;
  customerID?: string;
  status?: string;
  internalID?: string;
  externalID?: string;
}

export interface IOrderCollectionSliceRequestResponseDescription {
  pageNumber: number;
  pageSize: number;
  total: number;
  content: OrderDescription[];
}

export interface IGetOrderRequestData {
  orderId: string;
  idType: 'int' | 'ext';
}

export interface ISearchOrderRequestData {
  input: string;
  searchBy: 'intId' | 'extId';
}

export interface ICreateOrderIntentDescription {
  newOrder: Partial<IOrderCreationDescription>;
}

export interface IEditOrderIntentDescription {
  editedOrder: Partial<OrderDescription>;
}
export interface IDeleteOrderIntentDescription {
  orderToDeleteId: string;
}

export interface IAddOrderFloorIntentDescription {
  floors: Partial<IOrderFloorDescription>[];
}

export interface IAddOrderAttachmentIntentDescription {
  content: any;
}

export interface IAddOrderCommentIntentDescription {
  content: string;
}

export interface IAssignUserToOrderIntentDescription {
  assigneeID: string;
}

export interface ISendOrderActionIntentDescription {
  actionType: OrderActionType;
}

export interface ILogOrderWorkTimeIntentDescription {
  logTime: number;
  comment?: string;
}

export interface ILogOrderWorkTimeData {
  orderId: string;
  completeOrder: string;
  unassignOrder: string;
}

export interface IDeliverOrderIntentDescription {
  orderId: string;
  sendAllFiles: 'true' | 'false';
}

export interface IAddOrderLogoWatermarkIntentDescription {
  watermark?: IExternalFileDescription,
  logo?: IExternalFileDescription
}

export interface IOrderCreationDescription {
  externalID: string;
  serviceType: OrderServiceType;
  priority: number;
  customerID: string;
  library: OrderLibraryType;
  deadlineDate: string;
  options: IOrderOptionsDescription;
  attachments: IExternalFileDescription[];
  floors: IOrderFloorDescription[];
}

export interface IOrderEditionDescription {
  serviceType: OrderServiceType;
  priority?: number;
  customerID: string;
  library: OrderLibraryType;
  deadlineDate: string;
  options?: IOrderOptionsDescription;
  attachments?: IExternalFileDescription[];
  floors?: IOrderFloorDescription[];
}

export interface IOrderDescription {
  id: string;
  internalID: string;
  externalID: string;
  createdBy: string;
  state: 'ACTIVE' | 'ARCHIVED';
  status: OrderStatusType;
  serviceType: OrderServiceType;
  priority: number;
  enquiryDate: string;
  deadlineDate: string;
  deliveryDate: string;
  style: OrderStyleType;
  library: OrderLibraryType;
  orderProvider: OrderProviderType;
  attachments: ICloudFileDescription[];
  comments: IOrderCommentDescription[];
  floors: IOrderFloorDescription[];
  options: IOrderOptionsDescription;
  creator: IOrderUserDataDescription;
  assignee: IOrderUserDataDescription;
  customer: IOrderUserDataDescription;
  orderHistory: IOrderHistoryItemDescription[];
}

export interface IOrderHistoryItemDescription {
  id: string;
  eventType: OrderHistoryItemEventType;
  userInfo: IOrderHistoryItemUserInfoDescription;
  data: IOrderHistoryDataItemDescription[];
}

export interface IOrderHistoryDataItemDescription {
  id: string;
  orderHistoryDataType: 'ORDER_STATUS_CHANGED' | 'ENQUIRY_DATE' | 'ASSIGNEE_USER_ID' | 'LOG_TIME_MINUTES' | 'LOG_TIME_COMMENT';
  dataObjectId: string;
  oldValue: string;
  newValue: string;
  oldUserInfo: IOrderHistoryItemUserInfoDescription;
  newUserInfo: IOrderHistoryItemUserInfoDescription;
}

export interface IOrderHistoryItemUserInfoDescription {
  email: string;
  firstName: string;
  lastName: string;
  userID: string;
  role: UserRoleType[];
}

export interface IOrderOptionsDescription {
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
  logo: ICloudFileDescription;
  waterMark: ICloudFileDescription;
}

export interface IOrderCommentDescription {
  id: string;
  content: string;
  userInfo: IOrderUserDataDescription;
}

export interface IOrderProjectFileDescription {
  id: string;
  fileType: 'DOLLHOUSE_OBJ' | 'MODEL3D_JSON' | 'EDITOR_DATA_JSON' | 'IMAGE_PNG' | 'IMAGE_JPEG';
  modifiedAt: string;
  floorNumber: number;
  file: ICloudFileDescription;
}

export interface IOrderFloorDescription {
  id?: string;
  floorNumber?: number;
  name?: string;
  sourceFile?: ICloudFileDescription;
  projectFiles?: IOrderProjectFileDescription[];
}

export interface IOrderUserDataDescription {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleType[];
}

export class OrderDescription implements IOrderDescription {

  public id: string;
  public internalID: string;
  public externalID: string;
  public createdBy: string;
  public state: 'ACTIVE' | 'ARCHIVED';
  public status: OrderStatusType;
  public serviceType: OrderServiceType;
  public priority: number;
  public enquiryDate: string;
  public deadlineDate: string;
  public deliveryDate: string;
  public style: OrderStyleType;
  public library: OrderLibraryType;
  public orderProvider: OrderProviderType;
  public attachments: ICloudFileDescription[];
  public comments: IOrderCommentDescription[];
  public floors: IOrderFloorDescription[];
  public options: IOrderOptionsDescription;
  public creator: IOrderUserDataDescription;
  public assignee: IOrderUserDataDescription;
  public customer: IOrderUserDataDescription;
  public orderHistory: IOrderHistoryItemDescription[];

  constructor(description: IOrderDescription) {
    this.id = description.id;
    this.internalID = description.internalID;
    this.externalID = description.externalID;
    this.createdBy = description.createdBy;
    this.state = description.state;
    this.status = description.status;
    this.serviceType = description.serviceType;
    this.priority = description.priority;
    this.enquiryDate = description.enquiryDate;
    this.deadlineDate = description.deadlineDate;
    this.deliveryDate = description.deliveryDate;
    this.style = description.style;
    this.library = description.library;
    this.orderProvider = description.orderProvider;
    this.attachments = description.attachments;
    this.comments = description.comments;
    this.floors = description.floors;
    this.options = description.options;
    this.creator = description.creator;
    this.assignee = description.assignee;
    this.customer = description.customer;
    this.orderHistory = description.orderHistory;
  }
}
