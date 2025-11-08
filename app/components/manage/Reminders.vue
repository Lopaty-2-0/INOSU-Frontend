<script setup lang="ts">
import {ref, watch} from "vue";
import Checkbox from "~/components/ui/Checkbox.vue";

const props = defineProps({
  oldRemindersValue: {
    type: [Boolean, null] as PropType<boolean | null>,
    required: false,
  }
});

const emits = defineEmits(["update"]);
const reminder = ref<boolean>(props.oldRemindersValue ? props.oldRemindersValue : false);

const reset = (): void => {
  reminder.value = props.oldRemindersValue ? props.oldRemindersValue : true;
};

watch(reminder, (value: boolean): void => {
  emits("update", value);
});

defineExpose({ reset });
</script>

<template>
  <div class="section">
    <slot />

    <div class="items reminder">
      <div class="section">
        <div class="content">
          <Checkbox type="checkbox" id="reminder" name="reminder" :value="props.oldRemindersValue" v-model="reminder" />
          <label for="reminder">Dostávat připomínky</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;

  .update {
    color: rgba(var(--error-color), 1);
  }

  .line {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;

    input {
      flex: 1;
    }
  }

  .items {
    display: flex;
    gap: 30px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;

    .section {
      display: flex;
      flex-direction: row;
      gap: 20px;
      flex: 1;
      align-items: flex-end;

      .content {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;

        label {
          color: var(--mini-title-color);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
