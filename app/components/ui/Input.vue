<script setup lang="ts">
import { ref, watch, type PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: [Number, String, Object] as PropType<number | string | null | undefined>,
    default: null,
  },
  type: {
    type: String as PropType<"text" | "password" | "email" | "search" | "tel" | "url" | "number">,
    default: "text",
  }
});
const emits = defineEmits(["update:modelValue"]);

const input = ref<number | string>(props.modelValue ?? "");

watch(() => props.modelValue, (newVal) => {
  input.value = newVal ?? "";
});

watch(() => input.value, (newVal) => {
  emits("update:modelValue", newVal === "" ? null : newVal);
});
</script>

<template>
  <input
    v-model="input"
    :type="props.type"
  />
</template>

<style scoped lang="scss">
input {
  border-radius: var(--normal-border-radius);
  border: var(--border-width) solid rgba(var(--border-color), 0.5);
  padding: 15px;
  font-size: 16px;
  outline: none;
  background: var(--input-background);
  color: var(--input-color);
  width: 100%;

  &::placeholder {
    color: var(--input-placeholder-color);
  }

  &:focus {
    border-color: rgba(var(--main-color), 1);
  }

  &:disabled {
    opacity: var(--disabled-opacity);
    cursor: not-allowed;
  }
}
</style>