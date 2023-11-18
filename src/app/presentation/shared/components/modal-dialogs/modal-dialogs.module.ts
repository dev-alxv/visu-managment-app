import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UiCoreModule } from '../../modules/ui-core/ui-core.module';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { AddFloorDialogComponent } from './add-floor-dialog/add-floor-dialog.component';
import { WaitingResponseDialogComponent } from './waiting-response-dialog/waiting-response-dialog.component';
import { UploadOrderFilesDialogComponent } from './upload-order-files-dialog/upload-order-files-dialog.component';
import { LogTimeAndFinishDialogComponent } from './log-time-and-finish-dialog/log-time-and-finish-dialog.component';
import { LogTimeNoFinishDialogComponent } from './log-time-no-finish-dialog/log-time-no-finish-dialog.component';

const dialogs = [
  ActionDialogComponent,
  AssignDialogComponent,
  AddFloorDialogComponent,
  UploadOrderFilesDialogComponent,
  WaitingResponseDialogComponent,
  LogTimeAndFinishDialogComponent,
  LogTimeNoFinishDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    UiCoreModule
  ],
  declarations: [
    ...dialogs
  ],
  exports: [
    ...dialogs
  ]
})
export class ModalDialogsModule { }
