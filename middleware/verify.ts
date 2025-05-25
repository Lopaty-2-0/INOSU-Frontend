import checkPermissions from "~/componsables/checkPermissions";

export default defineNuxtRouteMiddleware((to) => {
    if (process.server) return;

    const roles = to.meta.roles as string[] | undefined;

    if (roles) {
        const permissionGranted = checkPermissions(roles);

        if (!permissionGranted) {
            return navigateTo("/panel/errors/403");
        }

        return true;
    }

    return true
});