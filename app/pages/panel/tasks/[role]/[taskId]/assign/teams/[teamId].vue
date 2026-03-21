<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Navigation from "~/components/ui/Navigation.vue";
import {computed, ref, useTemplateRef, watchEffect} from "vue";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import ActionFooter from "~/components/manage/Footer.vue";
import EditClass from "~/components/manage/Class.vue";
import type {AccountData} from "~/types/account";
import Pagination from "~/components/ui/Pagination.vue";
import UsersTable from "~/components/tables/Users.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import Input from "~/components/ui/Input.vue";
import type {TaskTeam} from "~/types/team";
import ActionBar from "~/components/ui/ActionBar.vue";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";
import { useI18n } from "#imports";

const route = useRoute();
const teamId = route.params.teamId as string;
const role = route.params.role as string;
const taskId = route.params.taskId as string;

const { t } = useI18n();

useHead({
  title: computed(() => t('pages.tasks.assignTeamEdit.title', { taskId })),
  meta: [{ name: "description", content: computed(() => t('pages.tasks.assignTeamEdit.description')) }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const amountForUsersPaging: number = 5;
const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);
const usersDatatable = useTemplateRef<InstanceType<typeof UsersTable>>("usersDatatable");
const submitLoading = ref<boolean>(false);
const selectedClass = ref<number | undefined>(undefined);
const selectedUsers = ref<number[]>([]);
const currentUsersPage = ref<number>(1);
const teamTaskData = ref<TaskTeam | undefined>(undefined);
const users = ref<AccountData[] | undefined>(undefined);
const usersCount = ref<number>(0);
const searchUsersInput = ref<string>("");
const newTeamNameInput = ref<string | null>(null);
const newTeamNameInputError = ref<string | null>(null);
const requestUrls = computed<string>(() => {
  return selectedClass.value ? "/api/user_class/get/users" : "/api/user/get/noClass"
});
const numberOfUsersPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForUsersPaging);
});

const resetSelection = (): void => {
  selectedUsers.value = teamTaskData.value?.users ? [...teamTaskData.value.users] : [];
  if (usersDatatable.value) usersDatatable.value.clearSelection();
};

const isEqual = (array1: number[], array2: number[]): boolean => {
  if (array1.length !== array2.length) return false;

  return array1.every((element: number, index: number) => {
    if (!array2[index]) return false;

    return element === array2[index];
  });
};

const checkForErrors = (): void => {
  if (newTeamNameInput.value && newTeamNameInput.value.length > 255) {
    newTeamNameInputError.value = t('tasks.assign.teamEdit.nameError');
    return;
  }

  newTeamNameInputError.value = null;
};

const resetInputs = (): void => {
  resetSelection();

  newTeamNameInput.value = teamTaskData.value ? teamTaskData.value.name : null;
};

const updateTeamData = async (): Promise<void> => {
  await updateTeamName();
  await assignToTeam();

  await teamRefresh();
  resetSelection();
};

const updateTeamName = async (): Promise<void> => {
  if (newTeamNameInputError.value || teamTaskData.value?.name === newTeamNameInput.value) return;

  submitLoading.value = true;

  await $fetch("/api/team/update", {
    method: "put",
    body: {
      idTask: taskId,
      idTeam: teamId,
      name: newTeamNameInput.value || "",
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode = response._data?.resCode?.toString();

      switch (resCode) {
        case "32010":
        case "32030":
        case "32040":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.invalidTaskId') });
          break;

        case "32020":
        case "32050":
        case "32060":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.invalidTeamId') });
          break;

        case "32070":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.taskNotFound') });
          break;

        case "32080":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.teamNotFound') });
          break;

        case "32090":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.invalidStatus') });
          break;

        case "32100":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.pointsNotNumber') });
          break;

        case "32110":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.pointsInvalid') });
          break;

        case "32120":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.pointsTooHigh') });
          break;

        case "32130":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.commentTooLong') });
          break;

        case "32140":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.teamNameTooLong') });
          break;

        case "32151":
          alertsStore.addAlert({ type: "success", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.success') });
          teamRefresh();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.unknown') });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.updateTeam.title'), message: t('tasks.assign.alerts.updateTeam.serverError') });
    },
  }).finally(() => {
    submitLoading.value = false;
  });
};

const assignToTeam = async (): Promise<void> => {
  if (isEqual(selectedUsers.value, teamTaskData.value?.users || [])) return;

  submitLoading.value = true;

  await $fetch("/api/user_team/change", {
    method: "put",
    body: {
      idTask: taskId,
      idTeam: teamId,
      idUser: selectedUsers.value,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode = response._data?.resCode?.toString();

      switch (resCode) {
        case "43010":
        case "43030":
        case "43040":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.invalidTaskId') });
          break;

        case "43020":
        case "43050":
        case "43060":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.invalidTeamId') });
          break;

        case "43070":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.taskNotFound') });
          break;

        case "43080":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.teamNotFound') });
          break;

        case "43090":
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.maxUsers') });
          break;

        case "43101":
          if (response._data.data?.differentTeam?.length > 0)
          alertsStore.addAlert({ type: "warning", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.differentTeam', { count: response._data.data.differentTeam.length }) });

          if (response._data.data?.badIds?.length > 0)
          alertsStore.addAlert({ type: "warning", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.badIds', { count: response._data.data.badIds.length }) });

          alertsStore.addAlert({ type: "success", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.success') });

          teamRefresh();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.unknown') });
          break;
      }

    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('tasks.assign.alerts.addToTeam.title'), message: t('tasks.assign.alerts.addToTeam.serverError') });
    },
  }).finally(() => {
    submitLoading.value = false;
  });
};

const onClassUpdate = (payload: { classes: number[] }): void => {
  selectedClass.value = payload.classes[0] || undefined;
};

const onUsersSearchInputChange = (input: string): void => {
  currentUsersPage.value = 1;

  searchUsersInput.value = input;
};

const onUsersRowClicked = (user: AccountData): void => {
  if (!selectedUsers.value.includes(user.id)) {
    selectedUsers.value.push(user.id);
  } else {
    selectedUsers.value = selectedUsers.value.filter((id: number) => id !== user.id);
  }
};

const { data: teamData, error: teamError, refresh: teamRefresh } = useFetch("/api/team/get/info", {
  query: {
    idTask: taskId,
    idTeam: teamId,
    guarantor: accountData.value.id,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

const { data: usersData, error: usersError, pending: usersPending } = useFetch(requestUrls, {
  query: {
    amountForPaging: amountForUsersPaging,
    pageNumber: currentUsersPage,
    searchQuery: searchUsersInput,
    idClass: selectedClass,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true,
});

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    users.value = undefined;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
}, { immediate: true });

watch([teamData, teamError], (): void => {
  if (teamError.value) {
    teamTaskData.value = undefined;
    return;
  }

  if (!teamData.value) return;

  teamTaskData.value = {
    ...teamData.value.data.team,
    users: teamData.value.data.users,
  }
}, { immediate: true });

watch(() => teamTaskData.value, (newVal: TaskTeam | undefined): void => {
  if (!newVal) return;

  newTeamNameInput.value = newVal.name;
  selectedUsers.value = [...newVal.users || []];
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !users.value && !usersError.value || !teamTaskData.value && !teamError.value);
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
            { label: t('tasks.assign.nav.title'), to: `/panel/tasks/${role}/${taskId}/assign` },
            { label: t('tasks.assign.nav.teams'), to: `/panel/tasks/${role}/${taskId}/assign/teams` },
            { label: t('tasks.assign.teamEdit.breadcrumb', { teamId }), to: `/panel/tasks/${role}/${taskId}/assign/teams/${teamId}`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <ActionBar
        class="action-bar"
        :description="t('tasks.assign.teamEdit.actionBarDescription')"
        :actions="['add', 'remove']"
        :active="1"
        :texts="[t('tasks.assign.teamEdit.actionBarAdd')]"
        :navigate-to="[`/panel/tasks/${role}/${taskId}/assign/teams`]"
      />

      <div id="task-assign" v-if="teamTaskData">
        <Navigation class="page-navigation" :title="t('tasks.assign.nav.title')" :active-link-id="2" :links="[
          { name: t('tasks.assign.nav.classes'), path: `/panel/tasks/${role}/${taskId}/assign` },
          { name: t('tasks.assign.nav.individuals'), path: `/panel/tasks/${role}/${taskId}/assign/individuals` },
          { name: t('tasks.assign.nav.teams'), path: `/panel/tasks/${role}/${taskId}/assign/teams` },
        ]" />

        <div class="content">
          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('tasks.assign.teamEdit.heading', { name: teamTaskData.name || t('tasks.assign.teamEdit.undetermined') }) }}</h3>
              <p>{{ t('tasks.assign.teamEdit.teamIdLabel') }} {{ teamTaskData.idTeam }}</p>
              <p>{{ t('tasks.assign.teamEdit.taskIdLabel') }} {{ teamTaskData.idTask }}</p>
              <p>{{ t('tasks.assign.teamEdit.membersLabel') }} {{ (teamTaskData.users || []).length }}</p>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('tasks.assign.teamEdit.nameSection') }} <span class="update" v-if="teamTaskData.name ? teamTaskData.name !== newTeamNameInput : newTeamNameInput">{{ t('import.updated') }}</span></h3>
              <p>{{ t('tasks.assign.teamEdit.nameDescription') }}</p>
            </div>

            <div class="content">
              <label for="team-name">{{ t('tasks.assign.teamEdit.nameLabel') }}</label>
              <Input type="text" id="team-name" :placeholder="t('tasks.assign.teamEdit.namePlaceholder')" v-model.trim="newTeamNameInput" @update:model-value="checkForErrors" />

              <p class="input-error" v-if="newTeamNameInputError">{{ newTeamNameInputError }}</p>
            </div>
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('tasks.assign.teamEdit.filterHeading') }}</h3>
              <p>{{ t('tasks.assign.teamEdit.filterDescription') }}</p>
            </div>

            <EditClass ref="editClass" :multiple="false" :old-class-ids="selectedClass ? [selectedClass] : []" @update="onClassUpdate" />
          </div>

          <div class="page-section bottom-line">
            <div class="line">
              <div class="section-head users">
                <h3>{{ t('tasks.assign.teamEdit.selectedStudents', { count: selectedUsers.length }) }} <span class="update" v-if="selectedUsers.length > 0 && !isEqual((teamTaskData?.users || []), selectedUsers)">{{ t('import.updated') }}</span></h3>
              </div>

              <SearchInput @change="onUsersSearchInputChange" :placeholder="t('tasks.assign.teamEdit.searchPlaceholder')" />
            </div>

            <UsersTable ref="usersDatatable" @row-clicked="onUsersRowClicked" :has-checkbox="true" :selected-ids="selectedUsers"  :users="users || []" :loading="usersPending" />

            <Pagination
                class="users-navigation"
                :number-of-pages="numberOfUsersPages"
                v-model="currentUsersPage"
            />
          </div>

          <div class="page-section">
            <ActionFooter :submit-function="updateTeamData" :reset-function="resetInputs" :is-loading="submitLoading" />
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

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

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
    }

    .classes {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 30px;

      .class {
        display: flex;
        flex: 1;
        cursor: pointer;
        min-width: 200px;
        text-decoration: none;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 60px 30px;
        transition: 0.2s;
        border-radius: var(--normal-border-radius);

        span {
          font-weight: 600;
          font-size: 16px;
          color: var(--title-color);
          text-transform: uppercase;

          .name {
            text-transform: none;
          }
        }

        &:hover,
        &.active {
          background: var(--card-1-hover-background);
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