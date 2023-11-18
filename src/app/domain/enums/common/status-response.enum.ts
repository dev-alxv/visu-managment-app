export enum StatusResponse {
    Ok = 'OK',
    Fail = 'FAIL',
    Block = 'BLOCK',
    InUse = 'INUSE',
    Error = 'ERROR'
}

export type StatusResponseType = keyof typeof StatusResponse;
