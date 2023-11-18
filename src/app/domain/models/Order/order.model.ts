import { apiConfig } from "src/environments/environment";
import { isDefined, parseDate } from "src/app/utils/utils";
import { IOrderCommentDescription, IOrderFloorDescription, IOrderHistoryDataItemDescription, IOrderHistoryItemDescription, IOrderProjectFileDescription, IOrderUserDataDescription, OrderDescription } from "src/app/data/interfaces/descriptions/api/order/description";
import { ICloudFileDescription } from "src/app/data/interfaces/descriptions/api/common/description";
import { OrderPriorityEnum, OrderProviderType, OrderServiceType, OrderStatusType, OrderLibraryType, OrderStyleType, OrderHistoryItemEventType } from "../../enums/order/order.enum";
import { CloudFile } from "../Common/common.models";
import {
  IOrderCommentIds,
  IOrderDates,
  IOrderHistoryEventChangeData,
  IOrderHistoryLogTimeEventData,
  IOrderIDs,
  IOrderOptions,
  IOrderUserData
} from "../../interfaces/order/order.interfaces";
import { IUserProfile } from "../../interfaces/user/user.interfaces";
import { setUserRoles } from "../User/user.model";

export class Order {

  public ids: IOrderIDs;
  public orderDates: IOrderDates;
  public style: OrderStyleType;
  public library: OrderLibraryType;
  public priority: OrderPriorityEnum;
  public state: 'ACTIVE' | 'ARCHIVED';
  public status: OrderStatusType;
  public serviceType: OrderServiceType;
  public orderProvider: OrderProviderType;
  public floors: OrderFloor[];
  public comments: OrderComment[];
  public attachments: CloudFile[];
  public options: IOrderOptions;
  public userData: IOrderUserData;
  public orderHistory: OrderHistory;

  constructor(orderDescription: OrderDescription) {

    // Set IDs
    this.ids = {
      main: orderDescription.id,
      internal: orderDescription.internalID,
      external: orderDescription.externalID
    };

    // Set order dates
    this.orderDates = {
      delivery: isDefined(orderDescription.deliveryDate) ? parseDate(orderDescription.deliveryDate) : '-',
      deadline: isDefined(orderDescription.deadlineDate) ? parseDate(orderDescription.deadlineDate) : '-'
    };

    // Set enquiry date from the ID => https://steveridout.github.io/
    if (isDefined(orderDescription.id)) {
      this.orderDates.enquiry = parseDate(new Date(parseInt(orderDescription.id.substring(0, 8), 16) * 1000).toISOString());
    };

    // Set style
    if (isDefined(orderDescription.style)) {
      this.style = orderDescription.style;
    };

    // Set library
    if (isDefined(orderDescription.library)) {
      this.library = orderDescription.library;
    };

    // Set state
    if (isDefined(orderDescription.state)) {
      this.state = orderDescription.state;
    };

    // Set status
    if (isDefined(orderDescription.status)) {
      this.status = orderDescription.status;
    } else {
      this.status = 'NEW';
    };

    // Set priority
    if (isDefined(orderDescription.priority)) {
      switch (true) {

        case orderDescription.priority >= 13 && orderDescription.priority <= 15:
          this.priority = OrderPriorityEnum.Highest
          break;

        case orderDescription.priority >= 10 && orderDescription.priority <= 12:
          this.priority = OrderPriorityEnum.High
          break;

        case orderDescription.priority >= 7 && orderDescription.priority <= 9:
          this.priority = OrderPriorityEnum.Medium
          break;

        case orderDescription.priority >= 4 && orderDescription.priority <= 6:
          this.priority = OrderPriorityEnum.Low
          break;

        case orderDescription.priority >= 0 && orderDescription.priority <= 3:
          this.priority = OrderPriorityEnum.Lowest
          break;
      };
    };

    // Set service type
    if (isDefined(orderDescription.serviceType)) {
      this.serviceType = orderDescription.serviceType;
    };

    // Set order provider
    if (isDefined(orderDescription.orderProvider)) {
      this.orderProvider = orderDescription.orderProvider;
    };

    // Set floors
    if (isDefined(orderDescription.floors) && orderDescription.floors.length) {
      this.floors = orderDescription.floors.map((description: IOrderFloorDescription) => new OrderFloor(description, orderDescription.id));
    };

    // Set comments
    if (isDefined(orderDescription.comments) && orderDescription.comments.length) {
      this.comments = orderDescription.comments.map((description: IOrderCommentDescription) => new OrderComment(description));
    };

    // Set attachments
    if (isDefined(orderDescription.attachments) && orderDescription.attachments.length) {
      this.attachments = orderDescription.attachments.map((description: ICloudFileDescription) => new CloudFile(description));
    };

    // Set options
    if (isDefined(orderDescription.options)) {
      this.options = orderDescription.options;

      // Set style
      if (orderDescription.options.style) {
        this.options.style = orderDescription.options.style;
      } else {
        this.options.style = undefined;
      }

      // Set logo
      if (orderDescription.options.logo && orderDescription.options.logo.id) {

        this.options.logo = new CloudFile(orderDescription.options.logo);

        // set created date from the ID => https://steveridout.github.io/
        this.options.logo.dateCreated = parseDate(
          new Date(parseInt(orderDescription.options.logo.id.substring(0, 8), 16) * 1000).toISOString()
        );
      }

      // Set waterMark
      if (orderDescription.options.waterMark && orderDescription.options.waterMark.id) {

        this.options.waterMark = new CloudFile(orderDescription.options.waterMark);

        // set created date from the ID => https://steveridout.github.io/
        this.options.waterMark.dateCreated = parseDate(
          new Date(parseInt(orderDescription.options.waterMark.id.substring(0, 8), 16) * 1000).toISOString()
        );
      }
    };

    // Set project files
    // if (isDefined(orderDescription.projectFiles)) {
    //   this.projectFiles = orderDescription.projectFiles.map((description: IOrderProjectFileDescription) => new OrderProjectFile(description));
    // }

    // Set user data
    // Initiate user data object
    this.userData = {} as IOrderUserData;
    //
    if (isDefined(orderDescription.creator)) {
      this.userData.creator = this.setOrderUserData(orderDescription.creator);
    };
    //
    if (isDefined(orderDescription.assignee)) {
      this.userData.assignee = this.setOrderUserData(orderDescription.assignee);
    };
    //
    if (isDefined(orderDescription.customer)) {
      this.userData.customer = this.setOrderUserData(orderDescription.customer);
    };

    // set Order history
    if (orderDescription) {
      this.orderHistory = new OrderHistory(orderDescription.orderHistory);
    }
  }

  private setOrderUserData(description: IOrderUserDataDescription): IUserProfile {

    const userData: IUserProfile = {
      id: description.userID,
      names: {
        first: description.firstName,
        last: description.lastName
      },
      contact: {
        email: description.email
      }
    } as IUserProfile;

    if (isDefined(description.role) && description.role.length) {
      userData.roles = setUserRoles(description.role);
    }

    // Set hardcoded name for Imogent test account
    if (description.userID === '612df3511cf3ad1d07943b12') {
      userData.names.first = 'imogent_test_account';
    }

    return userData;
  }
}

export class OrderFloor {

  public readonly id: string;
  public name: string;
  public floorNumber: number;
  public sourceFile?: CloudFile;
  public projectFile?: OrderProjectFile;
  public projectFileJSON?: OrderProjectFile;
  public projectFilesDescription?: IOrderProjectFileDescription[];
  public visuEditorLink?: string;

  constructor(orderFloorDescription?: IOrderFloorDescription, orderId?: string) {

    this.id = orderFloorDescription.id;
    this.floorNumber = orderFloorDescription.floorNumber;
    this.name = orderFloorDescription.name;

    // set source file
    if (isDefined(orderFloorDescription.sourceFile)) {
      this.sourceFile = new CloudFile(orderFloorDescription.sourceFile);
    };

    // set visu editor link
    // https://sandy.immoviewer.com/visu-editor/?orderId=612c892c8b745708b29a9d15&floor=1
    if (isDefined(orderId)) {
      this.visuEditorLink = `${apiConfig.apiURL}visu-editor/?orderId=${orderId}&floor=${orderFloorDescription.floorNumber}`;
    }

    // set project file data
    if (orderFloorDescription.projectFiles && orderFloorDescription.projectFiles.length > 0) {

      const pngFiles: IOrderProjectFileDescription[] = orderFloorDescription.projectFiles.filter((file: IOrderProjectFileDescription) => file.fileType === 'IMAGE_PNG');
      const jpegFiles: IOrderProjectFileDescription[] = orderFloorDescription.projectFiles.filter((file: IOrderProjectFileDescription) => file.fileType === 'IMAGE_JPEG');
      const jsonFiles: IOrderProjectFileDescription[] = orderFloorDescription.projectFiles.filter((file: IOrderProjectFileDescription) => file.fileType === 'EDITOR_DATA_JSON');

      const floorRelatedFile: IOrderProjectFileDescription = pngFiles.find((file: IOrderProjectFileDescription) => file.floorNumber === orderFloorDescription.floorNumber);
      const floorRelatedJSONFile: IOrderProjectFileDescription = jsonFiles.find((file: IOrderProjectFileDescription) => file.floorNumber === orderFloorDescription.floorNumber);

      if (isDefined(floorRelatedFile)) {
        this.projectFile = new OrderProjectFile(floorRelatedFile);
      }

      if (isDefined(jsonFiles) && jsonFiles.length) {
        this.projectFileJSON = new OrderProjectFile(jsonFiles[jsonFiles.length - 1]);
      }

      // set original files
      this.projectFilesDescription = orderFloorDescription.projectFiles;
    }
  }
}

export class OrderProjectFile {

  public readonly id: string;
  public data: CloudFile;
  public type: string;
  public floorNumber: number;
  public modifiedAt: string;

  constructor(description: IOrderProjectFileDescription) {

    this.id = description.id;
    this.data = new CloudFile(description.file);
    this.type = description.fileType;
    this.floorNumber = description.floorNumber;

    if (description.modifiedAt) {
      this.modifiedAt = parseDate(description.modifiedAt);
    }
  }
}

export class OrderComment {

  public ids: IOrderCommentIds;
  public creator: IUserProfile;
  public content: string;
  public date: string;

  constructor(orderCommentDescription: IOrderCommentDescription) {

    // set ids
    this.ids = {
      main: orderCommentDescription.id,
      userID: isDefined(orderCommentDescription.userInfo) ? orderCommentDescription.userInfo.userID : ''
    }

    // set creator
    if (isDefined(orderCommentDescription.userInfo)) {
      this.creator = {
        id: orderCommentDescription.userInfo.userID,
        // roles: setUserRoles(orderCommentDescription.userInfo.role),
        names: {
          first: orderCommentDescription.userInfo.firstName,
          last: orderCommentDescription.userInfo.lastName
        },
        contact: {
          email: orderCommentDescription.userInfo.email
        }
      }
    }

    // set content
    this.content = orderCommentDescription.content;

    // set created date from the ID => https://steveridout.github.io/
    this.date = parseDate(
      new Date(parseInt(orderCommentDescription.id.substring(0, 8), 16) * 1000).toISOString()
    );
  }
}

export class OrderHistory {

  public historyEvents: OrderHistoryEvent[];

  constructor(orderHistoryDescription: IOrderHistoryItemDescription[]) {

    // set history events
    if (isDefined(orderHistoryDescription)) {

      // this.historyEvents = orderHistoryDescription.map((description: IOrderHistoryItemDescription) => new OrderHistoryEvent(description));

      // this.historyEvents.forEach((event: OrderHistoryEvent) => {

      // });

      this.historyEvents = [
        // { id: '1', userId: '1', creator: 'Ivo', date: 'Today', type: 'ORDER_CREATED', orderStatusChangeValue: null, multiEventDataChangeList: [] },
        ...orderHistoryDescription.map((description: IOrderHistoryItemDescription) => new OrderHistoryEvent(description))
      ];

      // Show newest item first
      this.historyEvents.reverse();
    }
  }
}

export class OrderHistoryEvent {

  public id: string;
  public userId: string;
  public creator: string;
  public date: string;
  public type: OrderHistoryItemEventType;
  public logTimeData: IOrderHistoryLogTimeEventData;
  public orderStatusChangeValue: IOrderHistoryEventChangeData;
  public multiEventDataChangeList: IOrderHistoryEventChangeData[] = [];

  constructor(orderHistoryEventDescription: IOrderHistoryItemDescription) {

    // set id
    this.id = orderHistoryEventDescription.id;

    // set type
    this.type = orderHistoryEventDescription.eventType;

    //
    // this.userId = orderHistoryEventDescription.userId;

    //
    if (isDefined(orderHistoryEventDescription.userInfo)) {

      if (isDefined(orderHistoryEventDescription.userInfo.firstName)) {
        this.creator = orderHistoryEventDescription.userInfo.firstName + ' ' + orderHistoryEventDescription.userInfo.lastName;
      } else {
        this.creator = orderHistoryEventDescription.userInfo.email;
      }
    }

    // set order history data
    if (isDefined(orderHistoryEventDescription.data) && orderHistoryEventDescription.data.length) {

      const logTimeData: IOrderHistoryDataItemDescription = orderHistoryEventDescription.data.find((data: IOrderHistoryDataItemDescription) => data.orderHistoryDataType === 'LOG_TIME_MINUTES');
      const logTimeCommentData: IOrderHistoryDataItemDescription = orderHistoryEventDescription.data.find((data: IOrderHistoryDataItemDescription) => data.orderHistoryDataType === 'LOG_TIME_COMMENT');

      switch (orderHistoryEventDescription.eventType) {

        case 'ORDER_CREATED':
          for (const data of orderHistoryEventDescription.data) {

            const event: IOrderHistoryEventChangeData = {
              eventType: data.orderHistoryDataType,
              newValue: data.newValue
            }

            this.multiEventDataChangeList.push(event);
          };
          break;

        case 'ORDER_STATUS_CHANGED':
          this.orderStatusChangeValue = {
            newValue: orderHistoryEventDescription.data[0].newValue,
            oldValue: orderHistoryEventDescription.data[0].oldValue,
            eventType: orderHistoryEventDescription.data[0].orderHistoryDataType
          };
          break;

        case 'USER_ASSIGNED_TO_ORDER':
          this.orderStatusChangeValue = {
            newValue: orderHistoryEventDescription.data[0].newValue,
            eventType: orderHistoryEventDescription.data[0].orderHistoryDataType
          }

          if (isDefined(orderHistoryEventDescription.data[0].newUserInfo)) {

            this.orderStatusChangeValue.newUserInfo = {
              id: orderHistoryEventDescription.data[0].newUserInfo ? orderHistoryEventDescription.data[0].newUserInfo.userID : 'undefined',
              // roles: setUserRoles(orderHistoryEventDescription.data[0].newUserInfo.role),
              names: {
                first: orderHistoryEventDescription.data[0].newUserInfo.firstName,
                last: orderHistoryEventDescription.data[0].newUserInfo.lastName
              },
              contact: {
                email: orderHistoryEventDescription.data[0].newUserInfo.email
              }
            }
          };
          break;

        case 'LOG_TIME':

          this.logTimeData = {
            time: isDefined(logTimeData) ? logTimeData.newValue : undefined,
            comment: isDefined(logTimeCommentData) ? logTimeCommentData.newValue : undefined,
          }
          break;

        case 'LOG_TIME_FINISH':

          this.logTimeData = {
            time: isDefined(logTimeData) ? logTimeData.newValue : undefined,
            comment: isDefined(logTimeCommentData) ? logTimeCommentData.newValue : undefined,
          }
          break;

        default:
          break;
      }
    }

    // set date
    if (isDefined(orderHistoryEventDescription.id)) {
      // set created date from the ID => https://steveridout.github.io/
      this.date = parseDate(
        new Date(parseInt(orderHistoryEventDescription.id.substring(0, 8), 16) * 1000).toISOString()
      );
    }
  }
}
