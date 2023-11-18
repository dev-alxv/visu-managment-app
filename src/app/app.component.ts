import { AfterViewInit, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AuthService } from './presentation/+store/+services/auth/auth.service';
import { UiStateService } from './presentation/+store/+services/ui-state/ui-state.service';
import { AuthStore } from './presentation/+store/global/auth/auth.store';
import { AuthenticationState } from './presentation/+store/global/auth/auth.state';
import { OrderService } from './presentation/+store/+services/order/order.service';
import { UserService } from './presentation/+store/+services/user/user.service';
import {LoggerService} from "src/app/utils/logger.service";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  public title = 'ff-frontend-app';

  private authenticationComplete = false;

  constructor(
    private uiStateService: UiStateService,
    private authService: AuthService,
    private authStore: AuthStore,
    private userService: UserService,
    private orderService: OrderService,
    private loggerService: LoggerService
  ) { }

  public ngOnInit(): void {
    this.initiateCoreServices();
    this.observeAuthenticationState();
  }

  private observeAuthenticationState(): void {
    this.authStore.stateStream$
      // .pipe(first())
      .pipe()
      .subscribe({
        next: (state: AuthenticationState) => {
          this.loggerService.info('handleAuthenticationState', state, this.constructor.name)
          this.handleAuthenticationState(state)
        }
      });
  }

  public ngAfterViewInit(): void {
    this.uiStateService.init();
  }

  private initiateCoreServices(): void {
    this.authService.init();
  }

  private handleAuthenticationState(state: AuthenticationState): void {

    if (state.authorized && !this.authenticationComplete) {
      this.authenticationComplete = true;
      //
      this.orderService.init();
    }
  }
}
