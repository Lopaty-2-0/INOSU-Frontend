<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import "../../assets/style/datatable.scss";
import {computed, nextTick, ref, useSlots, watch} from "vue";
import type {MaturitaTableData} from "~/types/maturitaTables";
import Image from "~/components/ui/Image.vue";

type Column = { field: string; title: string; type?: string; width?: string; filter?: boolean; cellRenderer?: Function };

const props = defineProps({
  dataRows: {
    type: Array as () => MaturitaTableData[],
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
const config = useRuntimeConfig();

const cols = computed<Column[]>(() => {
  const base: Column[] = [
    { field: "topic.id", title: "Téma (číslo)", type: "number" },
    { field: "topic.name", title: "Téma", type: "string" },
    { field: "variant", title: "Varianta", type: "string" },
    { field: "task", title: "Zadání", type: "string" },
    { field: "user", title: "Student", type: "object" },
    { field: "guarantor", title: "Garant", type: "object" },
    { field: "objector", title: "Oponent", type: "object" },
  ];

  const merged: Column[] = [...base, ...(props.extraColumns || [])];

  if (slots.actions) {
    merged.push({ field: "actions", title: "Akce" });
  }

  return merged;
});
const datatable = ref<InstanceType<typeof Vue3Datatable> | null>(null);
const rows = computed<MaturitaTableData[]>((): MaturitaTableData[] => {
  if (!props.pageSize) {
    return props.dataRows;
  }

  return props.dataRows.slice(0, props.pageSize);
});
const selectRowOnClick = computed<boolean>((): boolean => props.hasCheckbox);

const clearSelection = (): void => {
  if (!datatable.value) return;

  datatable.value.clearSelectedRows();
};

const onRowClick = (rowData: any): void => {
  if (!datatable.value) return;

  emits("rowClicked", rowData as MaturitaTableData[]);
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
  <Vue3Datatable ref="datatable" class="datatable" :pagination="props.pagination" :rows="rows" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="false" :search="props.searchInput" :selectRowOnClick="selectRowOnClick" no-data-content="Žádná data k dispozici" @rowClick="onRowClick">
    <template v-for="(_, name) in slots" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>

    <template #user="data">
      <div class="profile">
        <Image :src="config.public.originUrl + '/api/file/pfp/' + data.value.user.profilePicture" alt="profile-photo" draggable="false"/>

        <div class="data">
          <p class="account-name no-wrap">
            {{ data.value.user.name + " " + data.value.user.surname }}
          </p>
          <p class="abbreviation no-wrap">
            {{ data.value.user.abbreviation || "Neurčeno" }}
          </p>
        </div>
      </div>
    </template>

    <template #guarantor="data">
      <div class="profile" v-if="data.value.guarantor.name">
        <Image :src="config.public.originUrl + '/api/file/pfp/' + data.value.guarantor.profilePicture" alt="profile-photo" draggable="false"/>

        <div class="data">
          <p class="account-name no-wrap">
            {{ data.value.guarantor.name + " " + data.value.guarantor.surname }}
          </p>
          <p class="abbreviation no-wrap">
            {{ data.value.guarantor.abbreviation || "Neurčeno" }}
          </p>
        </div>
      </div>

      <div v-else>
        Neurčeno
      </div>
    </template>

    <template #objector="data">
      <div class="profile" v-if="data.value.objector.name">
        <Image :src="config.public.originUrl + '/api/file/pfp/' + data.value.objector.profilePicture" alt="profile-photo" draggable="false"/>

        <div class="data">
          <p class="account-name no-wrap">
            {{ data.value.objector.name + " " + data.value.objector.surname }}
          </p>
          <p class="abbreviation no-wrap">
            {{ data.value.objector.abbreviation || "Neurčeno" }}
          </p>
        </div>
      </div>

      <div v-else>
        Neurčeno
      </div>
    </template>

    <template #task="data">
      <span class="limit">
        {{ data.value.task }}
      </span>
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

  .limit {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .no-wrap {
    white-space: nowrap;
  }

  .profile {
    display: flex;
    gap: 10px;
    align-items: center;

    .data {
      display: flex;
      flex-direction: column;
      gap: 5px;

      .account-name {
        color: var(--mini-title-color);
        font-size: 16px;
      }

      .abbreviation {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }
    }

    ::v-deep(img) {
      width: 45px;
      height: 45px;
      border-radius: var(--small-border-radius);
      object-fit: cover;
    }
  }

  .link {
    color: rgba(var(--main-color), 1);
    text-decoration: none;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      color: rgba(var(--main-color), 0.8);
    }
  }
}
</style>