import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { OrderPreloaderComponent } from './order-preloader/order-preloader.component';
import { MaterialUiModule } from '../../modules/material/material-ui.module';


const preLoaders = [
  OrderPreloaderComponent
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialUiModule
  ],
  declarations: [
    ...preLoaders
  ],
  exports: [
    ...preLoaders
  ]
})
export class ContentPreLoadersModule { }
