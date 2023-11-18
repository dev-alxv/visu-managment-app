enum UserFeaturesEnum {
  ViewOrder = 'ViewOrder',
  EditOrder = 'EditOrder',
  CreateOrder = 'CreateOrder',
  DeleteOrder = 'DeleteOrder',
}

enum UserStateEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REQUIRES_ACTIVATION = 'REQUIRES_ACTIVATION',
}

enum UserContractStateEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REQUIRES_ACTIVATION = 'REQUIRES_ACTIVATION',
}

export type UserStateType = keyof typeof UserStateEnum;
export type UserContractStateType = keyof typeof UserContractStateEnum;
export type UserFeaturesType = keyof typeof UserFeaturesEnum;
