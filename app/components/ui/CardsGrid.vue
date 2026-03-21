<script setup lang="ts" generic="T extends { id: string | number }">
import {watch, shallowRef} from "vue";
import Card from "~/components/ui/Card.vue";
import Loading from "~/components/ui/Loading.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

const props = defineProps({
  items: {
    type: Array as () => T[],
    default: () => [],
  },
  action: {
    type: String as () => "select" | "edit" | "remove",
    default: "list",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selectedItems: {
    type: Array as () => T[],
    default: () => [],
  },
  enableSelection: {
    type: Boolean,
    default: false,
  }
});
const emits = defineEmits(["get:selectedItems", "onItemClick"]);

const localSelectedItems: Ref<T[]> = shallowRef<T[]>([ ...(props.selectedItems ?? []) ]);

const onItemClick = (item: T): void => {
  emits("onItemClick", item);

  if (!props.enableSelection) return;

  const exists = localSelectedItems.value.some((u: T) => u.id === item.id);

  localSelectedItems.value = exists
      ? localSelectedItems.value.filter((u: T) => u.id !== item.id)
      : [...localSelectedItems.value, item];

  emits("get:selectedItems", localSelectedItems.value);
};

const isSelected = (item: T): boolean => {
  return localSelectedItems.value.some((u) => (u as T).id === item.id);
};

const reset = (): void => {
  localSelectedItems.value = [];
  emits("get:selectedItems", localSelectedItems.value);
};

const updateSelectedItems = (items: T[]): void => {
  localSelectedItems.value = items;
};

watch(() => props.selectedItems, (value: T[]): void => {
  localSelectedItems.value = value ? [...value] : [];
});

defineExpose({ reset, updateSelectedItems });
</script>

<template>
  <div class="items-grid">
    <div class="loading" v-if="props.loading">
      <Loading color="rgba(var(--description-color), 1)" />
    </div>

    <div class="all-items" v-else-if="items.length > 0">
      <Card
        v-for="item in props.items"
        :key="item.id"
        class="card"
        :class="{
          [props.action]: true,
          selected: isSelected(item),
        }"
        @click="onItemClick(item)"
      >
        <slot name="content" :data="item" />
      </Card>

      <slot name="additional" />
    </div>

    <p class="error message" v-else>{{ t('common.noRecords') }}</p>
  </div>
</template>

<style scoped lang="scss">
.items-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .all-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 30px;

    .card {
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        background: var(--card-1-hover-background);
      }

      &.selected {
        border: var(--border-width) solid rgba(var(--main-color), 0.5);
        background: rgba(var(--main-color), 0.1);
      }

      &.remove {
        &:hover,
        &.selected {
          background: rgba(var(--error-color), 0.1);
          border: var(--border-width) solid rgba(var(--error-color), 0.5);
        }
      }
    }
  }

  .message {
    font-size: 16px;

    &.error {
      color: rgba(var(--error-color), 1);
    }

    &.success {
      color: rgba(var(--success-color), 1);
    }
  }
}

@media (max-width: 489px) {
  .items-grid .all-items {
    display: flex;
    flex-direction: column;

    .card {
      width: 100%;
    }
  }
}
</style>
