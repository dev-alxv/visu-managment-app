import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';

import {AssignDialogComponent} from './assign-dialog.component';
import {routes} from 'src/app/app-routing.module';
import {OrderService} from 'src/app/presentation/+store/+services/order/order.service';
import {MatDialogMock, mockOrderService} from 'src/app/utils/utils';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";


describe('AssignDialogComponent', () => {
  let component: AssignDialogComponent;
  let fixture: ComponentFixture<AssignDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AssignDialogComponent
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MatDialog, useValue: MatDialogMock },
        { provide: OrderService, useValue: mockOrderService }
      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(AssignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method onInputSearchEvent should work correctly',  () => {
    component.assignUserOptionListStatic = [{name: 'Bob'}, {name: 'Jack'}]
    component.onInputSearchEvent('J')
    expect(component.assignUserOptionList.length).toBe(1)
    expect(component.assignUserOptionList).toEqual([{name: 'Jack'}])

    component.onInputSearchEvent('i')
    expect(component.assignUserOptionList.length).toBe(1)
    expect(component.assignUserOptionList).toEqual([{name: 'No Match'}])
    expect(component.selectedAssignee).toEqual({id: ''})

    component.onInputSearchEvent('')
    expect(component.selectedAssignee).toEqual({id: ''})
  });

  it('method selectUser should work correctly',  () => {
    component.selectUser({name: 'Mike', id: '123'})
    expect(component.selectedAssignee).toEqual({name: 'Mike', id: '123'})
  });

  it('method assignTo should work correctly',  () => {
    spyOn(mockOrderService, 'assignUser')
    spyOn(MatDialogMock, 'closeAll')
    component.assignTo()
    expect(mockOrderService.assignUser).toHaveBeenCalled()
    expect(MatDialogMock.closeAll).toHaveBeenCalled()
  });

  it('method closeModal should work correctly',  () => {
    spyOn(MatDialogMock, 'closeAll')
    component.closeModal()
    expect(MatDialogMock.closeAll).toHaveBeenCalled()
  });
});
