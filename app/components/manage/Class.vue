<script setup lang="ts">
import {computed, nextTick, ref, useTemplateRef, watch, watchEffect} from "vue";
import type {ClassData} from "~/types/classes";
import {useFetch} from "nuxt/app";
import ClassesTable from "~/components/tables/Classes.vue";
import Pagination from "~/components/ui/Pagination.vue";

const props = defineProps({
  oldClassIds: {
    type: Array as () => number[],
    required: true,
  },
  searchInput: {
    type: String,
    required: false,
    default: "",
  }
});

const emits = defineEmits(["update"]);
const amountForPaging: number = 5;
const datatable = useTemplateRef<InstanceType<typeof ClassesTable>>("datatable");
const classes = ref<ClassData[] | undefined>(undefined);
const selectedClasses = ref<number[]>([...props.oldClassIds]);
const currentPage = ref<number>(1);
const classesCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(classesCount.value / amountForPaging);
});

const reset = (): void => {
  if (!datatable.value) return;

  selectedClasses.value = [...props.oldClassIds];

  emits("update", { classes: datatable.value.getSelectedRowIds() });
};

const onRowClicked = (selectedClassData: ClassData): void => {
  if (!datatable.value) return;

  if (!selectedClasses.value.includes(selectedClassData.id)) {
    selectedClasses.value.push(selectedClassData.id);
  } else {
    selectedClasses.value = selectedClasses.value.filter((id: number) => id !== selectedClassData.id);
  }

  emits("update", { classes: selectedClasses.value });
};

const { data: classesData, error: classesError, pending: classesTablePending } = await useFetch("/api/class/get", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: props.searchInput,
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
  selectedClasses.value = newClassIds;
});

defineExpose({ reset });
</script>

<template>
  <div class="section">
    <slot />

    <div class="section">
      <ClassesTable ref="datatable" :classes="classes || []" :selected-ids="selectedClasses" :page-size="amountForPaging" :loading="classesTablePending" :has-checkbox="true" @row-clicked="onRowClicked" />

      <Pagination :number-of-pages="numberOfPages" v-model="currentPage" />
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
}
</style>
