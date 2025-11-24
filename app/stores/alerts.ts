import { defineStore } from "pinia";

interface Alert {
    index?: number;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    timeoutId?: number;
    remainingTime?: number;
    createdAt?: number;
    pausedAt?: number;
}

export const useAlertsStore = defineStore("alerts", {
    state: () => ({
        alerts: [] as Alert[],
        defaultAlertTimeout: 5000,
    }),
    getters: {
        getAlerts(): Alert[] {
            return this.alerts;
        },
        getDefaultAlertTimeout(): number {
            return this.defaultAlertTimeout;
        },
    },
    actions: {
        addAlert(alert: Alert): void {
            let maxIndex: number = 0;

            this.alerts.forEach((a: Alert) => {
                if (a.index && a.index > maxIndex) maxIndex = a.index;
            });

            const createdAt: number = Date.now();
            const newAlert: Alert = {
                index: maxIndex + 1,
                ...alert,
                createdAt,
                remainingTime: this.defaultAlertTimeout,
            };

            newAlert.timeoutId = window.setTimeout(() => {
                this.removeAlert(newAlert.index!);
            }, this.defaultAlertTimeout);

            this.alerts = [...this.alerts, newAlert];
        },
        pauseAlertTimeout(alertIndex: number): void {
            const alert: Alert | undefined = this.alerts.find((a: Alert) => a.index === alertIndex);
            if (!alert || !alert.timeoutId) return;

            window.clearTimeout(alert.timeoutId);
            alert.timeoutId = undefined;

            const now: number = Date.now();
            const elapsed: number = now - (alert.createdAt ?? now);

            alert.remainingTime = Math.max(0, this.defaultAlertTimeout - elapsed);
            alert.pausedAt = now;
        },
        resumeAlertTimeout(alertIndex: number): void {
            const alert: Alert |undefined = this.alerts.find((a: Alert) => a.index === alertIndex);
            if (!alert || alert.timeoutId || alert.remainingTime == null) return;

            alert.createdAt = Date.now() - (this.defaultAlertTimeout - alert.remainingTime);

            alert.timeoutId = window.setTimeout(() => {
                this.removeAlert(alertIndex);
            }, alert.remainingTime);
        },
        removeAlert(alertIndex: number): void {
            const alert: Alert | undefined = this.alerts.find((a: Alert) => a.index === alertIndex);

            if (alert) {
                if (alert.timeoutId) window.clearTimeout(alert.timeoutId);

                this.alerts = this.alerts.filter((a: Alert) => a.index !== alertIndex);
            }
        },
    },
});
