import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {
  BaseHostModalDialogComponent
} from "src/app/presentation/shared/components/base-host-modal-dialog/base-host-modal-dialog.component";


xdescribe('BaseHostModalDialogComponent', () => {
  let component: BaseHostModalDialogComponent;
  let fixture: ComponentFixture<BaseHostModalDialogComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BaseHostModalDialogComponent
      ],
      imports: [],
      providers: [],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(BaseHostModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

})
