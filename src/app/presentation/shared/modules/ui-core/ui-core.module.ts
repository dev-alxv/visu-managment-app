import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../../directives/directives.module';
import { MaterialUiModule } from '../material/material-ui.module';
import { ContainerSpinnerModule } from '../../components/container-spinner/container-spinner.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ContentPreLoadersModule } from '../../components/content-preloaders/content-preloaders.module';

const uiModules = [
  FileUploadModule,
  FlexLayoutModule,
  MaterialUiModule,
  TranslateModule,
  DirectivesModule,
  ContainerSpinnerModule,
  ContentPreLoadersModule,
  RouterModule
];

@NgModule({
  imports: [
    ...uiModules
  ],
  exports: [
    ...uiModules
  ],
  declarations: []
})
export class UiCoreModule { }
