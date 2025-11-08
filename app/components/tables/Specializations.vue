<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import {computed, ref} from "vue";
import type {SpecializationData} from "~/types/specialization";

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
  }
});
const emits = defineEmits(["checkboxSelect"]);

const cols: { field: string; title: string; type?: string; width?: string; filter?: boolean; cellRenderer?: Function }[] = [
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string" },
  { field: "abbreviation", title: "Zkratka", type: "string" },
  { field: "lengthOfStudy", title: "Délka studia (roky)", type: "number" },
];
const datatable = ref<InstanceType<typeof Vue3Datatable> | null>(null);
const rows = computed<SpecializationData[]>((): SpecializationData[] => {
  if (!props.pageSize) {
    return props.specializations;
  }

  return props.specializations.slice(0, props.pageSize);
});

const onInput = (): void => {
  if (!datatable.value) return;

  setTimeout((): void => {
    emits("checkboxSelect", datatable.value.getSelectedRows() as SpecializationData[]);
  }, 0);
};

const clearSelection = (): void => {
  if (!datatable.value) return;

  datatable.value.clearSelectedRows();
};

defineExpose({ clearSelection });
</script>

<template>
  <Vue3Datatable class="datatable" ref="datatable" :rows="rows" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :pagination="props.pagination" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="true" :search="props.searchInput" no-data-content="Žádná data k dispozici" @input="onInput">
    <template #abbreviation="data">
      <p>{{ data.value.abbreviation }}</p>
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