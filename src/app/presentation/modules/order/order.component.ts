import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {FileUploadControl} from '@iplab/ngx-file-upload';

import {Order, OrderFloor} from 'src/app/domain/models/Order/order.model';
import {OrderState} from '../../+store/global/order/order.state';
import {OrderStore} from '../../+store/global/order/order.store';
import {OrderService} from '../../+store/+services/order/order.service';
import {ModalTemplateInputData} from 'src/app/domain/interfaces/modal/modal.interfaces';
import {
  BaseHostModalDialogComponent
} from '../../shared/components/base-host-modal-dialog/base-host-modal-dialog.component';
import {
  AddFloorDialogComponent
} from '../../shared/components/modal-dialogs/add-floor-dialog/add-floor-dialog.component';
import {
  AssignDialogComponent
} from '../../shared/components/modal-dialogs/assign-dialog/assign-dialog.component';
import {
  IAddOrderCommentIntent,
  IAssignUserToOrderIntent,
  IDeleteOrderAttachmentIntent,
  IDeleteOrderFloorIntent,
  IDeleteOrderIntent,
  ILogOrderWorkTimeIntent,
  IOrderOptions,
  IOrderRequest,
  ISendOrderActionIntent,
  ISendOrderAttachmentIntent,
  ISendOrderFloorActionIntent
} from 'src/app/domain/interfaces/order/order.interfaces';
import {
  ActionDialogComponent
} from '../../shared/components/modal-dialogs/action-dialog/action-dialog.component';
import {
  WaitingResponseDialogComponent
} from '../../shared/components/modal-dialogs/waiting-response-dialog/waiting-response-dialog.component';
import {
  IUploadData,
  UploadOrderFilesDialogComponent
} from '../../shared/components/modal-dialogs/upload-order-files-dialog/upload-order-files-dialog.component';
import {UiStateStore} from '../../+store/global/ui-state/ui-state.store';
import {UiState} from '../../+store/global/ui-state/ui.state';
import {OrderActionType, OrderPriorityEnum} from 'src/app/domain/enums/order/order.enum';
import {isDefined} from 'src/app/utils/utils';
import {OrderApiService} from 'src/app/data/providers/api/Order/order-api.service';
import {UserState} from '../../+store/global/user/user.state';
import {UserStore} from '../../+store/global/user/user.store';
import {User} from 'src/app/domain/models/User/user.model';
import {delay} from 'rxjs/operators';
import {statusFilterOptions} from '../../shared/entities/dropdown.options';
import {Role} from 'src/app/domain/models/User/role.model';
import {
  ILoggedTimeData,
  LogTimeAndFinishDialogComponent
} from '../../shared/components/modal-dialogs/log-time-and-finish-dialog/log-time-and-finish-dialog.component';
import {
  LogTimeNoFinishDialogComponent
} from '../../shared/components/modal-dialogs/log-time-no-finish-dialog/log-time-no-finish-dialog.component';
import {LoggerService} from "src/app/utils/logger.service";

@UntilDestroy()

@Component({
  selector: 'ff-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public orderIntId: string;
  public orderExtId: string;

  public order: Partial<Order>;

  public userCollection: User[];

  public isUserAssignedToOrder: boolean;
  public currentAssigneeRoles: Role[];
  public currentAuthorizedUser: User;

  public orderSelectedStatus: { id?: number, name: string, style: string } = { name: '', style: '' };
  public orderSelectedPriority: { id?: number, name: string, style: string } = { name: '', style: '' };
  public orderCommentInput: string = '';

  public orderUpdateIntentInProgress: boolean;
  public orderCommentIntentInProgress: boolean;
  public orderAddFloorIntentInProgress: boolean;
  public orderAssignIntentInProgress: boolean;
  public orderActionIntentInProgress: boolean;
  public orderAddAttachmentIntentInProgress: boolean;
  public orderDeleteFloorIntentInProgress: boolean;
  public orderDeleteAttachmentIntentInProgress: boolean;
  public orderUpdateFloorIntentInProgress: boolean;
  public orderChangePriorityIntentInProgress: boolean;
  public orderWorkTimeLogIntentInProgress: boolean;
  public orderEmergencyUnassignIntentInProgress: boolean;

  public floorToDeleteId: string;
  public floorToUpdateId: string;
  public attachmentToDeleteId: string;

  public deleteAttachmentConfirmation: boolean;

  public orderStatusListOption = statusFilterOptions;

  public orderPriorityListOption = [
    { id: 1, name: "Highest priority", style: "b-red" },
    { id: 2, name: "High priority", style: "b-orange" },
    { id: 3, name: "Medium priority", style: "b-l-blue" },
    { id: 4, name: "Low priority", style: "b-green" },
    { id: 5, name: "Lowest priority", style: "b-grey" }
  ];

  public orderOptions: { name: string, info: string }[] = [
    { name: "Furniture", info: "No" },
    { name: "Square Meter", info: "No" },
    { name: "North Arrow", info: "No" },
    { name: "Room Designation", info: "No" },
    { name: "Floor Plan Designation", info: "No" },
    { name: "Align North", info: "No" },
    { name: "Flat Designation", info: "No" },
    { name: "Dimensional Chains", info: "No" },
    { name: "Meter Bars", info: "No" },
    { name: "Square Meter Spec.", info: "-" },
    { name: "Scale Ratio Type", info: "-" },
  ];

  public toggleOrderHistoryView: boolean = false;

  public onlyActiveOrderOptions: { name: string, info: string }[] = [];

  public fileUploadControl = new FileUploadControl({ listVisible: false });

  @ViewChild('ORDER_CREATED', { static: true }) ORDER_CREATED: TemplateRef<Element>;
  @ViewChild('ORDER_UPDATED', { static: true }) ORDER_UPDATED: TemplateRef<Element>;
  @ViewChild('ORDER_DELETED', { static: true }) ORDER_DELETED: TemplateRef<Element>;
  @ViewChild('COMMENT_ADDED', { static: true }) COMMENT_ADDED: TemplateRef<Element>;
  @ViewChild('COMMENT_DELETED', { static: true }) COMMENT_DELETED: TemplateRef<Element>;
  @ViewChild('USER_ASSIGNED_TO_ORDER', { static: true }) USER_ASSIGNED_TO_ORDER: TemplateRef<Element>;
  @ViewChild('INTERNAL_REVIEW_ADDED', { static: true }) INTERNAL_REVIEW_ADDED: TemplateRef<Element>;
  @ViewChild('ORDER_STATUS_CHANGED', { static: true }) ORDER_STATUS_CHANGED: TemplateRef<Element>;
  @ViewChild('LOG_TIME', { static: true }) LOG_TIME: TemplateRef<Element>;
  @ViewChild('LOG_TIME_FINISH', { static: true }) LOG_TIME_FINISH: TemplateRef<Element>;
  @ViewChild('EMERGENCY_ASSIGN', { static: true }) EMERGENCY_ASSIGN: TemplateRef<Element>;

  constructor(
    private uiStore: UiStateStore,
    private orderStore: OrderStore,
    private orderService: OrderService,
    private userStore: UserStore,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private loggerService: LoggerService,
    private api: OrderApiService
  ) { }

  ngOnInit(): void {

    // set order ID
    this.orderIntId = this.route.snapshot.params.id as string;

    this.observeUserStoreState();
    this.observeUiStateStream();
    this.observeOrderStateStream();
  }

  private observeUiStateStream(): void {
    this.uiStore.stateStream$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (state: UiState) => this.handleUiStateStream(state)
      });
  }

  private observeOrderStateStream(): void {
    this.orderStore.stateStream$
      .pipe(
        untilDestroyed(this),
        delay(150)
      )
      .subscribe({
        next: (state: OrderState) => this.handleOrderStateStream(state)
      });
  }

  private observeUserStoreState(): void {
    this.userStore.stateStream$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (state: UserState) => this.handleUserCollection(state.list)
      });
  }

  private handleUiStateStream(state: UiState): void {

    if (state.authorizedUser) {
      this.currentAuthorizedUser = state.authorizedUser;
    }

    if (state.uiOngoingActions.apiRequest.fetchingOrderListPageSlice) {
      // this.orderUpdateIntentInProgress = true;
    }

    if (state.apiIntentActionType === 'ADD_ORDER_FLOOR') {
      this.orderAddFloorIntentInProgress = true;
    }
  }

  private handleUserCollection(collection: User[]) {

    if (collection.length) {
      this.userCollection = collection;
    }
  }

  private getOrder(orderId: string, idType: 'int' | 'ext'): void {

    const getOrderRequest: IOrderRequest = {
      orderId,
      idType
    };

    this.orderService.getOrder(getOrderRequest);
  }

  private handleOrderStateStream(state: OrderState): void {

    if (state.list.length) {

      // Get order to show
      const foundOrder: Order = state.list.find((order: Partial<Order>) => order.ids.internal === this.orderIntId);

      if (isDefined(foundOrder)) {
        // Initiate Order object
        this.order = this.initOrderObject(foundOrder);
      } else {

        if (isDefined(state.order) && state.order.ids.internal === this.orderIntId) {
          this.order = this.initOrderObject(state.order);
        } else {
          // Get single order
          this.getOrder(this.orderIntId, 'int');
        }
      }

      // Reset waiting spinners on new list received
      this.orderUpdateIntentInProgress = false;
      this.orderCommentIntentInProgress = false;
      this.orderAddFloorIntentInProgress = false;
      this.orderAssignIntentInProgress = false;
      this.orderAddAttachmentIntentInProgress = false;
      this.orderActionIntentInProgress = false;
      this.orderDeleteFloorIntentInProgress = false;
      this.orderDeleteAttachmentIntentInProgress = false;
      this.orderUpdateFloorIntentInProgress = false;
      this.orderChangePriorityIntentInProgress = false;
      this.orderWorkTimeLogIntentInProgress = false;
      this.orderEmergencyUnassignIntentInProgress = false;
      this.floorToDeleteId = undefined;
      this.floorToUpdateId = undefined;
      this.attachmentToDeleteId = undefined;
    }
  }

  private initOrderObject(foundOrder: Partial<Order>): Partial<Order> {

    const order: Partial<Order> = {
      ...foundOrder
    };
    this.loggerService.info('Order: ', order, this.constructor.name)


    if (isDefined(foundOrder)) {

      if (isDefined(foundOrder.userData.assignee)) {

        // Set is user assigned to order
        this.isUserAssignedToOrder = foundOrder.userData.assignee.id === this.currentAuthorizedUser.id;

        // Set assignee role
        this.currentAssigneeRoles = foundOrder.userData.assignee.roles;
      }

      // Set order status
      const orderFoundStatus: { id: number, name: string, style: string } = this.orderStatusListOption.find((status: any) => status.name === order.status);
      this.orderSelectedStatus = isDefined(orderFoundStatus) ? orderFoundStatus : { name: 'no-status', style: 'no-status' };

      // Set order priority
      this.orderSelectedPriority = this.orderPriorityListOption.find((priority: any) => priority.name === order.priority);

      // Set order options
      this.orderOptions.map((o: { name: string, info: string }) => this.setOrderOptions(o, foundOrder.options));

      // Set only active order options
      this.onlyActiveOrderOptions = this.orderOptions.map((o: { name: string, info: string }) => this.setOrderOptions(o, foundOrder.options))
        .filter((o: { name: string, info: string }) => o.info !== 'No' && o.info !== 'None' && o.info !== '');

      // Set order history event creator
      // order.orderHistory.historyEvents = order.orderHistory.historyEvents.map((event: OrderHistoryEvent) => {

      //   const userFound: User | undefined = this.userCollection.find((u: User) => u.id === event.userId);

      //   const userProfile: { firstName: string, lastName: string } = userFound ? userFound.contact[0].profile : { firstName: 'Unknown', lastName: 'Unknown' };

      //   event.creator = userProfile.firstName + ' ' + userProfile.lastName;

      //   return event;
      // });
    }

    return order;
  }

  private setOrderOptions(o: { name: string, info: string }, options: IOrderOptions): { name: string, info: string } {

    switch (o.name) {

      case 'Furniture':
        o.info = isDefined(options.hasFurniture) && options.hasFurniture ? 'Yes' : 'No'
        break;

      case 'Square Meter':
        o.info = isDefined(options.hasSquareMeterSpecifications) && options.hasSquareMeterSpecifications ? 'Yes' : 'No'
        break;

      case 'North Arrow':
        o.info = isDefined(options.hasNorthArrow) && options.hasNorthArrow ? 'Yes' : 'No'
        break;

      case 'Room Designation':
        o.info = isDefined(options.hasRoomDesignation) && options.hasRoomDesignation ? 'Yes' : 'No'
        break;

      case 'Floor Plan Designation':
        o.info = isDefined(options.hasFloorplanDesignations) && options.hasFloorplanDesignations ? 'Yes' : 'No'
        break;

      case 'Align North':
        o.info = isDefined(options.hasAlignNorth) && options.hasAlignNorth ? 'Yes' : 'No'
        break;

      case 'Flat Designation':
        o.info = isDefined(options.hasFlatDesignation) && options.hasFlatDesignation ? 'Yes' : 'No'
        break;

      case 'Dimensional Chains':
        o.info = isDefined(options.hasDimensionalChains) && options.hasDimensionalChains ? 'Yes' : 'No'
        break;

      case 'Meter Bars':
        o.info = isDefined(options.hasMeterBars) && options.hasMeterBars ? 'Yes' : 'No'
        break;

      case 'Square Meter Spec.':
        o.info = isDefined(options.squareMeterSpecificationsType) ? options.squareMeterSpecificationsType : '-'
        break;

      case 'Scale Ratio Type':
        o.info = isDefined(options.trueToScaleRatioType) ? options.trueToScaleRatioType : '-'
        break;

      default:
        break;
    }

    return o;
  }

  public ffInfos = [
    { "name": "Furniture", "info": "Yes" },
    { "name": "Square Meter", "info": "Yes" },
    { "name": "North Arrow", "info": "Yes" },
    { "name": "Room Designation", "info": "No" },
    { "name": "Floor Plan Designation", "info": "No" },
    { "name": "Align North", "info": "No" },
    { "name": "Flat Designation", "info": "Yes" },
    { "name": "Dimensional Chains", "info": "Yes" },
    { "name": "Meter Bars", "info": "No" },
    { "name": "Square Meter Spec.", "info": "'circa'" },
    { "name": "Scale Ratio Type", "info": "1:100" },
  ];

  public fakeCards = [
    { "download": "yes", "picture": "yes", "attachment": "yes", "redraw": "yes", "clear": "yes", "floorlevel": "Basement", "attachmentname": "FP_Basement.png" },
    { "download": "no", "picture": "no", "attachment": "no", "redraw": "no", "clear": "no", "floorlevel": "1st Floor", "attachmentname": "FP_First-Floor.png" },
    { "download": "yes", "picture": "yes", "attachment": "yes", "redraw": "yes", "clear": "yes", "floorlevel": "Basement", "attachmentname": "FP_VeryLongWordToTest.png" },
  ];

  public fakeCards1 = [];

  // //////////////////////////
  // //////////////////////////
  // //////////////////////////

  public deleteOrder(): void {

    const deleteOrderIntent: IDeleteOrderIntent = {
      orderToDeleteId: this.order.ids.main
    } as IDeleteOrderIntent;

    this.orderService.deleteOrder(deleteOrderIntent);
  }

  public deleteFloor(floorId: string): void {

    const deleteOrderFloorIntent: IDeleteOrderFloorIntent = {
      orderId: this.order.ids.main,
      floorToDeleteId: floorId
    } as IDeleteOrderFloorIntent;

    this.floorToDeleteId = floorId;
    this.orderDeleteFloorIntentInProgress = true;

    this.orderService.deleteOrderFloor(deleteOrderFloorIntent);
  }

  public deleteFloorData(floorNumber: number, floorId: string): void {

    const sendDeleteOrderFloorDataIntent: ISendOrderFloorActionIntent = {
      actionType: 'DELETE_PROJECT_DATA',
      orderId: this.order.ids.main,
      floorNumber: floorNumber.toString()
    }

    this.floorToUpdateId = floorId;
    this.orderUpdateFloorIntentInProgress = true;

    this.orderService.sendOrderFloorAction(sendDeleteOrderFloorDataIntent);
  }

  public deleteAttachment(attachmentId: string, type: 'Data' | 'Logo' | 'Watermark'): void {

    const deleteOrderAttachmentIntent: IDeleteOrderAttachmentIntent = {
      orderId: this.order.ids.main,
      attachmentToDeleteId: attachmentId,
      attachmentType: type
    };

    this.deleteAttachmentConfirmation = false;
    this.orderDeleteAttachmentIntentInProgress = true;

    this.orderService.deleteOrderAttachment(deleteOrderAttachmentIntent);
  }

  public invokeOrderAction(type: OrderActionType): void {

    const sendOrderActionIntent: ISendOrderActionIntent = {
      orderId: this.order.ids.main,
      actionType: type
    };

    this.orderActionIntentInProgress = true;

    this.orderService.sendOrderAction(sendOrderActionIntent);
  }

  public sendLoggedOrderWorkTime(timeData: ILoggedTimeData): void {

    const sendLoggedOrderWorkTimeIntent: ILogOrderWorkTimeIntent = {
      orderId: this.order.ids.main,
      timeLogged: timeData.time,
      completeOrder: timeData.completeOrder,
      unassignOrder: timeData.unassignOrder,
      comment: timeData.comment
    };

    this.orderService.logOrderWorkTime(sendLoggedOrderWorkTimeIntent);
  }

  public openLogTimeAndFinish(): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Finish drawing FP',
        controlActions: false,
        logo: false,
        component: LogTimeAndFinishDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          orderId: this.order.ids.main
        },
        buttonsConfig: {
          closeButton: false,
          cancelButton: false
        }
      }),
      width: '700px',
      height: 'auto'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance['logTimeEvent' as keyof BaseHostModalDialogComponent]
              .subscribe({
                next: (data: ILoggedTimeData) => {
                  this.sendLoggedOrderWorkTime(data);
                  dialogRef.componentInstance.closeModal();
                }
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public openLogTimeWithoutFinish(): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Log FP time without finish',
        controlActions: false,
        logo: false,
        component: LogTimeNoFinishDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          isUserDrafter: this.currentAssigneeRoles.some((role: Role) => role.name === 'Drafter')
        },
        buttonsConfig: {
          closeButton: false,
          cancelButton: false
        }
      }),
      width: '700px',
      height: 'auto'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance['onlyLogTimeEvent' as keyof BaseHostModalDialogComponent]
              .subscribe({
                next: (data: ILoggedTimeData) => {
                  this.sendLoggedOrderWorkTime(data);
                  this.orderWorkTimeLogIntentInProgress = true;
                  dialogRef.componentInstance.closeModal();
                }
              })
          );
        }
      });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance['logTimeAndAssignEvent' as keyof BaseHostModalDialogComponent]
              .subscribe({
                next: (data: ILoggedTimeData) => {
                  this.sendLoggedOrderWorkTime(data);
                  dialogRef.componentInstance.closeModal();
                  this.assign();
                }
              })
          );
        }
      });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance['logTimeAndUnassignEvent' as keyof BaseHostModalDialogComponent]
              .subscribe({
                next: (data: ILoggedTimeData) => {
                  this.sendLoggedOrderWorkTime(data);
                  dialogRef.componentInstance.closeModal();
                }
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public emergencyUnassignConfirm(): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Do you really want to un-assign this order?',
        controlActions: true,
        logo: false,
        component: ActionDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          orderId: this.order.ids.internal
        },
        buttonsConfig: {
          closeButton: false,
          cancelButton: true,
          actionButtonTwo: {
            enable: true,
            text: 'Un-assign Order'
          }
        }
      }),
      width: '700px',
      height: '160px'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance.actionTwo
              .subscribe({
                next: () => {
                  this.orderEmergencyUnassignIntentInProgress = true;
                  this.emergencyUnassign();
                  dialogRef.componentInstance.closeModal();
                }
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public emergencyUnassign(): void {

    this.api.useEmergencyUnassign(this.order.ids.main)
      .subscribe({
        next: (resp: {}) => {
          if (resp) {
            this.orderService.getOrderCollectionSlice({}, true);
          }
        }
      });
  }

  public openUploadDialog(): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Upload',
        controlActions: false,
        logo: false,
        component: UploadOrderFilesDialogComponent,
        inputs: {

        },
        buttonsConfig: {
          closeButton: true
        }
      }),
      width: '600px',
      height: 'auto'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance['uploadOrderFilesEvent' as keyof BaseHostModalDialogComponent]
              .subscribe({
                next: (data: IUploadData) => {
                  this.sendAttachment(data);
                  dialogRef.componentInstance.closeModal();
                }
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public deleteOrderConfirm(): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Do you really want to delete this order?',
        controlActions: true,
        logo: false,
        component: ActionDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          orderId: this.order.ids.internal
        },
        buttonsConfig: {
          closeButton: false,
          cancelButton: true,
          actionButtonTwo: {
            enable: true,
            text: 'Delete Order'
          }
        }
      }),
      width: '600px',
      height: '160px'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance.actionTwo
              .subscribe({
                next: () => {
                  // this.deleteTourEvent.emit({ tourItemId: this.tour.ids.item });
                  this.deleteOrder();
                  dialogRef.componentInstance.closeModal();
                }
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public deleteOrderFloorConfirm(floorId: string, floorName: string): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: `Do you really want to delete this floor?`,
        controlActions: true,
        logo: false,
        component: ActionDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          orderId: this.order.ids.internal
        },
        buttonsConfig: {
          closeButton: false,
          cancelButton: true,
          actionButtonTwo: {
            enable: true,
            text: 'Delete Floor'
          }
        }
      }),
      width: '600px',
      height: '160px'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance.actionTwo
              .subscribe({
                next: () => {
                  // this.deleteTourEvent.emit({ tourItemId: this.tour.ids.item });
                  this.deleteFloor(floorId);
                  dialogRef.componentInstance.closeModal();
                }
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public deleteOrderFloorDataConfirm(floorNumber: number, floorId: string): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Do you really want to delete the entire floor data?',
        controlActions: true,
        logo: false,
        component: ActionDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          orderId: this.order.ids.internal
        },
        buttonsConfig: {
          closeButton: false,
          cancelButton: true,
          actionButtonTwo: {
            enable: true,
            text: 'Delete Data'
          }
        }
      }),
      width: '600px',
      height: '160px'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance.actionTwo
              .subscribe({
                next: () => {
                  this.deleteFloorData(floorNumber, floorId);
                  dialogRef.componentInstance.closeModal();
                }
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public deleteOrderAttachmentConfirm(attachmentId: string): void {

    this.deleteAttachmentConfirmation = true;
    this.attachmentToDeleteId = attachmentId;
  }

  public cancelDeleteOrderAttachment(): void {

    this.deleteAttachmentConfirmation = false;
    this.attachmentToDeleteId = undefined;
  }

  public addFloor(): void {

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Add Floor',
        controlActions: false,
        logo: false,
        component: AddFloorDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          orderId: this.order.ids.main
        },
        buttonsConfig: {
          closeButton: false,
          cancelButton: false
        }
      }),
      width: '592px',
      height: 'auto'
    });
  }

  public assign(): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Order: ID ' + this.order.ids.internal,
        controlActions: false,
        logo: false,
        component: AssignDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          orderId: this.order.ids.main,
          orderStatus: this.order.status
        },
        buttonsConfig: {
          closeButton: false,
          cancelButton: false
        }
      }),
      width: '800px',
      height: '510px'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance['confirmEvent' as keyof BaseHostModalDialogComponent]
              .subscribe({
                next: () => this.orderAssignIntentInProgress = true
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public assignToMe(): void {

    const assignUserToOrderIntent: IAssignUserToOrderIntent = {
      orderId: this.order.ids.main,
      userId: this.currentAuthorizedUser.id
    };

    // this.orderService.assignUser(aa);
  }

  public sendComment(): void {

    const addOrderCommentIntent: IAddOrderCommentIntent = {
      orderId: this.order.ids.main,
      commentText: this.orderCommentInput
    } as IAddOrderCommentIntent;

    if (this.orderCommentInput !== undefined && this.orderCommentInput !== '') {

      this.orderCommentIntentInProgress = true;

      this.orderService.addOrderComment(addOrderCommentIntent);

      this.orderCommentInput = '';
    }
  }

  public sendAttachment(fileList: IUploadData): void {

    const sendOrderAttachmentIntent: ISendOrderAttachmentIntent = {
      orderId: this.order.ids.main,
      attachments: fileList.attachments.length > 0 ? fileList.attachments : undefined,
      logo: fileList.logo ? fileList.logo : undefined,
      watermark: fileList.watermark ? fileList.watermark : undefined
    };

    console.log(sendOrderAttachmentIntent);

    if (fileList) {

      this.orderAddAttachmentIntentInProgress = true;

      this.orderService.sendAttachment(sendOrderAttachmentIntent);
    }
  }

  public sendFloorAttachment(fileList: FileList, floorId: string, floorNumber: number, type: 'source-file' | 'json-file'): void {

    let sendOrderFloorAttachmentIntent: ISendOrderFloorActionIntent = {
      actionType: undefined,
      orderId: this.order.ids.main,
      floorId: floorId,
      floorNumber: floorNumber.toString(),
      sourceFile: fileList.length > 0 ? fileList.item(0) : undefined
    };

    if (type === 'source-file') {
      sendOrderFloorAttachmentIntent = {
        ...sendOrderFloorAttachmentIntent,
        actionType: 'UPLOAD_SOURCE_FILE'
      };
    }

    if (type === 'json-file') {
      sendOrderFloorAttachmentIntent = {
        ...sendOrderFloorAttachmentIntent,
        actionType: 'UPLOAD_JSON_FILE'
      };
    }

    if (fileList.length) {

      if (type === 'json-file' && fileList.item(0).type !== 'application/json') {
        alert('Please select JSON file');
      } else {
        this.floorToUpdateId = floorId;
        this.orderUpdateFloorIntentInProgress = true;

        this.orderService.sendOrderFloorAction(sendOrderFloorAttachmentIntent);
      }

    }
  }

  public setOrderPriority(data: string): void {

    const intentData: { priority: number } = {
      priority: undefined
    };

    if (isDefined(data)) {
      switch (data) {
        case OrderPriorityEnum.Highest:
          intentData.priority = 15;
          break;

        case OrderPriorityEnum.High:
          intentData.priority = 12;
          break;

        case OrderPriorityEnum.Medium:
          intentData.priority = 9;
          break;

        case OrderPriorityEnum.Low:
          intentData.priority = 6;
          break;

        case OrderPriorityEnum.Lowest:
          intentData.priority = 3;
          break;
      }
    }

    this.orderChangePriorityIntentInProgress = true;

    this.orderService.changeOrderPriority(intentData, this.order.ids.main);
  }

  public waitingResponse(type: 'delete-order' | '', firstMessage: string): void {

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: '',
        controlActions: false,
        logo: false,
        component: WaitingResponseDialogComponent,
        inputs: {
          loading: true,
          message: firstMessage,
          type: type,
        },
        buttonsConfig: {
          closeButton: false
        }
      }),
      width: '600px',
      height: 'auto'
    });

    dialogRef.afterOpened()
      .subscribe({
        next: () => {
          outputActionsSubs.add(
            dialogRef.componentInstance['closeModalEvent' as keyof BaseHostModalDialogComponent]
              .subscribe({
                next: () => {
                  dialogRef.componentInstance.closeModal();

                  // doAsyncTask(230)
                  //   .subscribe({
                  //     complete: () => this.closeModalEvent.emit(type)
                  //   });
                }
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public openExternalLink(url: string) {
    window.open(url, "_self");
  }

  public floorsTrackFn = (i: number, floor: OrderFloor): string => floor.id;
}
