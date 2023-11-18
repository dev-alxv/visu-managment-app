import { Component, OnInit } from '@angular/core';

import { AuthStore } from '../../+store/global/auth/auth.store';
import { AuthService } from '../../+store/+services/auth/auth.service';
import { AuthenticationState } from '../../+store/global/auth/auth.state';
import { IAuthenticationRequest } from 'src/app/domain/interfaces/auth/auth.interfaces';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'ff-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public authenticationStoreStateStream$: Observable<AuthenticationState>;

  public loginForm: FormGroup;
  public hidePassword = true;

  public authRequestSent = false;

  public authData: IAuthenticationRequest = {
    username: '',
    password: ''
  } as IAuthenticationRequest;

  constructor(
    private authStore: AuthStore,
    private authService: AuthService
  ) { }

  public ngOnInit(): void {
    this.observeAuthenticationStateStream();
  }

  private observeAuthenticationStateStream(): void {
    this.authenticationStoreStateStream$ = this.authStore.stateStream$;
  }

  public signIn(): void {
    this.authRequestSent = true;
    this.authService.requestAuthentication(this.authData);
  }
}
