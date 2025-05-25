import { useAccountStore } from "~/stores/account";

const checkPermissions = (allowedRoles: string[] = []) => {
    if (!allowedRoles) return true;

    return allowedRoles.includes(useAccountStore().getRole);
};

export default checkPermissions;