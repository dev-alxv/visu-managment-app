import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderPreloaderComponent} from './order-preloader.component';


describe('OrderPreloaderComponent', () => {
  let component: OrderPreloaderComponent;
  let fixture: ComponentFixture<OrderPreloaderComponent>;

  beforeEach(async () => {
   await TestBed.configureTestingModule({
      declarations: [
        OrderPreloaderComponent
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

    fixture = TestBed.createComponent(OrderPreloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
