<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {computed, ref, useTemplateRef, watchEffect} from "vue";
import { useAlertsStore } from "~/stores/alerts";
import SearchInput from "~/components/ui/SearchInput.vue";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Loading from "~/components/ui/Loading.vue";
import Pagination from "~/components/ui/Pagination.vue";
import moment from "moment";
import type {MaturitaData, MaturitaTaskData} from "~/types/maturita";
import MaturitaTasksTable from "~/components/tables/MaturitaTasks.vue";

const { t } = useI18n();

useHead({
  title: t('pages.maturita.tasksRemove.title'),
  meta: [{ name: "description", content: t('pages.maturita.tasksRemove.description') }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const alertsStore = useAlertsStore();
const maturitaNotExists = ref<boolean | undefined>(undefined);
const currentMaturita = ref<MaturitaData | undefined>(undefined);
const datatable = useTemplateRef<InstanceType<typeof MaturitaTasksTable>>("datatable");
const allTasks = ref<MaturitaTaskData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const tasksCount = ref<number>(0);
const loading = ref<boolean>(false);
const selectedTaskIds = ref<number[]>([]);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(tasksCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const resetSelectedTasks = (): void => {
  if (!datatable.value) return;

  selectedTaskIds.value = [];
  datatable.value.clearSelection();
};

const onRowClicked = (tasks: MaturitaTaskData): void => {
  if (!datatable.value) return;

  if (!selectedTaskIds.value.includes(tasks.id)) {
    selectedTaskIds.value.push(tasks.id);
  } else {
    selectedTaskIds.value = selectedTaskIds.value.filter((id: number) => id !== tasks.id);
  }
};

const removeTasks = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/task/delete", {
    method: "delete",
    body: {
      id: selectedTaskIds.value
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode: string = response._data.resCode?.toString();
      const goodIds: number[] = response._data.data?.goodIds || [];
      const badIds: any[] = response._data.data?.badIds || [];

      switch (resCode) {
        case "28010":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.remove.alerts.removeMaturitaTask.title'), message: t('maturita.tasks.remove.alerts.removeMaturitaTask.studentsCannotDelete') });
          break;

        case "28020":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.remove.alerts.removeMaturitaTask.title'), message: t('maturita.tasks.remove.alerts.removeMaturitaTask.noId') });
          break;

        case "28031":
          if (badIds.length > 0) {
            alertsStore.addAlert({ type: "warning", title: t('maturita.tasks.remove.alerts.removeMaturitaTask.title'), message: t('maturita.tasks.remove.alerts.removeMaturitaTask.noneRemoved') });
          }

          alertsStore.addAlert({ type: "success", title: t('maturita.tasks.remove.alerts.removeMaturitaTask.title'), message: t('maturita.tasks.remove.alerts.removeMaturitaTask.success') });

          tasksRefresh();
          resetSelectedTasks();
          break;

        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.remove.alerts.removeMaturitaTask.title'), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.remove.alerts.removeMaturitaTask.title'), message: t('maturita.tasks.remove.alerts.removeMaturitaTask.unknown') });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('maturita.tasks.remove.alerts.removeMaturitaTask.title'), message: t('maturita.tasks.remove.alerts.removeMaturitaTask.unknown') });
    },
  }).finally(() => {
    loading.value = false;
  });
};

const { data: tasksData, error: tasksError, pending: tasksPending, refresh: tasksRefresh } = useFetch("/api/task/get/maturita/guarantor/approved", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

const { data: maturitaData, error: maturitaError, pending: maturitaPending } = useFetch("/api/maturita/get/current", {
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([tasksData, tasksError], (): void => {
  if (tasksError.value) {
    if (tasksError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    allTasks.value = [];
    tasksCount.value = 0;
    return;
  }

  if (!tasksData.value) return;

  allTasks.value = tasksData.value.data.tasks;
  tasksCount.value = tasksData.value.data.count;
}, { immediate: true });

watch([maturitaData, maturitaError], (): void => {
  if (maturitaError.value) {
    if (maturitaError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    currentMaturita.value = undefined;
    maturitaNotExists.value = true;
    return;
  }

  if (!maturitaData.value) return;

  currentMaturita.value = maturitaData.value.data.maturita;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allTasks.value && !tasksError.value || !currentMaturita.value && !maturitaError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/${role}/tasks`, icon: 'material-symbols:folder-copy-rounded' },
            { label: t('sidebar.links.assignments'), to: `/panel/maturita/${role}/tasks` },
            { label: t('maturita.tasks.remove.breadcrumb'), to: `/panel/maturita/${role}/tasks/remove`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-tasks" v-if="maturitaNotExists !== undefined && (maturitaNotExists)">
        <div class="content">
          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('maturita.tasks.remove.maturitaHeading') }}</h3>
              <p>{{ t('maturita.tasks.remove.description') }}</p>
            </div>

            <p class="error message">{{ t('maturita.tasks.remove.noMaturita') }}</p>
          </div>
        </div>
      </div>

      <div id="maturita-tasks" v-else-if="allTasks && currentMaturita">
        <div class="content">
          <ActionBar
              class="action-bar"
              :description="t('maturita.tasks.index.actionBar.description')"
              :texts="[t('actionBar.add'), t('actionBar.remove')]"
              :actions="['add', 'remove']"
              :active="1"
              :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
              :navigate-to="[
              `/panel/maturita/${role}/tasks/add`,
              `/panel/maturita/${role}/tasks/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>{{ t('maturita.tasks.remove.selectedCount', { count: selectedTaskIds.length }) }}</h3>
              <p>{{ t('maturita.tasks.remove.description') }}</p>
              <br>
              <p>{{ t('maturita.tasks.index.gradeLabel') }} {{ currentMaturita.grade }}</p>
              <p>{{ t('maturita.tasks.index.endLabelText') }} {{ moment(currentMaturita.endDate).format("HH:mm DD.MM. YYYY") }}</p>
            </div>

            <SearchInput @change="onSearchInputChange" :placeholder="t('maturita.tasks.remove.searchPlaceholder')" />
          </div>


          <div class="buttons">
            <button class="remove" @click="removeTasks">
              {{ t('maturita.tasks.remove.removeBtn') }}
              <Loading v-show="loading" size="5px" color="var(--actionBar-actions-remove-color)"/>
            </button>
            <button class="reset" @click="resetSelectedTasks">
              {{ t('maturita.tasks.remove.cancelBtn') }}
            </button>
          </div>

          <MaturitaTasksTable ref="datatable" :selected-ids="selectedTaskIds" :tasks="allTasks" :loading="tasksPending" :has-checkbox="true"  @row-clicked="onRowClicked" />

          <Pagination :number-of-pages="numberOfPages" v-model="currentPage" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#maturita-tasks {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .link {
    color: rgba(var(--main-color), 1);
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: rgba(var(--main-color), 0.8);
    }
  }

  .message {
    font-size: 16px;
    color: rgba(var(--description-color), 1);

    &.error {
      color: rgba(var(--error-color), 1);
    }
  }

  .actions {
    display: flex;
    flex-direction: row;
    gap: 10px;

    button {
      padding: 10px 15px;
      border-radius: var(--small-border-radius);
      transition: 0.2s;
      font-size: 16px;
      cursor: pointer;

      &.remove {
        color: var(--actionBar-actions-remove-color);
        background: rgba(var(--actionBar-actions-remove-background), 1);
        border-color: rgba(var(--actionBar-actions-remove-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-remove-background), 0.8);
        }
      }
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 30px;
      width: 100%;
    }

    .buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        border: var(--border-width) solid transparent;
        transition: 0.2s;
        font-size: 16px;
        cursor: pointer;

        &.remove {
          color: var(--actionBar-actions-remove-color);
          background: rgba(var(--actionBar-actions-remove-background), 1);
          border-color: rgba(var(--actionBar-actions-remove-border), 1);

          &:hover {
            background: rgba(var(--actionBar-actions-remove-background), 0.8);
          }
        }

        &.reset {
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border-color: rgba(var(--border-color), 0.5);

          &:hover {
            background: var(--btn-2-hover-background);
          }
        }

        .icon {
          font-size: 16px;
        }
      }
    }

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

    .page-section {
      display: flex;
      flex-direction: column;
      gap: 20px;

      &.bottom-line {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
      }
    }

    .section-head {
      display: flex;
      flex-direction: column;
      gap: 10px;

      h3 {
        font-weight: 600;
        font-size: 20px;
        color: var(--title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }

      .update {
        color: rgba(var(--error-color), 1);
      }
    }
  }
}

@media (max-width: 1055px) {
  #maturita-tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>