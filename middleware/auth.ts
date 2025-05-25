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

        if (!storedTheme || !["dark", "light"].includes(storedTheme)) {
            const isDarkMode: boolean = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            storedTheme = isDarkMode ? "light" : "light";

            accountStore.setTheme("system");
        } else {
            accountStore.setTheme(storedTheme as AccountTheme);
        }

        useState("theme", () => storedTheme);

        //Set account data
        accountStore.setLoading(false);
        const accountData: AccountData | null | undefined = useCookie("accountData").value as AccountData | null | undefined;

        if (!accountData) {
            return location.pathname = "/login";
        }

        accountStore.setAccountData(accountData);
        accountStore.setRole(data.value.data.role);

        accountStore.setLinks(JSON.parse(storedLinks as string) || []);
    } catch {
        return location.pathname = "/login";
    }
});
