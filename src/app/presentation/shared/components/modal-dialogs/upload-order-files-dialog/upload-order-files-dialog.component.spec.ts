import {ComponentFixture, TestBed, TestBedStatic} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {UploadOrderFilesDialogComponent} from './upload-order-files-dialog.component';
import {routes} from 'src/app/app-routing.module';
import {MatDialogMock} from 'src/app/utils/utils';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

const oldResetTestingModule: TestBedStatic = TestBed.resetTestingModule();

describe('UploadOrderFilesDialogComponent', () => {
  let component: UploadOrderFilesDialogComponent;
  let fixture: ComponentFixture<UploadOrderFilesDialogComponent>;

  beforeEach(async () => {
   await TestBed.configureTestingModule({
      declarations: [
        UploadOrderFilesDialogComponent
      ],
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot()
      ],
      providers: [
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

    fixture = TestBed.createComponent(UploadOrderFilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method confirmUpload should work correctly',  () => {
    const event = spyOn(component.uploadOrderFilesEvent, 'emit')
    component.confirmUpload()
    expect(event).toHaveBeenCalled()
  });

  it('method closeModal should work correctly',  () => {
    spyOn(MatDialogMock, 'closeAll')
    component.closeModal()
    expect(MatDialogMock.closeAll).toHaveBeenCalled()
  });
});
