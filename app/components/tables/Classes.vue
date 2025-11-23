<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import type { ClassData } from "~/types/classes";
import {computed, nextTick, ref, watch} from "vue";
import type {SpecializationData} from "~/types/specialization";

const props = defineProps({
  classes: {
    type: Array as () => ClassData[],
    required: true,
  },
  searchInput: {
    type: String,
    required: false,
  },
  pageSize: {
    type: Number,
    required: false,
    default: 10,
  },
  hasCheckbox: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  pagination: {
    type: Boolean,
    required: false,
    default: true,
  },
  selectedIds: {
    type: Array as () => number[],
    required: false,
    default: () => [],
  }
});
const emits = defineEmits(["rowClicked"]);

const cols: { field: string; title: string; type?: string; width?: string; filter?: boolean; cellRenderer?: Function }[] = [
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string" },
  {
    field: "class", title: "Třída", type: "string", cellRenderer: (item: ClassData) => {
      return `${item.specialization}${item.grade}${item.group}`.toUpperCase();
    }
  },
  { field: "grade", title: "Ročník", type: "number" },
  { field: "group", title: "Skupina", type: "string" },
  { field: "specialization", title: "Zaměření (zkratka)", type: "string" },
];
const datatable = ref<InstanceType<typeof Vue3Datatable> | null>(null);
const rows = computed<ClassData[]>((): ClassData[] => {
  if (!props.pageSize) {
    return props.classes;
  }

  return props.classes.slice(0, props.pageSize);
});
const selectRowOnClick = computed<boolean>((): boolean => props.hasCheckbox);

const clearSelection = (): void => {
  if (!datatable.value) return;

  datatable.value.clearSelectedRows();
};

const onRowClick = (rowData: any): void => {
  if (!datatable.value) return;

  emits("rowClicked", rowData as ClassData[]);
};

const updateSelection = async (): Promise<void> => {
  await nextTick();

  if (!datatable.value) return;

  const visibleRows = datatable.value.getVisibleRows();

  clearSelection();

  visibleRows.forEach((row: any, index: number) => {
    if (props.selectedIds.includes(row.id as number)) {
      datatable.value?.selectRow(index);
    }
  });
};

watch([() => rows.value, () => props.selectedIds, () => datatable.value], async (): Promise<void> => {
  await updateSelection();
}, { immediate: true });

defineExpose({ clearSelection, updateSelection });
</script>

<template>
  <Vue3Datatable ref="datatable" class="datatable" :pagination="props.pagination" :rows="rows" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="true" :search="props.searchInput" :selectRowOnClick="selectRowOnClick" no-data-content="Žádná data k dispozici" @rowClick="onRowClick">
    <template #group="data">
      <p>
        {{ data.value.group }}
      </p>
    </template>

    <template #specialization="data">
      <p>
        {{ data.value.specialization }}
      </p>
    </template>

    <template #actions="data">
      <slot name="actions" :row="data.value" />
    </template>
  </Vue3Datatable>
</template>

<style scoped lang="scss">
@use "../../assets/style/datatable";

::v-deep(.bh-datatable .bh-table-responsive tr td p) {
  text-transform: uppercase;
}

.datatable {
  width: 100%;
}
</style>