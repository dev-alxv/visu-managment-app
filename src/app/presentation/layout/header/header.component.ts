import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthStore } from '../../+store/global/auth/auth.store';
import { AuthService } from '../../+store/+services/auth/auth.service';
import { AuthenticationState } from '../../+store/global/auth/auth.state';
import { UiStateStore } from '../../+store/global/ui-state/ui-state.store';
import { UiState } from '../../+store/global/ui-state/ui.state';
import { isDefined } from 'src/app/utils/utils';

interface userProfile {
  names: {
    first: string;
    last: string;
  },
  email?: string;
}

@Component({
  selector: 'ff-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public authenticationStoreStateStream$: Observable<AuthenticationState>;

  public authUserProfile: userProfile;

  constructor(
    private authStore: AuthStore,
    private authService: AuthService,
    private uiStateStore: UiStateStore
  ) { }

  public ngOnInit(): void {
    this.observeAuthenticationStateStream();
    this.observeUiStateStream();
  }

  private observeAuthenticationStateStream(): void {
    this.authenticationStoreStateStream$ = this.authStore.stateStream$;
  }

  private observeUiStateStream(): void {
    this.uiStateStore.stateStream$
      .subscribe({
        next: (state: UiState) => this.parseUiState(state)
      });
  }

  private parseUiState(state: UiState): void {

    if (isDefined(state.authorizedUser)) {

      this.authUserProfile = {
        names: {
          first: state.authorizedUser.contact[0].profile.firstName,
          last: state.authorizedUser.contact[0].profile.lastName
        },
        email: state.authorizedUser.contact[0].profile.contactEMail
      };
    }
  }

  public onLogout(): void {
    this.authService.requestLogout();
  }

}
