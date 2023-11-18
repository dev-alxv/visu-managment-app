import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SupportComponent } from './support.component';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';

const routes: Routes = [
  { path: '', component: SupportComponent }
];

const uiElements = [

];

@NgModule({
  declarations: [
    SupportComponent
  ],
  imports: [
    CommonModule,

    // UI
    UiCoreModule,
    // ...uiElements,

    RouterModule.forChild(routes)
  ],
  exports: [
    SupportComponent
  ]
})
export class SupportModule { }
