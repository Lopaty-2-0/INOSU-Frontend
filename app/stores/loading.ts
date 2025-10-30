import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
    state: () => ({
        accountDataLoading: false,
        dataLoading: false
    }),
    getters: {
        isAccountDataLoading(): boolean {
            return this.accountDataLoading;
        },
        isDataLoading(): boolean {
            return this.dataLoading;
        }
    },
    actions: {
        setLoading(type: "accountDataLoading" | "dataLoading", value: boolean): void {
            this[type] = value;
        }
    }
});