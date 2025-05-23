const checkPermissions = (allowedRoles: string[] = [], userRole: string) => {
    if (!allowedRoles || userRole === "admin") return true;

    return allowedRoles.includes(userRole);
};

export default checkPermissions;