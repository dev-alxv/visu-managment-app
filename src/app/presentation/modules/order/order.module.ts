import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from './order.component';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';
import { EditOrderComponent } from './edit-order/edit-order.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: 'edit', component: EditOrderComponent }
];

const uiElements = [

];

@NgModule({
  declarations: [
    OrderComponent,
    EditOrderComponent
  ],
  imports: [
    CommonModule,

    // UI
    UiCoreModule,
    // ...uiElements,
    RouterModule.forChild(routes)
  ],
  exports: [
    OrderComponent,
    EditOrderComponent
  ]
})
export class OrderModule { }
