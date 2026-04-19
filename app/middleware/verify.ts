import checkPermissions from "~/componsables/checkPermissions";
import type {RouteLocationNormalizedGeneric} from "vue-router";

export default defineNuxtRouteMiddleware((to: RouteLocationNormalizedGeneric) => {
    if (process.server) return;

    const roles = to.meta.roles as string[] | undefined;

    if (roles) {
        const permissionGranted: boolean = checkPermissions(roles);

        if (!permissionGranted) {
            return navigateTo("/panel/errors/403");
        }

        return true;
    }

    return true;
});