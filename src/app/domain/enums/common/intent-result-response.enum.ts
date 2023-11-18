
export enum IntentResultResponse {
  Order_Created = 'ORDER_CREATED',
  Intent_Data_Missing = 'INTENT_DATA_MISSING',
}

export type IntentResultResponseType = keyof typeof IntentResultResponse;
