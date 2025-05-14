import { defineStore, acceptHMRUpdate } from "pinia";
import { useCookie } from "nuxt/app";
import type { AccountData, AccountTheme, AccountLink } from "../types/account";

export const useAccountStore = defineStore("account", {
    state: () => ({
        id: "",
        name: "",
        surname: "",
        abbreviation: null as string | null,
        email: "",
        role: "",
        profilePicture: "default.jpg",
        idClass: [] as number[],
        createdAt: new Date() as Date,
        links: [] as AccountLink[],
        theme: "" as AccountTheme,
        loading: true
    }),
    getters: {
        getAccountData(): AccountData {
            return {
                id: this.id,
                name: this.name,
                surname: this.surname,
                abbreviation: this.abbreviation,
                email: this.email,
                role: this.role,
                profilePicture: this.profilePicture,
                idClass: this.idClass,
                createdAt: this.createdAt
            };
        },
        getTheme(): AccountTheme {
            return this.theme;
        },
        getLinks(): AccountLink[] {
            return this.links;
        },
        getLoading(): boolean {
            return this.loading;
        }
    },
    actions: {
        setAccountData(accountData: AccountData): void {
            this.id = accountData.id;
            this.name = accountData.name;
            this.surname = accountData.surname;
            this.abbreviation = accountData.abbreviation;
            this.email = accountData.email;
            this.role = accountData.role;
            this.profilePicture = accountData.profilePicture;
            this.idClass = accountData.idClass;
            this.createdAt = accountData.createdAt;
        },
        updateAccountDataCookie(accountData: AccountData): void {
            useCookie("accountData").value = JSON.stringify(accountData);
        },
        updateProfilePicture(profilePicture: string): void {
            this.profilePicture = profilePicture;

            this.updateAccountDataCookie({
                ...this.getAccountData,
                profilePicture: profilePicture
            });
        },
        setTheme(theme: AccountTheme): void {
            this.theme = theme;
        },
        setLinks(links: AccountLink[]): void {
            this.links = links;
        },
        setLoading(value: boolean): void {
            this.loading = value;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}
