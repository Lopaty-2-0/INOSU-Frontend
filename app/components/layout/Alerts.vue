<script setup lang="ts">
import { useAlertsStore } from "~/stores/alerts";
import { storeToRefs } from "pinia";
import type { Alert } from "~/stores/alerts";
import { ref, onMounted, onUnmounted, unref } from "vue";

const alertsStore = useAlertsStore();
const { getAlerts: alerts } = storeToRefs(alertsStore);

const now = ref<number>(Date.now());
let tickerId: number = 0;

onMounted(() => {
  tickerId = window.setInterval(() => {
    now.value = Date.now();
    alertsStore.updateNow?.();
  }, 100);
});

onUnmounted(() => {
  if (tickerId) window.clearInterval(tickerId);
});

const removeAlert = (index?: number) => {
  if (index) alertsStore.removeAlert(index);
};

const pauseAlertTimeout = (index?: number) => {
  if (index) alertsStore.pauseAlertTimeout(index);
};

const resumeAlertTimeout = (index?: number) => {
  if (index) alertsStore.resumeAlertTimeout(index);
};

const getProgress = (alert: Alert) => {
  const p = unref(alert.progress);

  if (p !== undefined) return Math.min(100, Math.max(0, p));

  return alertsStore.getAlertProgress(alert.index ?? -1);
};

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

      <div
        v-if="alert.progress !== undefined || !alert.infinite"
        class="progress-bar"
        :style="{ '--progress': getProgress(alert) / 100 }"
      ></div>

      <Icon
        v-if="alert.canClose !== false"
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
