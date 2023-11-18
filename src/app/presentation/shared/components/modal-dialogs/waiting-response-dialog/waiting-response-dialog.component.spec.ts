import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';

import {WaitingResponseDialogComponent} from './waiting-response-dialog.component';

describe('WaitingResponseDialogComponent', () => {
  let component: WaitingResponseDialogComponent;
  let fixture: ComponentFixture<WaitingResponseDialogComponent>;

  beforeEach(async () => {
   await TestBed.configureTestingModule({
      declarations: [
        WaitingResponseDialogComponent,
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [

      ],
      teardown: {
        destroyAfterEach: false
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
