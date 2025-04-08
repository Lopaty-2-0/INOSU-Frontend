import {acceptHMRUpdate, defineStore} from "pinia";

interface Alert {
    index?: number,
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string
}

export const useAlertsStore = defineStore("alerts", {
    state: () => ({
        alerts: [] as Alert[],
        defaultAlertTimeout: 3000
    }),
    getters: {
        getAlerts(): Alert[] {
            return this.alerts;
        }
    },
    actions: {
        addAlert(alert: Alert): void {
            // Find max alert index from alerts and add 1 for the new index
            let maxIndex: number = 0;
            this.alerts.map((alert) => {
                if (alert.index && alert.index > maxIndex) maxIndex = alert.index;
            });

            this.alerts = [...this.alerts, {index: maxIndex + 1, ...alert}];

            // Remove the alert after the default timeout
            setTimeout(() => {
                this.removeAlert(maxIndex + 1);
            }, this.defaultAlertTimeout);
        },
        removeAlert(alertIndex: number): void {
            // Find the index of the alert to remove (if there are multiple stores with the same index, they will be removed sequentially, because it always finds the 1st element with that index)
            const index: number = this.alerts.findIndex(alert => alert.index === alertIndex);

            // If the alert is found, remove it
            if (index !== -1) {
                const updatedAlerts: Alert[] = [...this.alerts];
                updatedAlerts.splice(index, 1);

                this.alerts = updatedAlerts;
            }
        }
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAlertsStore, import.meta.hot));
}
