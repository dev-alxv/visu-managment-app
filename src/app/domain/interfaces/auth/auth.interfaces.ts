import { User } from "../../models/User/user.model";

export interface IAuthorizedUser {
  accessToken?: string;
  expire?: string;
  profile?: User;
}

export interface IAuthenticationRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  received?: boolean;
  authDenied?: boolean;
}
