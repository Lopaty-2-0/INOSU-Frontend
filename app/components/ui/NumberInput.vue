<script setup lang="ts">
import {computed, ref, watch, type PropType} from "vue";

const props = defineProps({
  modelValue: {
    type: [Number, null] as PropType<number | null>,
    required: true,
  },
  step: {
    type: Number,
    required: false,
  },
  enableNull: {
    type: Boolean,
    required: false,
    default: false,
  },
  min: {
    type: Number,
    required: false,
  },
  max: {
    type: Number,
    required: false,
  },
  unit: {
    type: String,
    required: false,
    default: "",
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  id: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  }
});

const emits = defineEmits(["update:modelValue"]);

const currentValue = ref<number | null>(props.modelValue);
const step = computed<number>(() => props.step || 1);

const handleInput = (event: Event): void => {
  if (props.disabled) {
    currentValue.value = props.modelValue;
    return;
  }

  const target = event.target as HTMLInputElement;

  if (target.value === "") {
    if (props.enableNull) {
      currentValue.value = null;
      emits("update:modelValue", currentValue.value);
    } else {
      currentValue.value = 0;
      emits("update:modelValue", currentValue.value);
    }
    return;
  }

  let newValue: number = parseFloat(target.value);

  if (isNaN(newValue)) {
    currentValue.value = props.modelValue;
    return;
  }

  if (typeof props.min === "number" && newValue < props.min) {
    currentValue.value = props.min;
    emits("update:modelValue", currentValue.value);
    return;
  }

  if (typeof props.max === "number" && newValue > props.max) {
    currentValue.value = props.max;
    emits("update:modelValue", currentValue.value);
    return;
  }

  currentValue.value = newValue;
  emits("update:modelValue", currentValue.value);
};

const increaseValue = (): void => {
  if (props.disabled) return;

  if (currentValue.value === null) {
    currentValue.value = 0;
    emits("update:modelValue", currentValue.value);
    return;
  }

  if (props.enableNull && currentValue.value === -1) {
    currentValue.value = null;
    emits("update:modelValue", currentValue.value);
    return;
  }

  if (typeof props.max === "number") {
    if (currentValue.value + step.value <= props.max) {
      currentValue.value = currentValue.value + step.value;
      emits("update:modelValue", currentValue.value);
    }
  } else {
    currentValue.value = currentValue.value + step.value;
    emits("update:modelValue", currentValue.value);
  }
};

const decreaseValue = (): void => {
  if (props.disabled) return;

  if (currentValue.value === null) {
    if (typeof props.min === "number" && -step.value < props.min) {
      return;
    }
    currentValue.value = -step.value;
    emits("update:modelValue", currentValue.value);
    return;
  }

  if (props.enableNull && currentValue.value === 0) {
    currentValue.value = null;
    emits("update:modelValue", currentValue.value);
    return;
  }

  if (typeof props.min === "number") {
    if (currentValue.value - step.value >= props.min) {
      currentValue.value = currentValue.value - step.value;
      emits("update:modelValue", currentValue.value);
    }
  } else {
    currentValue.value = currentValue.value - step.value;
    emits("update:modelValue", currentValue.value);
  }
};

watch(() => props.modelValue, (newValue: number | null): void => {
  if (newValue === null) {
    currentValue.value = null;
    return;
  }

  if (typeof props.min === "number" && newValue < props.min) {
    currentValue.value = props.min;
    emits("update:modelValue", currentValue.value);
    return;
  }

  if (typeof props.max === "number" && newValue > props.max) {
    currentValue.value = props.max;
    emits("update:modelValue", currentValue.value);
    return;
  }

  currentValue.value = newValue;
}, { immediate: true });
</script>

<template>
  <div class="number-input" :class="{ disabled: props.disabled }">
    <button @click="decreaseValue">
      <Icon class="icon" name="uil:minus" />
    </button>

    <div class="value">
      <input
        :id="props.id"
        type="number"
        v-model.number="currentValue"
        @change="handleInput"
        pattern="[0-9]*"
        inputmode="decimal"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
      />
      {{ props.unit }}
    </div>

    <button @click="increaseValue">
      <Icon class="icon" name="uil:plus" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.number-input {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;

  .value {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100%;

    input {
      padding: 15px;
      transition: 0.2s;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border-radius: var(--normal-border-radius);
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      font-size: 16px;
      outline: none;
      background: var(--input-background);
      color: var(--input-color);
      width: 100%;
      flex: 1;
      text-align: center;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &[type="number"] {
        -moz-appearance: textfield;
        -webkit-appearance: none;
      }

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
  }

  button {
    aspect-ratio: 1/1;
    padding: 15px;
    border: var(--border-width) solid rgba(var(--border-color), 0.5);
    color: var(--btn-2-color);
    background: var(--btn-2-background);
    border-radius: var(--normal-border-radius);
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      font-size: 16px;
    }

    &:hover {
      background: var(--btn-2-hover-background);
    }
  }

  &.disabled {
    button {
      opacity: var(--disabled-opacity);
      cursor: not-allowed;

      &:hover {
        background: var(--btn-2-background);
      }
    }
  }
}
</style>
