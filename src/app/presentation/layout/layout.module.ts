import { NgModule } from '@angular/core';

import { LayoutComponent } from './layout.component';
import { MainComponent } from './main/main.component';
import { UiCoreModule } from '../shared/modules/ui-core/ui-core.module';
import { HeaderComponent } from './header/header.component';
import { SideComponent } from './side/side.component';

// import { ExamplesComponent, ModalExampleTwoComponent } from './main/example/examples.component';

@NgModule({
  declarations: [
    LayoutComponent,
    MainComponent,
    HeaderComponent,
    SideComponent
  ],
  imports: [
    // UI core
    UiCoreModule
  ],
  exports: [LayoutComponent]
})
export class LayoutModule { }
