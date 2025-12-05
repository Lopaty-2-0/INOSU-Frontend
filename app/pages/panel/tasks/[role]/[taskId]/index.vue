<script setup lang="ts">
import moment from "moment";
import {computed, watchEffect} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import type {TaskData, Task_Team_Solo_Table} from "~/types/tasks";
import SearchInput from "~/components/ui/SearchInput.vue";
import UsersTable from "~/components/tables/Users.vue";
import TaskTeamsTable from "~/components/tables/TaskTeams.vue";
import Pagination from "~/components/ui/Pagination.vue";
import type {AccountData} from "~/types/account";
import type {TaskTeam} from "~/types/team";
import {navigateTo} from "nuxt/app";
import TasksTable from "~/components/tables/Tasks.vue";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: "Panel | Úkoly - " + taskId,
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

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

const onUsersSearchInputChange = (input: string): void => {
  userSearchInput.value = input;
};

const onTeamSearchInputChange = (input: string): void => {
  teamSearchInput.value = input;
};

const openUserTask = async (id: number): Promise<void> => {
  if (!id) return;

  const teamId: number | undefined = usersData.value.data.users.find((data: Task_Team_Solo_Table) => data.userData.id === id)?.idTeam;

  if (!teamId) return;

  await navigateTo(`/panel/tasks/${role}/${taskId}/${teamId}`);
};

const openTeamTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/${role}/${taskId}/${id}`);
};

const { data: usersData, error: usersError, pending: usersPending } = await useFetch("/api/team/get/users", {
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

const { data: teamsData, error: teamsError, pending: teamsPending } = await useFetch("/api/team/get/teams", {
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
            { label: `Úkol ID: ${taskId}`, to: `/panel/tasks/${role}/${taskId}`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="task">
      <div id="task">
        <div class="content">
          <div class="page-section head">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant ID: {{ task.guarantor.id }}</p>
              <p>Začátek: {{ moment(task.startDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Konec: {{ moment(task.endDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p v-if="task.deadline">Uzávěrka: {{ moment(task.deadline).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Max bodů: {{ task.points || "neurčeno" }}</p>
              <p>
                Zadání:
                <a :href="`/api/file/task/${task.id}/${task.task}`" class="link" download target="_blank">
                  {{ task.task }}
                </a>
              </p>
            </div>
          </div>

          <div class="page-section" v-if="users">
            <div class="section-head">
              <h3>Žáci</h3>

              <SearchInput @change="onUsersSearchInputChange" placeholder="Hledat uživatele" />
            </div>

            <UsersTable :users="users" :loading="usersPending" :extra-columns="[
              { field: 'points', title: 'Počet bodů' }
            ]">
              <template #points="data">
                <span>{{ usersTeam?.filter((soloTeam: Task_Team_Solo_Table) => soloTeam.userData.id === data.value.id)?.[0]?.points || "Neurčeno" }}</span>
              </template>

              <template #actions="data">
                <div class="actions">
                  <button type="button" class="primary" @click="openUserTask(data.value.id)">Otevřít</button>
                </div>
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

            <TaskTeamsTable :teams="teams" :loading="teamsPending" :extra-columns="[
              { field: 'points', title: 'Počet bodů' }
            ]">
              <template #points="data">
                <span>{{ data.value.points || "Neurčeno" }}</span>
              </template>

              <template #actions="data">
                <div class="actions">
                  <button type="button" class="primary" @click="openTeamTask(data.value.idTeam)">Otevřít</button>
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

<style lang="scss" scoped>
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
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
      display: flex;
      flex-direction: column;
      gap: 30px;

      &:last-child {
        border-bottom: none;
      }

      &:not(.head) .section-head {
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