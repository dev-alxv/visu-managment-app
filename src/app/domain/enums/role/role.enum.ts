enum UserRoleEnum {
  Admin = 'Admin',
  Supervisor = 'Supervisor',
  Drafter = 'Drafter',
  Customer = 'Customer'
}

export type UserRoleType = keyof typeof UserRoleEnum;
