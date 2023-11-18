import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';

import { OrderStore } from 'src/app/presentation/+store/global/order/order.store';
import { OrderState } from 'src/app/presentation/+store/global/order/order.state';
import { Order, OrderFloor } from 'src/app/domain/models/Order/order.model';
import { User } from 'src/app/domain/models/User/user.model';
import { UserStore } from 'src/app/presentation/+store/global/user/user.store';
import { DatePipe } from '@angular/common';
import { delay } from 'rxjs/operators';
import { UserState } from 'src/app/presentation/+store/global/user/user.state';
import { Role } from 'src/app/domain/models/User/role.model';
import { deepCopy, isDefined } from 'src/app/utils/utils';
import { IEditOrderIntent } from 'src/app/domain/interfaces/order/order.interfaces';
import { OrderPriorityEnum } from 'src/app/domain/enums/order/order.enum';
import { OrderService } from 'src/app/presentation/+store/+services/order/order.service';
import {
  orderLibrarySelectOptions,
  orderPrioritySelectOptions,
  orderStyleSelectOptions,
  serviceTypeSelectOptions
} from 'src/app/presentation/shared/entities/dropdown.options';
import { CloudFile } from 'src/app/domain/models/Common/common.models';
import { environment } from 'src/environments/environment';

interface INewOrderFloor {
  id?: string;
  number?: string;
  name?: string;
}

@UntilDestroy()

@Component({
  selector: 'ff-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {

  public orderToEdit: Order;
  public userCollection: User[];
  public supervisorCollection: User[];
  public customerCollection: User[];
  public initialDeadlineDate: string;
  public todayDate: Date = new Date();
  public minSelectableHour: string;
  public currentHour: string;
  public orderDateInFuture: boolean = false;
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

  public orderLogo: Partial<CloudFile>;
  public orderWatermark: Partial<CloudFile>;

  public attachments = [

  ];

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
  public orderFloorList: INewOrderFloor[] = [];

  constructor(
    private datePipe: DatePipe,
    private orderStore: OrderStore,
    private userStore: UserStore,
    private orderService: OrderService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Get order to show
    const orderFound: Order = orderStore.state.list.find((order: Order) => order.ids.internal === this.route.snapshot.params.id as string);

    if (isDefined(orderFound)) {
      this.orderToEdit = deepCopy(orderFound);
    } else {
      this.orderToEdit = deepCopy(orderStore.state.order);
    }
  }

  public ngOnInit(): void {
    this.observeOrderStateStream();
    this.observeUserStoreState();
    this.initiateEditOrderData();
    this.getDate();
  }

  private observeOrderStateStream(): void {
    this.orderStore.stateStream$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (state: OrderState) => this.handleOrderStateStream(state)
      });
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

  private handleOrderStateStream(state: OrderState): void {

    // if (state.list.length && !this.orderToEdit) {
    //   // Get order to show
    //   this.orderToEdit = state.list.find((order: Order) => order.ids.internal === this.route.snapshot.params.id as string);
    //   //
    //   this.initiateEditOrderData();
    // }
  }

  private handleUserCollection(collection: User[]): void {

    if (collection.length) {

      const missingUser: { name: string; id: string; } = {
        name: 'MISSING USER',
        id: '0'
      };

      this.supervisorCollection = collection.filter((user: User) => user.role.find((role: Role) => role.name === 'Supervisor'));
      // this.customerCollection = collection.filter((user: User) => user.role.find((role: Role) => role.name === 'Customer'));
      this.customerCollection = collection.filter((user: User) => user.role.find((role: Role) => role.name));

      this.orderSupervisorOptionList = this.supervisorCollection.map((supervisor: User) => {

        const availableSupervisorOption: { name: string; id: string; } = {
          name: supervisor.contact[0].profile.firstName ? supervisor.contact[0].profile.firstName : 'No name',
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

      // Return Visu test account as Customer only on Sandy
      if (environment.forTestPurpose) {

        let availableCustomerOption: { name: string; id: string; };

        const missingUser: { name: string; id: string; } = {
          name: 'MISSING USER',
          id: '0'
        };

        const visuUserAcc: User = collection.find((user: User) => user.id === '61828f4078646e1207b737ea');

        if (isDefined(visuUserAcc)) {

          availableCustomerOption = {
            name: visuUserAcc.contact[0].profile.firstName ? visuUserAcc.contact[0].profile.firstName : 'No name',
            id: visuUserAcc.id
          };

          this.orderCustomerOptionList.push(availableCustomerOption);
        };
      }

      // Preselect customer
      if (isDefined(this.orderToEdit.userData.customer)) {
        const userPresent: User = this.customerCollection.find((user: User) => user.id === this.orderToEdit.userData.customer.id);

        if (isDefined(userPresent)) {
          this.selectedOrderCustomer = this.orderCustomerOptionList.find((customer: { name: string; id: string; }) => customer.id === this.orderToEdit.userData.customer.id);
        } else {
          this.orderCustomerOptionList.push(missingUser);
          this.selectedOrderCustomer = this.orderCustomerOptionList.find((customer: { name: string; id: string; }) => customer.id === '0');
        }
      } else {
        this.orderCustomerOptionList.push(missingUser);
        this.selectedOrderCustomer = this.orderCustomerOptionList.find((customer: { name: string; id: string; }) => customer.id === '0');
      }

      // this.preselectOrderSupervisor();
    }
  }

  private preselectOrderSupervisor(): void {
    this.selectedOrderSupervisor = this.orderSupervisorOptionList
      .find((option: { name: string; id: string; }) => option.id === this.orderToEdit.userData.supervisor.id);
  }

  private initiateEditOrderData(): void {

    console.log(this.orderToEdit);

    // Initiate dropdowns
    this.selectedOrderserviceType = this.serviceTypeOptionList.find((o: { color: string; name: string; value: "FLOORPLAN" | "FAKE_VISU_ORDER"; }) => o.value === this.orderToEdit.serviceType);
    this.selectedOrderCustomer = this.orderCustomerOptionList.find((o: { name: string; id: string }) => o.id === this.orderToEdit.userData.customer.id);
    this.selectedOrderPriority = this.orderPriorityOptionList.find((o: { name: any; color: string; }) => o.name === this.orderToEdit.priority);
    this.selectedOrderLibrary = this.orderLibraryOptionList.find((o: { id: number; name: string; value: string; }) => o.value === this.orderToEdit.library).id;
    this.selectedOrderStyle = isDefined(this.orderToEdit.options.style) ? this.orderStyleOptionList.find((o: { id: number; name: string; }) => o.name === this.orderToEdit.options.style).id : 0;

    // Initiate options
    for (const [key, value] of Object.entries(this.orderToEdit.options)) {

      const option: { name: string, selected: boolean } = {
        name: '',
        selected: value
      };

      switch (key) {
        case 'hasFurniture':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Furniture').selected = value;
          break;

        case 'hasNorthArrow':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'North Arrow').selected = value;
          break;

        case 'hasRoomDesignation':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Room Designation').selected = value;
          break;

        case 'hasFloorplanDesignations':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Floor Plan Desig.').selected = value;
          break;

        case 'hasAlignNorth':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Align North').selected = value;
          break;

        case 'hasFlatDesignation':
          option.name = 'Flat Designation';
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Flat Designation').selected = value;
          break;

        case 'hasDimensionalChains':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Dimensional Chains').selected = value;
          break;

        case 'hasMeterBars':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Meter Bars').selected = value;
          break;

        case 'hasIsometric':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Isometric').selected = value;
          break;

        case 'hasSquareMeterSpecifications':
          this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Square Meter S.').selected = value;
          break;

        case 'drawingType':
          if (value !== '') {
            this.selectedDrawingType = this.drawingType.find((o: { id: number; name: string }) => o.name === this.orderToEdit.options.drawingType).id;
          }
          break;

        case 'squareMeterSpecificationsType':
          // option.name = 'Furniture';
          // this.ffInfos.push(option);
          break;

        case 'trueToScaleRatioType':
          if (value !== '' && value !== 'None') {
            this.selectedScaleRatioEnabled = true;
            this.ffInfos.find((o: { name: string, selected: boolean }) => o.name === 'Scale Ratio').selected = true;
          }
          break;

        default:
          break;
      }

    };

    // Initiate Logo/Watermark
    if (isDefined(this.orderToEdit.options.logo)) {
      this.addOrderLogo = true;
      this.orderLogo = this.orderToEdit.options.logo;
    }

    if (isDefined(this.orderToEdit.options.waterMark)) {
      this.addOrderWatermark = true;
      this.orderWatermark = this.orderToEdit.options.waterMark;
    }

    // Initiate floors
    if (isDefined(this.orderToEdit.floors) && this.orderToEdit.floors.length > 0) {

      this.orderFloorList = this.orderToEdit.floors.map((floor: OrderFloor) => {

        const floorItem: INewOrderFloor = {
          id: floor.id ? floor.id : undefined,
          name: floor.name,
          number: floor.floorNumber.toString()
        };

        return floorItem;
      });

      // for (const floor of this.orderToEdit.floors) {

      //   const floorItem: INewOrderFloor = {
      //     name: floor.name,
      //     number: floor.floorNumber.toString()
      //   };

      //   this.orderFloorList.push(floorItem);
      // }
    } else {
      this.orderFloorList.push({});
    };

    // initiate attachments
    if (isDefined(this.orderToEdit.attachments) && this.orderToEdit.attachments.length > 0) {

      this.attachments = this.orderToEdit.attachments
    }
  }

  private getDate(): void {

    const [date, hour]: string[] = this.orderToEdit.orderDates.deadline.split(',');
    const [day, month, year]: string[] = date.split('.');
    const dateBuild: string = year + '.' + month + '.' + day;

    this.orderDateInFuture = new Date(`${dateBuild},${hour}`) > this.todayDate;
    this.initialDeadlineDate = this.datePipe.transform(dateBuild, 'yyyy-MM-dd');
    this.selectedOrderDeadlineDate = new Date(dateBuild).toString();
    // this.selectedOrderDeadlineDate = this.datePipe.transform(dateBuild, 'yyyy-MM-dd');
    this.selectedOrderDeadlineTime = hour.trim();
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

  public ffInfos = [
    { name: "Furniture", selected: true },
    // { name: "Square Meter", selected: false },
    { name: "North Arrow", selected: false },
    { name: "Room Designation", selected: false },
    { name: "Floor Plan Desig.", selected: false },
    { name: "Align North", selected: false },
    { name: "Flat Designation", selected: false },
    { name: "Dimensional Chains", selected: false },
    { name: "Meter Bars", selected: false },
    { name: "Isometric", selected: false },
    { name: "Square Meter S.", selected: false },
    { name: "Scale Ratio", selected: false }
  ];

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

  private setOrderFloors(): OrderFloor[] {

    const newFloors: OrderFloor[] = this.orderFloorList.map((floorWannaBe: INewOrderFloor) => {

      let floor: OrderFloor;

      if (isDefined(floorWannaBe.id)) {
        floor = {
          ...this.orderToEdit.floors.find((f: OrderFloor) => f.id === floorWannaBe.id),
          name: floorWannaBe.name,
          floorNumber: floorWannaBe.number !== '' ? parseInt(floorWannaBe.number) : undefined
        };
      } else {
        floor = new OrderFloor({
          name: floorWannaBe.name,
          floorNumber: floorWannaBe.number !== '' ? parseInt(floorWannaBe.number) : undefined
        });
      }

      return floor;
    }).filter((floor: OrderFloor) => floor.name !== undefined && floor.name !== '' && floor.floorNumber !== undefined);

    return newFloors;
  }

  private setLogo(): Partial<CloudFile> | undefined {

    let logo: Partial<CloudFile>;

    if (this.addOrderLogo && isDefined(this.orderToEdit.options.logo)) {
      logo = this.orderToEdit.options.logo;
    }

    return logo;
  }

  private setWatermark(): Partial<CloudFile> | undefined {

    let watermark: Partial<CloudFile>;

    if (this.addOrderWatermark && isDefined(this.orderToEdit.options.waterMark)) {
      watermark = this.orderToEdit.options.waterMark;
    }

    return watermark;
  }

  public setOrderOptions(value: 'true' | 'false', name: string): void {

    switch (name) {

      case 'Furniture':
        this.orderToEdit.options.hasFurniture = value === 'true' ? true : false;
        break;

      case 'Square Meter':
        this.orderToEdit.options.hasSquareMeterSpecifications = value === 'true' ? true : false;
        break;

      case 'North Arrow':
        this.orderToEdit.options.hasNorthArrow = value === 'true' ? true : false;
        break;

      case 'Room Designation':
        this.orderToEdit.options.hasRoomDesignation = value === 'true' ? true : false;
        break;

      case 'Floor Plan Desig.':
        this.orderToEdit.options.hasFloorplanDesignations = value === 'true' ? true : false;
        break;

      case 'Align North':
        this.orderToEdit.options.hasAlignNorth = value === 'true' ? true : false;
        break;

      case 'Flat Designation':
        this.orderToEdit.options.hasFlatDesignation = value === 'true' ? true : false;
        break;

      case 'Dimensional Chains':
        this.orderToEdit.options.hasDimensionalChains = value === 'true' ? true : false;
        break;

      case 'Meter Bars':
        this.orderToEdit.options.hasMeterBars = value === 'true' ? true : false;
        break;

      case 'Isometric':
        this.orderToEdit.options.hasIsometric = value === 'true' ? true : false;
        break;

      case 'Square Meter S.':
        this.orderToEdit.options.hasSquareMeterSpecifications = value === 'true' ? true : false;
        break;

      case 'Scale Ratio':
        this.selectedScaleRatioEnabled = value === 'true' ? true : false;
        break;

      default:
        break;
    }
  }

  public selectDateEvent(event: any): void {
    const dateObj: Date = event.value;
    this.selectedOrderDeadlineDate = dateObj.toString();

    if (dateObj > this.todayDate) {
      this.orderDateInFuture = true;
      this.minSelectableHour = null;
      this.currentHour = null;
    } else {
      this.parseMinDeadlineHour();
    }
  }

  public addNewFloor(): void {
    const newFloor: INewOrderFloor = {};
    this.orderFloorList.push(newFloor);
  }

  public deleteNewFloor(index: number): void {

    this.orderFloorList.splice(index, 1);

    if (index === 0 && !this.orderFloorList.length) {
      this.orderFloorList.push({});
    }
  }

  public deleteAttachment(index: number): void {
    this.orderToEdit.attachments.splice(index, 1);
  }

  public deleteLogoAttachment(): void {
    this.orderToEdit.options.logo = undefined;
  }

  public deleteWatermarkAttachment(): void {
    this.orderToEdit.options.waterMark = undefined;
  }

  public cancelEdit(): void {
    this.router.navigateByUrl(this.router.url.replace('/edit', ''));
  }

  public saveEdit(): void {

    const editOrderIntentData: IEditOrderIntent = {

      changedOrderData: {
        ...this.orderToEdit,

        orderDates: {
          ...this.orderToEdit.orderDates,
          deadline: this.parseDeadlineDate()
        },

        options: {
          ...this.orderToEdit.options,
          drawingType: this.drawingType.find((o: { id: number; name: string }) => o.id === this.selectedDrawingType).name,
          squareMeterSpecificationsType: this.orderToEdit.options.hasSquareMeterSpecifications ? this.squareMeter.find((o: any) => o.id === this.selectedSquareMeter).name : '',
          trueToScaleRatioType: this.selectedScaleRatioEnabled ? this.ratioType.find((o: any) => o.id === this.selectedRatioType).name : 'None',
          style: this.orderStyleOptionList.find((option: { id: number; name: string }) => option.id === this.selectedOrderStyle).name,
          logo: this.setLogo(),
          waterMark: this.setWatermark()
        },

        priority: this.setOrderPriority(),
        serviceType: this.selectedOrderserviceType.value,
        style: this.orderStyleOptionList.find((option: { id: number; name: string }) => option.id === this.selectedOrderStyle).name,
        library: this.orderLibraryOptionList.find((option: { id: number; name: string }) => option.id === this.selectedOrderLibrary).value,
      },

      orderId: this.orderToEdit.ids.main,
      customerId: isDefined(this.selectedOrderCustomer) ? this.selectedOrderCustomer.id : this.orderToEdit.userData.customer.id,
      newFloors: this.setOrderFloors(),
      newAttachments: [...this.fileUploadControl.value],
      newLogo: this.addOrderLogo ? this.logoUploadControl.value[0] : undefined,
      newWatermark: this.addOrderWatermark ? this.watermarkUploadControl.value[0] : undefined

    } as IEditOrderIntent;

    this.orderService.editOrder(editOrderIntentData);
    console.log(editOrderIntentData);
  }
}
