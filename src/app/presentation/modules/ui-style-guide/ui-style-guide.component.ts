import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalTemplateInputData } from 'src/app/domain/interfaces/modal/modal.interfaces';
import { BaseHostModalDialogComponent } from '../../shared/components/base-host-modal-dialog/base-host-modal-dialog.component';

@Component({
  selector: 'ff-ui-style-guide',
  templateUrl: './ui-style-guide.component.html',
  styleUrls: ['./ui-style-guide.component.scss']
})
export class UiStyleGuideComponent {

  constructor(
    private dialog: MatDialog
  ) { }

  public options2 = [
    { "id": 1, "name": "Highest priority" },
    { "id": 2, "name": "Highest priority" },
    { "id": 3, "name": "Highest priority" },
    { "id": 4, "name": "Highest priority" }
  ]










  public selected2 = this.options2[0].id;

  public openExampleModal(): void {

    const dialogRef = this.dialog.open(BaseHostModalDialogComponent, {
      panelClass: '', // add class for this dialog
      data: new ModalTemplateInputData({
        modalTitle: 'Example Modal Template',
        controlActions: true,
        logo: false,
        component: exampleComponent, //--> here component to load
        inputs: { // here an object with inputs data needed by your hosted component

        },
        buttonsConfig: {
          closeButton: true,
          cancelButton: false,
          actionButtonTwo: {
            enable: true,
            text: 'Button Two'
          }
        }
      }),
      width: '700px',
      height: '200px'
    });
  }
}

@Component({
  selector: "test-component",
  template: "",
})
class exampleComponent { }
