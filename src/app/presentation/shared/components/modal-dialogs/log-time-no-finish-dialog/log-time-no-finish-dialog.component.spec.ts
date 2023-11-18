import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from 'src/app/presentation/+store/+services/order/order.service';
import { MatDialogMock, mockOrderService } from 'src/app/utils/utils';

import { LogTimeNoFinishDialogComponent } from './log-time-no-finish-dialog.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('LogTimeNoFinishDialogComponent', () => {
  let component: LogTimeNoFinishDialogComponent;
  let fixture: ComponentFixture<LogTimeNoFinishDialogComponent>;

  beforeEach(async () => {
   await TestBed.configureTestingModule({
      declarations: [
        LogTimeNoFinishDialogComponent,
      ],
      imports: [

      ],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: MatDialog, useValue: MatDialogMock }
      ],
      teardown: {
        destroyAfterEach: false
      },
     schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTimeNoFinishDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method onlyLogTime should work correctly',  () => {
    const event = spyOn(component.onlyLogTimeEvent, 'emit')
    component.onlyLogTime()
    expect(event).toHaveBeenCalled()
  });

  it('method logTimeAndAssign should work correctly',  () => {
    const event = spyOn(component.logTimeAndAssignEvent, 'emit')
    component.logTimeAndAssign()
    expect(event).toHaveBeenCalled()
  });

  it('method logTimeAndUnassign should work correctly',  () => {
    const event = spyOn(component.logTimeAndUnassignEvent, 'emit')
    component.logTimeAndUnassign()
    expect(event).toHaveBeenCalled()
  });

  it('method closeModal should work correctly',  () => {
    spyOn(MatDialogMock, 'closeAll')
    component.closeModal()
    expect(MatDialogMock.closeAll).toHaveBeenCalled()
  });
});
