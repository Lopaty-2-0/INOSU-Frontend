<script setup lang="ts">
import { useAlertsStore } from "../stores/alerts";
import { storeToRefs } from "pinia";

const alertsStore = useAlertsStore();
const { getAlerts: alerts } = storeToRefs(alertsStore);

const removeAlert = (index?: number): void => {
  if (index) alertsStore.removeAlert(index);
};
</script>

<template>
  <div id="alerts">
    <div
      v-for="(alert, index) in alerts"
      :key="index"
      class="alert"
      :class="alert.type"
    >
      <div class="content">
        <span>{{ alert.title }}</span>
        <p>{{ alert.message }}</p>
      </div>

      <Icon
        class="icon"
        size="24px"
        name="material-symbols:close-rounded"
        @click="removeAlert(alert.index)"
      ></Icon>
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

      .content span {
        color: var(--alert-success-color);
      }
    }
    &.error {
      background: var(--alert-error-background);

      .content span {
        color: var(--alert-error-color);
      }
    }
    &.warning {
      background: var(--alert-warning-background);

      .content span {
        color: var(--alert-warning-color);
      }
    }
    &.info {
      background: var(--alert-info-background);

      .content span {
        color: var(--alert-info-color);
      }
    }
  }
}
</style>
