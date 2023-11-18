import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationControlsDirective } from 'ngx-pagination';

import { OrdersComponent } from './orders.component';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent
  },
  {
    path: 'order/:id',
    loadChildren: () => import('../order/order.module').then(m => m.OrderModule)
  }
];

const uiElements = [

];

@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,

    // UI
    UiCoreModule,
    ...uiElements,

    RouterModule.forChild(routes)
  ],
  exports: [
    [OrdersComponent]
  ]
})
export class OrdersModule { }
