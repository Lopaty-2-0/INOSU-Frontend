import { u as useAccountStore } from './account.mjs';

const checkPermissions = (allowedRoles = []) => {
  if (!allowedRoles) return true;
  return allowedRoles.includes(useAccountStore().getRole);
};

export { checkPermissions as c };
//# sourceMappingURL=checkPermissions.mjs.map
