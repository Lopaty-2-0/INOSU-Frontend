<script setup lang="ts">
import {ref, watch} from "vue";

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
const taskFile = ref<File | null>(null);
const fileInput = ref<null | HTMLInputElement>(null);
const taskTitle = ref<string>(props.oldTaskFile || "");

const selectFile = (): void => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const uploadFile = async (event: Event): Promise<void> => {
  errors.value = { file: "" };

  const target: HTMLInputElement = event.target as HTMLInputElement;
  const file: File | undefined = target.files?.[0];

  if (!file) return;

  if (file.size > 31457280) {
    errors.value.file = "Soubor je příliš velký, nahrajte prosím jiný (Max: 30MB).";
    return;
  }

  taskFile.value = file;
  taskTitle.value = file.name;

  emits("update", file);
};

watch(() => props.oldTaskFile, (newVal) => {
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
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="items taskFile">
      <div class="section">
        <div class="content file">
          <div
              class="content upload-file"
              @click="selectFile"
              :class="{ error: errors.file }"
          >
            <p v-if="errors.file">
              <Icon
                  class="icon"
                  name="material-symbols:error-rounded"
              />
              {{ errors.file }}
            </p>
            <p v-else>
              <Icon
                  class="icon"
                  name="material-symbols:cloud-upload"
              />
              {{ (taskFile || taskTitle) ? "Soubor: " + taskTitle : "Klikni pro nahrání souboru z počítače" }}
            </p>
            <input
                type="file"
                size="2097152"
                placeholder="Nahrát soubor"
                ref="fileInput"
                @change="uploadFile($event)"
                accept=".pdf,.docx,.odt,.html,.zip"
            />
          </div>
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

        &.file {
          display: flex;
          flex-direction: row;
          gap: 30px;

          .upload-file {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            width: 100%;
            border: 2px dashed rgba(var(--border-color), 0.5);
            background: var(--input-background);
            border-radius: var(--normal-border-radius);
            padding: 20px;
            font-size: 16px;
            transition: 0.2s;
            color: var(--input-color);
            cursor: pointer;

            p {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              font-size: 16px;
              gap: 20px;
              position: relative;

              .icon {
                font-size: 60px;
                border: none;
              }
            }

            input {
              height: 100%;
              display: none;
            }

            &:hover {
              background: var(--btn-2-hover-background);
            }

            &.error {
              border-color: rgba(var(--error-color), 1);
              color: rgba(var(--error-color), 1);
            }
          }
        }

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