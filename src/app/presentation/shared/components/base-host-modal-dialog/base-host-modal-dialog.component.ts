import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalTemplateInputData } from 'src/app/domain/interfaces/modal/modal.interfaces';

@Component({
  selector: 'scout24-base-host-modal-dialog',
  templateUrl: './base-host-modal-dialog.component.html',
  styleUrls: ['./base-host-modal-dialog.component.scss']
})
export class BaseHostModalDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;

  public componentRef: ComponentRef<any>;
  public modalInputData: ModalTemplateInputData;

  @Output() public actionOne: EventEmitter<any> = new EventEmitter();
  @Output() public actionTwo: EventEmitter<any> = new EventEmitter();
  @Output() public actionThree: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalTemplateInputData | any,
    private dialogRef: MatDialogRef<BaseHostModalDialogComponent>,
    private resolver: ComponentFactoryResolver
  ) {
    this.modalInputData = data;
  }

  public ngOnInit() {

  }

  public ngAfterViewInit(): void {
    this.createComponent();
  }

  private createComponent() {
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(this.data.component);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.changeDetectorRef.detectChanges();
    const hostedComponent: any = this.componentRef.instance;

    // pass Inputs to component
    if (this.data.inputs) {
      setTimeout(() => {
        Object.keys(this.data.inputs).forEach(inputName => {
          hostedComponent[inputName] = this.data.inputs[inputName]
        });
      }, 10);
    }

    // type OptionalIndexed<T> = { [key: string]: T | undefined };
    // const indexer = this as unknown as OptionalIndexed<BaseHostModalDialogComponent>;
    // console.log(Object.keys(hostedComponent));

    // PassThrough outputs from hosted component
    Object.keys(hostedComponent as typeof BaseHostModalDialogComponent)
      .filter(prop => hostedComponent[prop] instanceof EventEmitter)
      .forEach((output: keyof BaseHostModalDialogComponent) => {
        this[output as keyof BaseHostModalDialogComponent] = new EventEmitter();

        this[`${output}_sub` as keyof BaseHostModalDialogComponent] = hostedComponent[output].subscribe((data: any) => {
          this[output as keyof BaseHostModalDialogComponent].emit(data)
        })
      })
  }

  public buttonOneAction() {
    this.actionOne.emit('');
  }

  public buttonTwoAction() {
    this.actionTwo.emit('');
  }

  public buttonThreeAction() {
    this.actionThree.emit('');
  }

  public closeModal() {
    this.dialogRef.close();
  }

  public ngOnDestroy() {
    this.componentRef.destroy();
  }

}
