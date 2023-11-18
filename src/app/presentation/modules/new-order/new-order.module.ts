import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NewOrderComponent } from './new-order.component';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  { path: '', component: NewOrderComponent }
];

const uiElements = [

];

@NgModule({
  declarations: [
    NewOrderComponent
  ],
  imports: [
    CommonModule,

    // UI
    UiCoreModule,
    // ...uiElements,

    RouterModule.forChild(routes)
  ],
  exports: [
    NewOrderComponent
  ]
})
export class NewOrderModule { }
