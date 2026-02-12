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
import ActionBar from "~/components/ui/ActionBar.vue";

useHead({
  title: "Panel | Návrhy maturitních zadání - Zamítnuté",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["student"],
});

const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);
const maturitaNotExists = ref<boolean | undefined>(undefined);
const currentMaturita = ref<MaturitaData | undefined>(undefined);
const allTasks = ref<MaturitaTaskData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const tasksCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(tasksCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const editTask = async (id: number, guarantorId: number): Promise<void> => {
  if (!id || !guarantorId) return;

  await navigateTo(`/panel/maturita/student/proposals/${id}/${guarantorId}`);
};

const { data: tasksData, error: tasksError, pending: tasksPending, refresh: refreshTasks } = useFetch("/api/task/get/maturita/student/pending", {
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

const { data: maturitaData, error: maturitaError } = useFetch("/api/maturita/get/current", {
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
            { label: 'Návrhy', to: `/panel/maturita/student/proposals`, active: true },
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
            <div class="section-head bottom-line">
              <h3>Návrhy maturitních zadání</h3>
              <p>Seznam vašich vytvořených úkolů, s kterými můžete pracovat.</p>
              <br>
              <p>Ročník: {{ currentMaturita.grade }}</p>
              <p>Konec: {{ moment(currentMaturita.endDate).format("HH:mm DD.MM. YYYY") }}</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat zadání" />
          </div>

          <MauturitaProposalsTable class="datatable" role="student" :tasks="allTasks" :loading="tasksPending">
            <template #actions="data">
              <div class="actions">
                <button type="button" class="primary" @click="editTask(data.value.id, data.value.guarantor.id)">Upravit</button>
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