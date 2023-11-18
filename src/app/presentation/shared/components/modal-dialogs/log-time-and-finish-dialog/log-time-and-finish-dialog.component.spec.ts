import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {OrderService} from 'src/app/presentation/+store/+services/order/order.service';
import {MatDialogMock, mockOrderService} from 'src/app/utils/utils';

import {LogTimeAndFinishDialogComponent} from './log-time-and-finish-dialog.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('LogTimeAndFinishDialogComponent', () => {
  let component: LogTimeAndFinishDialogComponent;
  let fixture: ComponentFixture<LogTimeAndFinishDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LogTimeAndFinishDialogComponent,
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
    fixture = TestBed.createComponent(LogTimeAndFinishDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method sendLoggedTime should work correctly',  () => {
    const event = spyOn(component.logTimeEvent, 'emit')
    component.sendLoggedTime()
    expect(event).toHaveBeenCalled()
  });

  it('method closeModal should work correctly',  () => {
    spyOn(MatDialogMock, 'closeAll')
    component.closeModal()
    expect(MatDialogMock.closeAll).toHaveBeenCalled()
  });
});
