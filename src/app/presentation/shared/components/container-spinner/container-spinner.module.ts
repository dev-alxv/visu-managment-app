import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ContainerSpinnerComponent } from './container-spinner.component';
import { MaterialUiModule } from '../../modules/material/material-ui.module';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialUiModule
  ],
  declarations: [ContainerSpinnerComponent],
  exports: [ContainerSpinnerComponent]
})
export class ContainerSpinnerModule { }
