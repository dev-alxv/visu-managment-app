import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatTimepickerModule } from 'mat-timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';

const matModules = [
  CommonModule,
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatMenuModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatTabsModule,
  FormsModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatTableModule,
  MatProgressSpinnerModule,
  ReactiveFormsModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTimepickerModule,
  NgxMatTimepickerModule,
  MatCardModule,
  MatRadioModule
];

@NgModule({
  imports: [
    ...matModules
  ],
  exports: [
    ...matModules
  ],
  declarations: [],
})
export class MaterialUiModule { }
