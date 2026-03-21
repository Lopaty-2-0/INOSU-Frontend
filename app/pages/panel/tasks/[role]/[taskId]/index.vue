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
import ActionBar from "~/components/ui/ActionBar.vue";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

const { t } = useI18n();

useHead({
  title: t('pages.tasks.roleTask.title', { taskId }),
  meta: [{ name: "description", content: t('pages.tasks.roleTask.description') }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);
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

const { data: usersData, error: usersError, pending: usersPending } = useFetch("/api/team/get/users", {
  query: {
    idTask: taskId,
    guarantor: accountData.value.id,
    amountForPaging: amountOfUsersForPaging,
    pageNumber: currentUsersPage,
    searchQuery: userSearchInput,
  },
  lazy: true,
  method: "get",
  server: false,
  credentials: "include",
});

const { data: teamsData, error: teamsError, pending: teamsPending } = useFetch("/api/team/get/teams", {
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

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    users.value = [];
    usersCount.value = 0;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users.map((data: any) => data.userData);
  usersTeam.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
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

watch([taskData, taskError], (): void => {
  if (taskError.value) {
    navigateTo(`/panel/tasks/${role}`);
    return;
  }

  if (!taskData.value) return;

  task.value = taskData.value.data.task;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value && !taskError.value || !teams.value && !teamsError.value || !users.value && !usersError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.tasks'), to: `/panel/tasks/${role}`, icon: 'material-symbols:folder-copy-rounded' },
            { label: `${t('tasks.role.task.team.taskIdLabel')} ${taskId}`, to: `/panel/tasks/${role}/${taskId}`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="task" v-if="task && users && teams">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('tasks.role.task.index.heading')"
            :actions="['edit', 'remove']"
            :texts="[t('tasks.role.task.index.assignBtn'), t('actionBar.remove')]"
            :icons="[
              'material-symbols:edit-rounded',
              'material-symbols:delete-rounded',
            ]"
                :navigate-to="[
              `/panel/tasks/${role}/${taskId}/assign`,
              `/panel/tasks/${role}/${taskId}/assign/remove`,
            ]"
          />

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>{{ t('tasks.role.task.team.taskIdLabel') }} {{ task.id }}</p>
              <p>{{ t('tasks.role.task.team.guarantorLabel') }} {{ task.guarantor.name }} {{ task.guarantor.surname }}</p>
              <p>{{ t('tasks.role.task.team.startLabel') }} {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>{{ t('tasks.role.task.team.endLabel') }} {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">{{ t('tasks.role.task.team.deadlineLabel') }} {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p>{{ t('tasks.role.task.team.maxPointsLabel') }} {{ task.points ?? t('chat.unknown') }}</p>
              <p>
                {{ t('tasks.role.task.team.assignmentLabel') }}
                <a :href="task.task ? `/api/file/task/${task.guarantor.id}/${task.id}/${task.task}` : '#'" class="link" download target="_blank">
                  {{ task.task || t('home.tasks.noAssignment') }}
                </a>
              </p>
            </div>
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('tasks.role.task.team.studentsHeading') }}</h3>

              <SearchInput @change="onUsersSearchInputChange" :placeholder="t('tasks.role.task.index.searchPlaceholder')" />
            </div>

            <UsersTable :users="users" :loading="usersPending" :extra-columns="[
              { field: 'points', title: t('tables.columns.maxPoints') }
            ]">
              <template #points="data">
                <span>{{ usersTeam?.filter((soloTeam: Task_Team_Solo_Table) => soloTeam.userData.id === data.value.id)?.[0]?.points || t('tasks.role.task.team.undetermined') }}</span>
              </template>

              <template #actions="data">
                <div class="actions">
                  <button type="button" class="primary" @click="openUserTask(data.value.id)">{{ t('tasks.role.task.index.openBtn') }}</button>
                </div>
              </template>
            </UsersTable>

            <Pagination
                class="users-navigation"
                :number-of-pages="numberOfUsersPages"
                v-model="currentUsersPage"
            />
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('tasks.role.task.team.teamsHeading') }}</h3>

              <SearchInput @change="onTeamSearchInputChange" :placeholder="t('tasks.role.task.index.teamsSearchPlaceholder')" />
            </div>

            <TaskTeamsTable v-if="teams" :teams="teams" :loading="teamsPending" :extra-columns="[
              { field: 'points', title: t('tables.columns.maxPoints') }
            ]">
              <template #points="data">
                <span>{{ data.value.points || t('tasks.role.task.team.undetermined') }}</span>
              </template>

              <template #actions="data">
                <div class="actions">
                  <button type="button" class="primary" @click="openTeamTask(data.value.idTeam)">{{ t('tasks.role.task.index.openBtn') }}</button>
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