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
import {useUpload} from "~/componsables/useUploader";

const route = useRoute();
const teamId = route.params.teamId as string;
const taskId = route.params.taskId as string;
const guarantorId = route.params.guarantorId as string;

useHead({
  title: "Panel | Úkol - " + taskId + " - Přiřazení - Jednotlivci",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["student"],
});

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const { progress, upload } = useUpload();
const editorEnabledTools: string[] = [];
const submitLoading = ref<boolean>(false);
const teamTaskData = ref<TaskTeam | undefined>(undefined);
const task = ref<TaskData | undefined>(undefined);
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

const resetInputs = (): void => {
  newVersionFile.value = null;
};

const downloadMaterials = async (): Promise<void> => {
  if (!task.value || !task.value.task) {
    alertsStore.addAlert({ type: "error", title: "Stahování souborů", message: "Chyba při stahování materiálů úkolu." });
    return;
  }

  await navigateTo(`${config.public.originUrl}/api/file/task/${task.value.guarantor.id}/${task.value.id}/${task.value.task}`, { external: true });
};

const downloadVersion = async (version: Version): Promise<void> => {
  if (!version || !version.elaboration) {
    alertsStore.addAlert({ type: "warning", title: "Stahování verze", message: "Tato verze není dostupná." });
    return;
  }

  await navigateTo(`${config.public.originUrl}/api/file/tasks/${guarantorId}/${taskId}/${teamId}/${version.idVersion}/${version.elaboration}`, { external: true });
};

const removeVersion = async (version: Version): Promise<void> => {
  if (!version || !version.idVersion) {
    alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "Chyba při odstraňování verze." });
    return;
  }

  specificVersionLoading.value = { idVersion: version.idVersion, loading: true };

  await $fetch("/api/version_team/change", {
    method: "put",
    body: {
      idTask: taskId,
      idTeam: teamId,
      guarantor: guarantorId,
      idVersion: version.idVersion,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode = response._data?.resCode?.toString();

      switch (resCode) {
        case "49010":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "ID týmu nebylo zadáno." });
          break;

        case "49020":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "ID úkolu nebylo zadáno." });
          break;

        case "49030":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "ID verze nebylo zadáno." });
          break;

        case "49040":
        case "49050":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "ID týmu je neplatné." });
          break;

        case "49060":
        case "49070":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "ID úkolu je neplatné." });
          break;

        case "49080":
        case "49090":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "ID verze je neplatné." });
          break;

        case "49100":
        case "49110":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "Neplatný garant úkolu." });
          break;

        case "49120":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "Zadaný tým neexistuje." });
          break;

        case "49130":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "Zadaná verze neexistuje." });
          break;

        case "49140":
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "Na odstranění verze nemáte oprávnění." });
          break;

        case "49150":
          alertsStore.addAlert({ type: "warning", title: "Odstranění verze", message: "Nelze odstranit verzi po termínu." });
          break;

        case "4961":
          alertsStore.addAlert({ type: "success", title: "Odstranění verze", message: "Verze byla úspěšně odstraněna." });
          refreshVersions();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "Nastala neznámá chyba." });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění verze", message: "Nepodařilo se spojit se serverem." });
    },
  }).finally(() => {
    specificVersionLoading.value = undefined;
  });
};

const uploadNewVersion = async (): Promise<void> => {
  if (!newVersionFile.value) return;

  submitLoading.value = true;

  await $fetch("/api/version_team/add", {
    method: "post",
    server: true,
    credentials: "include",
    body: {
      idTask: taskId,
      idTeam: teamId,
      guarantor: guarantorId,
      elaboration: newVersionFile.value.name,
      size: newVersionFile.value.size,
    },
    ignoreResponseError: true,

    onResponse({ response }: any) {
      const resCode = response._data?.resCode?.toString();
      const data: any = response._data?.data;

      switch (resCode) {
        case "F15020":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Nahraný soubor je příliš velký." });
          break;
        case "38010":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "ID týmu nebylo zadáno." });
          break;
        case "38020":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "ID úkolu nebylo zadáno." });
          break;
        case "38030":
        case "38040":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "ID týmu je neplatné." });
          break;
        case "38050":
        case "38060":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "ID úkolu je neplatné." });
          break;
        case "38070":
        case "38080":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Neplatný garant úkolu." });
          break;
        case "38090":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Zadaný garant neexistuje." });
          break;
        case "38100":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Uživatel není garantem úkolu." });
          break;
        case "38110":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Zadaný úkol neexistuje." });
          break;
        case "38120":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Zadaný tým neexistuje." });
          break;
        case "38130":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Na přidání verze nemáte oprávnění." });
          break;
        case "38140":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Vypracování nebylo zadáno." });
          break;
        case "38150":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Nepodporovaný formát souboru." });
          break;
        case "38160":
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Název souboru je příliš dlouhý." });
          break;
        case "38170":
          alertsStore.addAlert({ type: "warning", title: "Přidání verze", message: "Nelze odevzdat verzi po termínu." });
          break;
        case "38181":
          if (data.redirectUrl && newVersionFile.value) {
            const alert: Alert = {
              title: "Nahrávání souboru",
              message: "Probíhá nahrávání souboru...",
              type: "info",
              infinite: true,
              canClose: false,
              progress: progress
            };

            const alertIndex: number = alertsStore.addAlert(alert);

            upload(newVersionFile.value, data.redirectUrl).then(async (): Promise<void> => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({ title: "Nahrávání souboru", message: "Soubor byl úspěšně nahrán.", type: "success" });

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
                      alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Soubor nebyl nalezen na úložišti." });
                      return;
                    case "85201":
                      alertsStore.addAlert({ type: "success", title: "Přidání verze", message: "Nová verze byla úspěšně nahrána." });

                      resetInputs();
                      await refreshVersions();
                      break;
                    default:
                      alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Nastala neznámá chyba při ukládání." });
                      break;
                  }
                },
              });
            }).catch(() => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({ title: "Nahrávání souboru", message: "Nastala chyba při nahrávání souboru.", type: "error" });
            });
          }
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Nastala neznámá chyba." });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Přidání verze", message: "Nepodařilo se spojit se serverem." });
    },
  }).finally(() => {
    submitLoading.value = false;
  });
};

const { data: teamData, error: teamError } = useFetch("/api/team/get/info", {
  query: {
    idTask: taskId,
    idTeam: teamId,
    guarantor: guarantorId
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

const { data: taskData, error: taskError } = useFetch("/api/task/get/id", {
  query: {
    id: taskId,
    guarantor: guarantorId
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

const { data: versionsData, error: versionsError, refresh: refreshVersions, pending: versionsLoading } = useFetch("/api/version_team/get", {
  query: {
    idTask: taskId,
    idTeam: teamId,
    guarantor: guarantorId,
    amountForPaging: versionsPerPage,
    pageNumber: versionsActivePage,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

watchEffect((): void => {
  if (teamError.value) {
    navigateTo(`/panel/tasks/student/${taskId}`);
    return;
  }

  if (!teamTaskData.value) return;
});

watchEffect(async (): Promise<void> => {
  if (taskError.value) {
    navigateTo(`/panel/tasks/student/${taskId}`);
    return;
  }

  if (!taskData.value) return

  task.value = taskData.value.data.task;
});

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

watch(teamData, async (newValue: any): Promise<void> => {
  if (!newValue) return;

  teamTaskData.value = {
    ...newValue.data.team,
    users: newValue.data.users,
  }

  teamTaskPoints.value = teamData.value.data.team.points ?? null;
  guarantorComment.value = teamData.value.data.team.review || "Zatím žádný komentář...";

}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value && !taskError.value || !teamError.value && !teamTaskData.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Úkoly', to: `/panel/tasks/student`, icon: 'material-symbols:folder-copy-rounded' },
            { label: `Úkol ID: ${taskId}`, to: `/panel/tasks/student/${taskId}/${teamId}`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="team-task" v-if="teamTaskData && task">
        <div class="content">
          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant: {{ task.guarantor.name }} {{ task.guarantor.surname }}</p>
              <p>Začátek: {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>Konec: {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">Uzávěrka: {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.points">
                <br>
                Body: {{ teamTaskData.points ?? "-" }} / {{ task.points }} = {{ teamTaskData.points !== null && task.points ? ((teamTaskData.points / task.points) * 100).toFixed(2) : "0" }}%
              </p>
            </div>

            <Card class="team-card section-head" variant="outlined" v-if="teamTaskData.isTeam">
              <div class="content">
                <p class="name"><span>{{ teamTaskData.name || "Neurčeno" }}</span></p>
                <p><span>ID:</span> {{ teamTaskData.idTeam }}</p>
                <p><span>Počet členů:</span> {{ (teamTaskData.users || []).length }}</p>
                <p></p>
              </div>
            </Card>

            <div class="user section-head">
              <span>Garant:</span>
              <div class="profile">
                <Image
                  :src="config.public.originUrl + '/api/file/pfp/' + task.guarantor.profilePicture"
                  alt="profile-photo"
                  draggable="false"
                />

                <p class="account-name">
                  {{ task.guarantor.name + " " + task.guarantor.surname }}
                </p>
              </div>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Materiály</h3>
              <p>Zde můžete upravit informace o týmu přiřazeném k úkolu.</p>
            </div>

            <div class="download-input">
              <div class="line">
                <div class="input">
                  {{ task.task || "Žádné zadání" }}
                </div>
                <div class="icon-div" @click="downloadMaterials">
                  <Icon class="icon" name="material-symbols:download"/>
                </div>
              </div>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Verze vypracování <span class="update" v-if="newVersionFile">(aktualizováno)</span></h3>
              <p>Zde můžete upravit informace o týmu přiřazeném k úkolu.</p>
            </div>

            <FileInput
                ref="fileInput"
                class="content"
                v-model="newVersionFile"
                :placeholder="'Klikni pro nahrání souboru z počítače'"
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

                      <p v-else>{{ version.elaboration || "Odstraněno" }}</p>
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
              <p class="error message">Žádný záznam nebyl zobrazen!</p>
            </div>

            <Pagination :number-of-pages="versionsNumberOfPages" v-model="versionsActivePage" />
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Komentář garanta</h3>
              <p>Zde můžete upravit informace o týmu přiřazeném k úkolu.</p>
            </div>

            <div class="guarantor-comment download-input">
              <div class="input-div">
                <span class="label">Poslední úprava: {{ teamTaskData.reviewUpdatedAt ? moment(teamTaskData.reviewUpdatedAt).format("HH:mm DD.MM. YYYY") : "Neupraveno" }}</span>

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
#team-task {
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