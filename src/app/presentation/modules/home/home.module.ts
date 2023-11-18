import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';

const routes: Routes = [
  { path: '', component: HomeComponent }
];

const uiElements = [

];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,

    // UI
    UiCoreModule,
    // ...uiElements,

    RouterModule.forChild(routes)
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
