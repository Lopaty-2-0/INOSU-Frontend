<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {computed, ref, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import type {TaskTeam} from "~/types/team";
import moment from "moment";
import Image from "~/components/ui/Image.vue";
import Pagination from "~/components/ui/Pagination.vue";
import Loading from "~/components/ui/Loading.vue";
import Editor from "~/components/ui/Editor.vue";
import type {Version} from "~/types/team";
import type {MaturitaTaskData} from "~/types/maturita";
import ActionBar from "~/components/ui/ActionBar.vue";

const { t } = useI18n();
const route = useRoute();
const teamId = route.params.teamId as string;
const role = route.params.role as string;
const taskId = route.params.taskId as string;
const guarantorId = route.params.guarantorId as string;

useHead({
  title: t('pages.maturita.objectorTeam.title', { taskId }),
  meta: [{ name: "description", content: t('pages.maturita.objectorTeam.description') }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const teamTaskData = ref<TaskTeam | undefined>(undefined);
const task = ref<MaturitaTaskData | undefined>(undefined);
const teamTaskPoints = ref<number | null>(null);
const guarantorComment = ref<string>("");
const versions = ref<Version[] | undefined>(undefined);
const versionsPerPage = 3;
const versionsActivePage = ref<number>(1);
const versionsCount = ref<number>(0);
const versionsNumberOfPages = computed<number>(() => {
  return Math.ceil(versionsCount.value / versionsPerPage);
});

const downloadMaterials = async (): Promise<void> => {
  if (!task.value || !task.value.task) {
    alertsStore.addAlert({ type: "error", title: t('maturita.objector.team.download.title'), message: t('maturita.objector.team.download.error') });
    return;
  }
  await navigateTo(`${config.public.originUrl}/api/file/task/${guarantorId}/${task.value.id}/${task.value.task}`, { external: true });
};

const downloadVersion = async (version: Version): Promise<void> => {
  if (!version || !version.elaboration) {
    alertsStore.addAlert({ type: "warning", title: t('maturita.objector.team.download.title'), message: t('maturita.objector.team.download.versionUnavailable') });
    return;
  }

  await navigateTo(`${config.public.originUrl}/api/file/tasks/${guarantorId}/${taskId}/${teamId}/${version.idVersion}/${version.elaboration}`, { external: true });
};

const { data: teamData, error: teamError } = useFetch("/api/team/get/info", {
  query: {
    idTask: taskId,
    idTeam: teamId,
    guarantor: guarantorId,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

const { data: taskData, error: taskError } = useFetch("/api/task/get/id", {
  query: {
    id: taskId,
    guarantor: guarantorId,
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
    guarantor: guarantorId,
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
    if (taskError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    navigateTo(`/panel/maturita/${role}/objector`);
    return;
  }

  if (!taskData.value) return;

  task.value = taskData.value.data.task;
}, { immediate: true });

watch(versionsData, async (newValue: any): Promise<void> => {
  if (!newValue) return;

  if (versionsError.value) {
    if (versionsError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    versions.value = undefined;
    return;
  }

  if (!newValue.data.versions) return;

  versions.value = newValue.data.versions;
  versionsCount.value = newValue.data.count;
}, { immediate: true });

watch([teamData, teamError], async (): Promise<void> => {
  if (teamError.value) {
    if (teamError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    navigateTo(`/panel/maturita/${role}/objector`);
    return;
  }

  if (!teamData.value) return;

  teamTaskData.value = {
    ...teamData.value.data.team,
    users: teamData.value.data.users,
  }

  teamTaskPoints.value = teamData.value.data.team.points ?? null;
  guarantorComment.value = teamData.value.data.team.review || t('maturita.objector.team.noComment');
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
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/${role}/objector`, icon: 'material-symbols:search-rounded' },
            { label: t('maturita.objector.index.heading'), to: `/panel/maturita/${role}/objector` },
            { label: `${t('maturita.team.assignmentLabel')} ${taskId}`, to: `/panel/maturita/${role}/objector/${taskId}/${guarantorId}/${teamId}/` },
            { label: `${t('maturita.team.assignmentLabel')} ${teamId}`, to: `/panel/maturita/${role}/objector/${taskId}/${guarantorId}/${teamId}`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-task" v-if="teamTaskData && task">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('maturita.objector.team.actionBar.description')"
            :texts="[t('maturita.objector.team.actionBar.openChat')]"
            :actions="['edit']"
            :icons="[
                'material-symbols:chat-rounded'
            ]"
              :navigate-to="[
              `/panel/maturita/${role}/objector/${taskId}/${teamId}/${guarantorId}/chat`,
            ]"
          />

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>{{ t('maturita.objector.team.taskIdLabel') }} {{ task.id }}</p>
              <p>{{ t('maturita.objector.team.startLabel') }} {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>{{ t('maturita.objector.team.endLabel') }} {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">{{ t('maturita.objector.team.deadlineLabel') }} {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.points">
                <br>
                {{ t('maturita.objector.team.maxPointsLabel') }} {{ teamTaskData.points ?? "-" }} / {{ task.points }} = {{ teamTaskData.points !== null && task.points ? ((teamTaskData.points / task.points) * 100).toFixed(2) : "0" }}%
              </p>
            </div>

            <div class="user section-head">
              <span>{{ t('maturita.objector.team.studentLabel') }}</span>
              <div class="profile" v-if="task.userData && task.userData.id">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + task.userData.profilePicture" alt="profile-photo" draggable="false" />

                <p class="account-name">
                  {{ task.userData.name + " " + task.userData.surname }}
                </p>
              </div>

              <p v-else>{{ t('maturita.objector.team.undetermined') }}</p>
            </div>

            <div class="user section-head">
              <span>{{ t('maturita.objector.team.guarantorLabel') }}</span>
              <div class="profile" v-if="task.guarantor && task.guarantor.id">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + task.guarantor.profilePicture" alt="profile-photo" draggable="false" />

                <p class="account-name">
                  {{ task.guarantor.name + " " + task.guarantor.surname }}
                </p>
              </div>

              <p v-else>{{ t('maturita.objector.team.undetermined') }}</p>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('maturita.objector.team.materialsHeading') }}</h3>
              <p>{{ t('maturita.objector.team.materialsDescription') }}</p>
            </div>

            <div class="download-input">
              <div class="line">
                <div class="input">
                  {{ task.task || t('maturita.objector.team.noAssignment') }}
                </div>
                <div class="icon-div" @click="downloadMaterials">
                  <Icon class="icon" name="material-symbols:download"/>
                </div>
              </div>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('maturita.objector.team.versionsHeading') }}</h3>
              <p>{{ t('maturita.objector.team.versionsDescription') }}</p>
            </div>

            <div class="versions" v-show="!versionsLoading && versionsCount > 0">
              <div class="download-input" v-for="version in versions" :key="version.idVersion">
                <div class="input-div">
                  <span class="label">{{ moment(version.createdAt).format("HH:mm DD.MM. YYYY") }}</span>

                  <div class="line">
                    <div class="input">
                      {{ version.elaboration || t('maturita.objector.team.removed') }}
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
              <p class="error message">{{ t('maturita.objector.team.noVersions') }}</p>
            </div>

            <Pagination :number-of-pages="versionsNumberOfPages" v-model="versionsActivePage" />
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('maturita.objector.team.commentHeading') }}</h3>
              <p>{{ t('maturita.objector.team.commentDescription') }}</p>
            </div>

            <div class="guarantor-comment download-input">
              <div class="input-div">
                <span class="label">{{ t('maturita.objector.team.lastEdited') }} {{ teamTaskData.reviewUpdatedAt ? moment(teamTaskData.reviewUpdatedAt).format("HH:mm DD.MM. YYYY") : t('maturita.objector.team.notEdited') }}</span>

                <div class="line">
                  <Editor
                    v-model="guarantorComment"
                    class="editor"
                    :enable="true"
                    :read-only="true"
                    :enabled-tools="[]"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
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
