<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {computed, ref, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import {type Alert, useAlertsStore} from "~/stores/alerts";
import ActionFooter from "~/components/manage/Footer.vue";
import type {TaskTeam} from "~/types/team";
import type {TaskData} from "~/types/tasks";
import moment from "moment";
import Card from "~/components/ui/Card.vue";
import Image from "~/components/ui/Image.vue";
import Pagination from "~/components/ui/Pagination.vue";
import Loading from "~/components/ui/Loading.vue";
import Editor from "~/components/ui/Editor.vue";
import type {Version} from "~/types/team";
import FileInput from "~/components/ui/FileInput.vue";
import type {MaturitaTaskData} from "~/types/maturita";
import ActionBar from "~/components/ui/ActionBar.vue";
import {useUpload} from "~/componsables/useUploader";
import { useI18n } from "#imports";

const { t } = useI18n();

useHead({
  title: computed(() => t('pages.maturita.studentIndex.title')),
  meta: [{ name: "description", content: computed(() => t('pages.maturita.studentIndex.description')) }],
});

definePageMeta({
  roles: ["student"],
});

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const { progress, upload } = useUpload();
const editorEnabledTools: string[] = [];
const submitLoading = ref<boolean>(false);
const taskNotExists = ref<boolean | undefined>(undefined);
const teamTaskData = ref<TaskTeam | undefined>(undefined);
const task = ref<MaturitaTaskData | undefined>(undefined);
const teamTaskPoints = ref<number | null>(null);
const specificVersionLoading = ref<{ idVersion: number, loading: boolean } | undefined>(undefined);
const guarantorComment = ref<string>("");
const versions = ref<Version[] | undefined>(undefined);
const versionsPerPage = 3;
const versionsActivePage = ref<number>(1);
const versionsCount = ref<number>(0);
const versionsNumberOfPages = computed<number>(() => {
  return Math.ceil(versionsCount.value / versionsPerPage);
});
const newVersionFile = ref<File | null>(null);
const guarantorId = computed<number | undefined>(() => task.value?.guarantor?.id);
const taskId = computed<number | undefined>(() => task.value?.id);
const teamId = computed<number | undefined>(() => task.value?.idTeam);
const teamQuery = computed(() => {
  if (!task.value || taskNotExists.value) return null;

  return {
    idTask: task.value.id,
    idTeam: task.value.idTeam,
    guarantor: task.value.guarantor?.id,
  };
});
const versionsQuery = computed(() => {
  if (!task.value || taskNotExists.value) return null;

  return {
    idTask: task.value.id,
    idTeam: task.value.idTeam,
    guarantor: task.value.guarantor?.id,
    amountForPaging: versionsPerPage,
    pageNumber: versionsActivePage.value,
  };
});

const resetInputs = (): void => {
  newVersionFile.value = null;
};

const downloadMaterials = async (): Promise<void> => {
  if (!task.value || !task.value.task) {
    alertsStore.addAlert({ type: "error", title: t('maturita.student.index.alerts.downloadFiles.title'), message: t('maturita.student.index.alerts.downloadFiles.error') });
    return;
  }

  await navigateTo(`${config.public.originUrl}/api/file/task/${task.value.guarantor?.id}/${task.value.id}/${task.value.task}`, { external: true });
};

const downloadVersion = async (version: Version): Promise<void> => {
  if (!version || !version.elaboration) {
    alertsStore.addAlert({ type: "warning", title: t('maturita.student.index.alerts.downloadVersion.title'), message: t('maturita.student.index.alerts.downloadVersion.unavailable') });
    return;
  }

  await navigateTo(`${config.public.originUrl}/api/file/tasks/${guarantorId.value}/${taskId.value}/${teamId.value}/${version.idVersion}/${version.elaboration}`, { external: true });
};

const removeVersion = async (version: Version): Promise<void> => {
  if (!version || !version.idVersion) {
    alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.error') });
    return;
  }

  specificVersionLoading.value = { idVersion: version.idVersion, loading: true };

  await $fetch("/api/version_team/change", {
    method: "put",
    body: {
      idTask: taskId.value,
      idTeam: teamId.value,
      guarantor: guarantorId.value,
      idVersion: version.idVersion,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode = response._data?.resCode?.toString();

      switch (resCode) {
        case "49010":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.noTeamId') });
          break;

        case "49020":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.noTaskId') });
          break;

        case "49030":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.noVersionId') });
          break;

        case "49040":
        case "49050":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.invalidTeamId') });
          break;

        case "49060":
        case "49070":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.invalidTaskId') });
          break;

        case "49080":
        case "49090":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.invalidVersionId') });
          break;

        case "49100":
        case "49110":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.invalidGuarantor') });
          break;

        case "49120":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.teamNotFound') });
          break;

        case "49130":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.versionNotFound') });
          break;

        case "49140":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.noPermission') });
          break;

        case "49150":
          alertsStore.addAlert({ type: "warning", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.afterDeadline') });
          break;

        case "4961":
          alertsStore.addAlert({ type: "success", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.success') });
          refreshVersions();
          break;

        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.unknown') });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.removeVersion.title'), message: t('tasks.student.team.alerts.removeVersion.serverError') });
    },
  }).finally(() => {
    specificVersionLoading.value = undefined;
  });
};

const uploadNewVersion = async (): Promise<void> => {
  if (!newVersionFile.value) {
    alertsStore.addAlert({ type: "warning", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.noElaboration') });
    return;
  }

  submitLoading.value = true;

  await $fetch("/api/version_team/add", {
    method: "post",
    server: true,
    credentials: "include",
    body: {
      idTask: taskId.value,
      idTeam: teamId.value,
      guarantor: guarantorId.value,
      elaboration: newVersionFile.value.name,
      size: newVersionFile.value.size,
    },
    ignoreResponseError: true,

    onResponse({ response }: any) {
      const resCode = response._data?.resCode?.toString();
      const data: any = response._data?.data;

      switch (resCode) {
        case "F15020":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.fileTooBig') });
          break;
        case "38010":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.noTeamId') });
          break;
        case "38020":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.noTaskId') });
          break;
        case "38030":
        case "38040":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.invalidTeamId') });
          break;
        case "38050":
        case "38060":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.invalidTaskId') });
          break;
        case "38070":
        case "38080":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.invalidGuarantor') });
          break;
        case "38090":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.guarantorNotFound') });
          break;
        case "38100":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.notGuarantor') });
          break;
        case "38110":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.taskNotFound') });
          break;
        case "38120":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.teamNotFound') });
          break;
        case "38130":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.noPermission') });
          break;
        case "38140":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.noElaboration') });
          break;
        case "38150":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.badFormat') });
          break;
        case "38160":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.nameTooLong') });
          break;
        case "38170":
          alertsStore.addAlert({ type: "warning", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.afterDeadline') });
          break;
        case "38181":
          if (data.redirectUrl && newVersionFile.value) {
            const alert: Alert = {
              title: t('maturita.student.index.alerts.uploading.title'),
              message: t('tasks.student.team.alerts.addVersion.uploading'),
              type: "info",
              infinite: true,
              canClose: false,
              progress: progress
            };

            const alertIndex: number = alertsStore.addAlert(alert);

            upload(newVersionFile.value, data.redirectUrl).then(async (): Promise<void> => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({ title: t('maturita.student.index.alerts.uploading.title'), message: t('tasks.student.team.alerts.addVersion.uploadSuccess'), type: "success" });

              await $fetch("/api/version_team/put/elaboration", {
                method: "PUT",
                body: {
                  idTask: data.version.idTask,
                  idTeam: data.version.idTeam,
                  idVersion: data.version.idVersion,
                  guarantor: data.version.guarantor,
                  elaboration: data.version.elaboration,
                },
                credentials: "include",
                ignoreResponseError: true,
                async onResponse({ response }: any) {
                  const resCode: string = response._data.resCode.toString();

                  switch (resCode) {
                    case "85190":
                      alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.fileNotFound') });
                      return;
                    case "85201":
                      alertsStore.addAlert({ type: "success", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.success') });

                      resetInputs();
                      await refreshVersions();
                      break;
                    case "E10100":
                      alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('errors.E10100') });
                      break;
                    default:
                      alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.serverError') });
                      break;
                  }
                },
              });
            }).catch(() => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({ title: t('maturita.student.index.alerts.uploading.title'), message: t('tasks.student.team.alerts.addVersion.uploadError'), type: "error" });
            });
          }
          break;
        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.unknown') });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('tasks.student.team.alerts.addVersion.title'), message: t('tasks.student.team.alerts.addVersion.serverConnectionError') });
    },
  }).finally(() => {
    submitLoading.value = false;
  });
};

const { data: taskData, error: taskError } = useFetch("/api/task/get/maturita/student/approved", {
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

const {data: teamData, error: teamError, refresh: refreshTeamData, execute: executeTeamData} = useFetch("/api/team/get/info", {
  method: "get",
  server: false,
  lazy: true,
  immediate: false,
  credentials: "include",
  query: teamQuery,
});

const {data: versionsData, error: versionsError, pending: versionsLoading, refresh: refreshVersions, execute: executeVersions} = useFetch("/api/version_team/get", {
  method: "get",
  server: false,
  lazy: true,
  credentials: "include",
  query: versionsQuery,
  immediate: false
});

watch(versionsQuery, async (query): Promise<void> => {
  if (!query) return;

  await executeVersions();
}, { immediate: true });

watch(teamQuery, async (query): Promise<void> => {
  if (!query) return;

  await executeTeamData();
}, { immediate: true });

watch([taskData, taskError], (): void => {
  if (taskError.value) {
    if (taskError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    const resCode: number = taskError.value.data.resCode;

    if ([78010, 78020].includes(resCode)) {
      taskNotExists.value = true;
      return;
    }

    navigateTo(`/panel`);
    return;
  }

  if (!taskData.value) return;

  taskNotExists.value = false;
  task.value = taskData.value.data.task;
}, { immediate: true });

watch([versionsData, versionsError], async (): Promise<void> => {
  if (versionsError.value) {
    if (versionsError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    versions.value = undefined;
    return;
  }

  if (!versionsData.value.data.versions) return;

  versions.value = versionsData.value.data.versions;
  versionsCount.value = versionsData.value.data.count;
});

watch([teamData, teamError], async (): Promise<void> => {
  if (teamError.value) {
    if (teamError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    navigateTo(`/panel`);
    return;
  }

  if (!teamData.value) return;

  teamTaskData.value = {
    ...teamData.value.data.team,
    users: teamData.value.data.users,
  }

  teamTaskPoints.value = teamData.value.data.team.points ?? null;
  guarantorComment.value = teamData.value.data.team.review || "Zatím žádný komentář...";
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", taskNotExists.value === undefined || (!taskNotExists.value && (!task.value && !taskError.value || !teamError.value && !teamTaskData.value)));
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/student`, icon: 'material-symbols:folder-copy-rounded' },
            { label: t('maturita.student.breadcrumb', { taskId: taskId || '-' }), to: `/panel/maturita/student`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div v-if="taskNotExists !== undefined && (taskNotExists)" id="maturita-task">
        <div class="content">
          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('maturita.student.index.heading') }}</h3>
              <p>{{ t('maturita.student.index.noTaskDescription') }}</p>
            </div>

            <p class="error message">{{ t('maturita.student.index.noTask') }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="task" id="maturita-task">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('maturita.student.index.actionBarDescription')"
            :texts="[t('maturita.student.index.openChatBtn')]"
            :actions="['edit']"
            :icons="[
              'material-symbols:chat-rounded'
            ]"
            :navigate-to="[
              `/panel/maturita/student/chat`,
            ]"
          />

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>{{ t('maturita.student.index.taskIdLabel') }} {{ task.id }}</p>
              <p>{{ t('maturita.student.index.startLabel') }} {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>{{ t('maturita.student.index.endLabel') }} {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">{{ t('maturita.student.index.deadlineLabel') }} {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.points">
                <br>
                {{ t('maturita.student.index.pointsLabel') }} {{ task.points ?? "-" }} / {{ task.maxPoints }} = {{ task.points !== null && task.points ? ((task.points / task.maxPoints) * 100).toFixed(2) : "0" }}%
              </p>
            </div>

            <div class="user section-head">
              <span>{{ t('maturita.student.index.guarantorLabel') }}</span>
              <div class="profile">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + task.guarantor?.profilePicture" alt="profile-photo" draggable="false"/>

                <p class="account-name">
                  {{ task.guarantor?.name + " " + task.guarantor?.surname }}
                </p>
              </div>
            </div>

            <div class="user section-head">
              <span>{{ t('maturita.student.index.objectorLabel') }}</span>
              <div class="profile" v-if="task.objector && task.objector.id">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + task.objector.profilePicture" alt="profile-photo" draggable="false" />

                <p class="account-name">
                  {{ task.objector.name + " " + task.objector.surname }}
                </p>
              </div>

              <p v-else>{{ t('maturita.student.index.undetermined') }}</p>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('maturita.student.index.materialsHeading') }}</h3>
              <p>{{ t('maturita.student.index.materialsDescription') }}</p>
            </div>

            <div class="download-input">
              <div class="line">
                <div class="input">
                  {{ task.task || t('maturita.student.index.noMaterial') }}
                </div>
                <div class="icon-div" @click="downloadMaterials">
                  <Icon class="icon" name="material-symbols:download"/>
                </div>
              </div>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('maturita.student.index.versionsHeading') }} <span class="update" v-if="newVersionFile">(aktualizováno)</span></h3>
              <p>{{ t('maturita.student.index.versionsDescription') }}</p>
            </div>

            <FileInput
                ref="fileInput"
                class="content"
                v-model="newVersionFile"
                :placeholder="t('maturita.student.index.filePlaceholder')"
                :max-size-m-b="5000"
                accept=".pdf,.docx,.odt,.gif,.html,.zip"
                :title="newVersionFile ? newVersionFile.name : ''"
            />

            <div class="versions" v-show="!versionsLoading && versionsCount > 0">
              <div class="download-input" v-for="version in versions" :key="version.idVersion">
                <div class="input-div">
                  <span class="label">{{ moment(version.createdAt).format("HH:mm DD.MM. YYYY") }}</span>

                  <div class="line">
                    <div class="input">
                      <Loading class="loading" color="rgba(var(--description-color), 1)" size="6px" v-if="specificVersionLoading && specificVersionLoading.idVersion === version.idVersion && specificVersionLoading.loading" />

                      <p v-else>{{ version.elaboration || t('maturita.student.index.removed') }}</p>
                    </div>
                    <div class="icon-div" @click="downloadVersion(version)" v-if="version.elaboration">
                      <Icon class="icon" name="material-symbols:download"/>
                    </div>
                    <div class="icon-div" @click="removeVersion(version)" v-if="version.elaboration">
                      <Icon class="icon" name="material-symbols:delete-rounded"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="versions loading" v-show="versionsLoading">
              <Loading color="rgba(var(--description-color), 1)" size="16px" />
            </div>

            <div class="versions" v-show="!versionsLoading && versionsCount === 0">
              <p class="error message">{{ t('maturita.student.index.noVersions') }}</p>
            </div>

            <Pagination :number-of-pages="versionsNumberOfPages" v-model="versionsActivePage" />
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('maturita.student.index.guarantorCommentHeading') }}</h3>
              <p>{{ t('maturita.student.index.guarantorCommentDescription') }}</p>
            </div>

            <div class="guarantor-comment download-input">
              <div class="input-div">
                <span class="label">{{ teamTaskData?.reviewUpdatedAt ? t('maturita.student.index.lastEdited', { date: moment(teamTaskData?.reviewUpdatedAt).format("HH:mm DD.MM. YYYY") }) : t('maturita.student.index.notEdited') }}</span>

                <div class="line">
                  <Editor
                      v-model="guarantorComment"
                      class="editor"
                      :enable="true"
                      :read-only="true"
                      :enabled-tools="editorEnabledTools"
                      placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="page-section">
            <ActionFooter :submit-function="uploadNewVersion" :reset-function="resetInputs" :is-loading="submitLoading" />
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#maturita-task {
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

    .message {
      font-size: 16px;
      color: rgba(var(--description-color), 1);

      &.error {
        color: rgba(var(--error-color), 1);
      }
    }

    .versions {
      display: flex;
      flex-direction: column;
      gap: 20px;

      p {
        font-size: 16px;

        &.error {
          color: rgba(var(--error-color), 1);
        }
      }

      &.loading {
        justify-content: center;
        align-items: center;
        min-height: 100px;
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

    .download-input {
      &.guarantor-comment {
        .line {
          align-items: flex-start;

          ::v-deep(.editor) {
            flex: 1;
          }
        }
      }

      .input-div {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 10px;

        .label {
          color: var(--mini-title-color);
          font-size: 16px;
        }
      }

      .line {
        gap: 10px;

        .input {
          border-radius: var(--normal-border-radius);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          padding: 15px;
          font-size: 16px;
          outline: none;
          background: var(--input-background);
          color: var(--input-color);
          flex: 1;

          .loading {
            padding: 5px;
          }
        }

        .icon-div {
          padding: 15px;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          color: var(--btn-2-color);
          background: var(--btn-2-background);
          border-radius: var(--normal-border-radius);
          cursor: pointer;
          transition: 0.2s;
          line-height: 0;
          display: flex;
          justify-content: center;
          align-items: center;

          .icon {
            font-size: 16px;
          }

          &:hover {
            background: var(--btn-2-hover-background);
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

    .team-card {
      padding: 30px;

      .content {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .name {
          font-weight: 800;
        }
      }
    }

    .section-head {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .profile {
        display: flex;
        gap: 10px;
        align-items: center;

        .account-name {
          color: rgba(var(--description-color), 1);
          font-size: 16px;
        }

        ::v-deep(img) {
          width: 45px;
          height: 45px;
          border-radius: var(--small-border-radius);
          object-fit: cover;
        }
      }

      h3 {
        font-weight: 600;
        font-size: 20px;
        color: var(--title-color);
      }

      span {
        color: var(--mini-title-color);
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
</style>