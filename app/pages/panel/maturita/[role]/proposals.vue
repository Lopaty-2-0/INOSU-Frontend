<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Pagination from "~/components/ui/Pagination.vue";
import MauturitaProposalsTable from "~/components/tables/MaturitaProposals.vue";
import type {MaturitaData, MaturitaTaskData} from "~/types/maturita";
import moment from "moment/moment";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";
import {useAlertsStore} from "~/stores/alerts";
import Loading from "~/components/ui/Loading.vue";

const { t } = useI18n();

useHead({
  title: t('pages.maturita.proposalsRole.title'),
  meta: [{ name: "description", content: t('pages.maturita.proposalsRole.description') }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const accountStore = useAccountStore();
const alertsStore = useAlertsStore();
const { getAccountData: accountData } = storeToRefs(accountStore);
const maturitaNotExists = ref<boolean | undefined>(undefined);
const currentMaturita = ref<MaturitaData | undefined>(undefined);
const allTasks = ref<MaturitaTaskData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const tasksCount = ref<number>(0);
const loading = ref<{ isLoading: boolean, id: number | null, teamId: number | null }>({ isLoading: false, id: null, teamId: null });
const numberOfPages = computed<number>((): number => {
  return Math.ceil(tasksCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const changeTaskStatus = async (id: number, teamId: number, status: "approved" | "rejected"): Promise<void> => {
  if (!teamId || !id) return;

  loading.value = { isLoading: true, id, teamId };

  await $fetch("/api/team/update", {
    method: "put",
    body: {
      idTask: id,
      idTeam: teamId,
      status: status
    },
    credentials: "include",
    ignoreResponseError: true,

    onResponse({ response }: any) {
      const resCode = response?._data?.resCode?.toString();

      switch (resCode) {
        case "32010":
        case "32030":
        case "32040":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.invalidTaskId') });
          break;

        case "32020":
        case "32050":
        case "32060":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.invalidTeamId') });
          break;

        case "32070":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.taskNotFound') });
          break;

        case "32080":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.teamNotFound') });
          break;

        case "32090":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.invalidStatus') });
          break;

        case "32100":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.maxVariants') });
          break;

        case "32110":
        case "32120":
        case "32130":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.pointsInvalid') });
          break;

        case "32140":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.commentTooLong') });
          break;

        case "32150":
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('maturita.proposals_role.alerts.manageProposal.nameTooLong') });
          break;

        case "32161":
          alertsStore.addAlert({type: "success", title: t('maturita.proposals_role.alerts.manageProposal.title'),
            message: status === "approved" ? t('maturita.proposals_role.alerts.manageProposal.accepted') : t('maturita.proposals_role.alerts.manageProposal.rejected')
          });
          refreshTasks();
        break;

        default:
          alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('common.unknown') });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('maturita.proposals_role.alerts.manageProposal.title'), message: t('common.unknown') });
    },
  }).finally(() => {
    loading.value = { isLoading: false, id: null, teamId: null };
  });
};

const { data: tasksData, error: tasksError, pending: tasksPending, refresh: refreshTasks } = useFetch("/api/task/get/maturita/guarantor/pending", {
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

const { data: maturitaData, error: maturitaError } = useFetch("/api/maturita/get/current", {
  method: "get",
  server: false,
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

  allTasks.value = tasksData.value.data.tasks.map((task: MaturitaTaskData) => {
    return {
      ...task,
      guarantor: accountData.value
    }
  });
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
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/${role}/proposals`, icon: 'material-symbols:lightbulb-rounded' },
            { label: t('sidebar.links.proposals'), to: `/panel/maturita/${role}/proposals`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-tasks" v-if="maturitaNotExists !== undefined && (maturitaNotExists)">
        <div class="content">
          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('maturita.proposals_role.maturitaSection.heading') }}</h3>
              <p>{{ t('maturita.proposals_role.maturitaSection.description') }}</p>
            </div>

            <p class="error message">{{ t('maturita.proposals_role.maturitaSection.noMaturita') }}</p>
          </div>
        </div>
      </div>

      <div id="maturita-tasks" v-else-if="allTasks && currentMaturita">
        <div class="content">
          <div class="line">
            <div class="section-head bottom-line">
              <h3>{{ t('maturita.proposals_role.listHeading') }}</h3>
              <p>{{ t('maturita.proposals_role.listDescription') }}</p>
              <br>
              <p>{{ t('maturita.grade.add.startLabel').replace(' *', '') }}: {{ currentMaturita.grade }}</p>
              <p>{{ t('maturita.team.endLabel') }} {{ moment(currentMaturita.endDate).format("HH:mm DD.MM. YYYY") }}</p>
            </div>

            <SearchInput @change="onSearchInputChange" :placeholder="t('maturita.proposals_role.searchPlaceholder')" />
          </div>

          <MauturitaProposalsTable :role="role" class="datatable" :tasks="allTasks" :loading="tasksPending">
            <template #actions="data">
              <Loading color="var(--actionBar-actions-add-color)" size="6px" v-if="loading.isLoading && loading.id === data.value.id && loading.teamId === data.value.idTeam" />

              <div class="actions" v-else>
                <button type="button" class="approved" @click="changeTaskStatus(data.value.id, data.value.idTeam, 'approved')">{{ t('maturita.proposals_role.acceptBtn') }}</button>
                <button type="button" class="rejected" @click="changeTaskStatus(data.value.id, data.value.idTeam, 'rejected')">{{ t('maturita.proposals_role.rejectBtn') }}</button>
              </div>
            </template>
          </MauturitaProposalsTable>

          <Pagination v-model="currentPage" :number-of-pages="numberOfPages" />
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

  .navigation {
    height: fit-content;
    position: sticky;
    min-width: 250px;
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
      background: var(--btn-2-background);
      color: var(--btn-2-color);
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;

      &:hover {
        background: var(--btn-2-hover-background);
      }

      &.rejected {
        color: var(--actionBar-actions-remove-color);
        background: rgba(var(--actionBar-actions-remove-background), 1);
        border-color: rgba(var(--actionBar-actions-remove-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-remove-background), 0.8);
        }
      }

      &.approved {
        color: var(--actionBar-actions-add-color);
        background: rgba(var(--actionBar-actions-add-background), 1);
        border-color: rgba(var(--actionBar-actions-add-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-add-background), 0.8);
        }
      }

      &.primary {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        background: var(--btn-1-background);
        color: var(--btn-1-color);

        &:hover {
          background: var(--btn-1-hover-background);
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
      flex: 1;
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

@media (max-width: 1420px) {
  #maturita-tasks .navigation {
    flex: 1;
  }
}

@media (max-width: 1055px) {
  #maturita-tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
