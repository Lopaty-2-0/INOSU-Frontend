<script setup lang="ts">
import { useAlertsStore } from "~/stores/alerts";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref } from "vue";

const alertsStore = useAlertsStore();
const { getAlerts: alerts, getDefaultAlertTimeout: defaultTimeout } = storeToRefs(alertsStore);
const now = ref<number>(Date.now());
let tickerId: number = 0;

const removeAlert = (index?: number): void => {
  if (index) alertsStore.removeAlert(index);
};

const pauseAlertTimeout = (index?: number): void => {
  if (index) alertsStore.pauseAlertTimeout(index);
};

const resumeAlertTimeout = (index?: number): void => {
  if (index) alertsStore.resumeAlertTimeout(index);
};

const getProgress = (alert: any): number => {
  if (!defaultTimeout.value) return 0;

  if (alert.timeoutId && alert.createdAt) {
    const elapsed: number = Math.max(0, now.value - alert.createdAt);
    const remaining: number = Math.max(0, defaultTimeout.value - elapsed);
    return (remaining / defaultTimeout.value) * 100;
  }

  if (typeof alert.remainingTime === "number") {
    return Math.max(0, (alert.remainingTime / defaultTimeout.value) * 100);
  }

  return 0;
};

onMounted((): void => {
  tickerId = window.setInterval(() => {
    now.value = Date.now();
  }, 100);
});

onUnmounted((): void => {
  if (tickerId) window.clearInterval(tickerId);
});
</script>

<template>
  <div id="alerts">
    <div
      v-for="(alert, index) in alerts"
      :key="alert.index ?? index"
      class="alert"
      :class="alert.type"
      @mouseenter="pauseAlertTimeout(alert.index)"
      @mouseleave="resumeAlertTimeout(alert.index)"
    >
      <div class="content">
        <span>{{ alert.title }}</span>
        <p>{{ alert.message }}</p>
      </div>

      <div class="progress-bar" :style="{ '--progress': (getProgress(alert) / 100) }"></div>

      <Icon
        class="icon"
        size="24px"
        name="material-symbols:close-rounded"
        @click="removeAlert(alert.index)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
#alerts {
  position: fixed;
  top: 80px;
  right: 0;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: flex-start;
  align-items: flex-end;
  z-index: 10;
  max-height: 300px;
  width: fit-content;
  padding-right: 10px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }

  .alert {
    position: relative;
    border-radius: var(--normal-border-radius);
    outline: none;
    padding: 20px;
    min-width: 400px;
    max-width: 600px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    .progress-bar {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 4px;
      width: 100%;
      transform-origin: left center;
      transform: scaleX(var(--progress, 0));
      transition: transform 0.15s linear;
      pointer-events: none;
      border-radius: var(--normal-border-radius);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: flex-start;

      span {
        font-size: 16px;
        font-weight: bold;
      }

      p {
        font-size: 16px;
        color: var(--alert-description-color);
        margin: 0;
      }
    }

    .icon {
      cursor: pointer;
      color: var(--alert-description-color);
      transition: 0.2s;

      &:hover {
        opacity: 0.7;
      }
    }

    &.success {
      background: var(--alert-success-background);

      .progress-bar {
        background: var(--alert-success-color);
      }

      .content span {
        color: var(--alert-success-color);
      }
    }
    &.error {
      background: var(--alert-error-background);

      .progress-bar {
        background: var(--alert-error-color);
      }

      .content span {
        color: var(--alert-error-color);
      }
    }
    &.warning {
      background: var(--alert-warning-background);

      .progress-bar {
        background: var(--alert-warning-color);
      }

      .content span {
        color: var(--alert-warning-color);
      }
    }
    &.info {
      background: var(--alert-info-background);

      .progress-bar {
        background: var(--alert-info-color);
      }

      .content span {
        color: var(--alert-info-color);
      }
    }
  }
}
</style>
