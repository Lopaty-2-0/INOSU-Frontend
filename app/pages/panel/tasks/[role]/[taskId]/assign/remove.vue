<script setup lang="ts">
import moment from "moment";
import {computed, useTemplateRef, watch, watchEffect} from "vue";
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
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";
import { useI18n } from "#imports";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

const { t } = useI18n();

useHead({
  title: computed(() => t('pages.tasks.assignRemove.title', { taskId })),
  meta: [{ name: "description", content: computed(() => t('pages.tasks.assignRemove.description')) }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const alertsStore = useAlertsStore();
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
      guarantor: accountData.value.id,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode: string = response._data.resCode?.toString();
      const badIds: any[] = response._data.data?.badIds || [];

      switch (resCode) {
        case "31010":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.noTaskId') });
          break;

        case "31020":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.noTeamId') });
          break;

        case "31030":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.taskIdNotNumber') });
          break;

        case "31040":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.taskIdInvalid') });
          break;

        case "31050":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.taskNotFound') });
          break;

        case "31071":
          if (badIds.length > 0)
            alertsStore.addAlert({ type: "warning", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.partialFail') });

          alertsStore.addAlert({ type: "success", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.success') });

          usersRefresh();
          teamsRefresh();
          resetSelectedTeams();
          break;

        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.unknown') });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.removeAssignment.title'), message: t('tasks.assign.alerts.removeAssignment.unknown') });
    },
  }).finally(() => {
    loading.value = false;
  });
};

const onUsersSearchInputChange = (input: string): void => {
  userSearchInput.value = input;
};

const onTeamSearchInputChange = (input: string): void => {
  teamSearchInput.value = input;
};

const { data: usersData, error: usersError, pending: usersPending, refresh: usersRefresh } = useFetch("/api/team/get/users", {
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

const { data: taskData, error: taskError } = useFetch("/api/task/get/id", {
  query: {
    id: taskId,
    guarantor: accountData.value.id,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([taskData, taskError], (): void => {
  if (taskError.value) {
    if (taskError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    task.value = undefined;
    return;
  }

  if (!taskData.value) return;

  task.value = taskData.value.data.task;
}, { immediate: true });

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    if (usersError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
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
    if (teamsError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    teams.value = [];
    teamsCount.value = 0;
    return;
  }

  if (!teamsData.value) return;

  teams.value = teamsData.value.data.teams;
  teamsCount.value = teamsData.value.data.count;
}, { immediate: true });

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
            { label: t('sidebar.links.tasks'), to: `/panel/tasks/${role}`, icon: 'material-symbols:folder-copy-rounded' },
            { label: t('tasks.assign.taskIdBreadcrumb', { taskId }), to: `/panel/tasks/${role}/${taskId}` },
            { label: t('tasks.assign.remove.breadcrumb'), to: `/panel/tasks/${role}/${taskId}/assign/remove`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="task" v-if="task">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('tasks.assign.remove.actionBarDescription')"
            :actions="['edit', 'remove']"
            :active="1"
            :texts="[t('tasks.assign.remove.actionBarAssign'), t('tasks.assign.remove.actionBarRemove')]"
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
              <p>{{ t('tasks.assign.taskIdLabel') }} {{ task.id }}</p>
              <p>{{ t('tasks.assign.guarantorLabel') }} {{ task.guarantor.name }} {{ task.guarantor.surname }}</p>
              <p>{{ t('tasks.assign.startLabel') }} {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>{{ t('tasks.assign.endLabel') }} {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">{{ t('tasks.assign.deadlineLabel') }} {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p>{{ t('tasks.assign.maxPointsLabel') }} {{ task.points ?? t('tasks.assign.undetermined') }}</p>
              <p>
                {{ t('tasks.assign.assignmentLabel') }}
                <a :href="task.task ? `/api/file/task/${task.guarantor.id}/${task.id}/${task.task}` : '#'" class="link" download target="_blank">
                  {{ task.task || t('tasks.assign.noAssignment') }}
                </a>
              </p>
            </div>
          </div>

          <div class="section-head">
            <h3>{{ t('tasks.assign.remove.heading', { count: selectedTeams.length }) }}</h3>
            <p>{{ t('tasks.assign.remove.description') }}</p>
          </div>

          <div class="buttons">
            <button class="remove" @click="removeTeams">
              {{ t('tasks.assign.remove.removeBtn') }}
              <Loading
                v-show="loading"
                size="5px"
                color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="resetSelectedTeams">
              {{ t('tasks.assign.remove.cancelBtn') }}
            </button>
          </div>

          <div class="page-section" v-if="users">
            <div class="section-head">
              <h3>{{ t('tasks.assign.remove.studentsHeading') }}</h3>

              <SearchInput @change="onUsersSearchInputChange" :placeholder="t('tasks.assign.remove.userSearchPlaceholder')" />
            </div>

            <UsersTable ref="usersDatatable" @row-clicked="onUsersRowClicked" :has-checkbox="true" :selected-ids="selectedUsers" :users="users" :loading="usersPending" :extra-columns="[
              { field: 'points', title: t('tasks.assign.remove.pointsColumn') }
            ]">
              <template #points="data">
                <span>{{ usersTeam?.filter((soloTeam: Task_Team_Solo_Table) => soloTeam.userData.id === data.value.id)?.[0]?.points ?? t('tasks.assign.remove.undetermined') }}</span>
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
              <h3>{{ t('tasks.assign.remove.teamsHeading') }}</h3>

              <SearchInput @change="onTeamSearchInputChange" :placeholder="t('tasks.assign.remove.teamSearchPlaceholder')" />
            </div>

            <TaskTeamsTable ref="teamsDatatable" @row-clicked="onTeamsRowClicked" :has-checkbox="true" :selected-ids="selectedTeams" :teams="teams" :loading="teamsPending" :extra-columns="[
              { field: 'points', title: t('tasks.assign.remove.pointsColumn') }
            ]">
              <template #points="data">
                <span>{{ data.value.points || t('tasks.assign.remove.undetermined') }}</span>
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