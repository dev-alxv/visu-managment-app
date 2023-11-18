import { Role } from "./role.model";
import { FeaturePermissions } from "./feature-permission.model";
import { UserContact, UserContract } from "../../interfaces/user/user.interfaces";
import { UserStateType } from "../../enums/user/user.enum";
import { IUserContactDescription, UserDescription } from "src/app/data/interfaces/descriptions/api/user/description";
import { UserRoleType as UserRoleTypeDescription } from "src/app/data/enums/user/user.enum";
import { isDefined } from "src/app/utils/utils";

export class User {

  public id: string;
  public role: Role[];
  public featurePermissions: FeaturePermissions;
  public state: UserStateType;
  public email: string;
  public identity: string;
  public contact: UserContact[];
  public contract: UserContract;
  public accountType: string;
  public parentID: string;
  public language: string;
  public country: string;
  public useContract: string;
  public services: any;
  public orderConfig: any;
  public parentUser: any;

  constructor(userDescription: UserDescription) {

    // set id
    if (isDefined(userDescription.id)) {
      this.id = userDescription.id;
    }

    // set roles
    this.role = setUserRoles(userDescription.role);

    // set feature permissions
    this.featurePermissions = undefined;

    // set state
    if (isDefined(userDescription.state)) {
      this.state = userDescription.state;
    }

    // set identity
    if (isDefined(userDescription.identity)) {
      this.identity = userDescription.identity;
    }

    // set email
    if (isDefined(userDescription.email)) {
      this.email = userDescription.email;
    }

    // set country
    if (isDefined(userDescription.country)) {
      this.country = userDescription.country;
    }

    // set langauge
    if (isDefined(userDescription.lang)) {
      this.language = userDescription.lang;
    }

    // set contacts info
    if (isDefined(userDescription.contacts) && userDescription.contacts.length) {
      this.contact = userDescription.contacts.map((description: IUserContactDescription) => {

        const contact: UserContact = {
          profile: {
            firstName: description.data.firstName,
            lastName: description.data.lastName,
            contactEMail: description.data.contactEMail,
            gender: description.data.gender as 'MALE' | 'FEMALE' | 'OTHER' | 'NO_GENDER'
          },
          canSendMails: description.sendMails
        };

        return contact;
      });

    } else {

      const contact: UserContact = {
        profile: {
          firstName: this.identity,
          lastName: '',
          contactEMail: this.email,
          gender: 'OTHER'
        },
        canSendMails: undefined
      };

      this.contact = [contact];
    }

  }
}

export function setUserRoles(roleDescriptionList: UserRoleTypeDescription[]): Role[] {

  return roleDescriptionList.map((roleDescription: UserRoleTypeDescription) => {

    let role: Role;

    switch (roleDescription) {

      // WONT USE ADMIN FOR NOW
      ///
      // case 'ADMIN':
      //   role = new Role('Admin');
      //   return role;

      case 'VISUALIZATION_DRAFTER':
        role = new Role('Drafter');
        return role;

      case 'VISUALIZATION_SUPERVISOR':
        role = new Role('Supervisor');
        return role;

      case 'VISUALIZATION_CUSTOMER':
        role = new Role('Customer');
        return role;

      default:
        return role;
    }
  }).filter((role: Role) => isDefined(role));
}
