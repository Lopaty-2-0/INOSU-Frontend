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
import MaturitaProposalsTable from "~/components/tables/MaturitaProposals.vue";

useHead({
  title: "Panel | Návrhy maturitních zadání - Odstranění",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["student"],
});

const alertsStore = useAlertsStore();
const maturitaNotExists = ref<boolean | undefined>(undefined);
const currentMaturita = ref<MaturitaData | undefined>(undefined);
const datatable = useTemplateRef<InstanceType<typeof MaturitaProposalsTable>>("datatable");
const allTasks = ref<MaturitaTaskData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const tasksCount = ref<number>(0);
const loading = ref<boolean>(false);
const selectedRows = ref<{ taskId: number, guarantorId: number }[]>([]);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(tasksCount.value / amountForPaging);
});
const selectedTaskIds = computed<number[]>((): number[] => {
  return selectedRows.value.map((row: { taskId: number, guarantorId: number }) => row.taskId);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const resetSelectedTasks = (): void => {
  if (!datatable.value) return;

  selectedRows.value = [];
  datatable.value.clearSelection();
};

const onRowClicked = (tasks: MaturitaTaskData): void => {
  if (!datatable.value || !tasks.guarantor) return;

  if (!selectedRows.value.includes({ taskId: tasks.id, guarantorId: tasks.guarantor.id })) {
    selectedRows.value.push({ taskId: tasks.id, guarantorId: tasks.guarantor.id });
  } else {
    selectedRows.value = selectedRows.value.filter((id) => id.taskId !== tasks.id && id.guarantorId !== tasks.guarantor?.id);
  }
};

const removeTasks = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/task/delete/student", {
    method: "delete",
    body: {
      idTask: selectedTaskIds.value,
      guarantor: selectedRows.value.map((row) => row.guarantorId),
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode: string = response._data.resCode?.toString();
      const goodIds: number[] = response._data.data?.goodIds || [];
      const badIds: any[] = response._data.data?.badIds || [];

      switch (resCode) {
        case "81010":
          alertsStore.addAlert({ type: "error", title: "Odstranění návrhů maturitních zadání", message: "Tato role nemůže mazat maturitní zadání." });
          break;

        case "81020":
          alertsStore.addAlert({ type: "error", title: "Odstranění návrhů maturitních zadání", message: "Nebyl zadán identifikátor zadání." });
          break;

        case "81030":
          alertsStore.addAlert({ type: "error", title: "Odstranění návrhů maturitních zadání", message: "Nebyl zadán garant." });
          break;

        case "81040":
          alertsStore.addAlert({ type: "error", title: "Odstranění návrhů maturitních zadání", message: "Počet ID zadání neodpovídá počtu garantů." });
          break;

        case "81051":
          if (badIds.length > 0) {
            alertsStore.addAlert({ type: "warning", title: "Odstranění návrhů maturitních zadání", message: `Některá zadání (${badIds.length}) se nepodařilo odstranit.` });
          }

          if (goodIds.length > 0) {
            alertsStore.addAlert({ type: "success", title: "Odstranění návrhů maturitních zadání", message: `Zadání (${goodIds.length}) byla úspěšně odstraněna.` });
          }

          tasksRefresh();
          resetSelectedTasks();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění návrhů maturitních zadání", message: "Nastala neznámá chyba." });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění návrhů maturitních zadání", message: "Nastala neznámá chyba." });
    },
  }).finally(() => {
    loading.value = false;
  });
};

const { data: tasksData, error: tasksError, pending: tasksPending, refresh: tasksRefresh } = useFetch("/api/task/get/maturita/student/not_approved", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

const { data: maturitaData, error: maturitaError, pending: maturitaPending } = useFetch("/api/maturita/get/current", {
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

watch([tasksData, tasksError], (): void => {
  if (tasksError.value) {
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
            { label: 'Maturity', to: `/panel/maturita/student/proposals`, icon: 'material-symbols:lightbulb-rounded' },
            { label: 'Návrhy', to: `/panel/maturita/student/proposals` },
            { label: 'Zamítnuté', to: `/panel/maturita/student/proposals/rejected`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-tasks" v-if="maturitaNotExists !== undefined && (maturitaNotExists)">
        <div class="content">
          <div class="page-section">
            <div class="section-head">
              <h3>Maturitní zadání</h3>
              <p>Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.</p>
            </div>

            <p class="error message">Žádný maturitní období more.</p>
          </div>
        </div>
      </div>

      <div id="maturita-tasks" v-else-if="allTasks && currentMaturita">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa návrhů maturitních zadání"
            :texts="['Přidat', 'Zamítnuté', 'Odstranit']"
            :actions="['add', 'remove', 'remove']"
            :active="2"
            :separator-indexes="[1]"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:close-rounded',
              'material-symbols:delete-rounded',
            ]"
              :navigate-to="[
              `/panel/maturita/student/proposals/add`,
              `/panel/maturita/student/proposals/rejected`,
              `/panel/maturita/student/proposals/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Vybrané maturitní zadání: {{ selectedRows.length }}</h3>
              <p>Seznam vašich vytvořených úkolů, s kterými můžete pracovat.</p>
              <br>
              <p>Ročník: {{ currentMaturita.grade }}</p>
              <p>Konec: {{ moment(currentMaturita.endDate).format("HH:mm DD.MM. YYYY") }}</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat zadání" />
          </div>


          <div class="buttons">
            <button class="remove" @click="removeTasks">
              Odstranit
              <Loading v-show="loading" size="5px" color="var(--actionBar-actions-remove-color)"/>
            </button>
            <button class="reset" @click="resetSelectedTasks">
              Zrušit vše
            </button>
          </div>

          <MaturitaProposalsTable ref="datatable" :selected-ids="selectedTaskIds" role="student" :tasks="allTasks" :loading="tasksPending" :has-checkbox="true" @row-clicked="onRowClicked"
                                  :extra-columns="[
              { title: 'Status', field: 'status' }
            ]"
          >

            <template #status="data">
              <p class="status" :class="[data.value.status]">
                {{
                  data.value.status === "approved" ? "Schváleno" :
                  data.value.status === "rejected" ? "Zamítnuto" :
                  data.value.status === "pending" ? "Čeká na schválení" :
                  data.value.status
                }}
              </p>
            </template>
          </MaturitaProposalsTable>

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

    .status {
      font-size: 14px;
      font-weight: 500;

      &.approved {
        color: rgba(var(--success-color), 1);
      }

      &.rejected {
        color: rgba(var(--error-color), 1);
      }

      &.pending {
        color: rgba(var(--warning-color), 1);
      }
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