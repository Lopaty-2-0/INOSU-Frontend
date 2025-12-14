<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import type { ClassData } from "~/types/classes";
import {computed, nextTick, ref, useSlots, watch} from "vue";
import type {SpecializationData} from "~/types/specialization";

type Column = { field: string; title: string; type?: string; width?: string; filter?: boolean; cellRenderer?: Function };

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
    { field: "name", title: "Název", type: "string", width: "40%" },
    {
      field: "class", title: "Třída", type: "string", width: "30%", cellRenderer: (item: ClassData) => {
        return `${item.specialization}${item.grade}${item.group}`.toUpperCase();
      }
    },
    { field: "grade", title: "Ročník", type: "number", width: "10%" },
    { field: "group", title: "Skupina", type: "string", width: "10%" },
    { field: "specialization", title: "Zaměření (zkratka)", type: "string", width: "10%" },
  ];

  const merged: Column[] = [...base, ...(props.extraColumns || [])];

  if (slots.actions) {
    merged.push({ field: "actions", title: "Akce" });
  }

  return merged;
});
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

const getSelectedRowIds = (): number[] => {
  if (!datatable.value) return [];

  return datatable.value.getSelectedRows().map((row: ClassData) => row.id) as number[];
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

defineExpose({ clearSelection, updateSelection, getSelectedRowIds });
</script>

<template>
  <Vue3Datatable ref="datatable" class="datatable" :pagination="props.pagination" :rows="rows" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="false" :search="props.searchInput" :selectRowOnClick="selectRowOnClick" no-data-content="Žádná data k dispozici" @rowClick="onRowClick">
    <template v-for="(_, name) in slots" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>

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