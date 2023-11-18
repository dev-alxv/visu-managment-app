import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay } from 'rxjs/operators';

import { UserStore } from 'src/app/presentation/+store/global/user/user.store';
import { UserState } from 'src/app/presentation/+store/global/user/user.state';
import { User } from 'src/app/domain/models/User/user.model';
import { isDefined } from 'src/app/utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from 'src/app/presentation/+store/+services/order/order.service';
import { IAssignUserToOrderIntent } from 'src/app/domain/interfaces/order/order.interfaces';
import { Role } from 'src/app/domain/models/User/role.model';
import { OrderStatusType } from 'src/app/domain/enums/order/order.enum';

interface IAssignee {
  name?: string;
  info?: string;
  id?: string;
};

@UntilDestroy()

@Component({
  selector: 'ff-assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrls: ['./assign-dialog.component.scss']
})
export class AssignDialogComponent implements OnInit {

  public userCollection: User[] = [];
  public assignUserOptionList: IAssignee[] = [];
  public assignUserOptionListStatic: IAssignee[] = [];
  public selectedAssignee: IAssignee = { id: '' };
  public assigneeInput: string;

  @Input() public orderId: string;
  @Input() public orderStatus: OrderStatusType;

  @Output() public confirmEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private userStore: UserStore,
    private orderService: OrderService,
    private matDialog: MatDialog
  ) {
    this.observeUserStoreState();
  }

  ngOnInit(): void {

  }

  private observeUserStoreState(): void {
    this.userStore.stateStream$
      .pipe(
        untilDestroyed(this),
        delay(700)
      )
      .subscribe({
        next: (state: UserState) => this.handleUserCollection(state.list)
      });
  }

  private handleUserCollection(collection: User[]): void {

    if (collection.length) {

      // this.userCollection = collection.filter((user: User) => user.role.find((role: Role) => role.name === 'Supervisor'));
      this.userCollection = collection.filter((user: User) => isDefined(user.contact) && user.role.find((role: Role) => role.name !== 'Customer'));

      if (isDefined(this.orderStatus) && this.orderStatus === 'NEW') {
        this.userCollection = this.userCollection.filter((user: User) => user.role.length > 1 && user.role[0].name !== 'Drafter');
      }

      this.assignUserOptionList = this.userCollection.map((assignee: User) => {

        const roleList: string[] = [];

        for (const role of assignee.role) {
          roleList.push(role.name);
        }

        const availableAssigneeOption: IAssignee = {
          name: assignee.contact[0].profile.firstName ? assignee.contact[0].profile.firstName : 'No name',
          info: roleList.join(', '),
          id: assignee.id
        };

        return availableAssigneeOption;
      }).filter((u: IAssignee) => u.name !== 'No name');

      this.assignUserOptionListStatic = this.assignUserOptionList;
    }
  }

  public onInputSearchEvent(searchText: string): void {

    if (searchText !== '' && searchText !== undefined) {

      const foundSearch: IAssignee[] = this.assignUserOptionListStatic.filter((u: IAssignee) => u.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);

      if (foundSearch.length > 0) {
        this.assignUserOptionList = foundSearch;
      } else {
        this.assignUserOptionList = [{ name: 'No Match' }];
        this.selectedAssignee = { id: '' };
      }
    } else {
      this.assignUserOptionList = this.assignUserOptionListStatic;
      this.selectedAssignee = { id: '' };
    }
  }

  public selectUser(user: IAssignee): void {
    this.selectedAssignee = user;
    this.assigneeInput = user.name;
  }

  public assignTo(): void {

    const assignUserToOrderIntent: IAssignUserToOrderIntent = {
      orderId: this.orderId,
      userId: this.selectedAssignee.id
    } as IAssignUserToOrderIntent;

    this.confirmEvent.emit();
    this.closeModal();
    this.orderService.assignUser(assignUserToOrderIntent);
  }

  public closeModal(): void {
    this.matDialog.closeAll();
  }

}
