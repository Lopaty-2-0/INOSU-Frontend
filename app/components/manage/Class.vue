<script setup lang="ts">
import {computed, nextTick, ref, useTemplateRef, watch, watchEffect} from "vue";
import type {ClassData} from "~/types/classes";
import {useFetch} from "nuxt/app";
import ClassesTable from "~/components/tables/Classes.vue";
import Pagination from "~/components/ui/Pagination.vue";
import InputMenu, {type InputMenuItem} from "~/components/ui/InputMenu.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

const props = defineProps({
  oldClassIds: {
    type: Array as () => number[],
    required: true,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["update"]);
const amountForPaging: number = 4;
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
    value: classData.id.toString()
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

const { data: classesData, error: classesError, pending: classesPending } = useFetch("/api/class/get", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true,
});

watch([classesData, classesError], (): void => {
  if (classesError.value) {
    classes.value = [];
    classesCount.value = 0;
    return;
  }

  if (!classesData.value) return;

  classes.value = classesData.value.data.classes;
  classesCount.value = classesData.value.data.count;
}, { immediate: true });

watch(() => props.oldClassIds, (newClassIds: number[]): void => {
  selectedClasses.value = newClassIds.map((id: number) => id.toString());
});

defineExpose({ reset });
</script>

<template>
  <div class="section">
    <slot />

    <div class="section content">
      <label>{{ t('manage.class.label') }}</label>

      <InputMenu
          v-model="selectedClasses"
          :multiple="props.multiple"
          :items="dropDownClasses"
          :create-item="false"
          :placeholder="t('manage.class.placeholder')"
          :deselect="true"
          :disable-item-filtering="true"
          :no-data-text="t('manage.class.noData')"
          @update:model-value="onSelect"
          @search:change="onSearchInputChange"
          :loading="classesPending"
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
