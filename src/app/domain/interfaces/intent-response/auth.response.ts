import { IIntentResponse } from "../common/intent.response";

export interface IAuthenticationIntentResponseData extends IIntentResponse {
  token?: {
    payload?: string;
    createdAt?: string;
    state?: string;
    type?: string;
  }
}
