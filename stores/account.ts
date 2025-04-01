import { defineStore, acceptHMRUpdate } from "pinia";
import type {AccountData, AccountTheme, AccountLink} from "../types/account";

export const useAccountStore = defineStore("account", {
    state: () => ({
        id: "",
        name: "",
        surname: "",
        abbreviation: "",
        email: "",
        role: "",
        profilePicture: "default.jpg",
        idClass: null as number | null,
        createdAt: new Date() as Date,
        links: [] as AccountLink[],
        theme: "" as AccountTheme
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
        setTheme(theme: AccountTheme): void {
            this.theme = theme;
        },
        setLinks(links: AccountLink[]): void {
            this.links = links;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}
