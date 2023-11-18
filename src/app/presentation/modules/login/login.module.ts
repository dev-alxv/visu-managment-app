import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import { UiCoreModule } from '../../shared/modules/ui-core/ui-core.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,

    // UI
    UiCoreModule
    // ...uiElements,
  ]
})
export class LoginModule { }
