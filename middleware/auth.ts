import { useAccountStore } from "~/stores/account";
import type { AccountData, AccountTheme } from "../types/account";
import { useCookie, useState } from "nuxt/app";
import apiUseFetch from "../componsables/apiUseFetch";
import checkPermissions from "~/componsables/checkPermissions";

export default defineNuxtRouteMiddleware(async (from, to) => {
    if (process.server) return;

    try {
        const { data } = await apiUseFetch("/auth/verify", {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        });

        const resCode: string = data.value.resCode.toString();
        const isLogged: boolean = data.value.data.logged;

        if (resCode !== "17011" || !isLogged) {
            location.pathname = "/login";
            return;
        }

        const accountStore = useAccountStore();

        //Get user theme
        let storedTheme: string | null = localStorage.getItem("theme") as string | null;
        let storedLinks: string | null = localStorage.getItem("links") as string | null;

        accountStore.setTheme((storedTheme || "light") as AccountTheme);

        //Set account data
        accountStore.setLoading(false);
        const accountData: AccountData | null | undefined = useCookie("accountData").value as AccountData | null | undefined;

        if (!accountData || !data.value.data.id || !data.value.data.role) {
            return location.pathname = "/login";
        }

        accountStore.setAccountData(accountData || {} as AccountData);
        accountStore.setRole(data.value.data.role);
        accountStore.setId(data.value.data.id);

        accountStore.setLinks(JSON.parse(storedLinks as string) || []);
    } catch {
        return location.pathname = "/login";
    }
});
