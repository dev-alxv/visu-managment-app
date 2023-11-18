import { User } from "../../models/User/user.model";
import { IRequestResponse } from "../common/request.response";

export interface IUserRequestResponseData extends IRequestResponse {
  authUserProfile?: User;
  userCollection?: User[];
}
