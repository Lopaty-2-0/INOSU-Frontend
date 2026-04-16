import { useAccountStore } from "~/stores/account";
import type {AccountData, AccountTheme, LocalAccountData} from "~/types/account";
import useSimpleDataCipher from "~/componsables/useSimpleDataCipher";
import {useLoadingStore} from "~/stores/loading";

export default defineNuxtRouteMiddleware(async () => {
    if (process.server) return;

    try {
        const data: any = await $fetch("/api/auth/verify", {
            method: "get",
            credentials: "include",
            ignoreResponseError: true,
        });

        const resCode: string = data.resCode.toString();

        if (resCode === "E10100") {
            useLoadingStore().setHasRateLimit(true);
            return;
        }

        const isLogged: boolean = data.data.logged;

        if (resCode !== "17011" || !isLogged) {
            location.pathname = "/login";
            return;
        }

        const { encodeData, decodeData } = useSimpleDataCipher();
        const accountStore = useAccountStore();
        const loadingStore = useLoadingStore();

        //Get user theme
        let storedTheme: string | null = localStorage.getItem("theme") as string | null;
        let storedLinks: string | null = localStorage.getItem("links") as string | null;

        accountStore.setTheme((storedTheme || "light") as AccountTheme);

        //Set account data
        const accountDataString: string | null = sessionStorage.getItem("accountData") as string | null;
        let accountData: LocalAccountData | null = accountDataString ? decodeData(accountDataString) as LocalAccountData : null;

        if (!accountData || (data.data.updatedAt !== accountData.updatedAt)) {
            await $fetch("/api/user/logged/data", {
                method: "get",
                credentials: "include",
                ignoreResponseError: true,
                cache: "no-cache",
                async onResponse({ response }: any): Promise<any> {
                    const resCode: string = response._data.resCode.toString();

                    if (resCode === "E10100") {
                        loadingStore.setHasRateLimit(true);
                        return;
                    }

                    if (resCode === "50011") {
                        const freshAccountData: AccountData = response._data.data.user as AccountData;

                        if (!freshAccountData) return;

                        accountData = {
                            name: freshAccountData.name,
                            surname: freshAccountData.surname,
                            abbreviation: freshAccountData.abbreviation,
                            email: freshAccountData.email,
                            profilePicture: freshAccountData.profilePicture,
                            idClass: freshAccountData.idClass,
                            createdAt: freshAccountData.createdAt,
                            updatedAt: freshAccountData.updatedAt,
                            reminders: freshAccountData.reminders,
                        };

                        const encodedAccountData: string = encodeData(accountData);

                        sessionStorage.setItem("accountData", encodedAccountData);
                    }
                }
            });
        }

        loadingStore.setLoading("accountDataLoading", false);

        if (!accountData || !data.data.id || !data.data.role) {
            return location.pathname = "/login";
        }

        accountStore.setLocalAccountData(accountData || {} as LocalAccountData);
        accountStore.setRole(data.data.role);
        accountStore.setId(data.data.id);
        accountStore.setLinks(JSON.parse(storedLinks as string) || []);

        return true;
    } catch {
        return location.pathname = "/login";
    }
});
