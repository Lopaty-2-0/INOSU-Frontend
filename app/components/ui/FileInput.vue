<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "#imports";

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object as () => File | null,
    default: null
  },
  maxSizeMB: {
    type: Number,
    default: 2
  },
  title: {
    type: String as () => string | null,
    default: null
  },
  accept: {
    type: String,
    default: "*"
  },
  placeholder: {
    type: String as () => string | null,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const errorText = ref<string | null>(null);
const resolvedPlaceholder = computed<string>(() => props.placeholder ?? t('fileInput.placeholder'));
const fileInput = ref<HTMLInputElement | null>(null);
const maxSizeBytes = computed<number>(() => props.maxSizeMB * 1024 * 1024);
const acceptedTypes = computed<string[]>(() => {
  if (props.accept === "*") return ["*"];
  return props.accept.split(",").map(type => type.trim());
});

const emits = defineEmits(["update:modelValue", "resetError"]);

const selectFile = (): void => {
  if (fileInput.value && !props.disabled) {
    fileInput.value.click();
  }
};

const uploadFile = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const selectedFile: File | undefined = target.files?.[0];

  if (!selectedFile) return;

  const fileName: string = selectedFile.name.toLowerCase();
  const allowedExtensions: string[] = acceptedTypes.value.map((type: string) => type.startsWith('.') ? type : '.' + type);
  const hasValidExtension: boolean = allowedExtensions.some((ext: string) => fileName.endsWith(ext));

  if (!acceptedTypes.value.includes("*") && !hasValidExtension) {
    errorText.value = t('fileInput.errors.unsupportedFormat', { accept: props.accept });
    emits("update:modelValue", null);
    return;
  }

  if (selectedFile.size > maxSizeBytes.value) {
    errorText.value = t('fileInput.errors.tooLarge', { maxSize: props.maxSizeMB });
    emits("update:modelValue", null);
    return;
  }

  resetError();
  emits("update:modelValue", selectedFile);
};

const resetError = (): void => {
  errorText.value = null;
};

defineExpose({ resetError });
</script>

<template>
  <div class="upload-file" @click="selectFile" :class="{ error: errorText, disabled: props.disabled }">
    <p v-if="errorText">
      <Icon class="icon" name="material-symbols:error-rounded"/>
      {{ errorText }}
    </p>
    <p v-else>
      <Icon class="icon" name="material-symbols:cloud-upload"/>
      {{ props.title ? t('fileInput.selectedFile', { title: props.title }) : resolvedPlaceholder }}
    </p>
    <input
      type="file"
      :size="maxSizeBytes"
      :placeholder="resolvedPlaceholder"
      ref="fileInput"
      :accept="props.accept"
      @change="uploadFile($event)"
      :disabled="props.disabled"
    />
  </div>
</template>

<style scoped lang="scss">
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
    background: var(--input-background-hover);
  }

  &.error {
    border-color: rgba(var(--error-color), 1);
    color: rgba(var(--error-color), 1);
  }

  &.disabled {
    opacity: var(--disabled-opacity);
    cursor: not-allowed;

    &:hover {
      background: var(--input-background);
    }
  }
}
</style>