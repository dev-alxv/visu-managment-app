import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {
  UiStyleGuideComponent
} from "src/app/presentation/modules/ui-style-guide/ui-style-guide.component";
import {MatDialog} from "@angular/material/dialog";
import {of} from "rxjs";

describe('UiStyleGuideComponent', () => {
  let component: UiStyleGuideComponent;
  let fixture: ComponentFixture<UiStyleGuideComponent>;

  const fakeMatDialog = jasmine.createSpyObj(['open'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UiStyleGuideComponent,
      ],
      imports: [],
      providers: [
        {provide: MatDialog, useValue: fakeMatDialog}
      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiStyleGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fakeMatDialog.open.and.returnValue({
      afterOpened() {
        return of()
      },
      afterClosed() {
        return of()
      },
      componentInstance: {
        logTimeEvent: of(),
        onlyLogTimeEvent: of(),
        logTimeAndAssignEvent: of(),
        logTimeAndUnassignEvent: of(),
        closeModal() {}
      }
    })
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method dialog.open should be called in method openExampleModal', function () {
    component.openExampleModal()
    expect(fakeMatDialog.open).toHaveBeenCalled()
  });
});
