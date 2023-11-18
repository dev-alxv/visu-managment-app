import { UiStateService } from "../+store/+services/ui-state/ui-state.service";
import { PermissionsService } from "./permissions/permissions.service";
import { UserRoleFeaturesService } from "./user-role-features/user-role-features.service";

export const Services = [
  PermissionsService,
  UserRoleFeaturesService,
  UiStateService
];
