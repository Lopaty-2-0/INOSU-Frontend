<script setup lang="ts">
import useArrayChunks from "../../componsables/useArrayChunks";
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  numberOfPages: {
    type: Number,
    required: true,
    default: 0,
  },
  chunkSize: {
    type: Number,
    default: 3,
  },
});

const emits = defineEmits(["update:modelValue"]);

const activePagesIndex = ref<number>(0);
const pagesArray = ref<number[]>([]);
const navigationPages = ref<number[][]>([]);

const modelIndex = () => Math.max(0, (props.modelValue ?? 1) - 1);
const toModelValue = (index: number) => index + 1;

const setActivePage = (index: number): void => {
  const value: number = toModelValue(index);

  if (value === props.modelValue) return;

  emits("update:modelValue", value);
};

const previousPage = (): void => {
  if (!navigationPages.value.length) return;

  const firstIndex = navigationPages.value[activePagesIndex.value]?.[0];

  if (firstIndex !== undefined && modelIndex() > firstIndex && modelIndex() > 0) {
    emits("update:modelValue", props.modelValue - 1);
  } else if (activePagesIndex.value > 0) {
    navigationPagesPrevious();
  }
};

const nextPage = (): void => {
  if (!navigationPages.value.length) return;

  const currentChunk = navigationPages.value[activePagesIndex.value];
  const lastIndex = currentChunk?.[currentChunk.length - 1];

  if (lastIndex !== undefined && modelIndex() < lastIndex) {
    emits("update:modelValue", props.modelValue + 1);
  } else if (activePagesIndex.value < navigationPages.value.length - 1) {
    navigationPagesNext();
  }
};

const navigationPagesNext = (): void => {
  if (activePagesIndex.value < navigationPages.value.length - 1) {
    activePagesIndex.value++;
    const first = navigationPages.value[activePagesIndex.value]?.[0] ?? 0;
    emits("update:modelValue", toModelValue(first));
  }
};

const navigationPagesPrevious = (): void => {
  if (activePagesIndex.value > 0) {
    activePagesIndex.value--;

    const pages = navigationPages.value[activePagesIndex.value];
    const last = pages?.[pages.length - 1] ?? 0;

    emits("update:modelValue", toModelValue(last));
  }
};

watch([() => props.numberOfPages, () => props.chunkSize], ([newCount, newChunk]): void => {
  if (newCount > 0) {
    pagesArray.value = Array.from({ length: Math.ceil(newCount) }, (_, index) => index);
    navigationPages.value = useArrayChunks(pagesArray.value, newChunk);

    activePagesIndex.value = 0;
    if (props.modelValue === undefined || props.modelValue === null) {
      emits("update:modelValue", 1);
    }
  } else {
    pagesArray.value = [];
    navigationPages.value = [];
    activePagesIndex.value = 0;
    if (props.modelValue === undefined || props.modelValue === null) {
      emits("update:modelValue", 1);
    }
  }
}, { immediate: true });

watch(() => props.modelValue, (newValue: number) => {
  const index: number = (newValue ?? 1) - 1;

  const chunkIndex: number = navigationPages.value.findIndex(chunk => chunk.includes(index));

  if (chunkIndex !== -1) {
    activePagesIndex.value = chunkIndex;
  }
}, { immediate: true });
</script>

<template>
  <div class="navigation" v-if="props.numberOfPages > 1">
    <button class="back" @click="previousPage">
      <Icon class="icon" name="material-symbols:arrow-left-alt-rounded" />
      Zpět
    </button>

    <ul class="pages">
      <li v-if="activePagesIndex > 0" class="page" @click="navigationPagesPrevious">...</li>

      <li
          v-for="pageNumber in navigationPages[activePagesIndex]"
          :key="pageNumber"
          :class="{ page: true, active: (pageNumber + 1) === props.modelValue }"
          @click="setActivePage(pageNumber)"
      >
        {{ pageNumber + 1 }}
      </li>

      <li v-if="activePagesIndex < navigationPages.length - 1" class="page" @click="navigationPagesNext">
        ...
      </li>
    </ul>

    <button class="next" @click="nextPage">
      Další
      <Icon class="icon" name="material-symbols:arrow-right-alt-rounded" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  gap: 20px;
  width: 100%;

  button {
    display: flex;
    align-items: center;
    transition: 0.2s;
    gap: 10px;
    font-weight: 500;
    color: rgba(var(--description-color), 1);
    cursor: pointer;
    background: none;
    border: none;

    .icon {
      font-size: 16px;
    }

    &:hover {
      color: var(--mini-title-color);
    }
  }

  .pages {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: rgba(var(--description-color), 1);
    font-weight: 500;
    flex-wrap: wrap;

    .page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 40px;
      min-height: 40px;
      border-radius: var(--small-border-radius);
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        background: var(--btn-2-hover-background);
      }

      &.active {
        background: var(--btn-1-background);
        color: var(--btn-1-color);
      }
    }
  }
}

@media (max-width: 600px) {
  .navigation {
    flex-wrap: wrap;

    .pages {
      order: 1;
      width: 100%;
    }

    button {
      order: 2;
    }
  }
}
</style>
