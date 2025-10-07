<script setup lang="ts">
import { ref } from "vue";
import Input from "~/components/ui/Input.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "material-symbols:search-rounded",
  },
});
const emits = defineEmits(["update:modelValue"]);

const searchInput = ref<string>(props.modelValue);

watch(() => searchInput.value, (newValue: string) => {
  emits("update:modelValue", newValue || "");
});
</script>

<template>
  <div class="search" :class="{ disabled: props.disabled }">
    <Input type="text" name="searchInput" :placeholder="props.placeholder" v-model="searchInput" :disabled="props.disabled" />

    <Icon class="icon" :name="props.icon"></Icon>
  </div>
</template>

<style scoped lang="scss">
.search {
  min-width: 150px;
  display: flex;
  align-items: center;

  input {
    padding: 15px 40px 15px 15px;
  }

  .icon {
    margin-left: -30px;
    cursor: pointer;
    color: rgba(var(--description-color), 1);
    transition: 0.2s;
    font-size: 16px;

    &:hover {
      color: var(--mini-title-color);
    }
  }

  &.disabled .icon {
    opacity: 0.7;
    pointer-events: none;
  }
}
</style>