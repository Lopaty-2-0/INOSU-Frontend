<script setup lang="ts">
import {computed, nextTick, ref, useTemplateRef, watch, watchEffect} from "vue";
import type {ClassData} from "~/types/classes";
import {useFetch} from "nuxt/app";
import ClassesTable from "~/components/tables/Classes.vue";
import Pagination from "~/components/ui/Pagination.vue";
import InputMenu, {type InputMenuItem} from "~/components/ui/InputMenu.vue";

const props = defineProps({
  oldClassIds: {
    type: Array as () => number[],
    required: true,
  },
});

const emits = defineEmits(["update"]);
const amountForPaging: number = 1;
const classes = ref<ClassData[] | undefined>(undefined);
const selectedClasses = ref<string[]>([...props.oldClassIds?.map((id: number) => id.toString())]);
const error = ref<string | null>(null);
const currentPage = ref<number>(1);
const classesCount = ref<number>(0);
const searchInput = ref<string>("");
const numberOfPages = computed<number>((): number => {
  return Math.ceil(classesCount.value / amountForPaging);
});
const dropDownClasses = computed<InputMenuItem[]>(() => {
  return (classes.value || []).map((classData: ClassData) => ({
    label: classData.name,
    name: classData.id.toString()
  }));
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const reset = (): void => {
  selectedClasses.value = [...props.oldClassIds?.map((id: number) => id.toString())];

  emits("update", { classes: selectedClasses.value.map((id: string) => Number(id)) });
};

const onSelect = (selectedClassData: ClassData | string | string[] | undefined): void => {
  if (!selectedClassData) return;

  if (Array.isArray(selectedClassData)) {
    selectedClasses.value = selectedClassData.map(s => s.toString());
  } else if (typeof selectedClassData === "string") {
    const idStr: string = selectedClassData;

    if (!selectedClasses.value.includes(idStr)) {
      selectedClasses.value.push(idStr);
    } else {
      selectedClasses.value = selectedClasses.value.filter((id: string) => id !== idStr);
    }
  } else {
    const idStr: string = (selectedClassData as ClassData).id?.toString();
    if (!idStr) return;

    if (!selectedClasses.value.includes(idStr)) {
      selectedClasses.value.push(idStr);
    } else {
      selectedClasses.value = selectedClasses.value.filter((id: string) => id !== idStr);
    }
  }

  emits("update", { classes: selectedClasses.value.map((id: string) => Number(id)) });
};

const { data: classesData, error: classesError } = useFetch("/api/class/get", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: true,
  credentials: "include",
});

watchEffect((): void => {
  if (classesError.value) {
    classes.value = [];
    classesCount.value = 0;
    return;
  }

  if (!classesData.value) return;

  classes.value = classesData.value.data.classes;
  classesCount.value = classesData.value.data.count;
});

watch(() => props.oldClassIds, (newClassIds: number[]): void => {
  selectedClasses.value = newClassIds.map((id: number) => id.toString());
});

defineExpose({ reset });
</script>

<template>
  <div class="section">
    <slot />

    <div class="section content">
      <label>Výběr zaměření</label>

      <InputMenu
          v-model="selectedClasses"
          :multiple="true"
          :items="dropDownClasses"
          :create-item="false"
          placeholder="Vyberte třídu"
          :deselect="true"
          :disable-item-filtering="true"
          no-data-text="Žádná třída nebyla nalezena"
          @update:model-value="onSelect"
          @search:change="onSearchInputChange"
      >
        <template #row-extra v-if="numberOfPages > 1">
          <Pagination v-model="currentPage" :number-of-pages="numberOfPages" :chunk-size="2" />
        </template>
      </InputMenu>

      <p class="input-error" v-if="error && error.length > 0">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;

  .section {
    display: flex;
    flex-direction: column;
    gap: 35px;
    flex: 1;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .input-error {
      font-size: 16px;
      color: rgba(var(--error-color), 1);
    }

    label {
      color: var(--mini-title-color);
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
    }
  }
}
</style>
