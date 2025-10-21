import { defineStore, acceptHMRUpdate } from "pinia";
import type {AccountData, AccountTheme, AccountLink, LocalAccountData} from "~/types/account";
import useSimpleDataCipher from "~/componsables/useSimpleDataCipher";

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
        updatedAt: new Date() as Date,
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
                createdAt: this.createdAt,
                updatedAt: this.updatedAt
            };
        },
        getLocalAccountData(): LocalAccountData {
            return {
                profilePicture: this.profilePicture,
                email: this.email,
                name: this.name,
                surname: this.surname,
                idClass: this.idClass,
                abbreviation: this.abbreviation,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
            }
        },
        getTheme(): AccountTheme {
            return this.theme;
        },
        getLinks(): AccountLink[] {
            return this.links;
        },
        getLoading(): boolean {
            return this.loading;
        },
        getRole(): string {
            return this.role;
        },
        getId(): string {
            return this.id;
        }
    },
    actions: {
        setLocalAccountData(accountData: LocalAccountData): void {
            this.name = accountData.name;
            this.surname = accountData.surname;
            this.abbreviation = accountData.abbreviation;
            this.email = accountData.email;
            this.profilePicture = accountData.profilePicture;
            this.idClass = accountData.idClass;
            this.createdAt = accountData.createdAt;
            this.updatedAt = accountData.updatedAt;
        },
        setId(id: string): void {
            this.id = id;
        },
        updateAccountDataSessionStorage(): void {
            sessionStorage.setItem("accountData", useSimpleDataCipher().encodeData({
                name: this.name,
                surname: this.surname,
                abbreviation: this.abbreviation,
                email: this.email,
                profilePicture: this.profilePicture,
                idClass: this.idClass,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
            }));
        },
        updateProfilePicture(profilePicture: string): void {
            this.profilePicture = profilePicture;
        },
        setTheme(theme: AccountTheme): void {
            this.theme = theme;
        },
        setRole(role: string): void {
            this.role = role;
        },
        setLinks(links: AccountLink[]): void {
            this.links = links;

            localStorage.setItem("links", JSON.stringify(links));
        },
        setLoading(value: boolean): void {
            this.loading = value;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}
