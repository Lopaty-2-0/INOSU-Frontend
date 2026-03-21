<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import EditTaskFile from "~/components/manage/TaskFile.vue";
import EditDateTime from "~/components/manage/DateTime.vue";
import Navbar from "~/components/layout/Navbar.vue";
import { ref, computed } from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {type Alert, useAlertsStore} from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";
import {useUpload} from "~/componsables/useUploader";

const { t } = useI18n();

useHead({
  title: t('pages.tasks.roleAdd.title'),
  meta: [
    { name: "description", content: t('pages.tasks.roleAdd.description') }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const alertsStore = useAlertsStore();
const { progress, upload } = useUpload();
const editName = ref<InstanceType<typeof EditName> | null>(null);
const editTaskFile = ref<InstanceType<typeof EditTaskFile> | null>(null);
const editDeadlineDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const editEndDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const loading = ref<boolean>(false);
const oldData = computed<{ name: string, needApprove: boolean | null, taskFile: string, endDate: Date | null, deadline: Date | null, maxPoints: number | null }>(() => ({
  name: "",
  needApprove: null,
  taskFile: "",
  endDate: null,
  deadline: null,
  maxPoints: null,
}));
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
    deadline: undefined,
    endDate: undefined,
    maxPoints: null,
  };

  if (editName.value) editName.value.reset();
  if (editTaskFile.value) editTaskFile.value.reset();
  if (editDeadlineDate.value) editDeadlineDate.value.reset();
  if (editEndDate.value) editEndDate.value.reset();
  if (newData.value.maxPoints !== null) newData.value.maxPoints = null;
};

const addTask = async (): Promise<void> => {
  if (!newData.value.name || !newData.value.endDate || !newData.value.taskFile) {
    alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.fillRequired') });
    return;
  }

  loading.value = true;

  await $fetch("/api/task/add", {
    method: "post",
    body: {
      name: newData.value.name,
      deadline: newData.value.deadline ? newData.value.deadline.getTime() : undefined,
      endDate: newData.value.endDate ? newData.value.endDate.getTime() : undefined,
      task: newData.value.taskFile.name,
      points: newData.value.maxPoints ?? undefined,
      size: newData.value.taskFile.size,
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();
      const data: any = response._data.data;

      switch (resCode) {
        case "F15020":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.fileTooBig') });
          break;
        case "26141":
          if (data.uploadUrl && newData.value.taskFile) {
            const alert: Alert = {
              title: t('tasks.role.add.alerts.addTask.title'),
              message: t('tasks.role.add.alerts.addTask.uploading'),
              type: "info",
              infinite: true,
              canClose: false,
              progress: progress
            };

            const alertIndex: number = alertsStore.addAlert(alert);

            upload(newData.value.taskFile, data.uploadUrl).then(async (): Promise<void> => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: t('tasks.role.add.alerts.addTask.title'),
                message: t('tasks.role.add.alerts.addTask.uploadSuccess'),
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
                      alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.fileNotFound') });
                      return;
                    case "84121":
                      alertsStore.addAlert({ type: "success", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.success') });
                      resetUserData();
                      break;
                    default:
                      alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.serverError') });
                      break;
                  }
                },
              });
            })
            .catch((): void => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: t('tasks.role.add.alerts.addTask.title'),
                message: t('tasks.role.add.alerts.addTask.uploadError'),
                type: "error"
              });
            });
          }
          break;

        case "26010":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.noPermission') });
          break;

        case "26020":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.noName') });
          break;

        case "26030":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.noEndDate') });
          break;

        case "26040":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.nameTooLong') });
          break;

        case "26050":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.dateInvalid') });
          break;

        case "26060":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.dateOrder') });
          break;

        case "26070":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.noFile') });
          break;

        case "26080":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.fileBadFormat') });
          break;

        case "26090":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.deadlineBeforeStart') });
          break;

        case "26100":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.deadlineBeforeEnd') });
          break;

        case "26110":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.noDeadline') });
          break;

        case "26120":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.maxPointsInvalid') });
          break;

        case "26130":
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.noMaxPoints') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.unknown') });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('tasks.role.add.alerts.addTask.title'), message: t('tasks.role.add.alerts.addTask.unknown') });
    },
  }).finally((): void => {
    loading.value = false;
  });
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.tasks'), to: `/panel/tasks/${role}`, active: false, icon: 'material-symbols:folder-copy-rounded' },
            { label: t('actionBar.add'), to: `/panel/tasks/${role}/add`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="tasks">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('tasks.role.add.heading')"
            :texts="[t('actionBar.add'), t('actionBar.remove')]"
            :actions="['add', 'remove']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :active="0"
            :navigate-to="[
              `/panel/tasks/${role}/add`,
              `/panel/tasks/${role}/remove`,
            ]"
          />

          <div class="line page-section">
            <EditName ref="editName" :old-name="oldData.name" @update="onNameUpdate">
              <div class="section-head">
                <h3>{{ t('tasks.role.add.nameHeading') }} <span class="update" v-show="newData.name">{{ t('common.updated') }}</span></h3>
                <p>{{ t('tasks.role.add.nameDescription') }}</p>
              </div>
            </EditName>
          </div>

          <div class="line page-section">
            <EditTaskFile ref="editTaskFile" :max-size-m-b="32" @update="onTaskFileUpdate" :old-check="oldData.taskFile">
              <div class="section-head">
                <h3>{{ t('tasks.role.add.fileHeading') }} <span class="update" v-show="newData.taskFile">{{ t('common.updated') }}</span></h3>
                <p>{{ t('tasks.role.add.fileDescription') }}</p>
              </div>
            </EditTaskFile>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>{{ t('tasks.role.add.timeRangeHeading') }}</h3>
              <p>{{ t('tasks.role.add.timeRangeDescription') }}</p>
            </div>

            <div class="line">
              <EditDateTime ref="editEndDate" @update="onEndDateUpdate" :old-date="oldData.endDate" :label="t('tasks.role.add.endLabel')" />
              <EditDateTime ref="editDeadlineDate" @update="onDeadlineDateUpdate" :old-date="oldData.deadline" :label="t('tasks.role.add.deadlineLabel')" />
            </div>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>{{ t('tasks.role.add.pointsHeading') }} <span class="update" v-show="newData.maxPoints !== null">{{ t('common.updated') }}</span></h3>
              <p>{{ t('tasks.role.add.pointsDescription') }}</p>
            </div>

            <NumberInput v-model="newData.maxPoints" :min="0" :placeholder="t('tasks.role.add.pointsPlaceholder')" enable-null />
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="addTask">
            {{ t('tasks.role.add.requiredNote') }}
          </EditFormFooter>
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