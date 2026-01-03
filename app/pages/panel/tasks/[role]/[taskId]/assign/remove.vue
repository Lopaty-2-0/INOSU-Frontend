<script setup lang="ts">
import moment from "moment";
import {computed, useTemplateRef, watchEffect} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import {useLoadingStore} from "~/stores/loading";
import {useAlertsStore} from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import type {TaskData, Task_Team_Solo_Table} from "~/types/tasks";
import SearchInput from "~/components/ui/SearchInput.vue";
import UsersTable from "~/components/tables/Users.vue";
import TaskTeamsTable from "~/components/tables/TaskTeams.vue";
import Pagination from "~/components/ui/Pagination.vue";
import type {AccountData} from "~/types/account";
import type {TaskTeam} from "~/types/team";
import {navigateTo} from "nuxt/app";
import ActionBar from "~/components/ui/ActionBar.vue";
import Loading from "~/components/ui/Loading.vue";
import SpecializationsTable from "~/components/tables/Specializations.vue";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: "Panel | Úkol - " + taskId + " - Odstranění přiřazení",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const alertsStore = useAlertsStore();
const task = ref<TaskData | undefined>(undefined);
const usersTeam = ref<Task_Team_Solo_Table[] | undefined>(undefined);
const userSearchInput = ref<string>("");
const currentUsersPage = ref<number>(1);
const amountOfUsersForPaging: number = 5;
const users = ref<AccountData[] | undefined>(undefined);
const usersCount = ref<number>(0);
const numberOfUsersPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountOfUsersForPaging);
});

const teamSearchInput = ref<string>("");
const currentTeamsPage = ref<number>(1);
const amountOfTeamsForPaging: number = 5;
const teams = ref<TaskTeam[] | undefined>(undefined);
const teamsCount = ref<number>(0);
const numberOfTeamsPages = computed<number>((): number => {
  return Math.ceil(teamsCount.value / amountOfTeamsForPaging);
});

const usersDatatable = useTemplateRef<InstanceType<typeof UsersTable>>("usersDatatable");
const teamsDatatable = useTemplateRef<InstanceType<typeof TaskTeamsTable>>("teamsDatatable");
const selectedTeams = ref<number[]>([]);
const selectedUsers = ref<number[]>([]);
const loading = ref<boolean>(false);

const resetSelectedTeams = (): void => {
  selectedTeams.value = [];
  selectedUsers.value = [];

  usersDatatable.value?.clearSelection();
  teamsDatatable.value?.clearSelection();
};

const onUsersRowClicked = (user: AccountData): void => {
  if (!usersDatatable.value) return;

  const teamId: number | undefined = usersTeam.value?.filter((soloTeam: Task_Team_Solo_Table) => soloTeam.userData.id === user.id)?.[0]?.idTeam || undefined;

  if (!teamId) return;

  if (!selectedTeams.value.includes(teamId)) {
    selectedTeams.value.push(teamId);
    selectedUsers.value.push(user.id);
  } else {
    selectedTeams.value = selectedTeams.value.filter((id: number) => id !== teamId);
    selectedUsers.value = selectedUsers.value.filter((id: number) => id !== user.id);
  }
};

const onTeamsRowClicked = (team: TaskTeam): void => {
  if (!teamsDatatable.value) return;

  if (!selectedTeams.value.includes(team.idTeam)) {
    selectedTeams.value.push(team.idTeam);
  } else {
    selectedTeams.value = selectedTeams.value.filter((id: number) => id !== team.idTeam);
  }
};

const removeTeams = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/team/delete", {
    method: "delete",
    body: {
      idTask: taskId,
      idTeam: selectedTeams.value,
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "31010":
          alertsStore.addAlert({ type: "error", title: "Odstranění přiřazení", message: "Chybí ID daného úkolu." });
          break;
        case "31020":
          alertsStore.addAlert({ type: "error", title: "Odstranění přiřazení", message: "Chybí ID vybraných přiřazení." });
          break;
        case "31030":
        case "31040":
          alertsStore.addAlert({ type: "error", title: "Odstranění přiřazení", message: "ID úkolu je neplatné." });
          break;
        case "31050":
          alertsStore.addAlert({ type: "error", title: "Odstranění přiřazení", message: "Zadaný úkol neexistuje." });
          break;
        case "31060":
          alertsStore.addAlert({ type: "error", title: "Odstranění přiřazení", message: "Uživatel není garantem úkolu." });
          break;
        case "31071":
          const goodIds: number[] = response._data.data.goodIds;
          alertsStore.addAlert({ type: "success", title: "Odstranění přiřazení", message: `Úkol byl odstraněn u ${goodIds.length} přiřazení.` });

          usersRefresh();
          teamsRefresh();
          resetSelectedTeams();
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění přiřazení", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění přiřazení", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    loading.value = false;
  });
};

const onUsersSearchInputChange = (input: string): void => {
  userSearchInput.value = input;
};

const onTeamSearchInputChange = (input: string): void => {
  teamSearchInput.value = input;
};

const { data: usersData, error: usersError, pending: usersPending, refresh: usersRefresh } = await useFetch("/api/team/get/users", {
  query: {
    idTask: taskId,
    amountForPaging: amountOfUsersForPaging,
    pageNumber: currentUsersPage,
    searchQuery: userSearchInput,
  },
  lazy: true,
  method: "get",
  server: true,
  credentials: "include",
});

const { data: teamsData, error: teamsError, pending: teamsPending, refresh: teamsRefresh } = useFetch("/api/team/get/teams", {
  query: {
    idTask: taskId,
    amountForPaging: amountOfTeamsForPaging,
    pageNumber: currentTeamsPage,
    searchQuery: teamSearchInput,
  },
  lazy: true,
  method: "get",
  server: true,
  credentials: "include",
});

const { data: taskData, error: taskError } = await useFetch("/api/task/get/id", {
  query: {
    idTask: taskId,
  },
  method: "get",
  server: true,
  credentials: "include",
});

watchEffect((): void => {
  if (taskError.value || !taskData.value) {
    navigateTo(`/panel/tasks/${role}`);
    return;
  }

  if (usersError.value || !usersData.value) {
    users.value = [];
    usersCount.value = 0;
  }

  if (teamsError.value || !teamsData.value) {
    teams.value = [];
    teamsCount.value = 0;
  }

  if (!usersData.value || !teamsData.value) return;


  task.value = taskData.value.data.task;
  users.value = usersData.value.data.users.map((data: any) => data.userData);
  usersTeam.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
  teams.value = teamsData.value.data.teams;
  teamsCount.value = teamsData.value.data.count;
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value);
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
            { label: `Odstranit přiřazené`, to: `/panel/tasks/${role}/${taskId}/assign/remove`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="task">
      <div id="task">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa úkolu"
            :actions="['edit', 'remove']"
            :active="1"
            :texts="['Přiřadit', 'Odstranit přiřazené']"
            :icons="[
              'material-symbols:edit-rounded',
              'material-symbols:delete-rounded',
            ]"
                :navigate-to="[
              `/panel/tasks/${role}/${taskId}/assign`,
            ]"
          />

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant: {{ task.guarantor.name }} {{ task.guarantor.surname }}</p>
              <p>Začátek: {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>Konec: {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">Uzávěrka: {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p>Max bodů: {{ task.points ?? "neurčeno" }}</p>
              <p>
                Zadání:
                <a :href="`/api/file/task/${task.id}/${task.task}`" class="link" download target="_blank">
                  {{ task.task }}
                </a>
              </p>
            </div>
          </div>

          <div class="section-head">
            <h3>Vybrané přiřazení: {{ selectedTeams.length }}</h3>
            <p>Vyberte třídy, které chcete trvale odstranit ze systému.</p>
          </div>

          <div class="buttons">
            <button class="remove" @click="removeTeams">
              Odstranit
              <Loading
                v-show="loading"
                size="5px"
                color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="resetSelectedTeams">
              Zrušit vše
            </button>
          </div>

          <div class="page-section" v-if="users">
            <div class="section-head">
              <h3>Žáci</h3>

              <SearchInput @change="onUsersSearchInputChange" placeholder="Hledat uživatele" />
            </div>

            <UsersTable ref="usersDatatable" @row-clicked="onUsersRowClicked" :has-checkbox="true" :selected-ids="selectedUsers" :users="users" :loading="usersPending" :extra-columns="[
              { field: 'points', title: 'Počet bodů' }
            ]">
              <template #points="data">
                <span>{{ usersTeam?.filter((soloTeam: Task_Team_Solo_Table) => soloTeam.userData.id === data.value.id)?.[0]?.points ?? "Neurčeno" }}</span>
              </template>
            </UsersTable>

            <Pagination
              class="users-navigation"
              :number-of-pages="numberOfUsersPages"
              v-model="currentUsersPage"
            />
          </div>

          <div class="page-section" v-if="teams">
            <div class="section-head">
              <h3>Týmy</h3>

              <SearchInput @change="onTeamSearchInputChange" placeholder="Hledat týmy" />
            </div>

            <TaskTeamsTable ref="teamsDatatable" @row-clicked="onTeamsRowClicked" :has-checkbox="true" :selected-ids="selectedTeams" :teams="teams" :loading="teamsPending" :extra-columns="[
              { field: 'points', title: 'Počet bodů' }
            ]">
              <template #points="data">
                <span>{{ data.value.points || "Neurčeno" }}</span>
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
#task {
  display: flex;
  flex-direction: column;
  gap: 60px;

  .link {
    color: rgba(var(--main-color), 1);
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: rgba(var(--main-color), 0.8);
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

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .page-section {
      border-bottom: none;
      display: flex;
      flex-direction: column;
      gap: 30px;

      &.bottom-line {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
      }

      &:not(.bottom-line) .section-head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 30px;
        flex-wrap: wrap;
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
</style>