<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import {computed, nextTick, ref, useSlots, watch} from "vue";
import type {SpecializationData} from "~/types/specialization";

type Column = { field: string; title: string; type?: string; width?: string; filter?: boolean; cellRenderer?: Function };

const props = defineProps({
  specializations: {
    type: Array as () => SpecializationData[],
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
  },
  extraColumns: {
    type: Array as () => Column[],
    required: false,
    default: () => [],
  },
});
const emits = defineEmits(["rowClicked"]);
const slots = useSlots();

const cols = computed<Column[]>(() => {
  const base: Column[] = [
    { field: "id", title: "ID", width: "90px", type: "number" },
    { field: "name", title: "Název", type: "string", width: "60%" },
    { field: "abbreviation", title: "Zkratka", type: "string", width: "20%" },
    { field: "lengthOfStudy", title: "Délka studia (roky)", type: "number", width: "20%" },
  ];

  const merged: Column[] = [...base, ...(props.extraColumns || [])];

  if (slots.actions) {
    merged.push({ field: "actions", title: "Akce" });
  }

  return merged;
});
const datatable = ref<InstanceType<typeof Vue3Datatable> | null>(null);
const rows = computed<SpecializationData[]>((): SpecializationData[] => {
  if (!props.pageSize) {
    return props.specializations;
  }

  return props.specializations.slice(0, props.pageSize);
});
const selectRowOnClick = computed<boolean>((): boolean => props.hasCheckbox);

const clearSelection = (): void => {
  if (!datatable.value) return;

  datatable.value.clearSelectedRows();
};

const onRowClick = (rowData: any): void => {
  if (!datatable.value) return;

  emits("rowClicked", rowData as SpecializationData[]);
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

watch([() => rows.value, () => props.selectedIds], async (): Promise<void> => {
  await updateSelection();
}, { immediate: true });

defineExpose({ clearSelection });
</script>

<template>
  <Vue3Datatable class="datatable" ref="datatable" :rows="rows" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :pagination="props.pagination" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="true" :search="props.searchInput" :selectRowOnClick="selectRowOnClick" no-data-content="Žádná data k dispozici" @rowClick="onRowClick">
    <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>

    <template #abbreviation="data">
      <p>{{ data.value.abbreviation }}</p>
    </template>

    <template #actions="data">
      <slot name="actions" :value="data" />
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