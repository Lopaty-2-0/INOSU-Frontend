<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import EditTaskFile from "~/components/manage/TaskFile.vue";
import EditDateTime from "~/components/manage/DateTime.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, computed, watchEffect, useTemplateRef, watch} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import { useAlertsStore } from "~/stores/alerts";
import {useAccountStore} from "~/stores/account";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";
import {storeToRefs} from "pinia";
import {navigateTo, useFetch} from "nuxt/app";
import type { TaskData } from "~/types/tasks";
import {useLoadingStore} from "~/stores/loading";
import InputMenu, {type InputMenuItem} from "~/components/ui/InputMenu.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import UsersTable from "~/components/tables/Users.vue";
import Pagination from "~/components/ui/Pagination.vue";
import type {MaturitaTaskData, TopicData} from "~/types/maturita";
import type {AccountData} from "~/types/account";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: "Panel | Maturitní zadání - " + taskId + " - Úpravení",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);
const usersDatatable = useTemplateRef<InstanceType<typeof UsersTable>>("usersDatatable");
const amountForUsersPaging: number = 5;
const editName = ref<InstanceType<typeof EditName> | null>(null);
const editTaskFile = ref<InstanceType<typeof EditTaskFile> | null>(null);
const users = ref<AccountData[] | undefined>(undefined);
const usersCount = ref<number>(0);
const currentUsersPage = ref<number>(1);
const searchUsersInput = ref<string>("");
const loading = ref<boolean>(false);
const oldData = ref<{ name: string, taskFile: string, loaded: boolean, objector: AccountData | null }>({
  name: "",
  taskFile: "",
  objector: null,
  loaded: false
});
const newData = ref<{ name: string | undefined, taskFile: File | undefined, objector: number[] | undefined }>({
  name: undefined,
  taskFile: undefined,
  objector: undefined,
});
const numberOfUsersPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForUsersPaging);
});

const onUsersSearchInputChange = (input: string): void => {
  currentUsersPage.value = 1;

  searchUsersInput.value = input;
};

const onUsersRowClicked = (user: AccountData): void => {
  if (newData.value.objector?.[0] === user.id) {
    newData.value.objector = undefined;
  } else {
    newData.value.objector = [user.id];
  }
  if (usersDatatable.value) usersDatatable.value.updateSelection();
};

const onNameUpdate = (name: string): void => {
  newData.value.name = name;
};

const onTaskFileUpdate = (taskFile: File | undefined): void => {
  newData.value.taskFile = taskFile;
};

const resetUserData = (): void => {
  newData.value = {
    name: undefined,
    taskFile: undefined,
    objector: oldData.value.objector ? [oldData.value.objector.id] : undefined,
  };

  if (editName.value) editName.value.reset();
  if (editTaskFile.value) editTaskFile.value.reset();
};

const updateTask = async (): Promise<void> => {
  loading.value = true;

  const formData = new FormData();
  formData.append("id", taskId);
  if (newData.value.name) formData.append("name", newData.value.name || "");
  if (newData.value.taskFile) formData.append("task", newData.value.taskFile);
  if (newData.value.objector?.[0]) formData.append("objector", newData.value.objector[0].toString());

  await $fetch("/api/task/update", {
    method: "put",
    body: formData,
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "74010":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Tato role nemůže upravovat úkol." });
          break;

        case "74020":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Nebyl zadán ID úkolu." });
          break;

        case "74030":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "ID úkolu není číslo." });
          break;

        case "74040":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "ID úkolu není platné." });
          break;

        case "74050":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Úkol nenalezen nebo k němu nemáte oprávnění." });
          break;

        case "74060":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Název úkolu je příliš dlouhý." });
          break;

        case "74070":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Špatný formát souboru nebo příliš dlouhý název." });
          break;

        case "74080":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Datum ukončení není číslo nebo je příliš daleko." });
          break;

        case "74090":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Datum ukončení je před datem začátku." });
          break;

        case "74100":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Uzávěrka je před datem začátku." });
          break;

        case "74110":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Uzávěrka je před datem ukončení." });
          break;

        case "74120":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Uzávěrka není platná." });
          break;

        case "74130":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Body nejsou ve správném formátu." });
          break;

        case "74140":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Počet bodů není platný." });
          break;

        case "74150":
        case "74160":
        case "74170":
        case "74180":
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Oponent je neplatný nebo nemá oprávnění." });
          break;

        case "74191":
          alertsStore.addAlert({ type: "success", title: "Úprava maturitního zadání", message: "Maturitní zadání bylo úspěšně upraveno." });

          await refreshTask();
          resetUserData();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Úprava maturitního zadání", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    loading.value = false;
  });
};

const { data: taskData, error: taskError, refresh: refreshTask } = useFetch("/api/task/get/id", {
  query: {
    id: taskId,
    guarantor: accountData.value.id,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true,
});

const { data: usersData, error: usersError, pending: usersPending } = useFetch("/api/evaluator/get/current", {
  query: {
    amountForPaging: amountForUsersPaging,
    pageNumber: currentUsersPage,
    searchQuery: searchUsersInput,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

watch([taskError, taskData], async (): Promise<void> => {
  if (taskError.value) {
    navigateTo(`/panel/maturita/tasks/${role}`);
    return;
  }

  if (!taskData.value) return;

  const task: MaturitaTaskData = taskData.value.data.task;

  oldData.value.name = task.name;
  oldData.value.taskFile = task.task;
  oldData.value.objector = task.objector;
  newData.value.objector = [task.objector.id];
  oldData.value.loaded = true;
}, { immediate: true });

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    users.value = undefined;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.evaluators;
  usersCount.value = usersData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !oldData.value.loaded || !users.value && !usersError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Maturity', to: `/panel/maturita/${role}/tasks`, icon: 'material-symbols:folder-copy-rounded' },
            { label: 'Zadání', to: `/panel/maturita/${role}/tasks` },
            { label: `Zadání ID: ${taskId}`, to: `/panel/maturita/${role}/tasks/${taskId}/edit` },
            { label: 'Úpravení', to: `/panel/maturita/${role}/tasks/${taskId}/edit`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="oldData.loaded && users">
      <div id="maturita-tasks">
        <div class="content">
          <div class="line page-section">
            <EditName ref="editName" :old-name="oldData.name" @update="onNameUpdate">
              <div class="section-head">
                <h3>Název <span class="update" v-show="newData.name">(aktualizováno)</span></h3>
                <p>Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.</p>
              </div>
            </EditName>
          </div>

          <div class="line page-section">
            <EditTaskFile ref="editTaskFile" @update="onTaskFileUpdate" :old-check="oldData.taskFile">
              <div class="section-head">
                <h3>Zadání <span class="update" v-show="newData.taskFile">(aktualizováno)</span></h3>
                <p>Vyberte soubor se zadáním úkolu, který budou studenti stahovat a podle něj úkol plnit. Povolené formáty: PDF, DOCX, ODT, HTML nebo ZIP.</p>
              </div>
            </EditTaskFile>
          </div>

          <div class="page-section">
            <div class="line">
              <div class="section-head users">
                <h3>Oponent <span class="update" v-show="newData.objector?.[0] && newData.objector?.[0] !== oldData.objector?.id">(aktualizováno)</span></h3>
              </div>

              <SearchInput @change="onUsersSearchInputChange" placeholder="Hledat uživatele" />
            </div>

            <UsersTable ref="usersDatatable" @row-clicked="onUsersRowClicked" :has-checkbox="true" :selected-ids="newData.objector" :users="users || []" :loading="usersPending" />

            <Pagination
                class="users-navigation"
                :number-of-pages="numberOfUsersPages"
                v-model="currentUsersPage"
            />
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="updateTask"></EditFormFooter>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#maturita-tasks {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
      display: flex;
      flex-direction: column;
      gap: 30px;

      .line {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 35px;
        flex-wrap: wrap;

        ::v-deep(.section) {
          flex: 1;
        }
      }
    }

    .section-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;

      .input-error {
        font-size: 16px;
        color: rgba(var(--error-color), 1);
      }

      label {
        color: var(--mini-title-color);
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }

      input {
        border-radius: var(--normal-border-radius);
        font-size: 16px;
        outline: none;
        padding: 15px;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        min-width: 150px;
        background: var(--input-background);
        color: var(--input-color);

        &:focus {
          border-color: rgba(var(--main-color), 1);
        }

        &.error {
          border-color: rgba(var(--error-color), 1);
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

    .password-rules {
      display: flex;
      flex-direction: column;
      gap: 10px;

      h4 {
        font-weight: 600;
        font-size: 16px;
        color: var(--title-color);
        margin-top: 10px;
      }

      ul {
        list-style: none;

        li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: rgba(var(--description-color), 1);
          margin-bottom: 10px;

          .icon {
            color: rgba(var(--main-color), 1);
            line-height: 0;
          }
        }

        p {
          display: flex;
          align-items: center;
          gap: 5px;

          .icon {
            padding-left: 5px;
            color: rgba(var(--success-color), 1);
          }
        }
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