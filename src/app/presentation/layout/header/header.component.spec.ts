import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthService} from '../../+store/+services/auth/auth.service';
import {MatMenuModule} from '@angular/material/menu';

import {HeaderComponent} from './header.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const fakeAuthService = jasmine.createSpyObj(['requestLogout'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        // MockComponent({
        //   selector: 'mat-menu'
        // })
      ],
      imports: [
        MatMenuModule
      ],
      providers: [
        { provide: AuthService, useValue: fakeAuthService }
      ],
      teardown: {
        destroyAfterEach: false
      },
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method authService.requestLogout should be called in method onLogout',  () => {
    component.onLogout()
    expect(fakeAuthService.requestLogout).toHaveBeenCalled()
  });
});
