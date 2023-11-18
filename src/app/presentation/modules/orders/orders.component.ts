import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs';

import { Order } from 'src/app/domain/models/Order/order.model';
import { OrderService } from '../../+store/+services/order/order.service';
import { OrderState } from '../../+store/global/order/order.state';
import { OrderStore } from '../../+store/global/order/order.store';
import { UiStateStore } from '../../+store/global/ui-state/ui-state.store';
import { UiState } from '../../+store/global/ui-state/ui.state';
import { BaseHostModalDialogComponent } from '../../shared/components/base-host-modal-dialog/base-host-modal-dialog.component';
import { AssignDialogComponent } from '../../shared/components/modal-dialogs/assign-dialog/assign-dialog.component';
import { ModalTemplateInputData } from 'src/app/domain/interfaces/modal/modal.interfaces';
import { IOrderCollectionRequest } from 'src/app/domain/interfaces/order/order.interfaces';
import { UserStore } from '../../+store/global/user/user.store';
import { UserState } from '../../+store/global/user/user.state';
import { User } from 'src/app/domain/models/User/user.model';
import { isDefined } from 'src/app/utils/utils';
import { Role } from 'src/app/domain/models/User/role.model';
import { serviceFilterOptions, statusFilterOptions } from '../../shared/entities/dropdown.options';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

interface IFFUserData {
  id: number;
  profile: {
    name: string;
    lastname: string;
    email: string;
  }
}
@UntilDestroy()

@Component({
  selector: 'ff-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements AfterViewInit {

  public orderCollection: Order[];
  public userCollection: User[];
  public uiState: UiState;

  public searchInputText: string;

  public selected: string = 'Created Date (From new to old)';
  public displayedColumns: string[] = ['ids', 'orderDates', 'assignee', 'customer', 'data', 'actions'];
  public dataSource: Order[];
  public userData: IFFUserData[];
  public ordersPerPageSelected: string;

  public assignUserIntentInProgress: boolean;
  public orderToAssignId: string;

  public selectedOrderCustomer: { name: string; id: string; };

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  public serviceTypes = serviceFilterOptions;
  public selectedServiceType = [];

  public customers: { name: string; id: string; }[] = [];
  public selectedCustomer = [];

  public statuses = statusFilterOptions;
  public selectedStatus = [];

  public users: { name: string; id: string; }[] = [];
  public selectedUsers = [];

  public myFormGroup: FormGroup;

  public paginateConfig: PaginationInstance = {
    id: 'orderList',
    itemsPerPage: undefined,
    currentPage: undefined,
    totalItems: undefined,
  }

  ///////
  public options2 = [
    { id: 1, name: "Highest priority", style: "b-red" },
    { id: 2, name: "High priority", style: "b-orange" },
    { id: 3, name: "Medium priority", style: "b-l-blue" },
    { id: 4, name: "Low priority", style: "b-green" },
    { id: 5, name: "Lowest priority", style: "b-grey" }
  ]

  public selected2 = [];

  constructor(
    private orderStore: OrderStore,
    private orderService: OrderService,
    private uiStateStore: UiStateStore,
    private userStore: UserStore,
    private dialog: MatDialog,
    private router: Router,

    private http: HttpClient
  ) {
    this.observeUserStoreState();

    this.uiStateStore.stateStream$
      .pipe(
        untilDestroyed(this),
        switchMap((state: UiState) => {

          if (!isDefined(this.uiState)) {
            this.handleUserRoleUiView(state);
          }

          this.uiState = state;

          return this.orderStore.stateStream$;
        })
      )
      .subscribe({
        next: (state: OrderState) => {

          if (state.list) {
            this.assignUserIntentInProgress = false;
            this.orderToAssignId = undefined;
            this.orderCollection = this.handleOrderViewPermissions(state.list);
          }

          if (state.pageData) {
            this.paginateConfig.itemsPerPage = state.pageData.pageSize;
            this.paginateConfig.currentPage = state.pageData.pageNumber + 1;
            this.paginateConfig.totalItems = state.pageData.pageTotal;
            this.ordersPerPageSelected = state.pageData.pageSize.toString();

            // Set search input
            if (isDefined(state.pageData.searchData) && isDefined(state.pageData.searchData.input)) {
              this.searchInputText = state.pageData.searchData.input;
            }
          }
        }
      });
  }

  private observeUserStoreState(): void {
    this.userStore.stateStream$
      .pipe(
        untilDestroyed(this),
        // delay(500)
      )
      .subscribe({
        next: (state: UserState) => this.handleUserCollection(state.list)
      });
  }

  private handleUserRoleUiView(state: UiState): void {

    // Drafter
    if (!state.authorizedUser.role.some((r: Role) => r.name === 'Supervisor' || r.name === 'Admin')) {

      // Hide 'NEW' status from filter dropdown
      this.statuses = this.statuses.filter((status: { id: number, name: string, style: string }) => status.name !== 'NEW');
    }
  }

  private handleUserCollection(collection: User[]): void {

    if (collection.length) {
      this.userCollection = collection;

      const realUsers: User[] = collection.filter((user: User) => isDefined(user.contact) && user.role.find((role: Role) => role.name !== 'Customer'));
      const realCustomers: User[] = collection.filter((user: User) => isDefined(user.contact) && user.role.find((role: Role) => role.name === 'Customer'));

      this.users = realUsers.map((user: User) => {

        const availableUserOption: { name: string; id: string; } = {
          name: user.contact[0].profile.firstName ? user.contact[0].profile.firstName : 'No name',
          id: user.id
        };

        return availableUserOption;
      }).filter((u: { name: string; id: string; }) => u.name !== 'No name');

      this.customers = realCustomers.map((user: User) => {

        const availableCustomerOption: { name: string; id: string; } = {
          name: user.contact[0].profile.firstName ? user.contact[0].profile.firstName : 'No name',
          id: user.id
        };

        return availableCustomerOption;
      }).filter((u: { name: string; id: string; }) => u.name !== 'No name');
    }
  }

  private handleOrderViewPermissions(collection: Order[]): Order[] {

    if (isDefined(this.uiState)) {

      switch (this.uiState.authorizedUser.role[0].name) {

        case 'Drafter':
          // collection = collection.filter((order: Order) => order.status !== 'NEW');
          break;

        default:
          break;
      }
      // state.list.filter((order: Order) => order.status === 'TO_DO')
    }

    return collection;
  }

  public ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  public ngOnInit(): void {

    this.myFormGroup = new FormGroup({
      filterOption: new FormControl('Created Date (From new to old)')
    });
  }

  public onPageChange(page: number): void {
    this.paginateConfig.currentPage = page;
    this.fetchPage(page);
  }

  public onPageBoundsCorrection(page: number): void {
    // this.logEvent(`pageBoundsCorrection(${page})`);
    this.paginateConfig.currentPage = page;
  }

  private fetchPage(page: number): void {

    const pageReqParams: IOrderCollectionRequest = {
      pageData: {
        pageNumber: page - 1
      }
    };

    this.orderService.getOrderCollectionSlice(pageReqParams);
  }

  public changeToursPerPage(perPage: string): void {

    const pageReqParams: IOrderCollectionRequest = {
      pageData: {
        pageNumber: 0,
        ordersPerPage: parseInt(perPage)
      }
    } as IOrderCollectionRequest;

    this.orderService.getOrderCollectionSlice(pageReqParams);
  }

  public applyFilters(data: string[], type: 'user' | 'status' | 'customer' | 'service'): void {

    let pageReqParams: IOrderCollectionRequest = {};

    switch (type) {

      case 'user':
        pageReqParams = {
          filterData: {
            users: [...data]
          }
        };
        break;

      case 'status':
        pageReqParams = {
          filterData: {
            statuses: [...data]
          }
        };
        break;

      case 'customer':
        pageReqParams = {
          filterData: {
            customers: [...data]
          }
        };
        break;

      case 'service':
        pageReqParams = {
          filterData: {
            services: [...data]
          }
        };
        break;

      default:
        break;
    }

    this.orderService.getOrderCollectionSlice(pageReqParams);
  }

  public resetFilters(): void {

    let pageReqParams: IOrderCollectionRequest = {
      filterData: {
        users: [],
        statuses: [],
        customers: [],
        services: []
      }
    };

    this.selectedUsers = [];
    this.selectedStatus = [];
    this.selectedCustomer = [];
    this.selectedServiceType = [];

    this.orderService.getOrderCollectionSlice(pageReqParams);
  }

  public applySortFilter(data: string, type: 'sort_by'): void {

    let pageReqParams: IOrderCollectionRequest = {};

    switch (data) {

      case 'Created Date (From new to old)':
        pageReqParams = {
          filterData: {
            sortBy: 'id_desc'
          }
        };
        break;

      case 'Created Date (From old to new)':
        pageReqParams = {
          filterData: {
            sortBy: 'id_asc'
          }
        };
        break;


      case 'Deadline Date (From new to old)':
        pageReqParams = {
          filterData: {
            sortBy: 'deadlineDate_desc'
          }
        };
        break;

      case 'Deadline Date (From old to new)':
        pageReqParams = {
          filterData: {
            sortBy: 'deadlineDate_asc'
          }
        };
        break;

      default:
        break;
    }

    this.orderService.getOrderCollectionSlice(pageReqParams);
  }

  public applyTextFilter(evt: KeyboardEvent): void {

    let pageReqParams: IOrderCollectionRequest = {};

    if (evt.key === 'Enter' && isDefined(this.searchInputText) && this.searchInputText.trim() !== '') {

      pageReqParams = {
        searchData: {
          input: this.searchInputText
        }
      }

      this.orderService.getOrderCollectionSlice(pageReqParams);
    }
  }

  public clearTextFilter(): void {

    let pageReqParams: IOrderCollectionRequest = {
      searchData: {
        input: undefined
      }
    };

    this.searchInputText = '';

    this.orderService.getOrderCollectionSlice(pageReqParams);
  }

  // filterOption = [
  //   { key: "Created Date (From new to old)", abbriviation: '0-0-1' },
  //   { key: "Created Date (From old to new)", abbriviation: '1-0-1' },
  //   { key: "Deadline Date (From new to old)", abbriviation: '1-1-1' },
  //   { key: "Deadline Date (From old to new)", abbriviation: '1-1-1-1' }
  // ]

  public assign(internalId: string, mainId: string): void {

    this.orderToAssignId = mainId;

    const outputActionsSubs: Subscription = new Subscription();

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Order: ID ' + internalId,
        controlActions: false,
        logo: false,
        component: AssignDialogComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component
          orderId: mainId
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
                next: () => this.assignUserIntentInProgress = true
              })
          );
        }
      });

    dialogRef.afterClosed()
      .subscribe({
        next: () => outputActionsSubs.unsubscribe()
      });
  }

  public editOrder(orderToEditId: string): void {
    this.router.parseUrl(`/order/${orderToEditId}`);
  }

  public ordersTrackFn = (i: number, order: Order): string => order.ids.main;
}
