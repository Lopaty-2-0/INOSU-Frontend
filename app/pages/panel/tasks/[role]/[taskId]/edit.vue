<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import EditTaskFile from "~/components/manage/TaskFile.vue";
import EditDateTime from "~/components/manage/DateTime.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, computed, watchEffect} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {type Alert, useAlertsStore} from "~/stores/alerts";
import {useAccountStore} from "~/stores/account";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";
import {storeToRefs} from "pinia";
import {navigateTo} from "nuxt/app";
import type { TaskData } from "~/types/tasks";
import {useLoadingStore} from "~/stores/loading";
import {useUpload} from "~/componsables/useUploader";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

const { t } = useI18n();

useHead({
  title: t('pages.tasks.roleTaskEdit.title', { taskId }),
  meta: [
    { name: "description", content: t('pages.tasks.roleTaskEdit.description') }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { progress, upload } = useUpload();
const { getAccountData: accountData } = storeToRefs(accountStore);
const editName = ref<InstanceType<typeof EditName> | null>(null);
const editTaskFile = ref<InstanceType<typeof EditTaskFile> | null>(null);
const editDeadlineDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const editEndDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const loading = ref<boolean>(false);
const oldData = ref<{ name: string, needApprove: boolean | null, taskFile: string, endDate: Date | null, deadline: Date | null, maxPoints: number | null, loaded: boolean }>({
  name: "",
  needApprove: null,
  taskFile: "",
  endDate: null,
  deadline: null,
  maxPoints: null,
  loaded: false
});
const newData = ref<{ name: string | undefined, needApprove: boolean | undefined, taskFile: File | undefined, endDate: Date | undefined, deadline: Date | undefined, maxPoints: number | null }>({
  name: undefined,
  needApprove: undefined,
  taskFile: undefined,
  endDate: undefined,
  deadline: undefined,
  maxPoints: null,
});

const onNameUpdate = (name: string): void => {
  newData.value.name = name;
};

const onTaskFileUpdate = (taskFile: File | undefined): void => {
  newData.value.taskFile = taskFile;
};

const onDeadlineDateUpdate = (deadlineDate: Date | undefined): void => {
  newData.value.deadline = deadlineDate;
};

const onEndDateUpdate = (endDate: Date | undefined): void => {
  newData.value.endDate = endDate;
};

const resetUserData = (): void => {
  newData.value = {
    name: undefined,
    needApprove: undefined,
    taskFile: undefined,
    endDate: undefined,
    deadline: undefined,
    maxPoints: oldData.value.maxPoints,
  };

  if (editName.value) editName.value.reset();
  if (editTaskFile.value) editTaskFile.value.reset();
  if (editDeadlineDate.value) editDeadlineDate.value.reset();
  if (editEndDate.value) editEndDate.value.reset();
};

const updateTask = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/task/update", {
    method: "put",
    body: {
      id: taskId,
      name: newData.value.name ? newData.value.name : undefined,
      deadline: newData.value.deadline ? newData.value.deadline.getTime() : undefined,
      endDate: newData.value.endDate ? newData.value.endDate.getTime() : undefined,
      task: newData.value.taskFile ? newData.value.taskFile.name : undefined,
      size: newData.value.taskFile ? newData.value.taskFile.size : undefined,
      points: newData.value.maxPoints !== null ? newData.value.maxPoints : undefined,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();
      const data: any = response._data.data;

      switch (resCode) {
        case "F15020":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.fileTooBig') });
          break;
        case "74010":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.noPermission') });
          break;
        case "74020":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.noId') });
          break;
        case "74030":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.invalidId') });
          break;
        case "74040":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.invalidIdValue') });
          break;
        case "74050":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.notFound') });
          break;
        case "74060":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.nameTooLong') });
          break;
        case "74070":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.fileBadFormat') });
          break;
        case "74080":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.dateInvalid') });
          break;
        case "74090":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.dateOrder') });
          break;
        case "74100":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.deadlineBeforeStart') });
          break;
        case "74110":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.deadlineBeforeEnd') });
          break;
        case "74120":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.deadlineInvalid') });
          break;
        case "74130":
        case "74140":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.pointsInvalid') });
          break;
        case "74150":
        case "74160":
        case "74170":
        case "74180":
        case "74190":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.unknown') });
          break;
        case "74201":
          if (data.uploadUrl && newData.value.taskFile) {
            const alert: Alert = {
              title: t('tasks.role.task.edit.alerts.editTask.title'),
              message: t('tasks.role.task.edit.alerts.editTask.uploading'),
              type: "info",
              infinite: true,
              canClose: false,
              progress: progress
            };

            const alertIndex: number = alertsStore.addAlert(alert);

            upload(newData.value.taskFile, data.uploadUrl).then(async (): Promise<void> => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: t('tasks.role.task.edit.alerts.editTask.title'),
                message: t('tasks.role.task.edit.alerts.editTask.uploadSuccess'),
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
                      alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.fileNotFound') });
                      return;
                    case "84121":
                      await refreshTask();
                      resetUserData();
                      break;
                    case "E10100":
                      alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('errors.E10100') });
                      break;
                    default:
                      alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.serverError') });
                      break;
                  }
                },
              });
            })
            .catch((): void => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({ title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.uploadError'), type: "error" });
            });
          }
          alertsStore.addAlert({ type: "success", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.success') });
          await refreshTask();
          resetUserData();

          break;
        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.unknown') });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('tasks.role.task.edit.alerts.editTask.title'), message: t('tasks.role.task.edit.alerts.editTask.unknown') });
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
  server: false,
  credentials: "include",
  lazy: true,
});

watch([taskError, taskData], async (): Promise<void> => {
  if (taskError.value) {
    if (taskError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    navigateTo(`/panel/tasks/${role}/${taskId}`);
    return;
  }

  if (!taskData.value) return;

  const task: TaskData = taskData.value.data.task;

  oldData.value.name = task.name;
  oldData.value.taskFile = task.task || "";
  oldData.value.endDate = task.endDate ? new Date(task.endDate) : null;
  oldData.value.deadline = task.deadline ? new Date(task.deadline) : null;
  oldData.value.maxPoints = task.points ?? null;
  newData.value.maxPoints = task.points ?? null;
  oldData.value.loaded = true;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !oldData.value.loaded);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.tasks'), to: `/panel/tasks/${role}`, active: false, icon: 'material-symbols:folder-copy-rounded' },
            { label: `${t('tasks.role.task.team.taskIdLabel')} ${taskId}`, to: `/panel/tasks/${role}/${taskId}` },
            { label: t('actionBar.edit'), to: `/panel/tasks/${role}/${taskId}/edit`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="tasks" v-if="oldData.loaded">
        <div class="content">
          <div class="line page-section">
            <EditName ref="editName" :old-name="oldData.name" @update="onNameUpdate">
              <div class="section-head">
                <h3>{{ t('tasks.role.task.edit.nameHeading') }} <span class="update" v-show="newData.name">{{ t('common.updated') }}</span></h3>
                <p>{{ t('tasks.role.task.edit.nameDescription') }}</p>
              </div>
            </EditName>
          </div>

          <div class="line page-section">
            <EditTaskFile ref="editTaskFile" :max-size-m-b="32" @update="onTaskFileUpdate" :old-check="oldData.taskFile">
              <div class="section-head">
                <h3>{{ t('tasks.role.task.edit.fileHeading') }} <span class="update" v-show="newData.taskFile">{{ t('common.updated') }}</span></h3>
                <p>{{ t('tasks.role.task.edit.fileDescription') }}</p>
              </div>
            </EditTaskFile>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>{{ t('tasks.role.task.edit.timeRangeHeading') }}</h3>
              <p>{{ t('tasks.role.task.edit.timeRangeDescription') }}</p>
            </div>

            <div class="line">
              <EditDateTime ref="editEndDate" @update="onEndDateUpdate" :old-date="oldData.endDate" :label="t('tasks.role.task.edit.endLabel')" />
              <EditDateTime ref="editDeadlineDate" @update="onDeadlineDateUpdate" :old-date="oldData.deadline" :label="t('tasks.role.task.edit.deadlineLabel')" />
            </div>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>{{ t('tasks.role.task.edit.pointsHeading') }} <span class="update" v-show="newData.maxPoints !== oldData.maxPoints">{{ t('common.updated') }}</span></h3>
              <p>{{ t('tasks.role.task.edit.pointsDescription') }}</p>
            </div>

            <NumberInput v-model="newData.maxPoints" :min="0" :placeholder="t('tasks.role.task.edit.pointsPlaceholder')" />
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="updateTask"></EditFormFooter>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#tasks {
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
  #tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>