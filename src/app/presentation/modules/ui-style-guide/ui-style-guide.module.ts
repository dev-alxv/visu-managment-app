import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiStyleGuideComponent } from './ui-style-guide.component';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';

const routes: Routes = [
  { path: '', component: UiStyleGuideComponent }
];

const uiElements = [

];

@NgModule({
  declarations: [
    UiStyleGuideComponent
  ],
  imports: [
    CommonModule,

    // UI
    UiCoreModule,
    // ...uiElements,

    RouterModule.forChild(routes)
  ],
  exports: [UiStyleGuideComponent]
})
export class UiStyleGuideModule { }
