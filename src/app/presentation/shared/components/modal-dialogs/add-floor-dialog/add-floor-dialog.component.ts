import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { OrderService } from 'src/app/presentation/+store/+services/order/order.service';
import { OrderFloor } from 'src/app/domain/models/Order/order.model';
import { IAddOrderFloorIntent } from 'src/app/domain/interfaces/order/order.interfaces';

interface INewOrderFloor {
  number?: string;
  name?: string;
}

@Component({
  selector: 'ff-support',
  templateUrl: './add-floor-dialog.component.html',
  styleUrls: ['./add-floor-dialog.component.scss']
})
export class AddFloorDialogComponent implements OnInit {

  // Order floors
  public orderFloorList: INewOrderFloor[] = [{}];

  public isEmptyFloor: boolean;

  @Input() public orderId: string;

  @Output() public addOrderFloorEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private orderService: OrderService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  private createOrderFloors(): OrderFloor[] {

    const newFloors: OrderFloor[] = this.orderFloorList.map((floorWannaBe: INewOrderFloor) => {

      const floor: OrderFloor = new OrderFloor({
        name: floorWannaBe.name,
        floorNumber: floorWannaBe.number !== '' ? parseInt(floorWannaBe.number) : undefined
      });

      return floor;
    }).filter((floor: OrderFloor) => floor.name !== undefined && floor.name !== '' && floor.floorNumber !== undefined);

    return newFloors;
  }

  public addNewFloor(): void {
    const newFloor: INewOrderFloor = {};
    this.orderFloorList.push(newFloor);
  }

  public deleteNewFloor(index: number): void {
    this.orderFloorList.splice(index, 1);
  }

  public sentOrderFloors(): void {

    const addNewOrderFloorsIntentData: IAddOrderFloorIntent = {
      orderId: this.orderId,
      floorList: this.createOrderFloors()
    } as IAddOrderFloorIntent;

    if (addNewOrderFloorsIntentData.floorList.length > 0) {
      this.closeModal();
      this.orderService.addOrderFloor(addNewOrderFloorsIntentData);
    }
  }

  public closeModal(): void {
    this.matDialog.closeAll();
  }
}
