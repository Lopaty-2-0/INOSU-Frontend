<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import EditTaskFile from "~/components/manage/TaskFile.vue";
import EditDateTime from "~/components/manage/DateTime.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, computed, useTemplateRef, watch, watchEffect} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {type Alert, useAlertsStore} from "~/stores/alerts";
import {useAccountStore} from "~/stores/account";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";
import UsersTable from "~/components/tables/Users.vue";
import EditClass from "~/components/manage/Class.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import Pagination from "~/components/ui/Pagination.vue";
import Input from "~/components/ui/Input.vue";
import InputMenu, {type InputMenuItem} from "~/components/ui/InputMenu.vue";
import type {AccountData} from "~/types/account";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import type {ClassData} from "~/types/classes";
import type {TopicData} from "~/types/maturita";
import {useUpload} from "~/componsables/useUploader";

const { t } = useI18n();

useHead({
  title: t('pages.maturita.tasksAdd.title'),
  meta: [
    { name: "description", content: t('pages.maturita.tasksAdd.description') }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const alertsStore = useAlertsStore();
const { progress, upload } = useUpload();
const amountForUsersPaging: number = 5;
const amountForTopicsPaging: number = 5;
const loading = ref<boolean>(false);
const editName = ref<InstanceType<typeof EditName> | null>(null);
const editTaskFile = ref<InstanceType<typeof EditTaskFile> | null>(null);
const selectedTopicId = ref<string[]>([]);
const topics = ref<TopicData[] | undefined>(undefined);
const currentTopicsPage = ref<number>(1);
const topicsCount = ref<number>(0);
const searchTopicsInput = ref<string>("");
const selectedClass = ref<number | undefined>(undefined);
const usersDatatable = useTemplateRef<InstanceType<typeof UsersTable>>("usersDatatable");
const users = ref<AccountData[] | undefined>(undefined);
const selectedUserId = ref<number[]>([]);
const usersCount = ref<number>(0);
const currentUsersPage = ref<number>(1);
const searchUsersInput = ref<string>("");
const newData = ref<{ name: string | undefined, taskFile: File | undefined }>({
  name: undefined,
  taskFile: undefined,
});
const numberOfUsersPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForUsersPaging);
});
const numberOfTopicsPages = computed<number>((): number => {
  return Math.ceil(topicsCount.value / amountForTopicsPaging);
});
const oldData = computed<{ name: string, taskFile: string }>(() => ({
  name: "",
  taskFile: "",
}));
const requestUrls = computed<string>(() => {
  return selectedClass.value ? "/api/user_class/get/users" : "/api/user/get/noClass"
});
const dropDownTopics = computed<InputMenuItem[]>(() => {
  return (topics.value || []).map((topicData: TopicData) => ({
    label: topicData.name,
    value: topicData.id.toString()
  }));
});

const onUsersSearchInputChange = (input: string): void => {
  currentUsersPage.value = 1;

  searchUsersInput.value = input;
};

const onTopicsSearchInputChange = (input: string): void => {
  currentTopicsPage.value = 1;

  searchTopicsInput.value = input;
};

const onUsersRowClicked = (user: AccountData): void => {
  if (selectedUserId.value[0] && selectedUserId.value[0] === user.id) {
    selectedUserId.value = [];
  } else {
    selectedUserId.value[0] = user.id;
  }

  if (usersDatatable.value) usersDatatable.value.updateSelection();
};

const onClassUpdate = (payload: { classes: number[] }): void => {
  selectedClass.value = payload.classes[0] || undefined;
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
  };

  selectedTopicId.value = [];
  selectedClass.value = undefined;
  selectedUserId.value = [];

  if (editName.value) editName.value.reset();
  if (editTaskFile.value) editTaskFile.value.reset();
  if (usersDatatable.value) usersDatatable.value.updateSelection();
};

const addMaturitaTask = async (): Promise<void> => {
  if (!newData.value.name || !newData.value.taskFile || !selectedTopicId.value[0] || !selectedUserId.value[0]) {
    alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.fillRequired') });
    return;
  }

  loading.value = true;

  await $fetch("/api/task/add/maturita/guarantor", {
    method: "post",
    body: {
      name: newData.value.name,
      task: newData.value.taskFile.name,
      size: newData.value.taskFile.size,
      idUser: selectedUserId.value[0],
      idTopic: selectedTopicId.value[0],
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const resCode = response?._data?.resCode?.toString();
      const data: any = response?._data?.data;

      switch (resCode) {
        case "F15020":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.fileTooBig') });
          break;
        case "61010":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.noPermission') });
          break;

        case "61020":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.cannotCreate') });
          break;

        case "61030":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.noGuarantor') });
          break;

        case "61040":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.noName') });
          break;

        case "61050":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.noUser') });
          break;

        case "61060":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.noTopic') });
          break;

        case "61070":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.userIdNaN') });
          break;

        case "61080":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.userIdInvalid') });
          break;

        case "61090":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.userNotFound') });
          break;

        case "61100":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.cannotBeGuarantor') });
          break;

        case "61110":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.alreadyAssigned') });
          break;

        case "61120":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.topicIdNaN') });
          break;

        case "61130":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.topicIdInvalid') });
          break;

        case "61140":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.topicNotFound') });
          break;

        case "61150":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.nameTooLong') });
          break;

        case "61160":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.fileNotUploaded') });
          break;

        case "61170":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.fileBadFormat') });
          break;

        case "61180":
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.maxVariants') });
          break;

        case "61191":
          if (data.uploadUrl && newData.value.taskFile) {
            const alert: Alert = {
              title: t('settings.info.alerts.uploadFile.title'),
              message: t('settings.info.alerts.uploadFile.uploading'),
              type: "info",
              infinite: true,
              canClose: false,
              progress: progress
            };

            const alertIndex: number = alertsStore.addAlert(alert);

            upload(newData.value.taskFile, data.uploadUrl).then(async (): Promise<void> => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: t('settings.info.alerts.uploadFile.title'),
                message: t('settings.info.alerts.uploadFile.success'),
                type: "success"
              });

              await $fetch("/api/task/put/task", {
                method: "PUT",
                body: {
                  id: data.task.id,
                  guarantor: data.task.guarantor.id,
                  task: data.task.task,
                },
                credentials: "include",
                ignoreResponseError: true,
                async onResponse({ response }: any) {
                  const resCode: string = response._data.resCode.toString();

                  switch (resCode) {
                    case "84110":
                      alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.fileNotFound') });
                      return;
                    case "84121":
                      alertsStore.addAlert({ type: "success", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.success') });
                      resetUserData();
                      break;
                    default:
                      alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.savingError') });
                      break;
                  }
                },
              });
            })
            .catch((): void => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: t('settings.info.alerts.uploadFile.title'),
                message: t('settings.info.alerts.uploadFile.error'),
                type: "error"
              });
            });
          }
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.unknown') });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('maturita.tasks.add.alerts.addMaturitaTask.title'), message: t('maturita.tasks.add.alerts.addMaturitaTask.unknown') });
    },
  }).finally(() => {
    loading.value = false;
  });
};

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
  lazy: true
});

const { data: topicsData, error: topicsError, pending: topicsPending } = useFetch("/api/topic/get", {
  query: {
    amountForPaging: amountForTopicsPaging,
    pageNumber: currentTopicsPage,
    searchQuery: searchTopicsInput,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
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

watch([topicsData, topicsError], (): void => {
  if (topicsError.value) {
    topics.value = undefined;
    return;
  }

  if (!topicsData.value) return;

  topics.value = topicsData.value.data.topics;
  topicsCount.value = topicsData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !users.value && !usersError.value || !topics.value && !topicsError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/${role}/tasks`, icon: 'material-symbols:folder-copy-rounded' },
            { label: t('sidebar.links.assignments'), to: `/panel/maturita/${role}/tasks` },
            { label: t('maturita.tasks.add.breadcrumb'), to: `/panel/maturita/${role}/tasks/add`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-tasks" v-if="users && topics">
        <div class="content">
          <ActionBar
              class="action-bar"
              :description="t('maturita.tasks.index.actionBar.description')"
              :texts="[t('actionBar.add'), t('actionBar.remove')]"
              :actions="['add', 'remove']"
              :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
              :active="0"
              :navigate-to="[
              `/panel/maturita/${role}/tasks/add`,
              `/panel/maturita/${role}/tasks/remove`,
            ]"
          />

          <div class="page-section">
            <EditName ref="editName" :old-name="oldData.name" @update="onNameUpdate">
              <div class="section-head">
                <h3>{{ t('maturita.tasks.add.nameHeading') }} <span class="update" v-show="newData.name">{{ t('common.updated') }}</span></h3>
                <p>{{ t('maturita.tasks.add.nameDescription') }}</p>
              </div>
            </EditName>
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('maturita.tasks.add.pointsHeading') }} <span class="update" v-show="selectedTopicId.length > 0">{{ t('common.updated') }}</span></h3>
              <p>{{ t('maturita.tasks.add.pointsDescription') }}</p>
            </div>

            <div class="section-content">
              <label for="grade">{{ t('maturita.tasks.add.topicLabel') }}</label>
              <InputMenu :items="dropDownTopics" deselect v-model="selectedTopicId" :placeholder="t('maturita.tasks.add.topicPlaceholder')" :loading="topicsPending" @search:change="onTopicsSearchInputChange">
                <template #row-extra v-if="numberOfTopicsPages > 1">
                  <Pagination v-model="currentTopicsPage" :number-of-pages="numberOfTopicsPages" :chunk-size="2" />
                </template>
              </InputMenu>
            </div>
          </div>

          <div class="page-section">
            <EditTaskFile ref="editTaskFile" :max-size-m-b="32" @update="onTaskFileUpdate" :old-check="oldData.taskFile">
              <div class="section-head">
                <h3>{{ t('maturita.tasks.add.fileHeading') }} <span class="update" v-show="newData.taskFile">{{ t('common.updated') }}</span></h3>
                <p>{{ t('maturita.tasks.add.fileDescription') }}</p>
              </div>
            </EditTaskFile>
          </div>

          <div class="page-section">
            <div class="line">
              <div class="section-head">
                <h3>{{ t('maturita.tasks.add.guarantorHeading') }}</h3>
                <p>{{ t('maturita.tasks.add.guarantorDescription') }}</p>
              </div>

              <SearchInput @change="onUsersSearchInputChange" :placeholder="t('maturita.tasks.add.searchPlaceholder')" />
            </div>

            <EditClass ref="editClass" :multiple="false" :old-class-ids="selectedClass ? [selectedClass] : []" @update="onClassUpdate" />

            <UsersTable class="datatable" ref="usersDatatable" @row-clicked="onUsersRowClicked" :has-checkbox="true" :selected-ids="selectedUserId"  :users="users || []" :loading="usersPending" />

            <Pagination
                class="users-navigation"
                :number-of-pages="numberOfUsersPages"
                v-model="currentUsersPage"
            />
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="addMaturitaTask">
            {{ t('maturita.tasks.add.requiredNote') }}
          </EditFormFooter>
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
  }
}

@media (max-width: 1055px) {
  #maturita-tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>