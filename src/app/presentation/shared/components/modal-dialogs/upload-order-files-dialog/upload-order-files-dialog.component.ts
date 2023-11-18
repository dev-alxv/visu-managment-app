import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';

export interface IUploadData {
  attachments?: File[];
  logo?: File;
  watermark?: File;
}

@Component({
  selector: 'ff-upload-order-files-dialog',
  templateUrl: './upload-order-files-dialog.component.html',
  styleUrls: ['./upload-order-files-dialog.component.scss']
})
export class UploadOrderFilesDialogComponent implements OnInit {

  public fileUploadControl = new FileUploadControl({ listVisible: false });
  public logoUploadControl = new FileUploadControl({ listVisible: false, accept: ['image/*'], discardInvalid: true }, [FileUploadValidators.accept(['image/*']), FileUploadValidators.filesLimit(1)]);
  public watermarkUploadControl = new FileUploadControl({ listVisible: false, accept: ['image/*'], discardInvalid: true }, [FileUploadValidators.accept(['image/*']), FileUploadValidators.filesLimit(1)]);

  @Output() public uploadOrderFilesEvent: EventEmitter<IUploadData> = new EventEmitter();

  constructor(
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  public confirmUpload(): void {

    const data: IUploadData = {
      attachments: this.fileUploadControl.value,
      logo: this.logoUploadControl.value[0],
      watermark: this.watermarkUploadControl.value[0]
    }

    this.uploadOrderFilesEvent.emit(data);
  }

  public closeModal(): void {
    this.matDialog.closeAll();
  }
}
