<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Navigation from "~/components/ui/Navigation.vue";
import moment from "moment/moment";
import type {TaskData} from "~/types/tasks";
import {computed, ref, useTemplateRef, watch, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import Pagination from "~/components/ui/Pagination.vue";
import TaskTeamsTable from "~/components/tables/TaskTeams.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import type {TaskTeam} from "~/types/team";
import Input from "~/components/ui/Input.vue";
import Loading from "~/components/ui/Loading.vue";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: "Panel | Úkol - " + taskId + " - Přiřazení - Jednotlivci",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const amountOfTeamsForPaging: number = 5;
const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);
const taskTeamsDatatable = useTemplateRef<InstanceType<typeof TaskTeamsTable>>("taskTeamsDatatable");
const task = ref<TaskData | undefined>(undefined);
const createTeamInput = ref<string>("");
const creatingTeamLoading = ref<boolean>(false);
const teamSearchInput = ref<string>("");
const currentTeamsPage = ref<number>(1);
const teams = ref<TaskTeam[] | undefined>(undefined);
const teamsCount = ref<number>(0);
const numberOfTeamsPages = computed<number>((): number => {
  return Math.ceil(teamsCount.value / amountOfTeamsForPaging);
});

const openEditTeamTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/${role}/${taskId}/assign/teams/${id}`);
};

const createTeam = async (): Promise<void> => {
  if ((createTeamInput.value || "").length > 255) {
    alertsStore.addAlert({ type: "warning", title: "Vytvoření týmu", message: "Název týmu je příliš dlouhý (max. 255 znaků)." });
    return;
  }

  creatingTeamLoading.value = true;

  await $fetch("/api/team/add", {
    method: "post",
    body: {
      idTask: taskId,
      name: createTeamInput.value || null,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode: string = response._data.resCode?.toString();

      switch (resCode) {
        case "30081":
          alertsStore.addAlert({ type: "success", title: "Vytvoření týmu", message: "Tým byl úspěšně vytvořen." });
          createTeamInput.value = "";
          teamsRefresh();
          break;

        case "30010":
          alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "ID úkolu nebylo zadáno." });
          break;

        case "30020":
          alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "ID úkolu musí být číslo." });
          break;

        case "30030":
          alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "ID úkolu není platné." });
          break;

        case "30040":
          alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "K tomuto typu úkolu nelze přidat tým." });
          break;

        case "30050":
          alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "Zadaný úkol neexistuje nebo nejste jeho garant." });
          break;

        case "30060":
          alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "Název týmu je příliš dlouhý." });
          break;

        case "30070":
          alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "Tým s tímto názvem již existuje." });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "Nastala neznámá chyba." });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Vytvoření týmu", message: "Nastala neznámá chyba." });
    },
  }).finally(() => {
    creatingTeamLoading.value = false;
  });
};

const onTeamsSearchInputChange = (input: string): void => {
  currentTeamsPage.value = 1;

  teamSearchInput.value = input;
};

const { data: taskData, error: taskError } = useFetch("/api/task/get/id", {
  query: {
    id: taskId,
    guarantor: accountData.value.id,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true,
});

const { data: teamsData, error: teamsError, pending: teamsPending, refresh: teamsRefresh } = useFetch("/api/team/get/teams", {
  query: {
    idTask: taskId,
    guarantor: accountData.value.id,
    amountForPaging: amountOfTeamsForPaging,
    pageNumber: currentTeamsPage,
    searchQuery: teamSearchInput,
  },
  lazy: true,
  method: "get",
  server: false,
  credentials: "include",
});

watch([taskData, taskError], (): void => {
  if (taskError.value) {
    navigateTo(`/panel/tasks/${role}`);
    return;
  }

  if (!taskData.value) return;

  task.value = taskData.value.data.task;
}, { immediate: true });

watch([teamsData, teamsError], (): void => {
  if (teamsError.value) {
    teams.value = [];
    teamsCount.value = 0;
    return;
  }

  if (!teamsData.value) return;

  teams.value = teamsData.value.data.teams;
  teamsCount.value = teamsData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value && !taskError.value || !teamsData.value && !teamsError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Úkoly', to: `/panel/tasks/${role}`, icon: 'material-symbols:folder-copy-rounded' },
            { label: `Úkol ID: ${taskId}`, to: `/panel/tasks/${role}/${taskId}` },
            { label: 'Přiřazení', to: `/panel/tasks/${role}/${taskId}/assign` },
            { label: 'Týmy', to: `/panel/tasks/${role}/${taskId}/assign/teams`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="task-assign">
        <Navigation class="page-navigation" title="Přiřazení" :active-link-id="2" :links="[
          { name: 'Třídy', path: `/panel/tasks/${role}/${taskId}/assign` },
          { name: 'Jednotlivci', path: `/panel/tasks/${role}/${taskId}/assign/individuals` },
          { name: 'Týmy', path: `/panel/tasks/${role}/${taskId}/assign/teams` },
        ]" />

        <div class="content" v-if="task">
          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant: {{ task.guarantor.name }} {{ task.guarantor.surname }}</p>
              <p>Začátek: {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>Konec: {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">Uzávěrka: {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p>Max bodů: {{ task.points || "neurčeno" }}</p>
              <p>
                Zadání:
                <a :href="task.task ? `/api/file/task/${task.guarantor.id}/${task.id}/${task.task}` : '#'" class="link" download target="_blank">
                  {{ task.task || "Žádné zadání" }}
                </a>
              </p>
            </div>
          </div>

          <div class="page-section">
            <div class="line">
              <div class="section-head users">
                <h3>Týmy</h3>
                <p>Vyberte třídy, do kterých bude nový uživatel (student) zařazen. Toto pole je volitelné.</p>
              </div>

              <SearchInput @change="onTeamsSearchInputChange" placeholder="Hledat týmy" />
            </div>

            <div class="create-team">
              <label for="teamName">Název</label>
              <div class="line">
                <Input
                    type="text"
                    id="teamName"
                    name="teamName"
                    placeholder="Zadejte název týmu pro vytvoření (nebo ponechte prázdný)"
                    v-model="createTeamInput"
                />

                <div class="column">
                  <div class="icon-div" @click="createTeam">
                    <Icon class="icon" name="material-symbols:add-rounded" />
                  </div>

                  <Loading v-show="creatingTeamLoading" size="5px" color="var(--btn-1-color)" />
                </div>
              </div>
            </div>

            <TaskTeamsTable ref="taskTeamsDatatable" :teams="teams || []" :loading="teamsPending" :extra-columns="[
              { field: 'points', title: 'Počet bodů' }
            ]">
              <template #points="data">
                <span>{{ data.value.points ?? "Neurčeno" }}</span>
              </template>

              <template #actions="data">
                <div class="actions">
                  <button type="button" class="primary" @click="openEditTeamTask(data.value.idTeam)">Upravit</button>
                </div>
              </template>
            </TaskTeamsTable>

            <Pagination
                class="users-navigation"
                :number-of-pages="numberOfTeamsPages"
                v-model="currentTeamsPage"
            />
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#task-assign {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .page-navigation {
    height: fit-content;
    position: sticky;
    top: 110px;
    min-width: 300px;
    padding: 30px;
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

    .create-team {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;

      label {
        color: var(--mini-title-color);
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }

      .line {
        gap: 10px;
        align-items: flex-start;

        #teamName {
          flex: 1;
        }

        .column {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-direction: column;
          gap: 10px;

          .icon-div {
            padding: 15px;
            border-radius: var(--small-border-radius);
            transition: 0.2s;
            font-size: 18px;
            background: rgba(var(--actionBar-actions-add-background), 1);
            color: var(--actionBar-actions-add-color);
            border: var(--border-width) solid rgba(var(--actionBar-actions-add-border), 1);
            cursor: pointer;
            line-height: 0;

            &:hover {
              background: rgba(var(--actionBar-actions-add-background), 0.8);
            }
          }
        }
      }
    }

    .link {
      color: rgba(var(--main-color), 1);
      text-decoration: none;
      transition: 0.2s;

      &:hover {
        color: rgba(var(--main-color), 0.8);
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

    .page-section {
      border-bottom: none;
      display: flex;
      flex-direction: column;
      gap: 30px;

      &.bottom-line {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
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
  }
}

@media (max-width: 1200px) {
  #task-assign {
    flex-direction: column;
    gap: 30px;

    .page-navigation {
      width: 100%;
      position: relative;
      top: 0;
      min-width: 200px;
    }
  }
}
</style>