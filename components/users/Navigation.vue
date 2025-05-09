<script setup lang="ts">
import useArrayChunks from "../../componsables/useArrayChunks";
import {ref, watch} from "vue";

const props = defineProps({
  numberOfPages: {
    type: Number,
    required: true,
    default: 0
  }
});

const emits = defineEmits(["get:activePage"]);
const activePage = ref<number>(0);
const activePagesIndex = ref<number>(0);
const pagesArray = ref<number[]>([]);
const navigationPages = ref<number[][]>([]);

const previousPage = (): void => {
  const firstActivePageNavigationPageIndex = navigationPages.value[activePagesIndex.value][0];

  if (activePage.value > firstActivePageNavigationPageIndex && activePage.value > 0) {
    activePage.value--;
    emits("get:activePage", activePage.value);
  } else if (activePagesIndex.value > 0) {
    navigationPagesPrevious();
  }
};

const nextPage = (): void => {
  const activePageNavigationPageLength = navigationPages.value[activePagesIndex.value].length - 1;
  const lastActivePageNavigationPageIndex = navigationPages.value[activePagesIndex.value][activePageNavigationPageLength];

  if (activePage.value < lastActivePageNavigationPageIndex) {
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
  activePage.value = index;

    emits("get:activePage", activePage.value);
};

const navigationPagesNext = (): void => {
  if (activePagesIndex.value < navigationPages.value.length - 1) {
    activePagesIndex.value++;
    activePage.value = navigationPages.value[activePagesIndex.value][0];
    emits("get:activePage", activePage.value);
  }
};

const navigationPagesPrevious = (): void => {
  if (activePagesIndex.value > 0) {
    activePagesIndex.value--;
    activePage.value = navigationPages.value[activePagesIndex.value][navigationPages.value[activePagesIndex.value].length - 1]; // Set to the last page of the previous navigation page
    emits("get:activePage", activePage.value);
  }
};

watch(() => props.numberOfPages, (newCount: number): void => {
  if (newCount) {
    pagesArray.value = Array.from({ length: Math.ceil(props.numberOfPages) }, (_, index) => index);
    navigationPages.value = useArrayChunks(pagesArray.value, 3);
    setActivePagesIndex(0);
    setActivePage(0);
  }
}, { immediate: true });
</script>

<template>
  <div class="navigation">
    <button class="back" @click="previousPage"><Icon class="icon" name="material-symbols:arrow-left-alt-rounded"></Icon> Zpět</button>

    <ul class="pages">
      <li class="page" v-if="activePagesIndex > 0" @click="navigationPagesPrevious">...</li>
      <li v-for="pageNumber in navigationPages[activePagesIndex]" :key="pageNumber" :class="{ page: true, active: pageNumber === activePage }" @click="setActivePage(pageNumber)">{{ pageNumber + 1 }}</li>
      <li class="page" v-if="activePagesIndex < navigationPages.length - 1" @click="navigationPagesNext">...</li>
    </ul>

    <button class="next" @click="nextPage">Další <Icon class="icon" name="material-symbols:arrow-right-alt-rounded"></Icon></button>
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

@media (max-width: 941px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 489px) {
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