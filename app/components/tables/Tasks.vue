<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import moment from "moment";
import type { TaskData } from "~/types/tasks";

const props = defineProps({
  tasks: {
    type: Array as () => TaskData[],
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
});

const cols: { field: string; title: string; type?: string; width?: string; filter?: boolean; }[] = [
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string", width: "30%" },
  { field: "startDate", title: "Začátek", type: "date" },
  { field: "endDate", title: "Konec", type: "date" },
  { field: "deadline", title: "Uzávěrka", type: "date" },
  { field: "points", title: "Max bodů", type: "number" },
  { field: "task", title: "Zadání", type: "string", width: "30%" },
  { field: "actions", title: "Akce" },
];

const downloadTask = (id: number, task: string): void => {
  window.open(`/api/file/task/${id}/${task}`, "_blank");
};
</script>

<template>
  <Vue3Datatable :rows="props.tasks" :loading="props.loading" :showFirstPage="false" :showLastPage="false" :hasCheckbox="props.hasCheckbox" :columns="cols" :pageSize="props.pageSize" :sortable="true" :search="props.searchInput" no-data-content="Žádná data k dispozici">
    <template #name="data">
      <span class="limit">{{ data.value.name }}</span>
    </template>

    <template #task="data">
      <span class="link limit" @click="downloadTask(data.value.id, data.value.task)">
        {{ data.value.task }}
      </span>
    </template>

    <template #startDate="data">
      <span class="no-wrap">{{ moment(data.value.startDate).format("DD.MM.YYYY HH:MM") }}</span>
    </template>

    <template #endDate="data">
      <span class="no-wrap">{{ moment(data.value.endDate).format("DD.MM.YYYY HH:MM") }}</span>
    </template>

    <template #deadline="data">
      {{ data.value.deadline ? moment(data.value.deadline).format("DD.MM.YYYYHH:MM") : "Neurčeno" }}
    </template>

    <template #points="data">
      {{ data.value.points || "Neurčeno" }}
    </template>

    <template #actions="data">
      <slot name="actions" :row="data.value" />
    </template>
  </Vue3Datatable>
</template>

<style scoped lang="scss">
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

.link {
  color: rgba(var(--main-color), 1);
  text-decoration: none;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    color: rgba(var(--main-color), 0.8);
  }
}
</style>