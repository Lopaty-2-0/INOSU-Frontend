<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import {computed, nextTick, ref, useSlots, watch} from "vue";
import type {AccountData} from "~/types/account";
import Image from "~/components/ui/Image.vue";
import moment from "moment/moment";

type Column = { field: string; title: string; type?: string; width?: string; filter?: boolean; cellRenderer?: Function };

const props = defineProps({
  users: {
    type: Array as () => AccountData[],
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
const config = useRuntimeConfig();
const slots = useSlots();

const cols = computed<Column[]>(() => {
  const base: Column[] = [
    { field: "id", title: "ID", width: "90px", type: "number" },
    { field: "profile", title: "Jméno a příjmení", type: "string", width: "50%" },
    { field: "email", title: "E-mail", type: "string", width: "50%" },
    { field: "abbreviation", title: "Zkratka", type: "string" },
    { field: "createdAt", title: "Vytvořen", type: "string" },
  ];

  const merged: Column[] = [...base, ...(props.extraColumns || [])];

  if (slots.actions) {
    merged.push({ field: "actions", title: "Akce" });
  }

  return merged;
});
const datatable = ref<InstanceType<typeof Vue3Datatable> | null>(null);
const rows = computed<AccountData[]>((): AccountData[] => {
  if (!props.pageSize) {
    return props.users;
  }

  return props.users.slice(0, props.pageSize);
});
const selectRowOnClick = computed<boolean>((): boolean => props.hasCheckbox);

const clearSelection = (): void => {
  if (!datatable.value) return;

  datatable.value.clearSelectedRows();
};

const onRowClick = (rowData: any): void => {
  if (!datatable.value) return;

  emits("rowClicked", rowData as AccountData[]);
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
  <Vue3Datatable ref="datatable" class="datatable" :pagination="props.pagination" :rows="rows" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="false" :search="props.searchInput" :selectRowOnClick="selectRowOnClick" no-data-content="Žádná data k dispozici" @rowClick="onRowClick">
    <template v-for="(_, name) in slots" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>

    <template #profile="data">
      <div class="profile">
        <Image
          :src="config.public.originUrl + '/api/file/pfp/' + data.value.profilePicture"
          alt="profile-photo"
          draggable="false"
        />

        <p class="account-name">
          {{ data.value.name + " " + data.value.surname }}
        </p>
      </div>
    </template>

    <template #abbreviation="data">
      {{ data.value.abbreviation || "Neurčeno" }}
    </template>

    <template #createdAt="data">
      <span class="no-wrap">{{ moment(data.value.createdAt).format("DD.MM. YYYY") }}</span>
    </template>

    <template #actions="data">
      <slot name="actions" :value="data.value" />
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

  .no-wrap {
    white-space: nowrap;
  }

  .profile {
    display: flex;
    gap: 10px;
    align-items: center;

    .account-name {
      color: var(--mini-title-color);
      font-size: 16px;
    }

    ::v-deep(img) {
      width: 45px;
      height: 45px;
      border-radius: var(--small-border-radius);
      object-fit: cover;
    }
  }
}
</style>