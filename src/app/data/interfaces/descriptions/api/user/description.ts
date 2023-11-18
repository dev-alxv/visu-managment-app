import { UserRoleType, UserStateType } from "src/app/data/enums/user/user.enum";

export interface IUserRequestResponseDescription {
  details: IUserDescription;
  type: 'QUERY_OK' | '';
}

export interface IUserCollectionRequestResponseDescription {
  details: {
    hasNext: boolean;
    list: IUserDescription[];
    pageIndex: number;
    pageSize: number;
  },
  type: 'QUERY_OK' | '';
}

export interface IVisuUserCollectionRequestResponseDescription {
  content: IUserDescription[];
  pageNumber: number;
  pageSize: number;
  total: string;
}

export interface IUserDescription {
  config: IUserOrderConfigDescription;
  country: string;
  email: string;
  id: string;
  identity: string;
  lang: string;
  orderConfig: IUserOrderConfigDescription;
  role: UserRoleType[];
  services: IUserServiceDescription[];
  state: UserStateType;
  contacts: IUserContactDescription[];
}

export interface IUserOrderConfigDescription {
  tourActionsConfig: unknown
}

export interface IUserContactDescription {
  data: {
    contactEMail: string;
    firstName: string;
    gender: string;
    lastName: string;
  };
  sendMails: boolean;
}

export interface IUserServiceDescription {
  portalType: string;
  status: number;
}

export class UserDescription implements IUserDescription {

  public id: string;
  public identity: string;
  public config: IUserOrderConfigDescription;
  public country: string;
  public email: string;
  public lang: string;
  public orderConfig: IUserOrderConfigDescription;
  public role: UserRoleType[];
  public services: IUserServiceDescription[];
  public state: UserStateType;
  public contacts: IUserContactDescription[];

  constructor(description: IUserDescription) {
    this.id = description.id;
    this.identity = description.identity;
    this.config = description.config;
    this.country = description.country;
    this.email = description.email;
    this.lang = description.lang;
    this.orderConfig = description.orderConfig;
    this.role = description.role;
    this.services = description.services;
    this.state = description.state;
    this.contacts = description.contacts;
  }
}
