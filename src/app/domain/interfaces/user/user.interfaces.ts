import { UserContractStateType } from "../../enums/user/user.enum";
import { Role } from "../../models/User/role.model";

export interface UserContact {
  profile: {
    firstName: string;
    lastName: string;
    cellPhone?: string;
    contactEMail?: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'NO_GENDER';
  };
  canSendMails: boolean;
}

export interface UserContract {
  state: UserContractStateType;
}

export interface IUserProfile {
  readonly id: string;
  roles?: Role[],
  names?: {
    first?: string;
    last?: string;
  };
  contact?: {
    email?: string;
  };
}
