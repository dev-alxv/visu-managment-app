import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';

import { Order, OrderFloor } from 'src/app/domain/models/Order/order.model';
import { OrderDescription } from 'src/app/data/interfaces/descriptions/api/order/description';
import { OrderService } from '../../+store/+services/order/order.service';
import { ICreateOrderIntent, IOrderOptions } from 'src/app/domain/interfaces/order/order.interfaces';
import { OrderPriorityEnum } from 'src/app/domain/enums/order/order.enum';
import { UserStore } from '../../+store/global/user/user.store';
import { UserState } from '../../+store/global/user/user.state';
import { User } from 'src/app/domain/models/User/user.model';
import { Role } from 'src/app/domain/models/User/role.model';
import { UiStateStore } from '../../+store/global/ui-state/ui-state.store';
import { UiState } from '../../+store/global/ui-state/ui.state';
import { isDefined } from 'src/app/utils/utils';
import { orderLibrarySelectOptions, orderPrioritySelectOptions, orderStyleSelectOptions, serviceTypeSelectOptions } from '../../shared/entities/dropdown.options';
import {LoggerService} from "src/app/utils/logger.service";

interface INewOrderFloor {
  number?: string;
  name?: string;
}

@UntilDestroy()

@Component({
  selector: 'ff-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {

  public newOrder: Order;
  public userCollection: User[];
  public supervisorCollection: User[];
  public customerCollection: User[];
  public initialDeadlineDate: string;
  public todayDate: Date = new Date();
  public minSelectableHour: string;
  public currentHour: string;
  public addOrderLogo: boolean = false;
  public addOrderWatermark: boolean = false;

  public selectedOrderserviceType: { color: string; name: string; value: 'FLOORPLAN' | 'FAKE_VISU_ORDER'; };
  public selectedOrderPriority: { name: 'Highest priority' | 'High priority' | 'Medium priority' | 'Low priority' | 'Lowest priority'; color: string; };
  public selectedOrderCustomer: { name: string; id: string; };
  public selectedOrderSupervisor: { name: string; id: string; };
  public selectedOrderLibrary: number;
  public selectedOrderStyle: number;
  public selectedScaleRatioEnabled: boolean;
  public selectedOrderDeadlineDate: string;
  public selectedOrderDeadlineTime: string;

  public fileUploadControl = new FileUploadControl({ listVisible: false });
  public logoUploadControl = new FileUploadControl({ listVisible: false, accept: ['image/*'], discardInvalid: true }, [FileUploadValidators.accept(['image/*']), FileUploadValidators.filesLimit(1)]);
  public watermarkUploadControl = new FileUploadControl({ listVisible: false, accept: ['image/*'], discardInvalid: true }, [FileUploadValidators.accept(['image/*']), FileUploadValidators.filesLimit(1)]);

  // Dropdowns data
  //////////
  public serviceTypeOptionList: { color: string; name: string; value: 'FLOORPLAN' | 'FAKE_VISU_ORDER'; }[] = serviceTypeSelectOptions;

  public orderPriorityOptionList: { name: 'Highest priority' | 'High priority' | 'Medium priority' | 'Low priority' | 'Lowest priority'; color: string; }[] = orderPrioritySelectOptions;

  public orderLibraryOptionList: { id: number; name: string; value: string; }[] = orderLibrarySelectOptions;

  public orderStyleOptionList: { id: number; name: string }[] = orderStyleSelectOptions;

  public orderCustomerOptionList: { name: string; id: string; }[] = [

  ];

  public orderSupervisorOptionList: { name: string; id: string; }[] = [

  ];

  ///////////////

  // Order floors
  public orderFloorList: INewOrderFloor[] = [{}];

  constructor(
    private datePipe: DatePipe,
    private uiStateStore: UiStateStore,
    private userStore: UserStore,
    private orderService: OrderService,
    private loggerService: LoggerService
  ) {
    this.observeUiState();
    this.observeUserStoreState();
  }

  public ngOnInit(): void {
    this.initiateNewOrder();
    this.getDate();
  }

  private observeUserStoreState(): void {
    this.userStore.stateStream$
      .pipe(
        untilDestroyed(this),
        delay(800)
      )
      .subscribe({
        next: (state: UserState) => this.handleUserCollection(state.list)
      });
  }

  private observeUiState(): void {
    this.uiStateStore.stateStream$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (state: UiState) => this.handleUiState(state)
      });
  }

  private handleUserCollection(collection: User[]): void {

    if (collection.length) {

      this.supervisorCollection = collection.filter((user: User) => user.role.find((role: Role) => role.name === 'Supervisor'));
      // this.customerCollection = collection.filter((user: User) => user.role.find((role: Role) => role.name === 'Customer'));
      this.customerCollection = collection.filter((user: User) => user.role.find((role: Role) => role.name));

      this.orderSupervisorOptionList = this.supervisorCollection.map((supervisor: User) => {

        const hasContactInfo: boolean = isDefined(supervisor.contact);

        const availableSupervisorOption: { name: string; id: string; } = {
          name: hasContactInfo && supervisor.contact[0].profile.firstName ? supervisor.contact[0].profile.firstName : 'No name',
          id: supervisor.id
        };

        return availableSupervisorOption;
      }).filter((u: { name: string; id: string; }) => u.name !== 'No name');

      this.orderCustomerOptionList = this.customerCollection.map((customer: User) => {

        const hasContactInfo: boolean = isDefined(customer.contact);

        const availableCustomerOption: { name: string; id: string; } = {
          name: hasContactInfo && customer.contact[0].profile.firstName ? customer.contact[0].profile.firstName : 'No name',
          id: customer.id
        };

        return availableCustomerOption;
      }).filter((u: { name: string; id: string; }) => u.name !== 'No name');

      this.selectedOrderCustomer = this.orderCustomerOptionList[0];
      this.preselectOrderSupervisor();
    }
  }

  private handleUiState(state: UiState): void {

  }

  private preselectOrderSupervisor(): void {
    this.selectedOrderSupervisor = this.orderSupervisorOptionList
      .find((option: { name: string; id: string; }) => option.id === this.uiStateStore.state.authorizedUser.id);
  }

  private initiateNewOrder(): void {
    this.newOrder = new Order({} as OrderDescription);

    // initiate dropdowns
    this.selectedOrderserviceType = this.serviceTypeOptionList[0];
    this.selectedOrderCustomer = this.orderCustomerOptionList[0];
    this.selectedOrderSupervisor = this.orderSupervisorOptionList[0];
    this.selectedOrderLibrary = this.orderLibraryOptionList[0].id;
    this.selectedOrderStyle = this.orderStyleOptionList[0].id;
    this.selectedOrderPriority = this.orderPriorityOptionList.find((option: { name: any; color: string; }) => option.name === 'Medium priority');

    // order options
    this.newOrder.options = {
      drawingType: '',
      hasFurniture: false,
      hasDimensionalChains: false,
      hasFlatDesignation: false,
      hasFloorplanDesignations: false,
      hasIndividualFloor: false,
      hasIsometric: false,
      hasMeterBars: false,
      hasNorthArrow: false,
      hasAlignNorth: false,
      hasRoomDesignation: false,
      hasSquareMeterSpecifications: false,
      squareMeterSpecificationsType: '',
      trueToScaleRatioType: ''
    } as IOrderOptions;
  }

  private setOrderPriority(): OrderPriorityEnum {

    let priority: OrderPriorityEnum;

    switch (this.selectedOrderPriority.name) {

      case 'Highest priority':
        priority = OrderPriorityEnum.Highest;
        break;

      case 'High priority':
        priority = OrderPriorityEnum.High;
        break;

      case 'Medium priority':
        priority = OrderPriorityEnum.Medium;
        break;

      case 'Low priority':
        priority = OrderPriorityEnum.Low;
        break;

      case 'Lowest priority':
        priority = OrderPriorityEnum.Lowest;
        break;
    }

    return priority;
  }

  private setOrderFloors(): OrderFloor[] {

    const newFloors: OrderFloor[] = this.orderFloorList.map((floorWannaBe: INewOrderFloor) => {

      const floor: OrderFloor = new OrderFloor({
        name: floorWannaBe.name,
        floorNumber: floorWannaBe.number !== '' ? parseInt(floorWannaBe.number) : undefined
      });

      return floor;
    }).filter((floor: OrderFloor) => floor.name !== undefined && floor.name !== '' && floor.floorNumber !== undefined);

    return newFloors;
  }

  private getDate(): void {
    this.initialDeadlineDate = this.datePipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.selectedOrderDeadlineDate = this.todayDate.toString();

    // initiate min hour
    this.parseMinDeadlineHour();
  }

  private parseMinDeadlineHour(): void {
    // Get local time
    const [HH, MM]: string[] = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions).split(':');
    const minHour: string = parseInt(HH) === 23 ? HH : (parseInt(HH) + 1).toString();

    this.currentHour = minHour;
    this.minSelectableHour = `${minHour}:00`;
    this.selectedOrderDeadlineTime = `${minHour}:00`;
  }

  private parseDeadlineDate(): string {

    const [HH, MM]: string[] = this.selectedOrderDeadlineTime.split(':');
    const userTimezoneOffset: number = this.todayDate.getTimezoneOffset() * 60000; //offset in milliseconds
    const dateNoZone: Date = (new Date(Date.parse(this.selectedOrderDeadlineDate) - userTimezoneOffset));

    // Set selected hour and minutes
    dateNoZone.setUTCHours(parseInt(HH), parseInt(MM), 0, 0);

    return dateNoZone.toISOString();
  }

  public selectDateEvent(event: any): void {
    const dateObj: Date = event.value;
    this.selectedOrderDeadlineDate = dateObj.toString();

    if (dateObj > this.todayDate) {
      this.minSelectableHour = null;
      this.currentHour = null;
    } else {
      this.parseMinDeadlineHour();
    }
  }

  public setOrderOptions(value: 'true' | 'false', name: string): void {

    switch (name) {

      case 'Furniture':
        this.newOrder.options.hasFurniture = value === 'true' ? true : false;
        break;

      case 'Square Meter':
        this.newOrder.options.hasSquareMeterSpecifications = value === 'true' ? true : false;
        break;

      case 'North Arrow':
        this.newOrder.options.hasNorthArrow = value === 'true' ? true : false;
        break;

      case 'Room Designation':
        this.newOrder.options.hasRoomDesignation = value === 'true' ? true : false;
        break;

      case 'Floor Plan Desig.':
        this.newOrder.options.hasFloorplanDesignations = value === 'true' ? true : false;
        break;

      case 'Align North':
        this.newOrder.options.hasAlignNorth = value === 'true' ? true : false;
        break;

      case 'Flat Designation':
        this.newOrder.options.hasFlatDesignation = value === 'true' ? true : false;
        break;

      case 'Dimensional Chains':
        this.newOrder.options.hasDimensionalChains = value === 'true' ? true : false;
        break;

      case 'Meter Bars':
        this.newOrder.options.hasMeterBars = value === 'true' ? true : false;
        break;

      case 'Isometric':
        this.newOrder.options.hasIsometric = value === 'true' ? true : false;
        break;

      case 'Square Meter S.':
        this.newOrder.options.hasSquareMeterSpecifications = value === 'true' ? true : false;
        break;

      case 'Scale Ratio':
        this.selectedScaleRatioEnabled = value === 'true' ? true : false;
        break;

      default:
        break;
    }
  }

  public addNewFloor(): void {
    const newFloor: INewOrderFloor = {};
    this.orderFloorList.push(newFloor);
  }

  public deleteNewFloor(index: number): void {
    this.orderFloorList.splice(index, 1);
  }

  public ffInfos = [
    { "name": "Furniture", "info": "Yes" },
    // { "name": "Square Meter", "info": "Yes" },
    { "name": "North Arrow", "info": "Yes" },
    { "name": "Room Designation", "info": "No" },
    { "name": "Floor Plan Desig.", "info": "No" },
    { "name": "Align North", "info": "No" },
    { "name": "Flat Designation", "info": "Yes" },
    { "name": "Dimensional Chains", "info": "Yes" },
    { "name": "Meter Bars", "info": "No" },
    { "name": "Isometric", "info": "No" },
    { "name": "Square Meter S.", "info": "No" },
    { "name": "Scale Ratio", "info": "No" }
  ]

  public squareMeter = [
    { id: 1, name: "circa" }
  ]
  public selectedSquareMeter = this.squareMeter[0].id;

  public ratioType = [
    { id: 1, name: "1:100" },
    { id: 2, name: "1:75" }
  ]
  public selectedRatioType = this.ratioType[0].id;

  public drawingType = [
    { id: 1, name: "Single Plan" },
    { id: 2, name: "Single Entire Floor" },
    { id: 3, name: "Entire Floor as a hole" }
  ]
  public selectedDrawingType = this.drawingType[0].id;


  public attachments = [

  ];

  public createOrder(): void {
    const createOrderIntentData: ICreateOrderIntent = {
      newOrder: {
        ...this.newOrder,

        ids: {
          ...this.newOrder.ids,
          // customer: this.selectedOrderCustomer.id,
          // supervisor: this.selectedOrderSupervisor.id
        },

        orderDates: {
          deadline: this.parseDeadlineDate()
        },

        floors: this.setOrderFloors(),

        options: {
          ...this.newOrder.options,
          drawingType: this.drawingType.find((o: { id: number; name: string }) => o.id === this.selectedDrawingType).name,
          squareMeterSpecificationsType: this.newOrder.options.hasSquareMeterSpecifications ? this.squareMeter.find((o: any) => o.id === this.selectedSquareMeter).name : '',
          trueToScaleRatioType: this.selectedScaleRatioEnabled ? this.ratioType.find((o: any) => o.id === this.selectedRatioType).name : 'None',
          style: this.orderStyleOptionList.find((option: { id: number; name: string }) => option.id === this.selectedOrderStyle).name
        },

        priority: this.setOrderPriority(),
        serviceType: this.selectedOrderserviceType.value,
        style: this.orderStyleOptionList.find((option: { id: number; name: string }) => option.id === this.selectedOrderStyle).name,
        library: this.orderLibraryOptionList.find((option: { id: number; name: string }) => option.id === this.selectedOrderLibrary).value,
      },

      customerId: this.selectedOrderCustomer.id,
      newFloors: this.setOrderFloors(),
      newAttachments: [...this.fileUploadControl.value],
      newLogoWatermark: {
        logo: this.logoUploadControl.value[0],
        watermark: this.watermarkUploadControl.value[0]
      }

    } as ICreateOrderIntent;

    // TODO:
    // console.log(createOrderIntentData);
    this.loggerService.info('Create order: ', createOrderIntentData, this.constructor.name)
    this.orderService.createOrder(createOrderIntentData);
  }
}
