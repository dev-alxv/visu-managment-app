import { IntentResultResponseType } from '../../enums/common/intent-result-response.enum';
import { StatusResponseType } from '../../enums/common/status-response.enum';

export interface IIntentResponse {
  result?: StatusResponseType;
  descriptionMessage?: string;
  intentResultResponse?: IntentResultResponseType;
}
