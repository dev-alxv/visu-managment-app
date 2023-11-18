import { StatusResponseType } from "../../enums/common/status-response.enum";

export interface IRequestResponse {
  payload?: any;
  result?: StatusResponseType;
  descriptionMessage?: string;
}
