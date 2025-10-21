import { useAccountStore } from "~/stores/account";
import type {AccountData, AccountTheme, LocalAccountData} from "~/types/account";
import apiUseFetch from "../componsables/apiUseFetch";
import useSimpleDataCipher from "~/componsables/useSimpleDataCipher";
import apiFetch from "~/componsables/apiFetch";

export default defineNuxtRouteMiddleware(async () => {
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

        const { encodeData, decodeData } = useSimpleDataCipher();
        const accountStore = useAccountStore();

        //Get user theme
        let storedTheme: string | null = localStorage.getItem("theme") as string | null;
        let storedLinks: string | null = localStorage.getItem("links") as string | null;

        accountStore.setTheme((storedTheme || "light") as AccountTheme);

        //Set account data
        const accountDataString: string | null = sessionStorage.getItem("accountData") as string | null;
        let accountData: LocalAccountData | null = accountDataString ? decodeData(accountDataString) as LocalAccountData : null;

        if (!accountData || (data.value.data.updatedAt !== accountData.updatedAt)) {
            await apiFetch("/user/logged/data", {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                ignoreResponseError: true,
                async onResponse({ response }: any): Promise<any> {
                    const resCode: string = response._data.resCode.toString();

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
                        };

                        const encodedAccountData: string = encodeData(accountData);

                        sessionStorage.setItem("accountData", encodedAccountData);
                    }
                }
            });
        }

        accountStore.setLoading(false);

        if (!accountData || !data.value.data.id || !data.value.data.role) {
            return location.pathname = "/login";
        }

        accountStore.setLocalAccountData(accountData || {} as LocalAccountData);
        accountStore.setRole(data.value.data.role);
        accountStore.setId(data.value.data.id);
        accountStore.setLinks(JSON.parse(storedLinks as string) || []);

        return true;
    } catch {
        return location.pathname = "/login";
    }
});
