<script setup lang="ts">
import {ref, watch} from "vue";
import FileInput from "~/components/ui/FileInput.vue";

const props = defineProps({
  oldTaskFile: {
    type: String,
    required: false,
  },
  reset: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update"]);
const errors = ref<{ file: string }>({ file: "" });
const fileInput = ref<InstanceType<typeof FileInput> | null>(null);
const taskFile = ref<File | null>(null);
const taskTitle = ref<string>(props.oldTaskFile || "");

watch(() => taskFile.value, (newVal: File | null) => {
  emits("update", newVal);

  if (newVal) {
    taskTitle.value = newVal.name;
  } else {
    taskTitle.value = props.oldTaskFile || "";
  }
});

watch(() => props.oldTaskFile, (newVal: string | undefined) => {
  if (fileInput.value) fileInput.value.resetError();

  if (newVal) {
    taskTitle.value = newVal;
  } else {
    taskTitle.value = "";
  }
});

watch(() => props.reset, (reset: boolean): void => {
  if (reset) {
    errors.value.file = "";
    taskFile.value = null;
    taskTitle.value = props.oldTaskFile || "";

    if (fileInput.value) fileInput.value.resetError();
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="items taskFile">
      <div class="section">
        <FileInput
          ref="fileInput"
          class="content"
          v-model="taskFile"
          :title="taskTitle || null"
          :placeholder="'Klikni pro nahrání souboru z počítače'"
          :max-size-m-b="2"
          accept=".pdf,.docx,.odt,.html,.zip"
        />
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
    flex-direction: column;
    gap: 30px;
    width: 100%;

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

        .input-error {
          font-size: 16px;
          color: rgba(var(--error-color), 1);
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

          &.error {
            border-color: rgba(var(--error-color), 1);
          }
        }
      }
    }
  }
}
</style>