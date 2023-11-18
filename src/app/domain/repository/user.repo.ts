import { Observable } from 'rxjs';

import { IUserRequestResponseData } from '../interfaces/request-response/user.response';

export abstract class UserRepo {

  public abstract authorizedProfile(): Observable<IUserRequestResponseData>;
  public abstract list(): Observable<IUserRequestResponseData>;
}
