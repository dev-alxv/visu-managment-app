import { NgModule } from '@angular/core';
import { CheckPermissionsDirective } from './check-permissions/check-permissions.directive';

const Directives = [
  CheckPermissionsDirective
];

@NgModule({
  declarations: [
    ...Directives
  ],
  exports: [
    ...Directives
  ]
})
export class DirectivesModule { }
