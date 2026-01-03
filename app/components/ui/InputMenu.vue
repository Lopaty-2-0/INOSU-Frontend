<script setup lang="ts">
import {ref, computed, watch, useSlots} from "vue";
import Input from "~/components/ui/Input.vue";
import Loading from "~/components/ui/Loading.vue";

export type InputMenuItem = {
  value: string;
  label: string;
};

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    required: false,
    default: [],
  },
  items: {
    type: Array as () => (string | InputMenuItem)[],
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  createItem: {
    type: Boolean,
    default: false,
  },
  uppercase: {
    type: Boolean,
    default: false,
  },
  lowercase: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  deselect: {
    type: Boolean,
    default: false,
  },
  noDataText: {
    type: String,
    default: "Nic nebylo nalezeno.",
  },
  placeholder: {
    type: String,
    default: "Vyberte / Vytvořte položku",
  },
  title: {
    type: String,
    default: "",
  },
  disableItemFiltering: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
});

const icons = {
  select: "material-symbols:done-rounded",
  selected: "material-symbols:close-rounded",
  open: "material-symbols:arrow-downward-rounded",
  close: "material-symbols:arrow-upward-rounded",
};

const slots = useSlots();
const emits = defineEmits(["update:modelValue", "create", "search:change", "search:input"]);

const open = ref<boolean>(false);
const input = ref<string>("");
const selectedItems = ref<string[]>([...props.modelValue]);

const normalizedItems = computed<InputMenuItem[]>(() => {
  return props.items.map((i: string | InputMenuItem) =>
      typeof i === "string" ? { value: i, label: i } : i
  );
});
const placeholder = computed<string>(() => {
  if (props.multiple) {
    return selectedItems.value.length > 0 ? `Vybráno: ${selectedItems.value.length}` : props.title || props.placeholder;
  } else {
    const selected: InputMenuItem | undefined = normalizedItems.value.find((i) => i.value === selectedItems.value[0]);
    let text: string = selected ? selected.label : props.title || props.placeholder;

    if (props.uppercase) text = text.toUpperCase();
    if (props.lowercase) text = text.toLowerCase();

    return text;
  }
});
const filteredItems = computed<InputMenuItem[]>(() => {
  if (props.disableItemFiltering) return normalizedItems.value;

  if (!input.value) return normalizedItems.value;

  return normalizedItems.value.filter((item) =>
      item.label.toLowerCase().includes(input.value.toLowerCase())
  );
});
const canCreateItem = computed<boolean>(() => {
  return (
    props.items.length > 0 && typeof props.items[0] !== "object" &&
    props.createItem && !!input.value &&
    !normalizedItems.value.some((item) => item.label.toLowerCase() === input.value.toLowerCase()) && filteredItems.value.length === 0
  );
});

const toggleDropdown = (): void => {
  if (props.disabled) return;

  open.value = !open.value;

  if (open.value) input.value = "";
};

const selectItem = (item: InputMenuItem): void => {
  if (props.multiple) {
    selectedItems.value = selectedItems.value.includes(item.value) ? selectedItems.value.filter((n) => n !== item.value) : [...selectedItems.value, item.value];

    emits("update:modelValue", selectedItems.value);
  } else {
    if (props.deselect && selectedItems.value[0] === item.value) {
      selectedItems.value = [];
      emits("update:modelValue", []);
    } else {
      selectedItems.value = [item.value];
      emits("update:modelValue", [item.value]);
    }

    open.value = false;
  }
};

const createItem = (): void => {
  const newItem: InputMenuItem = { value: input.value, label: input.value };

  selectItem(newItem);
  emits("create", newItem);

  input.value = "";
  open.value = false;
};

const onInput = (): void => {
  emits("search:input", input)

  if (!open.value) open.value = true;

  if (props.multiple) {
    emits("update:modelValue", selectedItems.value);
  }
};

watch(() => props.modelValue, (newValue: string[]): void => {
  selectedItems.value = newValue;
});
</script>

<template>
  <div class="input-menu" :class="{ open, error: props.error, disabled: props.disabled, uppercase: props.uppercase, lowercase: props.lowercase }">
    <div class="title">
      <Input
        :placeholder="placeholder"
        @input="onInput"
        @change="emits('search:change', input)"
        v-model="input"
        :disabled="props.disabled"
      />
      <div class="icon-div" @click="toggleDropdown">
        <Icon class="icon" :name="open ? icons.close : icons.open" />
      </div>
    </div>

    <div class="content" v-show="open">
      <div
        v-if="!props.loading"
        v-for="(item, index) in filteredItems"
        :key="item.value || index"
        :class="{ selected: selectedItems.includes(item.value) }"
        class="section"
        @click="selectItem(item)"
      >
        <Icon class="icon" :name="selectedItems.includes(item.value) ? icons.select : icons.selected"/>
        <span>{{ item.label }}</span>
      </div>

      <div v-if="props.loading" class="section center no-hover">
        <Loading color="rgba(var(--description-color), 1)" size="6px" />
      </div>

      <div v-if="canCreateItem" class="section" @click="createItem">
        <span>Přidat "{{ input }}"</span>
      </div>

      <span class="section no-hover" v-if="slots['row-extra']">
        <slot name="row-extra"></slot>
      </span>

      <div v-if="filteredItems.length <= 0 && !canCreateItem" class="section no-hover">
        <span class="no-data-text">{{ props.noDataText }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.input-menu {
  position: relative;
  display: flex;
  width: 100%;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &.disabled {
    .title .icon-div {
      cursor: not-allowed;
      opacity: var(--disabled-opacity);
    }
  }

  &.error {
    .title input {
      border: var(--border-width) solid rgba(var(--error-color), 1);
    }
  }

  &.uppercase {
    text-transform: uppercase;
  }

  &.lowercase {
    text-transform: lowercase;
  }

  .no-data-text {
    text-transform: none;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: 0.2s;
    width: 100%;
    gap: 10px;

    .icon-div {
      padding: 15px;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      color: var(--btn-2-color);
      background: var(--btn-2-background);
      border-radius: var(--normal-border-radius);
      cursor: pointer;
      transition: 0.2s;
      line-height: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        font-size: 16px;
      }
    }
  }

  .content {
    position: absolute;
    display: flex;
    flex-direction: column;
    transition: 0.2s;
    margin-top: 10px;
    border-radius: var(--normal-border-radius);
    font-size: 16px;
    outline: none;
    border: var(--border-width) solid rgba(var(--border-color), 0.5);
    background: var(--input-background);
    color: var(--input-color);
    width: 100%;
    word-break: break-word;
    top: 100%;
    z-index: 5;
    left: 0;

    .section {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      transition: 0.2s;

      .icon {
        font-size: 16px;
        color: rgba(var(--description-color), 1);
      }

      &.selected {
        .icon, span {
          color: rgba(var(--main-color), 1);
        }
      }

      &.center {
        justify-content: center;
        align-items: center;
      }

      &:not(.no-hover):hover {
        cursor: pointer;
        background: var(--input-background-hover);
      }

      &:last-child {
        border-bottom-left-radius: var(--normal-border-radius);
        border-bottom-right-radius: var(--normal-border-radius);
      }

      &:first-child {
        border-top-left-radius: var(--normal-border-radius);
        border-top-right-radius: var(--normal-border-radius);
      }

      &:not(:last-child) {
        border-bottom: var(--border-width) solid rgba(var(--border-color), 1);
      }
    }
  }
}
</style>