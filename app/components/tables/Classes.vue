<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import type { ClassData } from "~/types/classes";
import {computed, ref} from "vue";

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
  }
});
const emits = defineEmits(["checkboxSelect"]);

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

const onInput = (): void => {
  if (!datatable.value) return;

  setTimeout((): void => {
    emits("checkboxSelect", datatable.value.getSelectedRows() as ClassData[]);
  }, 0);
};

const clearSelection = (): void => {
  if (!datatable.value) return;

  datatable.value.clearSelectedRows();
};

defineExpose({ clearSelection });
</script>

<template>
  <Vue3Datatable ref="datatable" class="datatable" :pagination="props.pagination" :rows="rows" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="true" :search="props.searchInput" no-data-content="Žádná data k dispozici" @input="onInput">
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