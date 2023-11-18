import { NgModule } from '@angular/core';

import { BaseHostModalDialogComponent } from './base-host-modal-dialog.component';
import { UiCoreModule } from '../../modules/ui-core/ui-core.module';
import { ModalDialogsModule } from '../modal-dialogs/modal-dialogs.module';


@NgModule({
  imports: [
    UiCoreModule,
    ModalDialogsModule
  ],
  declarations: [
    BaseHostModalDialogComponent
  ]
})
export class BaseHostModalDialogModule { }
