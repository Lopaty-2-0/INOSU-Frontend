<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {computed, ref, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import ActionFooter from "~/components/manage/Footer.vue";
import type {TaskTeam} from "~/types/team";
import type {TaskData} from "~/types/tasks";
import moment from "moment";
import Card from "~/components/ui/Card.vue";
import type {AccountData} from "~/types/account";
import Image from "~/components/ui/Image.vue";
import NumberInput from "~/components/ui/NumberInput.vue";
import Pagination from "~/components/ui/Pagination.vue";
import Loading from "~/components/ui/Loading.vue";
import Editor from "~/components/ui/Editor.vue";
import type {Version} from "~/types/team";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";
import type {MaturitaTaskData} from "~/types/maturita";
import ActionBar from "~/components/ui/ActionBar.vue";

const { t } = useI18n();
const route = useRoute();
const teamId = route.params.teamId as string;
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: t('pages.maturita.teamIndex.title', { taskId }),
  meta: [{ name: "description", content: t('pages.maturita.teamIndex.description') }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);
const submitLoading = ref<boolean>(false);
const teamTaskData = ref<TaskTeam | undefined>(undefined);
const task = ref<MaturitaTaskData | undefined>(undefined);
const teamTaskPoints = ref<number | null>(null);
const isGuarantorCommentEnabled = ref<boolean>(false);
const guarantorComment = ref<string>("");
const editorEnabledTools: string[] = [
  "bold",
  "underline",
  "strike",
  "italic",
  "blockquote",
  "code-block",
  "link",
  "header",
  "list-ordered",
  "list-bullet",
  "list-check",
  "indentUp",
  "indentDown",
  "align",
  "color",
  "background",
  "clean",
];
const versions = ref<Version[] | undefined>(undefined);
const versionsPerPage = 3;
const versionsActivePage = ref<number>(1);
const versionsCount = ref<number>(0);
const versionsNumberOfPages = computed<number>(() => {
  return Math.ceil(versionsCount.value / versionsPerPage);
});
const errors = ref<{ points: string, review: string }>({
  points: "",
  review: "",
});

const checkForErrors = (): void => {
  errors.value.points = "";
  errors.value.review = "";

  if (teamTaskPoints.value && task.value && teamTaskPoints.value > task.value.points!) {
    errors.value.points = t('maturita.team.errors.pointsExceed', { max: task.value.points });
  } else if (teamTaskPoints.value && teamTaskPoints.value < 0) {
    errors.value.points = t('maturita.team.errors.pointsNegative');
  }

  if (guarantorComment.value.length > 65535) {
    errors.value.review = t('maturita.team.errors.commentTooLong');
  }
};

const resetInputs = (): void => {
  if (teamTaskData.value && typeof teamTaskData.value.points === "number") {
    teamTaskPoints.value = teamTaskData.value.points;
  } else {
    teamTaskPoints.value = null;
  }

  if (teamTaskData.value && teamTaskData.value.review) {
    guarantorComment.value = teamTaskData.value.review;
  } else {
    guarantorComment.value = "";
  }
};

const toggleGuarantorCommentEnabled = (): void => {
  isGuarantorCommentEnabled.value = !isGuarantorCommentEnabled.value;
};

const downloadMaterials = async (): Promise<void> => {
  if (!task.value || !task.value.task) {
    alertsStore.addAlert({ type: "error", title: t('maturita.team.download.title'), message: t('maturita.team.download.error') });
    return;
  }
  await navigateTo(`${config.public.originUrl}/api/file/task/${accountData.value.id}/${task.value.id}/${task.value.task}`, { external: true });
};

const downloadVersion = async (version: Version): Promise<void> => {
  if (!version || !version.elaboration) {
    alertsStore.addAlert({ type: "warning", title: t('maturita.team.download.title'), message: t('maturita.team.download.versionUnavailable') });
    return;
  }

  await navigateTo(`${config.public.originUrl}/api/file/tasks/${accountData.value.id}/${taskId}/${teamId}/${version.idVersion}/${version.elaboration}`, { external: true });
};

const updateTeam = async (): Promise<void> => {
  checkForErrors();

  if (errors.value.points.length > 0 || errors.value.review.length > 0) {
    alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.formErrors') });
    return;
  }

  submitLoading.value = true;

  await $fetch("/api/team/update", {
    method: "put",
    credentials: "include",
    ignoreResponseError: true,
    body: {
      idTask: taskId,
      idTeam: teamId,
      ...(guarantorComment.value !== teamTaskData.value?.review && { review: guarantorComment.value }),
      ...(teamTaskPoints.value !== teamTaskData.value?.points && { points: teamTaskPoints.value }),
    },

    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "32010":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.noTaskId') });
          break;
        case "32020":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.noTeamId') });
          break;
        case "32030":
        case "32040":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.taskIdInvalid') });
          break;
        case "32050":
        case "32060":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.teamIdInvalid') });
          break;
        case "32070":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.taskNotFound') });
          break;
        case "32080":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.teamNotFound') });
          break;
        case "32090":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.invalidStatus') });
          break;
        case "32100":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.maxVariants') });
          break;
        case "32110":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.pointsNaN') });
          break;
        case "32120":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.pointsNaN2') });
          break;
        case "32130":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.pointsExceed') });
          break;
        case "32140":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.commentTooLong') });
          break;
        case "32150":
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.nameTooLong') });
          break;
        case "32161":
          alertsStore.addAlert({ type: "success", title: t('maturita.team.alerts.manageTeam.title'), message: t('maturita.team.alerts.manageTeam.success') });
          await refreshTeamData();
          resetInputs();
          errors.value = { points: "", review: "" };
          break;
        default:
          alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('common.unknown') });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('maturita.team.alerts.manageTeam.title'), message: t('common.unknown') });
    },
  }).finally(() => {
    submitLoading.value = false;
  });
};

const { data: teamData, error: teamError, refresh: refreshTeamData } = useFetch("/api/team/get/info", {
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

const { data: versionsData, error: versionsError, pending: versionsLoading } = useFetch("/api/version_team/get", {
  query: {
    idTask: taskId,
    idTeam: teamId,
    guarantor: accountData.value.id,
    amountForPaging: versionsPerPage,
    pageNumber: versionsActivePage,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([taskData, taskError], (): void => {
  if (taskError.value) {
    navigateTo(`/panel/maturita/${role}/tasks/`);
    return;
  }

  if (!taskData.value) return;

  task.value = taskData.value.data.task;
}, { immediate: true });

watch(versionsData, async (newValue: any): Promise<void> => {
  if (!newValue) return;

  if (versionsError.value) {
    versions.value = undefined;
    return;
  }

  if (!newValue.data.versions) return;

  versions.value = newValue.data.versions;
  versionsCount.value = newValue.data.count;
}, { immediate: true });

watch([teamData, teamError], async (): Promise<void> => {
  if (teamError.value) {
    navigateTo(`/panel/maturita/${role}/tasks/`);
    return;
  }

  if (!teamData.value) return;

  teamTaskData.value = {
    ...teamData.value.data.team,
    users: teamData.value.data.users,
  }

  teamTaskPoints.value = teamData.value.data.team.points ?? null;
  guarantorComment.value = teamData.value.data.team.review ?? "";
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value && !taskError.value || !teamError.value && !teamTaskData.value || !versionsData.value && !versionsError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/${role}/tasks`, icon: 'material-symbols:folder-copy-rounded' },
            { label: t('maturita.tasks.index.heading'), to: `/panel/maturita/${role}/tasks` },
            { label: `${t('maturita.team.assignmentLabel')} ${taskId}`, to: `/panel/maturita/${role}/tasks/${taskId}/${teamId}` },
            { label: `${t('maturita.team.assignmentLabel')} ${teamId}`, to: `/panel/maturita/${role}/tasks/${taskId}/${teamId}`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-task" v-if="teamTaskData && task">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('maturita.team.actionBar.description')"
            :texts="[t('maturita.team.actionBar.openChat')]"
            :actions="['edit']"
            :icons="[
                'material-symbols:chat-rounded'
            ]"
              :navigate-to="[
              `/panel/maturita/${role}/tasks/${taskId}/${teamId}/chat`,
            ]"
          />

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>{{ t('maturita.team.taskIdLabel') }} {{ task.id }}</p>
              <p>{{ t('maturita.team.startLabel') }} {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>{{ t('maturita.team.endLabel') }} {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">{{ t('maturita.team.deadlineLabel') }} {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.points">
                <br>
                {{ t('maturita.team.maxPointsLabel') }} {{ teamTaskData.points ?? "-" }} / {{ task.points }} = {{ teamTaskData.points !== null && task.points ? ((teamTaskData.points / task.points) * 100).toFixed(2) : "0" }}%
              </p>
            </div>

            <div class="user section-head" v-if="task.userData">
              <span>{{ t('maturita.team.studentLabel') }}</span>
              <div class="profile">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + task.userData.profilePicture" alt="profile-photo" draggable="false" />

                <p class="account-name">
                  {{ task.userData.name + " " + task.userData.surname }}
                </p>
              </div>
            </div>

            <div class="user section-head">
              <span>{{ t('maturita.team.objectorLabel') }}</span>
              <div class="profile" v-if="task.objector && task.objector.id">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + task.objector.profilePicture" alt="profile-photo" draggable="false" />

                <p class="account-name">
                  {{ task.objector.name + " " + task.objector.surname }}
                </p>
              </div>

              <p v-else>{{ t('maturita.team.undetermined') }}</p>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('maturita.team.materialsHeading') }}</h3>
              <p>{{ t('maturita.team.materialsDescription') }}</p>
            </div>

            <div class="download-input">
              <div class="line">
                <div class="input">
                  {{ task.task || t('maturita.team.noAssignment') }}
                </div>
                <div class="icon-div" @click="downloadMaterials">
                  <Icon class="icon" name="material-symbols:download"/>
                </div>
              </div>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('maturita.team.versionsHeading') }}</h3>
              <p>{{ t('maturita.team.versionsDescription') }}</p>
            </div>

            <div class="versions" v-show="!versionsLoading && versionsCount > 0">
              <div class="download-input" v-for="version in versions" :key="version.idVersion">
                <div class="input-div">
                  <span class="label">{{ moment(version.createdAt).format("HH:mm DD.MM. YYYY") }}</span>

                  <div class="line">
                    <div class="input">
                      {{ version.elaboration || t('maturita.team.removed') }}
                    </div>
                    <div class="icon-div" @click="downloadVersion(version)" v-if="version.elaboration">
                      <Icon class="icon" name="material-symbols:download"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="versions loading" v-show="versionsLoading">
              <Loading color="rgba(var(--description-color), 1)" size="16px" />
            </div>

            <div class="versions" v-show="!versionsLoading && versionsCount === 0">
              <p class="error message">{{ t('maturita.team.noVersions') }}</p>
            </div>

            <Pagination :number-of-pages="versionsNumberOfPages" v-model="versionsActivePage" />
          </div>

          <div class="page-section bottom-line" v-if="task.points">
            <div class="section-head">
              <h3>{{ t('maturita.team.pointsHeading') }} <span class="update" v-if="teamTaskData.points !== teamTaskPoints">({{ t('common.updated') }})</span></h3>
              <p>{{ t('maturita.team.pointsDescription') }}</p>
            </div>

            <div class="content">
              <label for="teamTaskPoints">{{ task.points ? t('maturita.team.maxPointsLabel2', { points: task.points }) : t('maturita.team.noMaxPointsDefined') }}</label>
              <NumberInput id="teamTaskPoints" :placeholder="t('maturita.team.commentPlaceholder')" v-model="teamTaskPoints" :min="0" :max="task.points || 0" :disabled="!task.points" @update:model-value="checkForErrors"  />
              <p class="input-error" v-if="errors.points.length > 0">{{ errors.points }}</p>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('maturita.team.commentHeading') }} <span class="update" v-if="guarantorComment && teamTaskData.review !== guarantorComment">({{ t('common.updated') }})</span></h3>
              <p>{{ t('maturita.team.commentDescription') }}</p>
            </div>

            <div class="guarantor-comment download-input">
              <div class="input-div">
                <span class="label">{{ t('maturita.team.lastEdited') }} {{ teamTaskData.reviewUpdatedAt ? moment(teamTaskData.reviewUpdatedAt).format("HH:mm DD.MM. YYYY") : t('maturita.team.notEdited') }}</span>

                <div class="line">
                  <Editor
                      v-model="guarantorComment"
                      class="editor"
                      :enable="isGuarantorCommentEnabled"
                      :placeholder="t('maturita.team.commentPlaceholder')"
                      :enabled-tools="editorEnabledTools"
                      @update:model-value="checkForErrors"
                  />
                  <div class="icon-div" @click="toggleGuarantorCommentEnabled">
                    <Icon class="icon" name="material-symbols:edit"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="page-section">
            <ActionFooter :submit-function="updateTeam" :reset-function="resetInputs" :is-loading="submitLoading" />
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
