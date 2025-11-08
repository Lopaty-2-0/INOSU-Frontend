<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: undefined
  },
  value: {
    type: [Boolean, null] as PropType<boolean | null>,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
});
const emits = defineEmits(["update:modelValue", "change"]);

const isChecked = computed<boolean>((): boolean => {
  return typeof props.modelValue === "boolean" ? props.modelValue : (props.value ?? false);
});

const onChange =(event: Event): void => {
  const checked: boolean = (event.target as HTMLInputElement).checked;

  emits("update:modelValue", checked);
  emits("change", checked);
};
</script>

<template>
  <input
    class="checkbox"
    type="checkbox"
    :checked="isChecked"
    :disabled="disabled"
    :aria-checked="isChecked"
    @change="onChange"
  />
</template>

<style scoped lang="scss">
.checkbox {
  accent-color: rgba(var(--main-color), 1);
  height: 20px;
  width: 20px;
  border-radius: var(--mini-border-radius);
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  border: var(--border-width) solid rgba(var(--border-color), 0.5);
  background: var(--input-checkbox-background);
  display: inline-block;
  position: relative;
  transition: 0.2s;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 50%;
    border-radius: var(--mini-border-radius);
    background: var(--input-checkbox-checkmark-color);
    opacity: 0;
    transition: 0.2s;
  }

  &:checked {
    background-color: var(--input-checkbox-checked-background);
    border-color: var(--input-checkbox-checked-background);

    &::after {
      opacity: 1;
    }
  }
}
</style>