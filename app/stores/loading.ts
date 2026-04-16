import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
    state: () => ({
        accountDataLoading: false,
        dataLoading: false,
        rateLimit: false,
    }),
    getters: {
        isAccountDataLoading(): boolean {
            return this.accountDataLoading;
        },
        isDataLoading(): boolean {
            return this.dataLoading;
        },
        hasRateLimit(): boolean {
            return this.rateLimit;
        }
    },
    actions: {
        setLoading(type: "accountDataLoading" | "dataLoading", value: boolean): void {
            this[type] = value;
        },
        setHasRateLimit(value: boolean): void {
            if (value === this.rateLimit) return;

            this.rateLimit = value;
        }
    }
});