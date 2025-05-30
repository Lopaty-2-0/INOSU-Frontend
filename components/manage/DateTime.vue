<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  oldDate: {
    type: [Date, null] as PropType<Date | null>,
    required: true,
  },
  reset: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update"]);
const date = ref<{ input: Date | null, updated: boolean }>({ input: props.oldDate, updated: false });

watch(() => props.reset, (reset: boolean) => {
  if (reset) {
    date.value.updated = false;
    date.value.input = props.oldDate;
  }
});

watch(() => date.value.input, () => {
  date.value.updated = !!(date.value.input && date.value.input.getTime() !== props.oldDate?.getTime());

  emits("update", date.value.updated ? date.value.input : undefined);
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="items dateTime">
      <div class="section">
        <div class="content">
          <label for="dateTime">{{ props.label ? props.label : "Datum a čas" }} <span class="update" v-show="date.updated">(aktualizováno)</span></label>
          <VDatePicker expanded transparent bordeless v-model="date.input" mode="dateTime" hide-time-header is24hr />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../assets/style/calendar";

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
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        label {
          color: var(--mini-title-color);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        input {
          border-radius: var(--normal-border-radius);
          font-size: 16px;
          outline: none;
          padding: 15px;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          min-width: 150px;
          background: var(--input-background);
          color: var(--input-color);

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }
        }
      }
    }
  }
}
</style>