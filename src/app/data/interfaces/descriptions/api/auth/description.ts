
export interface IAuthDescription {
  payload?: IAuthResponseData;
  token?: {
    payload: string;
    createdAt: string;
    state: string;
    type: string;
  };
  refreshTokenRequest?: boolean;
  error?: string;
  errorDescription?: string;
}

export interface IAuthResponseData {
  details: IAuthTokenResponseDescription;
  type: 'QUERY_OK' | '';
}

export interface IAuthTokenResponseDescription {
  createdAt: number;
  encodedToken: string;
  state: string;
  type: string;
}
