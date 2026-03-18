<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Pagination from "~/components/ui/Pagination.vue";
import MaturitaTasksTable from "~/components/tables/MaturitaTasks.vue";
import type {MaturitaData, MaturitaTaskData} from "~/types/maturita";
import moment from "moment/moment";
import Image from "~/components/ui/Image.vue";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";
import Navigation from "~/components/ui/Navigation.vue";
import MaturitaTable from "~/components/tables/MaturitaTable.vue";

useHead({
  title: "Panel | Maturitní zadání",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const config = useRuntimeConfig();
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

const openChat = async (id: number, teamId: number): Promise<void> => {
  if (!id || !teamId) return;

  await navigateTo(`/panel/maturita/${role}/tasks/${id}/${teamId}/chat`);
};

const openTask = async (id: number, teamId: number): Promise<void> => {
  if (!id || !teamId) return;

  await navigateTo(`/panel/maturita/${role}/tasks/${id}/${teamId}`);
};

const editTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/maturita/${role}/tasks/${id}/edit`);
};

const { data: tasksData, error: tasksError, pending: tasksPending } = useFetch("/api/task/get/maturita/guarantor/approved", {
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

  maturitaNotExists.value = false;

  if (!maturitaData.value) return;

  currentMaturita.value = maturitaData.value.data.maturita;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allTasks.value && !tasksError.value || !currentMaturita.value && !maturitaError.value || maturitaNotExists.value === undefined);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Maturity', to: `/panel/maturita/${role}/tasks`, icon: 'material-symbols:folder-copy-rounded' },
            { label: 'Zadání', to: `/panel/maturita/${role}/tasks`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-tasks" v-if="maturitaNotExists !== undefined && maturitaNotExists">
        <div class="content">
          <div class="section-head">
            <h3>Maturitní zadání</h3>
            <p>Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.</p>
          </div>

          <p class="error message">Žádný maturitní období more.</p>
        </div>
      </div>

      <div id="maturita-tasks" v-else-if="allTasks && currentMaturita">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa maturitních zadání"
            :texts="['Přidat', 'Odebrat']"
            :actions="['add', 'remove']"
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
            <div class="section-head bottom-line">
              <h3>Maturitní zadání</h3>
              <p>Seznam vašich vytvořených úkolů, s kterými můžete pracovat.</p>
              <br>
              <p>Ročník: {{ currentMaturita.grade }}</p>
              <p>Konec: {{ moment(currentMaturita.endDate).format("HH:mm DD.MM. YYYY") }}</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat zadání" />
          </div>

          <MaturitaTasksTable class="datatable" :tasks="allTasks" :loading="tasksPending" :extra-columns="[
              { title: 'Student', field: 'userData' },
              { title: 'Oponent', field: 'objector' }
          ]">
            <template #userData="data">
              <div class="profile">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + data.value.userData.profilePicture" alt="profile-photo" draggable="false"/>

                <p class="account-name">
                  {{ data.value.userData.name }} {{ data.value.userData.surname }}
                </p>
              </div>
            </template>

            <template #objector="data">
              <div class="profile" v-if="data.value.objector && data.value.objector.id">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + data.value.objector.profilePicture" alt="profile-photo" draggable="false"/>

                <p class="account-name">
                  {{ data.value.objector.name }} {{ data.value.objector.surname }}
                </p>
              </div>

              <div v-else>
                Neurčeno
              </div>
            </template>

            <template #actions="data">
              <div class="actions">
                <button type="button" class="default" @click="openChat(data.value.id, data.value.idTeam)">Chat</button>
                <button type="button" class="default" @click="editTask(data.value.id)">Upravit</button>
                <button type="button" class="primary" @click="openTask(data.value.id, data.value.idTeam)">Otevřít</button>
              </div>
            </template>
          </MaturitaTasksTable>

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

      &:hover {
        background: var(--btn-2-hover-background);
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

    .datatable {
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
    }

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