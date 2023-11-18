import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerSpinnerComponent} from './container-spinner.component';
import {MockComponent} from 'src/app/utils/utils';


describe('ContainerSpinnerComponent', () => {
  let comp: ContainerSpinnerComponent;
  let fixture: ComponentFixture<ContainerSpinnerComponent>;

  beforeEach(async () => {
   await TestBed.configureTestingModule({
      declarations: [
        ContainerSpinnerComponent,
        MockComponent({
          selector: 'scout24-container-spinner',
          inputs: ['color', 'diameter', 'strokeWidth']
        }),
      ],
      imports: [

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

    fixture = TestBed.createComponent(ContainerSpinnerComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
