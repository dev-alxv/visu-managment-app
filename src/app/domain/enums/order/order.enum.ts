enum OrderStatusEnum {
  NEW = 'NEW',
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  AWAIT_IN_REVIEW = 'AWAIT_IN_REVIEW',
  INTERNAL_REVIEW = 'INTERNAL_REVIEW',
  REVIEW = 'REVIEW',
  AWAIT_EX_REVIEW = 'AWAIT_EX_REVIEW',
  EXTERNAL_REVIEW = 'EXTERNAL_REVIEW',
  NEW_ITERATION = 'NEW_ITERATION',
  DONE = 'DONE'
}

export enum TempOrderStatusEnum {
  NEW = 'NEW',
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  CUSTOMER_REVIEW = 'CUSTOMER_REVIEW',
  FEEDBACK_REVIEW = 'FEEDBACK_REVIEW',
  APPROVED = 'APPROVED',
  DONE = 'DONE'
}

enum OrderActionEnum {
  SET_READY = 'SET_READY',
  START_DRAWING = 'START_DRAWING',
  FINISH_DRAWING = 'FINISH_DRAWING',
  DELIVER = 'DELIVER',
  REJECT = 'REJECT',
  APPROVE = 'APPROVE'
}

enum OrderFloorActionEnum {
  UPLOAD_SOURCE_FILE = 'UPLOAD_SOURCE_FILE',
  UPLOAD_JSON_FILE = 'UPLOAD_JSON_FILE',
  DELETE_PROJECT_DATA = 'DELETE_PROJECT_DATA'
}

export enum OrderPriorityEnum {
  Highest = 'Highest priority',
  High = 'High priority',
  Medium = 'Medium priority',
  Low = 'Low priority',
  Lowest = 'Lowest priority',
}

enum OrderLibraryEnum {
  FALK = 'FALK',
  BONAVA = 'BONAVA',
  SCANDINAVIAN = 'SCANDINAVIAN',
  LUXURY = 'LUXURY',
  MODERN = 'MODERN',
  SPARKASSE = 'SPARKASSE'
}

enum OrderStyleEnum {
  PRIMARY = 'PRIMARY',
  NEUTRAL = 'NEUTRAL',
  BLACK_WHITE = 'BLACK_WHITE',
  BLACK_WHITE_DEPOSITED = 'BLACK_WHITE_DEPOSITED',
  BONAVA = 'BONAVA'
}

enum OrderServiceTypeEnum {
  FLOORPLAN = 'FLOORPLAN',
  FAKE_VISU_ORDER = 'FAKE_VISU_ORDER'
}

enum OrderProviderTypeEnum {
  IMOGENT = 'IMOGENT'
}

enum OrderHistoryItemEventTypeEnum {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_DELETED = 'ORDER_DELETED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  USER_ASSIGNED_TO_ORDER = 'USER_ASSIGNED_TO_ORDER',
  INTERNAL_REVIEW_ADDED = 'INTERNAL_REVIEW_ADDED',
  ORDER_STATUS_CHANGED = 'ORDER_STATUS_CHANGED',
  EMERGENCY_ASSIGN = 'EMERGENCY_ASSIGN',
  LOG_TIME = 'LOG_TIME',
  LOG_TIME_FINISH = 'LOG_TIME_FINISH'
}

export type OrderStyleType = keyof typeof OrderStyleEnum;
export type OrderStatusType = keyof typeof OrderStatusEnum;
export type OrderPriorityType = keyof typeof OrderPriorityEnum;
export type OrderLibraryType = keyof typeof OrderLibraryEnum;
export type OrderServiceType = keyof typeof OrderServiceTypeEnum;
export type OrderProviderType = keyof typeof OrderProviderTypeEnum;
export type OrderActionType = keyof typeof OrderActionEnum;
export type OrderFloorActionType = keyof typeof OrderFloorActionEnum;
export type OrderHistoryItemEventType = keyof typeof OrderHistoryItemEventTypeEnum;
