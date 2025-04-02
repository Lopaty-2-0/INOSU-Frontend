import { useAccountStore } from "~/stores/account";
import type {AccountTheme} from "../types/account";
import {useState} from "nuxt/app";
import {apiUseFetch} from "../componsables/apiUseFetch";

export default defineNuxtRouteMiddleware(async (from, to) => {
    if (process.server) return;

    await apiUseFetch("/auth/verify", {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
    }).then(({data}) => {
        const resCode: string = data.value.resCode.toString();
        const isLogged: boolean = data.value.data.logged;

        if (resCode !== "17011" || !isLogged) return location.pathname = "/login";

        const accountStore = useAccountStore();

        //Get user theme
        let storedTheme: AccountTheme | null = localStorage.getItem("theme") as AccountTheme | null;

        if (!storedTheme) {
            const isDarkMode: boolean = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            storedTheme = isDarkMode ? "dark" : "light";

            localStorage.setItem("theme", storedTheme);
        }

        //Set the theme
        accountStore.setTheme(storedTheme);
        useState("theme", () => storedTheme);

        //Set account data
        accountStore.setAccountData({
            id: "",
            name: "Test",
            surname: "Account",
            abbreviation: "TEAC",
            profilePicture: "default.jpg",
            role: "admin",
            email: "test@test.cz",
            createdAt: new Date(),
            idClass: null,
        });
        accountStore.setLinks([{ text: "YouTube", href: "https://youtube.com" }, { text: "Google", href: "https://google.com" }]);
    }).catch(() => {
        return location.pathname = "/login";
    });
});
