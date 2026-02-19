import { defineStore } from "pinia";
import type { Ref } from "vue";

export interface Alert {
    index?: number;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    timeout?: number;
    timeoutId?: number;
    remainingTime?: number;
    createdAt?: number;
    pausedAt?: number;
    canClose?: boolean;
    infinite?: boolean;
    progress?: number | Ref<number>;
}

export const useAlertsStore = defineStore("alerts", {
    state: () => ({
        alerts: [] as Alert[],
        defaultAlertTimeout: 5000,
        now: Date.now(),
    }),

    getters: {
        getAlerts(): Alert[] {
            return this.alerts;
        },
        getDefaultAlertTimeout(): number {
            return this.defaultAlertTimeout;
        },
        getAlertProgress: (state) => {
            return (alertIndex: number): number => {
                const alert = state.alerts.find(a => a.index === alertIndex);
                if (!alert) return 0;

                if (typeof alert.progress === "number") {
                    return Math.min(100, Math.max(0, alert.progress));
                }

                if (alert.infinite) return 0;

                const timeout = alert.timeout ?? state.defaultAlertTimeout;
                if (!timeout) return 0;

                if (alert.timeoutId && alert.createdAt) {
                    const elapsed = Math.max(0, state.now - alert.createdAt);
                    const remaining = Math.max(0, timeout - elapsed);
                    return (remaining / timeout) * 100;
                }

                if (typeof alert.remainingTime === "number") {
                    return Math.max(0, (alert.remainingTime / timeout) * 100);
                }

                return 0;
            };
        },
    },

    actions: {
        updateNow(): void {
            this.now = Date.now();
        },

        addAlert(alert: Alert): number {
            let maxIndex = 0;
            this.alerts.forEach(a => {
                if (a.index && a.index > maxIndex) maxIndex = a.index;
            });

            const timeout = alert.timeout ?? this.defaultAlertTimeout;
            const createdAt = Date.now();

            const newAlert = {
                index: maxIndex + 1,
                canClose: alert.canClose ?? true,
                infinite: alert.infinite ?? false,
                ...alert,
                createdAt,
                remainingTime: timeout,
            };

            if (!newAlert.infinite) {
                newAlert.timeoutId = window.setTimeout(() => {
                    this.removeAlert(newAlert.index!);
                }, timeout);
            }

            // @ts-ignore
            this.alerts = [...this.alerts, newAlert];

            return newAlert.index!;
        },

        pauseAlertTimeout(alertIndex: number): void {
            const alert = this.alerts.find(a => a.index === alertIndex);
            if (!alert || !alert.timeoutId || alert.infinite) return;

            window.clearTimeout(alert.timeoutId);
            alert.timeoutId = undefined;

            const now: number = Date.now();
            const elapsed: number = now - (alert.createdAt ?? now);
            const timeout: number = alert.timeout ?? this.defaultAlertTimeout;

            alert.remainingTime = Math.max(0, timeout - elapsed);
            alert.pausedAt = now;
        },

        resumeAlertTimeout(alertIndex: number): void {
            const alert = this.alerts.find(a => a.index === alertIndex);
            if (!alert || alert.timeoutId || alert.remainingTime == null || alert.infinite) return;

            const timeout: number = alert.timeout ?? this.defaultAlertTimeout;
            alert.createdAt = Date.now() - (timeout - alert.remainingTime);

            alert.timeoutId = window.setTimeout(() => {
                this.removeAlert(alertIndex);
            }, alert.remainingTime);
        },

        removeAlert(alertIndex: number): void {
            const alert = this.alerts.find(a => a.index === alertIndex);
            if (!alert) return;

            if (alert.timeoutId) {
                window.clearTimeout(alert.timeoutId);
            }

            this.alerts = this.alerts.filter(a => a.index !== alertIndex);
        },
    },
});