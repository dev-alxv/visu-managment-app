import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionDialogComponent} from './action-dialog.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";


describe('ActionDialogComponent', () => {
  let comp: ActionDialogComponent;
  let fixture: ComponentFixture<ActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ActionDialogComponent
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

    fixture = TestBed.createComponent(ActionDialogComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('method closeTimeDelayInput should work ', () => {
    const result = comp.closeTimeDelayInput
    expect(result).toBeUndefined()
  });
});
