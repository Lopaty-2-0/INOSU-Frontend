<script setup lang="ts">
import useArrayChunks from "../../componsables/useArrayChunks";
import { ref, watch } from "vue";

const props = defineProps({
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

const emits = defineEmits(["get:activePage"]);

const activePage = ref<number>(0);
const activePagesIndex = ref<number>(0);
const pagesArray = ref<number[]>([]);
const navigationPages = ref<number[][]>([]);

const previousPage = (): void => {
  if (navigationPages.value.length <= 0) return;

  const firstActivePageIndex = navigationPages.value[activePagesIndex.value]?.[0];

  if (firstActivePageIndex !== undefined && activePage.value > firstActivePageIndex && activePage.value > 0) {
    activePage.value--;
    emits("get:activePage", activePage.value);
  } else if (activePagesIndex.value > 0) {
    navigationPagesPrevious();
  }
};

const nextPage = (): void => {
  if (navigationPages.value.length <= 0) return;

  const currentChunk = navigationPages.value[activePagesIndex.value];
  const lastPageIndex = currentChunk?.[currentChunk.length - 1];

  if (lastPageIndex !== undefined && activePage.value < lastPageIndex) {
    activePage.value++;
    emits("get:activePage", activePage.value);
  } else if (activePagesIndex.value < navigationPages.value.length - 1) {
    navigationPagesNext();
  }
};

const setActivePagesIndex = (index: number): void => {
  activePagesIndex.value = index;
};

const setActivePage = (index: number): void => {
  activePage.value = index ?? 0;
  emits("get:activePage", activePage.value);
};

const navigationPagesNext = (): void => {
  if (activePagesIndex.value < navigationPages.value.length - 1) {
    activePagesIndex.value++;
    activePage.value = navigationPages.value[activePagesIndex.value]?.[0] ?? 0;
    emits("get:activePage", activePage.value);
  }
};

const navigationPagesPrevious = (): void => {
  if (activePagesIndex.value > 0) {
    activePagesIndex.value--;

    const pages: number[] | undefined = navigationPages.value[activePagesIndex.value];

    activePage.value = pages?.[pages.length - 1] ?? 0;
    emits("get:activePage", activePage.value);
  }
};

watch([() => props.numberOfPages, () => props.chunkSize], ([newCount, newChunk]: [number, number]): void => {
  if (newCount > 0) {
    pagesArray.value = Array.from({ length: Math.ceil(newCount) }, (_, index) => index);
    navigationPages.value = useArrayChunks(pagesArray.value, newChunk);
    setActivePagesIndex(0);
    setActivePage(0);
  } else {
    pagesArray.value = [];
    navigationPages.value = [];
    activePage.value = 0;
    activePagesIndex.value = 0;
  }
}, { immediate: true });
</script>

<template>
  <div class="navigation">
    <button class="back" @click="previousPage">
      <Icon class="icon" name="material-symbols:arrow-left-alt-rounded" />
      Zpět
    </button>

    <ul class="pages">
      <li v-if="activePagesIndex > 0" class="page" @click="navigationPagesPrevious">...</li>

      <li
          v-for="pageNumber in navigationPages[activePagesIndex]"
          :key="pageNumber"
          :class="{ page: true, active: pageNumber === activePage }"
          @click="setActivePage(pageNumber)"
      >
        {{ pageNumber + 1 }}
      </li>

      <li v-if="activePagesIndex < navigationPages.length - 1" class="page" @click="navigationPagesNext">...</li>
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
