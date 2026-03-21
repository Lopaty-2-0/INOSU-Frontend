<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import "../../assets/style/datatable.scss";
import moment from "moment";
import {computed, nextTick, ref, useSlots, watch} from "vue";
import type {MaturitaTaskData} from "~/types/maturita";
import Image from "~/components/ui/Image.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

type Column = { field: string; title: string; type?: string; width?: string; filter?: boolean; cellRenderer?: Function };

const props = defineProps({
  tasks: {
    type: Array as () => MaturitaTaskData[],
    required: true,
  },
  role: {
    type: String,
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
  const base: Column[] = props.role === "student" ?
    [
      { field: "id", title: t('tables.columns.id'), width: "90px", type: "number" },
      { field: "name", title: t('tables.columns.name'), type: "string" },
      { field: "topic", title: t('tables.columns.topic'), type: "string" },
      { field: "task", title: t('tables.columns.task'), type: "string" },
      { field: "guarantor", title: t('tables.columns.guarantor'), type: "object" },
    ]
      :
    [
      { field: "id", title: t('tables.columns.id'), width: "90px", type: "number" },
      { field: "name", title: t('tables.columns.name'), type: "string" },
      { field: "topic", title: t('tables.columns.topic'), type: "string" },
      { field: "task", title: t('tables.columns.task'), type: "string" },
      { field: "userData", title: t('tables.columns.proposer'), type: "object" },
    ];

  const merged: Column[] = [...base, ...(props.extraColumns || [])];

  if (slots.actions) {
    merged.push({ field: "actions", title: t('tables.columns.actions') });
  }

  return merged;
});
const datatable = ref<InstanceType<typeof Vue3Datatable> | null>(null);
const rows = computed<MaturitaTaskData[]>((): MaturitaTaskData[] => {
  if (!props.pageSize) {
    return props.tasks;
  }

  return props.tasks.slice(0, props.pageSize);
});
const selectRowOnClick = computed<boolean>((): boolean => props.hasCheckbox);

const downloadTask = (guarantorId: number, id: number, task: string | null): void => {
  if (!guarantorId || !id || !task) return;

  navigateTo(`/api/file/task/${guarantorId}/${id}/${task}`, { external: true, open: { target: "_blank" } });
};

const clearSelection = (): void => {
  if (!datatable.value) return;

  datatable.value.clearSelectedRows();
};

const onRowClick = (rowData: any): void => {
  if (!datatable.value) return;

  emits("rowClicked", rowData as MaturitaTaskData[]);
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
  <Vue3Datatable ref="datatable" class="datatable" :pagination="props.pagination" :rows="rows" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="false" :search="props.searchInput" :selectRowOnClick="selectRowOnClick" :no-data-content="t('common.noData')" @rowClick="onRowClick">
    <template v-for="(_, name) in slots" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>

    <template #userData="data">
      <div class="profile">
        <Image
            :src="config.public.originUrl + '/api/file/pfp/' + data.value.userData.profilePicture"
            alt="profile-photo"
            draggable="false"
        />

        <p class="account-name">
          {{ data.value.userData.name }} {{ data.value.userData.surname }}
        </p>
      </div>
    </template>

    <template #guarantor="data">
      <div class="profile">
        <Image
            :src="config.public.originUrl + '/api/file/pfp/' + data.value.guarantor.profilePicture"
            alt="profile-photo"
            draggable="false"
        />

        <p class="account-name">
          {{ data.value.guarantor.name }} {{ data.value.guarantor.surname }}
        </p>
      </div>
    </template>


    <template #name="data">
      <span class="limit">{{ data.value.name }}</span>
    </template>

    <template #task="data">
      <span class="link limit" @click="downloadTask(data.value.guarantor.id, data.value.id, data.value.task)">
        {{ data.value.task || t('common.noAssignment') }}
      </span>
    </template>

    <template #points="data">
      {{ data.value.points ?? t('common.undetermined') }}
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
    flex-direction: row;

    .account-name {
      color: var(--mini-title-color);
      font-size: 16px;
      text-wrap: nowrap;
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